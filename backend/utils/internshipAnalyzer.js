const internshipAnalyzer = {
  analyze: (text) => {
    if (!text) {
      return {
        count: 0,
        score: 0,
        recruiterValue: 'Low',
        summary: 'No internship or professional experience found.'
      };
    }

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let count = 0;
    const detectedInternships = [];

    // Scan for lines containing internship patterns
    const internshipPattern = /\b(intern|internship|trainee|apprentice|co-op|summer\s+intern|software\s+engineering\s+intern)\b/i;
    
    lines.forEach(line => {
      if (internshipPattern.test(line)) {
        // Double check this line isn't a section header
        if (!/^(internships|experience|work history)(:|\s|$)/i.test(line)) {
          count++;
          detectedInternships.push(line);
        }
      }
    });

    // Score calculations
    // 0 internships = 40 (or 20 if zero work experience detected)
    // 1 internship = 75
    // 2+ internships = 100
    // If there is general "work experience" instead of "internship", give points too
    const generalExperience = /\b(work\s+experience|professional\s+experience|experience|employment|job|position)\b/i.test(text);
    
    let score = 0;
    if (count === 0) {
      score = generalExperience ? 60 : 30;
    } else if (count === 1) {
      score = 85;
    } else {
      score = 100;
    }

    let recruiterValue = 'Low';
    let summary = 'No internships or work history detected. Recruiters value hands-on industry experience.';
    
    if (score >= 80) {
      recruiterValue = 'High';
      summary = `Found ${count} internship(s). Highly valued by recruiters as it shows industrial exposure.`;
    } else if (score >= 60) {
      recruiterValue = 'Medium';
      summary = 'General professional experience found, but explicit internships are missing.';
    }

    return {
      count,
      score,
      recruiterValue,
      summary
    };
  }
};

module.exports = internshipAnalyzer;
