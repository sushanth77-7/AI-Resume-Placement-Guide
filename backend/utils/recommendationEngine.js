const recommendationEngine = {
  generate: async (resume) => {
    const recommendations = [];

    // Check for formatting issues
    if (!resume.content.includes('\n')) {
      recommendations.push({
        type: 'Format',
        title: 'Add Line Breaks',
        description: 'Your resume appears to be in a single continuous block. Add proper line breaks and sections to improve readability.',
        priority: 'High'
      });
    }

    // Check for contact information
    const hasEmail = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(resume.content);
    const hasPhone = /[\d\-\(\)]{7,}/.test(resume.content);

    if (!hasEmail) {
      recommendations.push({
        type: 'Content',
        title: 'Add Email Address',
        description: 'Include your email address prominently at the top of your resume so recruiters can easily contact you.',
        priority: 'High'
      });
    }

    if (!hasPhone) {
      recommendations.push({
        type: 'Content',
        title: 'Add Phone Number',
        description: 'Include your phone number to make it easy for recruiters to reach you.',
        priority: 'High'
      });
    }

    // Check for experience section
    if (!resume.content.toLowerCase().includes('experience')) {
      recommendations.push({
        type: 'Content',
        title: 'Add Experience Section',
        description: 'Include a dedicated "Experience" section highlighting your professional background and achievements.',
        priority: 'High'
      });
    }

    // Check for education section
    if (!resume.content.toLowerCase().includes('education')) {
      recommendations.push({
        type: 'Content',
        title: 'Add Education Section',
        description: 'Include your educational qualifications including degree, institution, and graduation year.',
        priority: 'Medium'
      });
    }

    // Check for skills section
    if (resume.skills.length < 5) {
      recommendations.push({
        type: 'Skills',
        title: 'Expand Skills Section',
        description: `You have ${resume.skills.length} skills listed. Consider adding more relevant technical and soft skills to strengthen your profile.`,
        priority: 'Medium'
      });
    }

    // ATS Score recommendations
    if (resume.atsScore < 60) {
      recommendations.push({
        type: 'Keywords',
        title: 'Improve ATS Compatibility',
        description: 'Your resume has a low ATS score. Use industry-specific keywords and maintain proper formatting to improve compatibility with applicant tracking systems.',
        priority: 'High'
      });
    }

    // Length check
    if (resume.content.length < 500) {
      recommendations.push({
        type: 'Content',
        title: 'Expand Resume Content',
        description: 'Your resume appears to be quite short. Add more details about your experience, projects, and achievements.',
        priority: 'Medium'
      });
    }

    // Check for quantifiable achievements
    const hasNumbers = /\d+/.test(resume.content);
    if (!hasNumbers) {
      recommendations.push({
        type: 'Content',
        title: 'Add Quantifiable Metrics',
        description: 'Include numbers and metrics in your experience descriptions (e.g., "increased sales by 20%", "managed team of 5").',
        priority: 'Medium'
      });
    }

    return recommendations;
  }
};

module.exports = recommendationEngine;
