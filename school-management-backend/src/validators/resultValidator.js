// src/validators/resultValidator.js

function validateSubmitPayload(payload) {
  const errors = [];
  if (!payload.examId || !Number.isInteger(payload.examId)) errors.push('examId is required (integer)');
  if (!payload.studentId || !Number.isInteger(payload.studentId)) errors.push('studentId is required (integer)');
  if (!payload.answers || typeof payload.answers !== 'object') errors.push('answers is required (object mapping questionId -> answerIndex)');
  return errors;
}

module.exports = { validateSubmitPayload };

