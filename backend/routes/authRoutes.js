const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Register Route
router.post('/register', [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long').matches(/^[A-Za-z ]+$/).withMessage('Name can contain only alphabets and spaces'),
  body('email').trim().isEmail().matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/i).withMessage('Email must be a valid Gmail address ending with @gmail.com'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('confirmPassword').notEmpty().withMessage('Confirm password is required')
], authController.register);

// Login Route
router.post('/login', [
  body('email').trim().isEmail().matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/i).withMessage('Email must be a valid Gmail address ending with @gmail.com'),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);

// Protected Routes
router.get('/profile', authMiddleware, authController.getUserProfile);
router.put('/profile', authMiddleware, authController.updateUserProfile);
router.put('/change-password', authMiddleware, [
  body('oldPassword').notEmpty().withMessage('Old password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword').notEmpty().withMessage('Confirm password is required')
], authController.changePassword);

module.exports = router;
