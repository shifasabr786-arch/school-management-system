// src/controllers/students.js
const prisma = require('../db');
const { validateStudentPayload } = require('../validators/studentValidator');

/**
 * GET /api/students
 * Query params:
 *  - q (optional) simple search on name or admnNo or rollNo
 *  - page (optional) default 1
 *  - limit (optional) default 20
 */
exports.listStudents = async (req, res, next) => {
  try {
    const q = req.query.q ? String(req.query.q) : null;
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { admnNo: { contains: q, mode: 'insensitive' } },
            { rollNo: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {};

    const [total, students] = await Promise.all([
      prisma.student.count({ where }),
      prisma.student.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    res.json({
      meta: { total, page, limit, pages: Math.ceil(total / limit) || 1 },
      data: students,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/students/:id
 */
exports.getStudent = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'invalid id' });

    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) return res.status(404).json({ error: 'student not found' });

    res.json({ data: student });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/students
 */
exports.createStudent = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const errors = validateStudentPayload(payload);
    if (errors.length) return res.status(400).json({ errors });

    // Prepare data - only allowed fields
    const data = {
      admnNo: payload.admnNo || null,
      name: payload.name,
      parentName: payload.parentName || null,
      address: payload.address || null,
      class: payload.class || null,
      section: payload.section || null,
      dob: payload.dob ? new Date(payload.dob) : null,
      category: payload.category || null,
      rollNo: payload.rollNo || null,
    };

    const student = await prisma.student.create({ data });
    res.status(201).json({ data: student });
  } catch (err) {
    // unique constraint handling for admnNo
    if (err.code === 'P2002' && err.meta && err.meta.target) {
      return res.status(409).json({ error: `${err.meta.target} already exists` });
    }
    next(err);
  }
};

/**
 * PUT /api/students/:id
 */
exports.updateStudent = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'invalid id' });

    const payload = req.body || {};
    const errors = validateStudentPayload({ ...payload, name: payload.name || 'x' });
    // validateStudentPayload expects name; allow update without name by giving dummy in call above
    if (errors.length) {
      // If only error was name missing and name is not provided, strip that error
      const filtered = errors.filter(e => !e.startsWith('name is required') || payload.name);
      if (filtered.length) return res.status(400).json({ errors: filtered });
    }

    const data = {};
    if (payload.admnNo !== undefined) data.admnNo = payload.admnNo;
    if (payload.name !== undefined) data.name = payload.name;
    if (payload.parentName !== undefined) data.parentName = payload.parentName;
    if (payload.address !== undefined) data.address = payload.address;
    if (payload.class !== undefined) data.class = payload.class;
    if (payload.section !== undefined) data.section = payload.section;
    if (payload.dob !== undefined) data.dob = payload.dob ? new Date(payload.dob) : null;
    if (payload.category !== undefined) data.category = payload.category;
    if (payload.rollNo !== undefined) data.rollNo = payload.rollNo;

    const student = await prisma.student.update({
      where: { id },
      data,
    });

    res.json({ data: student });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'student not found' });
    }
    if (err.code === 'P2002' && err.meta && err.meta.target) {
      return res.status(409).json({ error: `${err.meta.target} already exists` });
    }
    next(err);
  }
};

/**
 * DELETE /api/students/:id
 */
exports.deleteStudent = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'invalid id' });

    await prisma.student.delete({ where: { id } });
    res.json({ message: 'deleted' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'student not found' });
    }
    next(err);
  }
};

