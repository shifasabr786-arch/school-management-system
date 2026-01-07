
// src/routes/fees.js
const express = require('express');
const router = express.Router();
const feesController = require('../controllers/fees');
const auth = require('../middlewares/auth');

// Public: list fees
router.get('/', feesController.listFees);
router.get('/student/:studentId', feesController.listStudentFees);

// Protected routes
router.post('/', auth, feesController.addFee);
router.put('/:id', auth, feesController.updateFee);
router.delete('/:id', auth, feesController.deleteFee);

module.exports = router;
