const express = require('express');
const profileOptimizerController = require('../controllers/profileOptimizerController');

const router = express.Router();

// Analyze LinkedIn & GitHub profile details
router.post('/analyze', profileOptimizerController.analyzeProfiles);

// Fetch role-specific recommendations
router.get('/role-suggestions/:role', profileOptimizerController.getRoleSuggestions);

module.exports = router;
