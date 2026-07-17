const { allCompanies, productCompanies, serviceCompanies } = require('../data/companies');
const companyComparison = require('../data/companyComparison');
const recommendationEngine = require('../data/recommendationEngine');

// Get All Companies (with optional category and search filters)
exports.getAllCompanies = async (req, res) => {
  try {
    const { category, search } = req.query;
    let list = [...allCompanies];

    if (category) {
      const catLower = category.toLowerCase();
      if (catLower === 'product') {
        list = [...productCompanies];
      } else if (catLower === 'service') {
        list = [...serviceCompanies];
      } else {
        list = list.filter(c => c.category.toLowerCase() === catLower);
      }
    }

    if (search) {
      const query = search.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.overview.businessDomain.toLowerCase().includes(query) ||
        c.overview.technologies.some(t => t.toLowerCase().includes(query))
      );
    }

    res.status(200).json({
      success: true,
      companies: list,
      total: list.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Company Details by ID
exports.getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = allCompanies.find(c => c.id === id || c.name.toLowerCase() === id.toLowerCase());

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.status(200).json({
      success: true,
      company
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search Companies
exports.searchCompanies = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const term = query.toLowerCase();
    const list = allCompanies.filter(c => 
      c.name.toLowerCase().includes(term) ||
      c.overview.businessDomain.toLowerCase().includes(term) ||
      c.overview.technologies.some(t => t.toLowerCase().includes(term))
    );

    res.status(200).json({
      success: true,
      companies: list
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Companies by Skills
exports.getCompaniesBySkills = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills array is required' });
    }

    const lowercaseSkills = skills.map(s => s.toLowerCase());
    const list = allCompanies.filter(c => 
      c.overview.technologies.some(t => lowercaseSkills.includes(t.toLowerCase()))
    );

    res.status(200).json({
      success: true,
      companies: list
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Company Preparation Resources
exports.getCompanyResources = async (req, res) => {
  try {
    const { id } = req.params;
    const company = allCompanies.find(c => c.id === id);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.status(200).json({
      success: true,
      companyName: company.name,
      requiredSkills: company.overview.technologies,
      interviewProcess: company.hiringProcess.rounds,
      preparationRoadmap: company.preparationRoadmap
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Top Companies (simulates returning high package product companies)
exports.getTopCompanies = async (req, res) => {
  try {
    const list = [...productCompanies]
      .sort((a, b) => {
        const salaryA = parseInt(a.placementInsights.highestSalaryRange.replace(/[^0-9]/g, '')) || 0;
        const salaryB = parseInt(b.placementInsights.highestSalaryRange.replace(/[^0-9]/g, '')) || 0;
        return salaryB - salaryA;
      })
      .slice(0, 5);

    res.status(200).json({
      success: true,
      companies: list
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Compare two companies side-by-side
exports.compareCompanies = async (req, res) => {
  try {
    const { companyA, companyB } = req.body;

    if (!companyA || !companyB) {
      return res.status(400).json({ error: 'Both companyA and companyB identifiers are required' });
    }

    const comparison = companyComparison.compareCompanies(companyA, companyB);
    if (!comparison) {
      return res.status(404).json({ error: 'One or both companies not found' });
    }

    res.status(200).json({
      success: true,
      comparison
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Recommend companies based on target role
exports.recommendCompanies = async (req, res) => {
  try {
    const { targetRole } = req.body;

    if (!targetRole) {
      return res.status(400).json({ error: 'Target role is required' });
    }

    const recommendations = recommendationEngine.recommendCompaniesForRole(targetRole);

    res.status(200).json({
      success: true,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
