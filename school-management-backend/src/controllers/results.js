// src/controllers/results.js
const prisma = require('../db');
const { validateSubmitPayload } = require('../validators/resultValidator');

/**
 * submitResult
 * payload example:
 * {
 *   "examId": 1,
 *   "studentId": 5,
 *   "answers": {
 *      "12": 2,
 *      "13": 1,
 *      ...
 *   }
 * }
 */
exports.submitResult = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const errors = validateSubmitPayload(payload);
    if (errors.length) return res.status(400).json({ errors });

    const examId = Number(payload.examId);
    const studentId = Number(payload.studentId);
    const answers = payload.answers;

    // fetch exam questions with correct answers
    const examQuestions = await prisma.examQuestion.findMany({
      where: { examId },
      include: {
        question: true,
      },
      orderBy: { sequenceNo: 'asc' },
    });

    if (!examQuestions || examQuestions.length === 0) {
      return res.status(400).json({ error: 'exam has no questions or not found' });
    }

    // Evaluate answers
    let marksObtained = 0;
    const details = [];

    for (const eq of examQuestions) {
      const q = eq.question;
      const qid = q.id;
      const correct = q.answer === null ? null : Number(q.answer);
      const given = answers[qid] !== undefined ? Number(answers[qid]) : null;

      const isCorrect = correct !== null && given !== null && given === correct;

      if (isCorrect) marksObtained += 1;

      details.push({
        questionId: qid,
        sequenceNo: eq.sequenceNo,
        givenAnswer: given,
        correctAnswer: correct,
        correct: isCorrect,
      });
    }

    // Save
    const result = await prisma.examResult.create({
      data: {
        examId,
        studentId,
        marksObtained,
        details,
      },
    });

    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * list all exam results (admin)
 * GET /api/results
 */
exports.listResults = async (req, res, next) => {
  try {
    const results = await prisma.examResult.findMany({
      orderBy: { submittedAt: 'desc' },
    });
    res.json({ data: results });
  } catch (err) {
    next(err);
  }
};

/**
 * get one result by ID
 * GET /api/results/:id
 */
exports.getResult = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await prisma.examResult.findUnique({ where: { id } });
    if (!result) return res.status(404).json({ error: 'result not found' });
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * get all results of a specific exam
 * GET /api/results/exam/:examId
 */
exports.getResultsByExam = async (req, res, next) => {
  try {
    const examId = parseInt(req.params.examId, 10);

    const results = await prisma.examResult.findMany({
      where: { examId },
      include: {
        student: true,
      },
      orderBy: { submittedAt: 'desc' }
    });

    res.json({ data: results });
  } catch (err) {
    next(err);
  }
};

/**
 * get all results of a specific student
 * GET /api/results/student/:studentId
 */
exports.getResultsByStudent = async (req, res, next) => {
  try {
    const studentId = parseInt(req.params.studentId, 10);

    const results = await prisma.examResult.findMany({
      where: { studentId },
      include: {
        exam: true,
      },
      orderBy: { submittedAt: 'desc' }
    });

    res.json({ data: results });
  } catch (err) {
    next(err);
  }
};

