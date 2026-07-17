const express = require('express');
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = express.Router();

// Upload Resume
router.post('/upload', authMiddleware, uploadMiddleware.single('resume'), resumeController.uploadResume);

// Get All User Resumes
router.get('/', authMiddleware, resumeController.getUserResumes);

// Get Single Resume
router.get('/:id', authMiddleware, resumeController.getResumeById);

// Generate Recommendations
router.post('/:id/recommendations', authMiddleware, resumeController.generateRecommendations);

// Update Resume Feedback
router.put('/:id/feedback', authMiddleware, resumeController.updateResumeFeedback);

// Delete Resume
router.delete('/:id', authMiddleware, resumeController.deleteResume);

module.exports = router;
