// src/routes/questions.js
const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questions');
const auth = require('../middlewares/auth');

// Public: list and get question (careful: we will not expose answers publicly)
router.get('/', questionsController.listQuestions);
router.get('/:id', questionsController.getQuestion);

// Protected: create/update/delete questions
router.post('/', auth, questionsController.createQuestion);
router.put('/:id', auth, questionsController.updateQuestion);
router.delete('/:id', auth, questionsController.deleteQuestion);

module.exports = router;

