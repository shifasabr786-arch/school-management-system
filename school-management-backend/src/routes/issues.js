// src/routes/issues.js
const express = require('express');
const router = express.Router();
const issuesController = require('../controllers/issues');
const auth = require('../middlewares/auth');

// Public listing (optionally can be protected)
router.get('/', issuesController.listIssues);
router.get('/:id', issuesController.getIssue);

// Protected endpoints (issue & return)
router.post('/issue', auth, issuesController.issueBook);
router.post('/return', auth, issuesController.returnBook);

module.exports = router;

