// src/validators/feeValidator.js

function validateFeePayload(payload) {
  const errors = [];

  if (!payload.studentId) errors.push("studentId is required");
  if (!payload.month) errors.push("month is required");

  return errors;
}

module.exports = { validateFeePayload };

