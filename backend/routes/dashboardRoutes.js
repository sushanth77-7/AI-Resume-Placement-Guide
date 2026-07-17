const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get dashboard statistics summary (Protected)
router.get('/summary', authMiddleware, dashboardController.getDashboardSummary);

module.exports = router;
