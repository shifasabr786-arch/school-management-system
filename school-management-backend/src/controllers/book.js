// src/controllers/books.js
const prisma = require('../db');
const { validateBookPayload } = require('../validators/bookValidator');

/**
 * GET /api/books
 * optional query: q (search by title/author/subject/bNo)
 */
exports.listBooks = async (req, res, next) => {
  try {
    const q = req.query.q ? String(req.query.q) : null;
    const where = q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { author: { contains: q, mode: 'insensitive' } },
            { subject: { contains: q, mode: 'insensitive' } },
            { bNo: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {};

    const books = await prisma.book.findMany({ where, orderBy: { id: 'asc' } });
    res.json({ data: books });
  } catch (err) {
    next(err);
  }
};

exports.getBook = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'invalid id' });

    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) return res.status(404).json({ error: 'book not found' });
    res.json({ data: book });
  } catch (err) {
    next(err);
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const errors = validateBookPayload(payload);
    if (errors.length) return res.status(400).json({ errors });

    const book = await prisma.book.create({
      data: {
        bNo: payload.bNo,
        title: payload.title,
        author: payload.author || null,
        subject: payload.subject || null,
        price: payload.price ? Number(payload.price) : null,
        purchaseDate: payload.purchaseDate ? new Date(payload.purchaseDate) : null,
        totalCopies: payload.totalCopies !== undefined ? Number(payload.totalCopies) : 1,
        availableCopies: payload.availableCopies !== undefined ? Number(payload.availableCopies) : (payload.totalCopies !== undefined ? Number(payload.totalCopies) : 1),
      },
    });

    res.status(201).json({ data: book });
  } catch (err) {
    if (err.code === 'P2002' && err.meta && err.meta.target) {
      return res.status(409).json({ error: `${err.meta.target} already exists` });
    }
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const payload = req.body || {};

    const book = await prisma.book.update({
      where: { id },
      data: {
        bNo: payload.bNo,
        title: payload.title,
        author: payload.author,
        subject: payload.subject,
        price: payload.price !== undefined ? Number(payload.price) : undefined,
        purchaseDate: payload.purchaseDate ? new Date(payload.purchaseDate) : undefined,
        totalCopies: payload.totalCopies !== undefined ? Number(payload.totalCopies) : undefined,
        availableCopies: payload.availableCopies !== undefined ? Number(payload.availableCopies) : undefined,
      },
    });

    res.json({ data: book });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'book not found' });
    if (err.code === 'P2002' && err.meta && err.meta.target) return res.status(409).json({ error: `${err.meta.target} already exists` });
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.book.delete({ where: { id } });
    res.json({ message: 'book deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'book not found' });
    next(err);
  }
};



