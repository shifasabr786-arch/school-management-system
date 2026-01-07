// src/validators/examValidator.js

function validateExamPayload(payload) {
  const errors = [];

  if (!payload.name || typeof payload.name !== 'string') {
    errors.push('name is required');
  }

  // generation instructions: either "questionIds" (array) OR "generate" object describing selection
  if (!payload.questionIds && !payload.generate) {
    errors.push('either questionIds or generate (selection object) is required');
  }

  // if questionIds provided validate array
  if (payload.questionIds) {
    if (!Array.isArray(payload.questionIds) || payload.questionIds.length < 1) {
      errors.push('questionIds must be a non-empty array of question ids');
    }
  }

  if (payload.generate) {
    // generate: { total: Number, bySubject: {subject: count}, difficulty: {easy: n, medium:n, hard:n} }
    if (typeof payload.generate !== 'object') errors.push('generate must be an object');
    else {
      const total = Number(payload.generate.total || 0);
      if (!Number.isInteger(total) || total <= 0) errors.push('generate.total must be a positive integer');
      // additional checks optional - we'll trust generate instructions otherwise
    }
  }

  if (payload.date !== undefined) {
    const d = new Date(payload.date);
    if (Number.isNaN(d.getTime())) errors.push('date must be valid ISO date');
  }

  if (payload.durationMinutes !== undefined && !Number.isInteger(payload.durationMinutes)) {
    errors.push('durationMinutes must be integer');
  }

  return errors;
}

module.exports = { validateExamPayload };

