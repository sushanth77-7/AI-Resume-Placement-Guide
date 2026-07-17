const { allCompanies } = require('./companies');

const roleMapping = {
  'MERN Stack Developer': {
    recommended: ['amazon', 'zoho', 'flipkart', 'salesforce', 'accenture', 'capgemini', 'ltimindtree'],
    requiredSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML5/CSS3', 'Git'],
    priority: 'Master asynchronous JS (async/await), build full-stack responsive web apps, study MongoDB index types and aggregation pipelines.'
  },
  'Full Stack Developer': {
    recommended: ['amazon', 'microsoft', 'google', 'flipkart', 'zoho', 'salesforce', 'sap', 'accenture', 'tcs', 'ltimindtree'],
    requiredSkills: ['Java/Python', 'JavaScript', 'React/Angular', 'SQL/NoSQL', 'Docker', 'REST APIs', 'System Design'],
    priority: 'Learn low-level design patterns (SOLID), study microservices communication, and practice database normalization vs sharding.'
  },
  'Java Developer': {
    recommended: ['oracle', 'sap', 'microsoft', 'amazon', 'zoho', 'tcs', 'infosys', 'wipro', 'capgemini', 'ltimindtree'],
    requiredSkills: ['Java', 'Spring Boot', 'Hibernate/JPA', 'PL/SQL', 'Multithreading', 'OOPS', 'Maven'],
    priority: 'Deep dive into JVM memory allocation (heap/stack), practice thread synchronization, and master Spring boot annotations.'
  },
  'Data Analyst': {
    recommended: ['google', 'amazon', 'oracle', 'salesforce', 'tcs', 'accenture', 'cognizant', 'ltimindtree', 'mphasis'],
    requiredSkills: ['SQL', 'Python', 'Excel', 'Pandas/NumPy', 'Tableau/Power BI', 'Statistics', 'ETL'],
    priority: 'Practice complex SQL window functions and joins, build interactive dashboards, and study regression models and hypothesis tests.'
  },
  'AI/ML Engineer': {
    recommended: ['google', 'microsoft', 'amazon', 'adobe', 'salesforce', 'tcs', 'accenture', 'capgemini', 'cognizant'],
    requiredSkills: ['Python', 'TensorFlow/PyTorch', 'Scikit-Learn', 'Linear Algebra', 'Statistics', 'Data Pipelines', 'Machine Learning'],
    priority: 'Understand gradient descent variants, practice feature engineering and scaling, and study CNN/RNN and Transformer layers.'
  },
  'Frontend Developer': {
    recommended: ['zoho', 'adobe', 'flipkart', 'salesforce', 'accenture', 'wipro', 'cognizant', 'capgemini'],
    requiredSkills: ['HTML5/CSS3', 'JavaScript', 'TypeScript', 'React/Angular/Vue', 'Responsive Design', 'SASS/SCSS', 'Webpack'],
    priority: 'Master JS closures and event bubbling, learn Flexbox/Grid CSS properties, and study lazy-loading performance optimizations.'
  },
  'Backend Developer': {
    recommended: ['amazon', 'oracle', 'google', 'sap', 'zoho', 'tcs', 'infosys', 'wipro', 'accenture', 'mphasis'],
    requiredSkills: ['Node.js/Java/Python', 'SQL/NoSQL', 'REST/GraphQL', 'Redis', 'Docker', 'API Design', 'System Design'],
    priority: 'Learn database indexing internal layouts (B-Trees), study connection pooling, implement rate limiters, and practice caching.'
  }
};

function recommendCompaniesForRole(targetRole) {
  // Default fallback if role is not fully matched
  const matchedRole = roleMapping[targetRole] || roleMapping['Full Stack Developer'];
  
  const recommendations = allCompanies
    .filter(c => matchedRole.recommended.includes(c.id))
    .map(c => ({
      id: c.id,
      name: c.name,
      category: c.category,
      difficulty: c.preparationRoadmap.difficultyLevel,
      averagePackage: c.placementInsights.averageFresherSalary,
      requiredSkills: c.overview.technologies,
      matchReason: c.category === 'Product-Based'
        ? `Top tier product company with premium compensation. Heavy alignment with OOPS, data structures, and clean coding paradigms.`
        : `Outstanding entry point for mass recruitment. High hiring volume for cloud, database, and backend engineer positions.`
    }));

  return {
    role: targetRole,
    requiredSkills: matchedRole.requiredSkills,
    priority: matchedRole.priority,
    companies: recommendations
  };
}

module.exports = {
  recommendCompaniesForRole
};
