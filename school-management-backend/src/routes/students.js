// src/routes/students.js
const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/students');
const authMiddleware = require('../middlewares/auth');

// Public: list & get single (you can change to protected if needed)
router.get('/', studentsController.listStudents);
router.get('/:id', studentsController.getStudent);

// Protected endpoints (create/update/delete)
router.post('/', authMiddleware, studentsController.createStudent);
router.put('/:id', authMiddleware, studentsController.updateStudent);
router.delete('/:id', authMiddleware, studentsController.deleteStudent);

module.exports = router;

