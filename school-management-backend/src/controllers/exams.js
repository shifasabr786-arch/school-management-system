//src/controllers/exams.js - 
// src/controllers/exams.js
const prisma = require('../db');
const { validateExamPayload } = require('../validators/examValidator');

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// helper to pick random sample (without replacement)
function sampleArray(arr, count) {
  const copy = arr.slice();
  shuffleArray(copy);
  return copy.slice(0, Math.min(count, copy.length));
}

/**
 * listExams - show exams metadata
 */
exports.listExams = async (req, res, next) => {
  try {
    const exams = await prisma.exam.findMany({ orderBy: { date: 'desc' } });
    res.json({ data: exams });
  } catch (err) {
    next(err);
  }
};

/**
 * getExam - returns exam metadata and questions (without correct answers)
 */
exports.getExam = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        examQuestions: {
          include: {
            question: true,
          },
          orderBy: { sequenceNo: 'asc' },
        },
      },
    });
    if (!exam) return res.status(404).json({ error: 'exam not found' });

    // Map questions and remove answer field
    const questions = exam.examQuestions.map(eq => {
      const q = eq.question;
      return {
        id: q.id,
        text: q.text,
        options: [q.option1, q.option2, q.option3, q.option4].filter(Boolean),
        sequenceNo: eq.sequenceNo,
      };
    });

    res.json({
      data: {
        id: exam.id,
        name: exam.name,
        date: exam.date,
        durationMinutes: exam.durationMinutes,
        questions,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * createExam - either direct questionIds OR generate
 * payload example:
 * {
 *   name: "Midterm Physics",
 *   date: "2025-06-01T09:00:00Z",
 *   durationMinutes: 90,
 *   questionIds: [1,2,3,4]
 * }
 *
 * OR
 * {
 *  name: "Random quiz",
 *  generate: { total: 10, bySubject: {Physics:5,Math:5}, difficulty: {easy:2,medium:6,hard:2} }
 * }
 */
exports.createExam = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const errors = validateExamPayload(payload);
    if (errors.length) return res.status(400).json({ errors });

    let questionIds = [];

    if (payload.questionIds) {
      questionIds = payload.questionIds.map(id => Number(id));
      // ensure they exist
      const existing = await prisma.question.findMany({ where: { id: { in: questionIds } } });
      if (existing.length !== questionIds.length) return res.status(400).json({ error: 'some questionIds not found' });
    } else if (payload.generate) {
      const gen = payload.generate;
      const total = Number(gen.total);

      // attempt selection: apply bySubject and difficulty filters best-effort
      // Strategy: collect candidate question ids then pick random sample of size total
      const whereClauses = [];

      // If bySubject present, fetch per subject counts and sample
      if (gen.bySubject && typeof gen.bySubject === 'object') {
        for (const [subject, count] of Object.entries(gen.bySubject)) {
          const items = await prisma.question.findMany({ where: { subject }, select: { id: true } });
          const ids = items.map(i => i.id);
          const take = Math.min(Number(count), ids.length);
          questionIds.push(...sampleArray(ids, take));
        }
      }

      // If difficulty present, and still need more, fetch per difficulty
      if (gen.difficulty && typeof gen.difficulty === 'object') {
        for (const [diff, count] of Object.entries(gen.difficulty)) {
          const items = await prisma.question.findMany({ where: { difficulty: diff }, select: { id: true } });
          const ids = items.map(i => i.id).filter(id => !questionIds.includes(id));
          const take = Math.min(Number(count), ids.length);
          questionIds.push(...sampleArray(ids, take));
        }
      }

      // If still below total, fetch any remaining questions
      if (questionIds.length < total) {
        const remaining = await prisma.question.findMany({ select: { id: true } });
        const remainingIds = remaining.map(i => i.id).filter(id => !questionIds.includes(id));
        const need = total - questionIds.length;
        questionIds.push(...sampleArray(remainingIds, need));
      }

      // final trim to total, and unique
      questionIds = Array.from(new Set(questionIds)).slice(0, total);
    }

    // Create exam and ExamQuestion entries in transaction
    const created = await prisma.$transaction(async (tx) => {
      const exam = await tx.exam.create({
        data: {
          name: payload.name,
          date: payload.date ? new Date(payload.date) : null,
          durationMinutes: payload.durationMinutes || null,
          generatedById: req.user ? req.user.userId : null,
        },
      });

      let seq = 1;
      for (const qid of questionIds) {
        await tx.examQuestion.create({
          data: {
            examId: exam.id,
            questionId: qid,
            sequenceNo: seq++,
          },
        });
      }

      return exam;
    });

    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
};

/**
 * updateExam - basic update metadata (not changing questions)
 */
exports.updateExam = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const payload = req.body || {};
    const exam = await prisma.exam.update({
      where: { id },
      data: {
        name: payload.name,
        date: payload.date ? new Date(payload.date) : undefined,
        durationMinutes: payload.durationMinutes !== undefined ? Number(payload.durationMinutes) : undefined,
      },
    });
    res.json({ data: exam });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'exam not found' });
    next(err);
  }
};

exports.deleteExam = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.exam.delete({ where: { id } });
    res.json({ message: 'exam deleted' });
  } catch (err) {
    next(err);
  }
};


