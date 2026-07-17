const roleKeywords = {
  'MERN Developer': [
    'React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'ES6', 
    'REST APIs', 'Redux', 'Mongoose', 'Frontend', 'Backend', 'JWT', 
    'Git', 'HTML5', 'CSS3', 'Tailwind CSS', 'Web Performance'
  ],
  'Full Stack Developer': [
    'React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Python', 
    'SQL', 'REST APIs', 'Docker', 'Git', 'HTML/CSS', 'AWS', 'CI/CD', 
    'System Design', 'PostgreSQL', 'Microservices', 'Unit Testing'
  ],
  'Java Developer': [
    'Java', 'Spring Boot', 'Hibernate', 'Microservices', 'REST APIs', 'SQL', 
    'Maven', 'JPA', 'Multi-threading', 'Git', 'AWS', 'Docker', 'PostgreSQL', 
    'OOPs', 'Data Structures', 'Spring Security'
  ],
  'Frontend Developer': [
    'JavaScript', 'React', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux', 
    'TypeScript', 'Responsive Design', 'SASS', 'Git', 'REST APIs', 
    'Webpack', 'Vite', 'UI/UX', 'Browser Developer Tools'
  ],
  'Backend Developer': [
    'Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'SQL', 'NoSQL', 
    'Redis', 'Docker', 'RESTful APIs', 'JWT', 'CI/CD', 'Git', 'MongoDB', 
    'PostgreSQL', 'Microservices', 'AWS', 'System Design'
  ],
  'Data Analyst': [
    'SQL', 'Python', 'Excel', 'Power BI', 'Tableau', 'Pandas', 'NumPy', 
    'Data Cleaning', 'Data Visualization', 'Statistics', 'Jupyter', 
    'ETL', 'R', 'Data Modeling', 'Business Intelligence', 'Matplotlib'
  ],
  'AI/ML Engineer': [
    'Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Machine Learning', 
    'Deep Learning', 'NLP', 'Data Preprocessing', 'Jupyter', 'Keras', 
    'Computer Vision', 'Git', 'SQL', 'Linear Algebra', 'Model Deployment'
  ]
};

const buzzwords = [
  'motivated', 'detail-oriented', 'hardworking', 'passionate', 'self-starter',
  'team-player', 'go-getter', 'results-driven', 'enthusiastic', 'quick-learner',
  'creative', 'dynamic'
];

function analyzeKeywords(text = '', role = 'Full Stack Developer') {
  const normalizedText = text.toLowerCase();
  const keywords = roleKeywords[role] || roleKeywords['Full Stack Developer'];

  const presentKeywords = [];
  const missingKeywords = [];

  keywords.forEach(kw => {
    // Avoid substring collisions (e.g. "go" matching inside "google")
    const regex = new RegExp('\\b' + kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'i');
    if (regex.test(normalizedText) || normalizedText.includes(kw.toLowerCase())) {
      presentKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const foundBuzzwords = buzzwords.filter(bw => 
    normalizedText.includes(bw)
  );

  return {
    presentKeywords,
    missingKeywords,
    buzzwordsDetected: foundBuzzwords,
    recommendedKeywords: missingKeywords.slice(0, 8)
  };
}

module.exports = {
  roleKeywords,
  buzzwords,
  analyzeKeywords
};
