const express = require('express');
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get All Companies
router.get('/', companyController.getAllCompanies);

// Get Top Companies
router.get('/top', companyController.getTopCompanies);

// Search Companies
router.get('/search', companyController.searchCompanies);

// Get Company by ID
router.get('/:id', companyController.getCompanyById);

// Get Companies by Skills
router.post('/skills', companyController.getCompaniesBySkills);

// Get Company Resources
router.get('/:id/resources', companyController.getCompanyResources);

// Compare two companies side-by-side
router.post('/compare', companyController.compareCompanies);

// Recommend companies based on target role
router.post('/recommend', companyController.recommendCompanies);

module.exports = router;
