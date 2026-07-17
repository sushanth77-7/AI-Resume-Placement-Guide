const ROLE_REQUIREMENTS = {
  'Frontend Developer': {
    skills: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind', 'Git', 'GitHub'],
    minProjects: 2,
    minCerts: 1,
    minExperience: 1, // in terms of internship or junior role mention
    expectedKeywords: ['ui', 'responsive', 'ux', 'components', 'state', 'rendering', 'dom']
  },
  'Backend Developer': {
    skills: ['Node.js', 'Express', 'MongoDB', 'SQL', 'REST API', 'Docker', 'AWS', 'Git'],
    minProjects: 2,
    minCerts: 1,
    minExperience: 1,
    expectedKeywords: ['api', 'database', 'server', 'middleware', 'routes', 'authentication', 'query']
  },
  'Java Developer': {
    skills: ['Java', 'Spring Boot', 'SQL', 'Hibernate', 'Git', 'Maven', 'Docker', 'JUnit'],
    minProjects: 2,
    minCerts: 1,
    minExperience: 1,
    expectedKeywords: ['oop', 'spring', 'microservices', 'jdbc', 'jpa', 'beans', 'testing']
  },
  'Full Stack Developer': {
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Git', 'REST API', 'Docker'],
    minProjects: 3,
    minCerts: 1,
    minExperience: 1,
    expectedKeywords: ['frontend', 'backend', 'fullstack', 'database', 'api', 'deployment', 'integration']
  },
  'MERN Stack Developer': {
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Git', 'Redux', 'JWT'],
    minProjects: 2,
    minCerts: 1,
    minExperience: 1,
    expectedKeywords: ['react', 'express', 'mongodb', 'node', 'state', 'token', 'router', 'api']
  },
  'Data Analyst': {
    skills: ['SQL', 'Python', 'Excel', 'Tableau', 'PowerBI', 'Pandas', 'Data Science', 'Statistics'],
    minProjects: 2,
    minCerts: 1,
    minExperience: 0,
    expectedKeywords: ['analysis', 'dashboard', 'visualization', 'query', 'reporting', 'sheets', 'metrics']
  },
  'AI/ML Engineer': {
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'NLP', 'Data Science', 'Git'],
    minProjects: 2,
    minCerts: 1,
    minExperience: 1,
    expectedKeywords: ['model', 'training', 'neural', 'deep learning', 'dataset', 'prediction', 'algorithm']
  }
};

const roleAnalyzer = {
  analyze: (text, role, detectedSkills, projectCount, internshipCount, certificationCount) => {
    const defaultRole = 'MERN Stack Developer';
    const targetRole = ROLE_REQUIREMENTS[role] ? role : defaultRole;
    const requirements = ROLE_REQUIREMENTS[targetRole];

    const lowerText = text ? text.toLowerCase() : '';

    // 1. Calculate Skills Match Score
    const normalizedDetected = detectedSkills.map(s => s.toLowerCase());
    const matchedSkills = requirements.skills.filter(s => 
      normalizedDetected.includes(s.toLowerCase())
    );
    const missingRequirements = requirements.skills.filter(s => 
      !normalizedDetected.includes(s.toLowerCase())
    );

    const skillsScore = requirements.skills.length > 0 
      ? Math.round((matchedSkills.length / requirements.skills.length) * 100) 
      : 0;

    // 2. Keyword check
    const matchedKeywords = requirements.expectedKeywords.filter(kw => 
      lowerText.includes(kw)
    );
    const keywordsScore = Math.round((matchedKeywords.length / requirements.expectedKeywords.length) * 100);

    // 3. Project adequacy
    const projectMatch = projectCount >= requirements.minProjects;
    
    // 4. Internship adequacy
    const internshipMatch = internshipCount >= requirements.minExperience;

    // 5. Certification adequacy
    const certMatch = certificationCount >= requirements.minCerts;

    // 6. Role Match Score (combination of skills match and keyword presence)
    const roleMatchScore = Math.round((skillsScore * 0.7) + (keywordsScore * 0.3));

    // 7. Interview Readiness Score
    // Weighted average: Skills (40%), Projects (25%), Internships/Experience (20%), Certifications (15%)
    const projectScoreFactor = projectCount === 0 ? 20 : projectCount === 1 ? 60 : 100;
    const experienceScoreFactor = internshipCount > 0 ? 100 : (lowerText.includes('experience') ? 70 : 30);
    const certificationScoreFactor = certificationCount > 0 ? 100 : 40;

    const interviewReadinessScore = Math.round(
      (skillsScore * 0.40) + 
      (projectScoreFactor * 0.25) + 
      (experienceScoreFactor * 0.20) + 
      (certificationScoreFactor * 0.15)
    );

    // 8. Generate missing requirements list with explanations
    const explanations = [];
    if (missingRequirements.length > 0) {
      explanations.push(`Missing core skills: [${missingRequirements.join(', ')}].`);
    }
    if (projectCount < requirements.minProjects) {
      explanations.push(`Requires at least ${requirements.minProjects} projects (currently identified: ${projectCount}).`);
    }
    if (internshipCount < requirements.minExperience && !lowerText.includes('experience')) {
      explanations.push(`Requires prior industrial or internship exposure in ${targetRole}.`);
    }
    if (certificationCount < requirements.minCerts) {
      explanations.push('Adding a relevant professional certification is highly recommended.');
    }
    if (matchedKeywords.length < 3) {
      explanations.push('Incorporate more domain terminology into your summaries and experience.');
    }

    if (explanations.length === 0) {
      explanations.push('Perfect match! The resume meets all target credentials and skill expectations.');
    }

    return {
      role: targetRole,
      roleMatch: {
        role: targetRole,
        score: Math.min(100, roleMatchScore),
        requiredSkills: requirements.skills,
        matchedSkills,
        missingRequirements
      },
      interviewReadiness: {
        score: Math.min(100, interviewReadinessScore),
        reasons: explanations,
        needsImprovement: missingRequirements
      }
    };
  }
};

roleAnalyzer.ROLE_REQUIREMENTS = ROLE_REQUIREMENTS;
module.exports = roleAnalyzer;
