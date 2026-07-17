const ROLE_EXPECTATIONS = {
  'Frontend Developer': 'Recruiters expect deep React/JavaScript knowledge, web performance optimization, responsive layouts, Tailwind/CSS, and Git/GitHub portfolio links with live demo urls.',
  'Backend Developer': 'Recruiters expect server-side architecture proficiency (Node.js/Express or Spring Boot), REST API design, database queries/indexing (MongoDB, SQL), caching, security, and cloud deployment experiences.',
  'Java Developer': 'Recruiters expect solid Core Java knowledge, OOP principles, Spring Boot and Hibernate frameworks, SQL database management, JUnit testing, and basic CI/CD knowledge.',
  'Full Stack Developer': 'Recruiters expect end-to-end web deployment experience, API integrations, relational and non-relational database design, modern frontends (React/Angular), and Docker containerization.',
  'MERN Stack Developer': 'Recruiters expect full-stack competence across MongoDB, Express, React, and Node.js, state management (Redux), user authentication (JWT/OAuth), RESTful services, and server deployment.',
  'Data Analyst': 'Recruiters expect proficiency in SQL queries, Python/R, data visualization platforms (Tableau, PowerBI), advanced Excel, statistical analysis, and clean dashboard project portfolios.',
  'AI/ML Engineer': 'Recruiters expect Python proficiency, machine learning math, model training and optimization libraries (TensorFlow, PyTorch, Scikit-learn), dataset cleaning, and Git repositories with research/project demos.'
};

const ROLE_IMPROVEMENT_SUGGESTIONS = {
  'Frontend Developer': [
    'Add links to live hosting (Netlify/Vercel) for your React projects.',
    'Mention experience with TypeScript, as it is standard in enterprise frontends.',
    'List performance improvements (e.g. "reduced bundle size by 20%").'
  ],
  'Backend Developer': [
    'Explain API security measures implemented (e.g. JWT, rate limiting, encryption).',
    'Include Docker and docker-compose files in your GitHub repositories.',
    'Highlight database query optimization or caching (Redis).'
  ],
  'Java Developer': [
    'Incorporate Spring Security and Spring Data JPA keywords.',
    'List experience writing unit tests with JUnit/Mockito.',
    'Mention Maven or Gradle dependency management.'
  ],
  'Full Stack Developer': [
    'Detail both client and server contributions in project descriptions.',
    'Include a deployment diagram or mention AWS/GCP/Heroku infrastructure.',
    'List CI/CD automation pipelines used in GitHub.'
  ],
  'MERN Stack Developer': [
    'Explicitly state MongoDB aggregation pipelines or Mongoose schemas.',
    'Mention React hooks, Context API, or Redux toolkit for state management.',
    'Detail user authentication (JWT/cookies) and API routes.'
  ],
  'Data Analyst': [
    'Link to a Tableau or PowerBI public dashboard portfolio.',
    'Mention SQL optimization tricks (joins, indices, subqueries).',
    'Add specific analysis libraries (Pandas, NumPy, Seaborn).'
  ],
  'AI/ML Engineer': [
    'Link to Jupyter Notebooks or training scripts in your GitHub.',
    'Detail model performance metrics (accuracy, F1-score, loss reduction).',
    'Mention dataset size, cleaning steps, and model deployment (e.g. Flask/FastAPI).'
  ]
};

