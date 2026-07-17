const express = require('express');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadPhoto, uploadCertificate } = require('../middleware/profileUploadMiddleware');

const router = express.Router();

// Get profile details (includes resumes & audits history)
router.get('/details', authMiddleware, profileController.getProfileDetails);

// Update personal information (supports profile picture upload)
router.put('/personal', authMiddleware, uploadPhoto.single('profilePicture'), profileController.updatePersonalInfo);

// Update career information
router.put('/career', authMiddleware, profileController.updateCareerInfo);

// Skills management
router.post('/skills', authMiddleware, profileController.addSkill);
router.delete('/skills/:id', authMiddleware, profileController.deleteSkill);

// Education history management
router.post('/education', authMiddleware, profileController.addEducation);
router.delete('/education/:id', authMiddleware, profileController.deleteEducation);

// Certificates management (supports PDF/Image upload)
router.post('/certificates', authMiddleware, uploadCertificate.single('certificate'), profileController.uploadCertificate);
router.delete('/certificates/:id', authMiddleware, profileController.deleteCertificate);

// Portfolio links update
router.put('/portfolio-links', authMiddleware, profileController.updatePortfolioLinks);

// Settings update
router.put('/settings', authMiddleware, profileController.updateSettings);

// Data export
router.get('/export', authMiddleware, profileController.exportProfileData);

// Delete account permanently
router.delete('/account', authMiddleware, profileController.deleteAccount);

module.exports = router;
