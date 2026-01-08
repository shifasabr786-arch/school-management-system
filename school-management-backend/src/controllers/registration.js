// src/controllers/registration.js
const prisma = require('../db');
const { validateRegistrationPayload } = require('../validators/registrationValidator');

// GET /api/registrations
exports.listRegistrations = async (req, res, next) => {
  try {
    const data = await prisma.registration.findMany({
      orderBy: { regDate: 'desc' },
      include: { student: true }
    });

    res.json({ data });
  } catch (err) {
    next(err);
  }
};

// POST /api/registrations
exports.createRegistration = async (req, res, next) => {
  try {
    const errors = validateRegistrationPayload(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const reg = await prisma.registration.create({
      data: {
        rNo: req.body.rNo,
        studentId: req.body.studentId,
        regFor: req.body.regFor || null,
        status: req.body.status || "pending",
      }
    });

    res.status(201).json({ data: reg });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Registration number already exists' });
    }
    next(err);
  }
};

// PUT /api/registrations/:id
exports.updateRegistration = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const reg = await prisma.registration.update({
      where: { id },
      data: {
        regFor: req.body.regFor,
        status: req.body.status,
      }
    });

    res.json({ data: reg });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/registrations/:id
exports.deleteRegistration = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.registration.delete({ where: { id } });
    res.json({ message: "Registration deleted" });
  } catch (err) {
    next(err);
  }
};

