const express = require('express');
const aptitudeController = require('../controllers/aptitudeController');

const router = express.Router();

// Get Random Sample Questions
router.get('/questions', aptitudeController.getRandomQuestions);

module.exports = router;
