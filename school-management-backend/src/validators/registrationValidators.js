// src/validators/registrationValidator.js

function validateRegistrationPayload(payload) {
  const errors = [];

  if (!payload.studentId) errors.push("studentId is required");
  if (!payload.rNo) errors.push("Registration number (rNo) is required");

  if (payload.regFor && typeof payload.regFor !== "string")
    errors.push("regFor must be a string");

  return errors;
}

module.exports = { validateRegistrationPayload };

