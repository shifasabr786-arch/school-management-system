// src/controllers/issues.js
const prisma = require('../db');
const { validateIssuePayload, validateReturnPayload } = require('../validators/issueValidator');

// Default fine rate (₹10 per day)
const FINE_PER_DAY = 10;

// Helper: compute fine (integer rupees)
function computeFine(dueDate, returnedOn) {
  if (!dueDate) return 0;
  const due = new Date(dueDate);
  const ret = returnedOn ? new Date(returnedOn) : new Date();
  const diffMs = ret.setHours(0,0,0,0) - due.setHours(0,0,0,0);
  const daysLate = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return daysLate > 0 ? daysLate * FINE_PER_DAY : 0;
}

/**
 * GET /api/issues
 * Returns issues with optional filters: studentId, bookId, active (not returned)
 */
exports.listIssues = async (req, res, next) => {
  try {
    const { studentId, bookId, active } = req.query;
    const where = {};
    if (studentId) where.studentId = Number(studentId);
    if (bookId) where.bookId = Number(bookId);
    if (active === 'true') where.returnedOn = null;
    const issues = await prisma.issue.findMany({
      where,
      orderBy: { issueDate: 'desc' },
      include: { student: true, book: true },
    });

    // attach computed fine (if not returned, compute as of today)
    const enriched = issues.map(i => {
      const fine = computeFine(i.dueDate, i.returnedOn);
      return { ...i, computedFine: fine };
    });

    res.json({ data: enriched });
  } catch (err) {
    next(err);
  }
};

exports.getIssue = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const issue = await prisma.issue.findUnique({ where: { id }, include: { student: true, book: true } });
    if (!issue) return res.status(404).json({ error: 'issue not found' });
    issue.computedFine = computeFine(issue.dueDate, issue.returnedOn);
    res.json({ data: issue });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/issues/issue
 * Body: { studentId, bookId, dueDate (optional ISO string) }
 */
exports.issueBook = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const errors = validateIssuePayload(payload);
    if (errors.length) return res.status(400).json({ errors });

    const studentId = Number(payload.studentId);
    const bookId = Number(payload.bookId);

    // check student exists
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) return res.status(404).json({ error: 'student not found' });

    // check book exists and availability
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return res.status(404).json({ error: 'book not found' });
    if (!book.availableCopies || book.availableCopies <= 0) return res.status(400).json({ error: 'no copies available' });

    // Determine dueDate: if provided use it, otherwise default to 14 days from now
    let dueDate = payload.dueDate ? new Date(payload.dueDate) : (() => {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      return d;
    })();

    // create issue entry and decrement availableCopies in a transaction
    const created = await prisma.$transaction(async (tx) => {
      const issue = await tx.issue.create({
        data: {
          studentId,
          bookId,
          issueDate: new Date(),
          dueDate,
          returnedOn: null,
        },
      });

      await tx.book.update({
        where: { id: bookId },
        data: { availableCopies: { decrement: 1 } },
      });

      return issue;
    });

    const issueFull = await prisma.issue.findUnique({ where: { id: created.id }, include: { student: true, book: true } });
    issueFull.computedFine = computeFine(issueFull.dueDate, issueFull.returnedOn);

    res.status(201).json({ data: issueFull });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/issues/return
 * Body: { issueId } OR { bookId, studentId }
 * Returns: issue record with fine
 */
exports.returnBook = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const errors = validateReturnPayload(payload);
    if (errors.length) return res.status(400).json({ errors });

    let issue;
    if (payload.issueId) {
      issue = await prisma.issue.findUnique({ where: { id: Number(payload.issueId) } });
    } else {
      // find the active issue for the student+book
      issue = await prisma.issue.findFirst({
        where: { studentId: Number(payload.studentId), bookId: Number(payload.bookId), returnedOn: null },
        orderBy: { issueDate: 'desc' },
      });
    }

    if (!issue) return res.status(404).json({ error: 'issue not found' });
    if (issue.returnedOn) return res.status(400).json({ error: 'book already returned' });

    // compute fine based on dueDate and return date (now or provided)
    const returnedOn = payload.returnedOn ? new Date(payload.returnedOn) : new Date();
    const fine = computeFine(issue.dueDate, returnedOn);

    // update issue (set returnedOn) and increment availableCopies in a transaction
    const updated = await prisma.$transaction(async (tx) => {
      const u = await tx.issue.update({
        where: { id: issue.id },
        data: { returnedOn },
      });

      await tx.book.update({
        where: { id: issue.bookId },
        data: { availableCopies: { increment: 1 } },
      });

      return u;
    });

    const full = await prisma.issue.findUnique({ where: { id: updated.id }, include: { student: true, book: true } });
    full.computedFine = fine;

    res.json({ data: full, fine });
  } catch (err) {
    next(err);
  }
};

