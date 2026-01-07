// src/controllers/fees.js
const prisma = require('../db');
const { validateFeePayload } = require('../validators/feeValidator');

// Helper: calculate total fee
function calculateTotal(payload) {
  const fields = [
    payload.admissionFee,
    payload.tuitionFee,
    payload.compFee,
    payload.lateFee,
    payload.activityFee,
  ];

  return fields.reduce((sum, val) => {
    return sum + (val ? Number(val) : 0);
  }, 0);
}

// GET /api/fees
exports.listFees = async (req, res, next) => {
  try {
    const data = await prisma.feeDetail.findMany({
      orderBy: { date: 'desc' },
      include: { student: true }
    });

    res.json({ data });
  } catch (err) {
    next(err);
  }
};

// GET /api/fees/student/:studentId
exports.listStudentFees = async (req, res, next) => {
  try {
    const studentId = parseInt(req.params.studentId);

    const data = await prisma.feeDetail.findMany({
      where: { studentId },
      orderBy: { date: 'desc' },
    });

    res.json({ data });
  } catch (err) {
    next(err);
  }
};

// POST /api/fees
exports.addFee = async (req, res, next) => {
  try {
    const errors = validateFeePayload(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const total = calculateTotal(req.body);

    const fee = await prisma.feeDetail.create({
      data: {
        studentId: req.body.studentId,
        month: req.body.month,
        admissionFee: req.body.admissionFee || 0,
        tuitionFee: req.body.tuitionFee || 0,
        compFee: req.body.compFee || 0,
        lateFee: req.body.lateFee || 0,
        activityFee: req.body.activityFee || 0,
        total: total,
      }
    });

    res.status(201).json({ data: fee });
  } catch (err) {
    next(err);
  }
};

// PUT /api/fees/:id
exports.updateFee = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const total = calculateTotal(req.body);

    const fee = await prisma.feeDetail.update({
      where: { id },
      data: {
        month: req.body.month,
        admissionFee: req.body.admissionFee,
        tuitionFee: req.body.tuitionFee,
        compFee: req.body.compFee,
        lateFee: req.body.lateFee,
        activityFee: req.body.activityFee,
        total,
      }
    });

    res.json({ data: fee });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/fees/:id
exports.deleteFee = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.feeDetail.delete({ where: { id } });
    res.json({ message: "Fee record deleted" });
  } catch (err) {
    next(err);
  }
};

