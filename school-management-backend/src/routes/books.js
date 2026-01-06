// src/routes/books.js
const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');
const auth = require('../middlewares/auth');

// Public
router.get('/', booksController.listBooks);
router.get('/:id', booksController.getBook);

// Protected (admin/teacher)
router.post('/', auth, booksController.createBook);
router.put('/:id', auth, booksController.updateBook);
router.delete('/:id', auth, booksController.deleteBook);

module.exports = router;
