const express = require('express');
const interviewController = require('../controllers/interviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Process AI request for technical interviews, mock assessments, project explanations, and resume analysis
router.post('/process', authMiddleware, interviewController.processInterviewRequest);

// Retrieve static curated interview FAQs
router.get('/faqs', authMiddleware, interviewController.getFaqs);

module.exports = router;
