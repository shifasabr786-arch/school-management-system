// src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const registrationRoutes = require('./routes/registration');
const feeRoutes = require('./routes/fees');
const booksRoutes = require('./routes/books');
const issuesRoutes = require('./routes/issues');
const questionsRoutes = require('./routes/questions');
const examsRoutes = require('./routes/exams');
const resultsRoutes = require('./routes/results');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// health check
app.get('/healthz', (req, res) => res.json({ ok: true }));

// backend API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/results', resultsRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;
