// src/validators/issueValidator.js

function validateIssuePayload(payload) {
  const errors = [];
  if (!payload.studentId) errors.push('studentId is required');
  if (!payload.bookId) errors.push('bookId is required');
  // dueDate optional - if provided must be valid ISO date
  if (payload.dueDate) {
    const d = new Date(payload.dueDate);
    if (Number.isNaN(d.getTime())) errors.push('dueDate must be a valid ISO date');
  }
  return errors;
}

function validateReturnPayload(payload) {
  const errors = [];
  if (!payload.issueId && (!payload.bookId || !payload.studentId)) {
    errors.push('Either issueId or (bookId and studentId) is required to return');
  }
  return errors;
}

module.exports = { validateIssuePayload, validateReturnPayload };


