// src/validators/questionValidator.js

function validateQuestionPayload(payload) {
  const errors = [];

  if (!payload.text || typeof payload.text !== 'string' || payload.text.trim().length < 5) {
    errors.push('text is required (min 5 chars)');
  }

  // options is optional, but if present must be array with >=2 strings
  if (payload.options !== undefined) {
    if (!Array.isArray(payload.options) || payload.options.length < 2) {
      errors.push('options must be an array of at least 2 strings');
    } else {
      for (const opt of payload.options) {
        if (typeof opt !== 'string') errors.push('each option must be a string');
      }
    }
  }

  // answer: should be an integer index (0-based) referring to options if options provided
  if (payload.answer !== undefined) {
    if (!Number.isInteger(payload.answer)) {
      errors.push('answer must be an integer index of correct option');
    } else if (payload.options && (payload.answer < 0 || payload.answer >= payload.options.length)) {
      errors.push('answer index out of range for provided options');
    }
  }

  if (payload.subject !== undefined && typeof payload.subject !== 'string') {
    errors.push('subject must be a string');
  }

  if (payload.difficulty !== undefined && typeof payload.difficulty !== 'string') {
    errors.push('difficulty must be a string (e.g., easy, medium, hard)');
  }

  return errors;
}

module.exports = { validateQuestionPayload };


