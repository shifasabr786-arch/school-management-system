const express = require('express');
const router = express.Router();
const examsController = require('../controllers/exams');
const auth = require('../middlewares/auth');

// Public list
router.get('/', examsController.listExams);
router.get('/:id', examsController.getExam); // returns exam metadata and questions (without correct answers)

// Protected: create exam (generation), update, delete
router.post('/', auth, examsController.createExam);
router.put('/:id', auth, examsController.updateExam);
router.delete('/:id', auth, examsController.deleteExam);

module.exports = router;

