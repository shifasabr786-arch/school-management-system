// src/routes/registration.js
const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registration');
const auth = require('../middlewares/auth');

// Public routes
router.get('/', registrationController.listRegistrations);

// Protected routes
router.post('/', auth, registrationController.createRegistration);
router.put('/:id', auth, registrationController.updateRegistration);
router.delete('/:id', auth, registrationController.deleteRegistration);

module.exports = router;

