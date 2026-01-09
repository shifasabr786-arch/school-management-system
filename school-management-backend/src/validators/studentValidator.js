// src/validators/studentValidator.js

function validateStudentPayload(payload) {
  const errors = [];

  if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length < 2) {
    errors.push('name is required (min 2 chars)');
  }

  if (payload.admnNo && typeof payload.admnNo !== 'string') {
    errors.push('admnNo must be a string');
  }

  if (payload.rollNo && typeof payload.rollNo !== 'string') {
    errors.push('rollNo must be a string');
  }

  if (payload.class && typeof payload.class !== 'string') {
    errors.push('class must be a string');
  }

  if (payload.dob) {
    const d = new Date(payload.dob);
    if (Number.isNaN(d.getTime())) errors.push('dob must be valid ISO date');
  }

  return errors;
}

module.exports = { validateStudentPayload };

