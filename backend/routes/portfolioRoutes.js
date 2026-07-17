const express = require('express');
const portfolioController = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');
const screenshotUpload = require('../middleware/screenshotUploadMiddleware');

const router = express.Router();

// Analyze profiles & screenshot (authenticated)
router.post('/analyze', authMiddleware, screenshotUpload.single('screenshot'), portfolioController.analyzePortfolio);

// Fetch user history list
router.get('/history', authMiddleware, portfolioController.getUserHistory);

// Fetch detailed single scan result
router.get('/history/:id', authMiddleware, portfolioController.getHistoryDetail);

// Delete past scan result
router.delete('/history/:id', authMiddleware, portfolioController.deleteHistory);

module.exports = router;
