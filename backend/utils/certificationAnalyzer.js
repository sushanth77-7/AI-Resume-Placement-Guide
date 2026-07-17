const CERTIFICATION_PLATFORMS = [
  'aws', 'azure', 'gcp', 'google cloud', 'microsoft', 'oracle', 'cisco', 'red hat', 
  'salesforce', 'coursera', 'udemy', 'nptel', 'scrum', 'pmp', 'comptia', 'freecodecamp',
  'hackerrank', 'leetcode', 'simplilearn', 'edx'
];

const ROLE_CERT_RECOMMENDATIONS = {
  'Frontend Developer': ['Meta Front-End Developer', 'AWS Certified Cloud Practitioner', 'Google UX Design'],
  'Backend Developer': ['AWS Certified Developer - Associate', 'MongoDB Certified Developer Associate', 'NodeJS Certification'],
  'Java Developer': ['Oracle Certified Associate (Java)', 'Spring Professional Certification', 'AWS Developer'],
  'Full Stack Developer': ['AWS Certified Developer - Associate', 'MongoDB Associate Developer', 'Full Stack Open'],
  'MERN Stack Developer': ['MongoDB Certified Developer Associate', 'AWS Certified Developer - Associate', 'Coursera MERN Stack Certificate'],
  'Data Analyst': ['Google Data Analytics Professional Certificate', 'Microsoft Certified: Power BI Data Analyst', 'IBM Data Analyst'],
  'AI/ML Engineer': ['TensorFlow Developer Certificate', 'AWS Certified Machine Learning - Specialty', 'Google Cloud Professional ML Engineer']
};

const certificationAnalyzer = {
  analyze: (text, role = 'MERN Stack Developer') => {
    if (!text) {
      return {
        detected: [],
        score: 0,
        industryValue: 'No content to analyze',
        recommended: []
      };
    }

    const lowerText = text.toLowerCase();
    const detected = [];

    // Scan for platforms and certification-like wording
    CERTIFICATION_PLATFORMS.forEach(platform => {
      // Look for boundary-checked platform names
      const regex = new RegExp(`\\b${platform}\\b`, 'i');
      if (regex.test(lowerText)) {
        detected.push(platform.toUpperCase());
      }
    });

    // Also look for specific certification keywords like "certified", "certifications", "credential"
    const certKeywords = ['certified', 'certification', 'certifications', 'credentials', 'licenses'];
    let mentionCount = 0;
    certKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        mentionCount += matches.length;
      }
    });

    const finalCount = Math.max(detected.length, Math.min(mentionCount, 5));

    // Calculate score
    // 0 certs = 30
    // 1 cert = 60
    // 2 certs = 85
    // 3+ certs = 100
    const score = finalCount === 0 ? 30 : finalCount === 1 ? 65 : finalCount === 2 ? 85 : 100;

    let industryValue = 'No certifications detected. Adding industry certifications boosts your resume authority.';
    if (finalCount > 0) {
      industryValue = `${finalCount} certification platform signals found. Adds strong credibility to technical competencies.`;
    }

    const recommended = ROLE_CERT_RECOMMENDATIONS[role] || ROLE_CERT_RECOMMENDATIONS['MERN Stack Developer'];

    return {
      detected,
      score,
      industryValue,
      recommended
    };
  }
};

module.exports = certificationAnalyzer;
