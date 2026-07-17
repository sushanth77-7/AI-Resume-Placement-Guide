const resumeQualityAnalyzer = {
  analyze: (formatScore, grammarScore, projectScore, internshipScore, certificationScore, skillCount = 0, roleMatchScore = 0, text = '') => {
    // 1. Calculate Individual Breakdown Metrics
    const formatting = formatScore;
    const grammar = grammarScore;
    const skills = Math.min(100, Math.max(15, skillCount * 12));
    const projects = projectScore;
    const experience = internshipScore;
    
    // Readability: Penalized by long sentences or lack of paragraphs
    const longSentencesCount = text ? (text.match(/[^.!?]{100,}/g) || []).length : 0;
    const readability = Math.min(100, Math.max(20, 100 - (longSentencesCount * 8)));

    const certifications = certificationScore;
    const roleMatch = roleMatchScore;

    // Aggregate Quality Score (weighted combination of the 8 metrics)
    const qualityScore = Math.round(
      (formatting * 0.15) +
      (grammar * 0.15) +
      (skills * 0.15) +
      (projects * 0.15) +
      (experience * 0.15) +
      (readability * 0.10) +
      (certifications * 0.05) +
      (roleMatch * 0.10)
    );

    const formattingIssues = [];
    const strengths = [];

    // Analyze individual score contributions for Strengths & Issues list
    if (formatting >= 80) {
      strengths.push('Professional layout and document structure');
    } else {
      formattingIssues.push('Review spacing and heading capitalization to improve document layout');
    }

    if (grammar >= 80) {
      strengths.push('Excellent writing and grammatical standards');
    } else {
      formattingIssues.push('Address spelling errors and replace weak verbs with action phrasing');
    }

    if (projects >= 80) {
      strengths.push('Detailed, measurable project details present');
    } else if (projects >= 50) {
      strengths.push('Project history is present');
    }

    if (experience >= 80) {
      strengths.push('Industrial internship/employment background');
    }

    if (certifications >= 80) {
      strengths.push('Verified certifications from recognized platforms');
    }

    if (roleMatch >= 80) {
      strengths.push('Highly aligned skills for the target position');
    }

    if (strengths.length === 0) {
      strengths.push('Standard contact and skills listing present');
    }

    return {
      score: Math.min(100, Math.max(10, qualityScore)),
      formattingIssues,
      strengths,
      breakdown: {
        formatting,
        grammar,
        skills,
        projects,
        experience,
        readability,
        certifications,
        roleMatch
      }
    };
  }
};

module.exports = resumeQualityAnalyzer;
