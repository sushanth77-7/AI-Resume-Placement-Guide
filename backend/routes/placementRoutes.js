const express = require('express');
const placementController = require('../controllers/placementController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get User Progress
router.get('/progress', authMiddleware, placementController.getUserProgress);

// Update Progress
router.put('/progress', authMiddleware, placementController.updateProgress);

// Add Milestone
router.post('/progress/milestone', authMiddleware, placementController.addMilestone);

// Complete Milestone
router.put('/progress/milestone/:milestoneId', authMiddleware, placementController.completeMilestone);

// Get Progress Summary
router.get('/summary', authMiddleware, placementController.getProgressSummary);

module.exports = router;
