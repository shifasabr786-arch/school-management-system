// src/routes/results.js
const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/results');
const auth = require('../middlewares/auth');

// -------------------------------
// Submit result (student)
// POST /api/results/submit
// -------------------------------
router.post('/submit', auth, resultsController.submitResult);

// -------------------------------
// List all results (admin/teacher)
// GET /api/results
// -------------------------------
router.get('/', auth, resultsController.listResults);

// -------------------------------
// Get result by ID
// GET /api/results/:id
// -------------------------------
router.get('/:id', auth, resultsController.getResult);

// -------------------------------
// Get results of a specific exam
// GET /api/results/exam/:examId
// -------------------------------
router.get('/exam/:examId', auth, resultsController.getResultsByExam);

// -------------------------------
// Get results of a specific student
// GET /api/results/student/:studentId
// -------------------------------
router.get('/student/:studentId', auth, resultsController.getResultsByStudent);

module.exports = router;


