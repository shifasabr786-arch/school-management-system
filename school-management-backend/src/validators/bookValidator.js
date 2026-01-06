
// src/validators/bookValidator.js

function validateBookPayload(payload) {
  const errors = [];
  if (!payload.bNo || typeof payload.bNo !== 'string') errors.push('bNo is required (string, unique)');
  if (!payload.title || typeof payload.title !== 'string') errors.push('title is required (string)');
  if (payload.totalCopies !== undefined && (!Number.isInteger(payload.totalCopies) || payload.totalCopies < 0))
    errors.push('totalCopies must be a non-negative integer');
  if (payload.availableCopies !== undefined && (!Number.isInteger(payload.availableCopies) || payload.availableCopies < 0))
    errors.push('availableCopies must be a non-negative integer');

  return errors;
}

module.exports = { validateBookPayload };