const recruiterAnalyzer = {
  analyze: (text, role, detectedSkills, missingSkills, projectCount, internshipCount, certificationCount) => {
    const positivePoints = [];
    const concerns = [];

    const lowerText = text ? text.toLowerCase() : '';

    // 1. Positive Points (What is helping the candidate)
    if (projectCount >= 2) {
      positivePoints.push('Has multiple project showcases, validating coding competence');
    }
    if (internshipCount > 0) {
      positivePoints.push('Prior industrial experience or internship roles listed');
    } else if (lowerText.includes('experience') || lowerText.includes('work history')) {
      positivePoints.push('Professional employment background');
    }
    if (certificationCount > 0) {
      positivePoints.push('Professional certifications showing proactive skill building');
    }
    if (detectedSkills.length >= 6) {
      positivePoints.push('Broad base of technical skills relevant to development work');
    }
    if (/github\.com/i.test(lowerText)) {
      positivePoints.push('GitHub links are present, which helps verify code quality');
    }
    if (/linkedin\.com/i.test(lowerText)) {
      positivePoints.push('LinkedIn URL is present, confirming professional presence');
    }
    if (/(metric|%|improved|reduced|optimized|\b\d+\b)/i.test(lowerText)) {
      positivePoints.push('Quantifiable achievements with business metrics included');
    }

    if (positivePoints.length === 0) {
      positivePoints.push('Basic education credentials present');
    }

    // 2. Concerns (What is missing)
    if (projectCount === 0) {
      concerns.push('Missing projects section; recruiters cannot evaluate technical skills');
    } else if (projectCount < 2) {
      concerns.push('Lacks project depth; add at least two complex projects');
    }
    if (internshipCount === 0) {
      concerns.push('No internships or work history listed, indicating lack of business team exposure');
    }
    if (certificationCount === 0) {
      concerns.push('No certifications found; certifications help validate skills for junior applicants');
    }
    if (!/github\.com/i.test(lowerText)) {
      concerns.push('GitHub profile URL is missing; code repos are standard for this role');
    }
    if (!/linkedin\.com/i.test(lowerText)) {
      concerns.push('LinkedIn URL is missing; standard for recruiter verification checks');
    }
    if (missingSkills.length > 3) {
      concerns.push(`Lacks essential target skills: [${missingSkills.slice(0, 3).join(', ')}]`);
    }
    if (!/(metric|%|improved|reduced|optimized)/i.test(lowerText)) {
      concerns.push('Missing measurable achievements (e.g. percentages, loading times)');
    }

    if (concerns.length === 0) {
      concerns.push('Formatting could be optimized for automated screeners');
    }

    // 3. Suggestions for improving hiring chances
    const baseSuggestions = ROLE_IMPROVEMENT_SUGGESTIONS[role] || ROLE_IMPROVEMENT_SUGGESTIONS['MERN Stack Developer'];
    const suggestions = [...baseSuggestions];

    if (!/github\.com/i.test(lowerText)) {
      suggestions.push('Add your GitHub profile link near the top contact section.');
    }
    if (!/linkedin\.com/i.test(lowerText)) {
      suggestions.push('Add your LinkedIn profile link to improve social validation.');
    }
    if (projectCount < 2) {
      suggestions.push('Build and host 2 complex projects on public platforms and link them.');
    }

    // 4. Hiring & Interview Readiness
    let hiringReadiness = 'Moderate';
    let interviewReadiness = 'Requires more project details';

    const scoreFactor = (positivePoints.length / (positivePoints.length + concerns.length)) * 100;
    if (scoreFactor >= 75) {
      hiringReadiness = 'Strong';
      interviewReadiness = 'Good fit for immediate technical interviews';
    } else if (scoreFactor >= 45) {
      hiringReadiness = 'Moderate';
      interviewReadiness = 'Strengthen keyword matches before applying';
    } else {
      hiringReadiness = 'Needs Improvement';
      interviewReadiness = 'Focus on building portfolio projects and adding key skills';
    }

    const baseExpectations = ROLE_EXPECTATIONS[role] || ROLE_EXPECTATIONS['MERN Stack Developer'];
    
    // Structure expectations field to answer all requirements
    const firstConcern = concerns.length > 0 ? concerns[0] : 'Optimize keywords for target role.';
    const expectations = `${baseExpectations}

What should be improved first:
${firstConcern}

Top 3 Actions to Improve:
1. ${suggestions[0] || 'Enrich technical skill matches.'}
2. ${suggestions[1] || 'Quantify achievements with business metrics.'}
3. ${suggestions[2] || 'Host projects and link to GitHub/live demo.'}`;

    return {
      positivePoints,
      concerns,
      suggestions,
      hiringReadiness,
      interviewReadiness,
      expectations
    };
  }
};

module.exports = recruiterAnalyzer;
exportSuggestions = ROLE_IMPROVEMENT_SUGGESTIONS;
exportExpectations = ROLE_EXPECTATIONS;
