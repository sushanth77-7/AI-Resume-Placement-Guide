const express = require('express');
const practiceController = require('../controllers/practiceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ==================== APTITUDE ENDPOINTS ====================
// Get random mock test questions (30 questions)
router.get('/aptitude/questions', authMiddleware, practiceController.getAptitudeQuestions);

// Submit test answers and get score report
router.post('/aptitude/submit', authMiddleware, practiceController.submitAptitudeTest);

// Get user's past aptitude mock test reports
router.get('/aptitude/attempts', authMiddleware, practiceController.getAptitudeHistory);

// Get specific aptitude report details
router.get('/aptitude/attempts/:id', authMiddleware, practiceController.getAptitudeAttemptDetail);


// ==================== CODING ENDPOINTS ====================
// Get 2 coding problems matching difficulty
router.get('/coding/session', authMiddleware, practiceController.getCodingProblemsSession);

// Run code against sample cases
router.post('/coding/run', authMiddleware, practiceController.runCodingCode);

// Submit code for full evaluation against hidden cases & code quality checks
router.post('/coding/submit', authMiddleware, practiceController.submitCodingCode);

// Get user's past coding attempts
router.get('/coding/attempts', authMiddleware, practiceController.getCodingHistory);


// ==================== PERFORMANCE ANALYTICS ====================
// Get global placement readiness, streaks, badges, charts, and recommendations
router.get('/analytics', authMiddleware, practiceController.getPerformanceAnalytics);

module.exports = router;
