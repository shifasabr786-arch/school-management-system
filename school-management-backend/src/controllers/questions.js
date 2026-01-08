// src/controllers/questions.js
const prisma = require('../db');
const { validateQuestionPayload } = require('../validators/questionValidator');

/**
 * listQuestions
 * query params: q (search), subject, difficulty, page, limit
 */
exports.listQuestions = async (req, res, next) => {
  try {
    const q = req.query.q ? String(req.query.q) : null;
    const subject = req.query.subject ? String(req.query.subject) : null;
    const difficulty = req.query.difficulty ? String(req.query.difficulty) : null;
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '50', 10)));
    const skip = (page - 1) * limit;

    const where = {};
    if (q) where.text = { contains: q, mode: 'insensitive' };
    if (subject) where.subject = subject;
    if (difficulty) where.difficulty = difficulty;

    const [total, questions] = await Promise.all([
      prisma.question.count({ where }),
      prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
    ]);

    // Do not expose 'answer' if the requester is not authenticated OR if you want to hide answers in public listing.
    // We'll hide the 'answer' field here to be safe.
    const sanitized = questions.map(q => {
      const { answer, ...rest } = q;
      return rest;
    });

    res.json({ meta: { total, page, limit, pages: Math.ceil(total / limit) || 1 }, data: sanitized });
  } catch (err) {
    next(err);
  }
};

exports.getQuestion = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const question = await prisma.question.findUnique({ where: { id } });
    if (!question) return res.status(404).json({ error: 'question not found' });
    // hide answer in public route
    const { answer, ...rest } = question;
    res.json({ data: rest });
  } catch (err) {
    next(err);
  }
};

exports.createQuestion = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const errors = validateQuestionPayload(payload);
    if (errors.length) return res.status(400).json({ errors });

    // options stored as separate fields option1..option4 in prisma schema; we'll map from payload.options array
    const options = payload.options || [];
    const q = await prisma.question.create({
      data: {
        text: payload.text,
        option1: options[0] || null,
        option2: options[1] || null,
        option3: options[2] || null,
        option4: options[3] || null,
        answer: payload.answer !== undefined ? payload.answer : null,
        subject: payload.subject || null,
        difficulty: payload.difficulty || null,
      },
    });

    const { answer: _, ...rest } = q;
    res.status(201).json({ data: rest });
  } catch (err) {
    next(err);
  }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const payload = req.body || {};
    const errors = validateQuestionPayload({ ...payload, options: payload.options || [] });
    if (errors.length) return res.status(400).json({ errors });

    const options = payload.options || [];
    const q = await prisma.question.update({
      where: { id },
      data: {
        text: payload.text,
        option1: options[0] || undefined,
        option2: options[1] || undefined,
        option3: options[2] || undefined,
        option4: options[3] || undefined,
        answer: payload.answer !== undefined ? payload.answer : undefined,
        subject: payload.subject !== undefined ? payload.subject : undefined,
        difficulty: payload.difficulty !== undefined ? payload.difficulty : undefined,
      },
    });

    const { answer: _, ...rest } = q;
    res.json({ data: rest });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'question not found' });
    next(err);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.question.delete({ where: { id } });
    res.json({ message: 'question deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'question not found' });
    next(err);
  }
};

