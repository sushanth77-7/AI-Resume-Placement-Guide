const formatAnalyzer = require('./formatAnalyzer');
const grammarAnalyzer = require('./grammarAnalyzer');
const projectAnalyzer = require('./projectAnalyzer');
const internshipAnalyzer = require('./internshipAnalyzer');
const certificationAnalyzer = require('./certificationAnalyzer');
const roleAnalyzer = require('./roleAnalyzer');
const skillExtractor = require('./skillExtractor');

const atsCalculator = {
  detectSectionAnalysis: (text) => {
    if (!text) {
      return { contact: false, education: false, experience: false, projects: false, certifications: false };
    }
    return {
      contact: /[^\s@]+@[^\s@]+\.[^\s@]+/.test(text) || /[\d\-\(\)]{7,}/.test(text) || /linkedin\.com/i.test(text) || /github\.com/i.test(text),
      education: /education|degree|b\.tech|btech|m\.tech|mtech|b\.sc|bsc|b\.e|be|master|bachelor|university|college|gpa|cgpa/i.test(text),
      experience: /experience|work history|internship|employment|job|position|company/i.test(text),
      projects: /projects?|portfolio|personal project|academic project|github\.com/i.test(text),
      certifications: /certification|certificate|credentials|license|certified/i.test(text)
    };
  },

  analyzeFormat: (text) => formatAnalyzer.analyze(text),
  analyzeGrammar: (text) => grammarAnalyzer.analyze(text),
  analyzeProjects: (text) => projectAnalyzer.analyze(text),
  analyzeInternships: (text) => internshipAnalyzer.analyze(text),
  analyzeCertifications: (text, role) => certificationAnalyzer.analyze(text, role),
  analyzeHackathons: (text) => {
    const matches = text.match(/hackathon|competition|coding challenge/gi) || [];
    return {
      count: matches.length,
      score: Math.min(100, 30 + matches.length * 15),
      impact: matches.length ? 'Participation demonstrates solid programming competence.' : 'No hackathon details found.'
    };
  },
  analyzeGitHub: (text) => {
    const hasGithub = /github\.com/i.test(text);
    return {
      score: hasGithub ? 90 : 20,
      found: hasGithub,
      suggestions: hasGithub ? ['Improve repo readmes', 'Add live links'] : ['Include your GitHub URL', 'Pin top repositories']
    };
  },
  analyzeLinkedIn: (text) => {
    const hasLinkedin = /linkedin\.com/i.test(text);
    return {
      score: hasLinkedin ? 90 : 20,
      found: hasLinkedin,
      suggestions: hasLinkedin ? ['Add summary section', 'Detail work achievements'] : ['Include your LinkedIn URL', 'Update title tags']
    };
  },
  analyzeAIAssistance: (text) => {
    // writingReview is calculated in aiContentDetector
    return { score: 30, probability: 30, likelySections: [], likelyHumanSections: [], warning: false, reasoning: 'Looks human-written.' };
  },
  analyzeQuality: (text, skillCount = 0, roleMatchScore = 0) => {
    const format = formatAnalyzer.analyze(text).score;
    const grammar = grammarAnalyzer.analyze(text).score;
    const proj = projectAnalyzer.analyze(text).score;
    const intern = internshipAnalyzer.analyze(text).score;
    const cert = certificationAnalyzer.analyze(text).score;
    
    // Calculate readability
    const lines = text ? text.split('\n').filter(Boolean) : [];
    const longSentences = lines.filter(l => l.split(/\s+/).length > 25).length;
    const readability = Math.max(30, 100 - (longSentences * 5));
    
    const completeness = atsCalculator.analyzeProfileCompleteness(text).score;

    const breakdown = {
      formatting: format,
      grammar: grammar,
      skills: Math.min(100, skillCount * 10),
      projects: proj,
      experience: intern,
      readability,
      certifications: cert,
      roleMatch: roleMatchScore
    };
    return {
      score: Math.round((format * 0.30) + (grammar * 0.30) + (readability * 0.25) + (completeness * 0.15)),
      formattingIssues: formatAnalyzer.analyze(text).issues,
      strengths: ['Clear design elements', 'Logical flow structure'],
      breakdown
    };
  },
  getResumeQualityScore: (format, grammar, project, internship, certification, skillCount = 0, roleMatchScore = 0, text = '') => {
    // Calculate readability
    const lines = text ? text.split('\n').filter(Boolean) : [];
    const longSentences = lines.filter(l => l.split(/\s+/).length > 25).length;
    const readability = Math.max(30, 100 - (longSentences * 5));
    
    // Calculate organization
    const completeness = atsCalculator.analyzeProfileCompleteness(text).score;

    const breakdown = {
      formatting: format,
      grammar: grammar,
      skills: Math.min(100, skillCount * 10),
      projects: project,
      experience: internship,
      readability,
      certifications: certification,
      roleMatch: roleMatchScore
    };
    return {
      score: Math.round((format * 0.30) + (grammar * 0.30) + (readability * 0.25) + (completeness * 0.15)),
      breakdown
    };
  },

  analyzeProfileCompleteness: (text) => {
    if (!text) {
      return {
        checks: {
          summary: false, skills: false, experience: false, projects: false, certifications: false,
          github: false, linkedin: false, portfolio: false, achievements: false, hackathons: false
        },
        score: 0,
        summary: [],
        impacts: {}
      };
    }
    const checks = {
      summary: /summary|objective|profile|about\s+me|career\s+summary|overview/i.test(text),
      skills: /skills|technologies|technical\s+skills|expertise|proficiencies|languages/i.test(text),
      experience: /experience|work\s+history|employment|professional\s+background|internship|job/i.test(text),
      projects: /projects?|personal\s+projects?|academic\s+projects?|github\.com/i.test(text),
      certifications: /certifications?|credentials?|licenses?|certified/i.test(text),
      github: /github\.com/i.test(text),
      linkedin: /linkedin\.com/i.test(text),
      portfolio: /portfolio|personal\s+website|behance|dribbble|github\.io/i.test(text),
      achievements: /achievements?|awards?|honors?|accomplishments?/i.test(text),
      hackathons: /hackathons?|competitions?|challenges?/i.test(text)
    };

    const count = Object.values(checks).filter(Boolean).length;
    const score = Math.round((count / Object.keys(checks).length) * 100);

    const impacts = {};
    Object.entries(checks).forEach(([key, present]) => {
      if (!present) {
        if (['skills', 'experience', 'projects'].includes(key)) {
          impacts[key] = { level: 'High', explanation: `Missing ${key} prevents recruiters from validating core capabilities.` };
        } else if (['github', 'linkedin', 'summary'].includes(key)) {
          impacts[key] = { level: 'Medium', explanation: `Adding ${key} improves recruiter outreach and confidence.` };
        } else {
          impacts[key] = { level: 'Low', explanation: `Adding ${key} provides supportive background context.` };
        }
      }
    });

    return {
      checks,
      score,
      summary: Object.entries(checks).filter(([_, val]) => val).map(([key]) => key),
      impacts
    };
  },

  // Calculate ATS Score independently (Formatting 10%, Completeness 10%, Tech Skills 15%, Soft Skills 5%, Projects 15%, Experience 15%, Keywords 10%, Quantified Achievements 5%, Certs 5%, Recruiter Impression 10%)
  calculateATS: (text, skills = [], roleMatchScore = 0, role = 'MERN Stack Developer') => {
    if (!text) return 0;

    const breakdown = atsCalculator.getATSBreakdown(text, skills, atsCalculator.detectSectionAnalysis(text), roleMatchScore, role);
    let totalScore = 0;
    breakdown.forEach(([_, score]) => {
      totalScore += score;
    });

    return Math.min(100, Math.max(10, Math.round(totalScore)));
  },

  getATSBreakdown: (text, skills = [], sections = {}, roleMatchScore = 0, role = 'MERN Stack Developer') => {
    const formatScore = formatAnalyzer.analyze(text).score;
    const completenessScore = atsCalculator.analyzeProfileCompleteness(text).score;
    
    // Categorized skills count
    const categorized = skillExtractor.normalizeAndCategorize(skills);
    const techSkillsCount = (categorized.programmingLanguages?.length || 0) + 
                            (categorized.frontend?.length || 0) + 
                            (categorized.backend?.length || 0) + 
                            (categorized.frameworks?.length || 0) + 
                            (categorized.databases?.length || 0) + 
                            (categorized.tools?.length || 0) + 
                            (categorized.cloud?.length || 0) + 
                            (categorized.devops?.length || 0);
    const softSkillsCount = categorized.softSkills?.length || 0;

    const techSkillsScore = Math.min(100, Math.max(20, techSkillsCount * 10));
    const softSkillsScore = Math.min(100, Math.max(20, softSkillsCount * 20));

    const projectScore = projectAnalyzer.analyze(text).score;
    const experienceScore = internshipAnalyzer.analyze(text).score;

    // Terminology density keyword score
    const targetKeywords = ['design', 'development', 'architecture', 'scalability', 'performance', 'database', 'testing', 'deployment', 'integration', 'optimization'];
    const matchedKws = targetKeywords.filter(kw => new RegExp(`\\b${kw}\\b`, 'i').test(text));
    const keywordScore = Math.min(100, Math.max(25, matchedKws.length * 15));

    const hasQuantified = /\b\d+(%|x|\s*(percent|users|millions|k|ms|s))\b/gi.test(text) || /achieved|improved|optimized|reduced/i.test(text);
    const quantifiedScore = hasQuantified ? 100 : 30;

    const certificationScore = certificationAnalyzer.analyze(text, role).score;
    const recruiterScore = Math.round((techSkillsScore * 0.4) + (projectScore * 0.3) + (experienceScore * 0.3));

    return [
      ['Resume Structure & Formatting', Math.round((formatScore / 100) * 10), 10, 'Evaluates layout spacing, hyphenation, and structure.'],
      ['Section Completeness', Math.round((completenessScore / 100) * 10), 10, 'Checks the presence of 10 essential resume parts.'],
      ['Technical Skills', Math.round((techSkillsScore / 100) * 15), 15, 'Rates tech stack breath across language, framework, database, and cloud domains.'],
      ['Soft Skills', Math.round((softSkillsScore / 100) * 5), 5, 'Rates presence of agile, communication, or leadership descriptors.'],
      ['Projects Quality', Math.round((projectScore / 100) * 15), 15, 'Evaluates project descriptions, technologies, and depth.'],
      ['Experience & Internships', Math.round((experienceScore / 100) * 15), 15, 'Analyzes work history, durations, and roles.'],
      ['ATS Keywords', Math.round((keywordScore / 100) * 10), 10, 'Rates keyword optimization for standard screening algorithms.'],
      ['Quantified Achievements', Math.round((quantifiedScore / 100) * 5), 5, 'Looks for action verbs linked to measurable numerical outcomes.'],
      ['Certifications', Math.round((certificationScore / 100) * 5), 5, 'Checks presence of industry standard credentials.'],
      ['Recruiter Impression', Math.round((recruiterScore / 100) * 10), 10, 'A simulated human recruiter appraisal based on experience level and stack depth.']
    ];
  },

  // Resume Quality classification (Poor, Standard, Good, Professional, Excellent)
  getResumeQualityClassification: (qualityScore) => {
    if (qualityScore >= 90) return { label: 'Excellent', rating: 'Excellent layout clarity, grammar correctness, and highly professional metrics.' };
    if (qualityScore >= 80) return { label: 'Professional', rating: 'Industry standard corporate resume formatting and terminology.' };
    if (qualityScore >= 70) return { label: 'Good', rating: 'Solid resume. Needs additional achievements to match premium profiles.' };
    if (qualityScore >= 55) return { label: 'Standard', rating: 'Basic outline, but formatting inconsistencies and lack of technical depth identified.' };
    return { label: 'Poor', rating: 'Requires structural redesign. Address spacing, layout, and sections.' };
  },

  // Decoupled Grade calculation based on overall structure and content quality (not role specific)
  getGrade: (atsScore, roleMatchScore, qualityScore, completenessScore) => {
    const overall = Math.round((atsScore * 0.4) + (qualityScore * 0.3) + (completenessScore * 0.3));

    if (overall >= 95) return { grade: 'A+', reason: 'Outstanding overall resume quality, exceptional formatting, and robust section completeness.' };
    if (overall >= 90) return { grade: 'A', reason: 'Excellent resume quality, highly structured content, and complete professional details.' };
    if (overall >= 85) return { grade: 'B+', reason: 'Very good resume format and details, with minor formatting adjustments needed.' };
    if (overall >= 75) return { grade: 'B', reason: 'Solid resume. Needs stronger technical terminology and more quantified accomplishments.' };
    if (overall >= 65) return { grade: 'C+', reason: 'Decent structure. Needs deeper projects and technical keywords to pass automated screening.' };
    if (overall >= 55) return { grade: 'C', reason: 'Basic formatting. Highlight professional experiences, certifications, and metrics.' };
    return { grade: 'D', reason: 'Requires major restructuring. Address spelling, formatting, and add comprehensive project/internship sections.' };
  },

  getRoleReadiness: (role, roleMatch, projectAnalysis, internshipAnalysis, certificationAnalysis) => {
    const skillsMatch = roleMatch.score || 0;
    const projectsMatch = projectAnalysis.score || 0;
    const experienceMatch = internshipAnalysis.score || 0;
    const certificationMatch = certificationAnalysis.score || 0;

    return {
      role,
      readinesScore: Math.round(
        (skillsMatch * 0.4) +
        (projectsMatch * 0.25) +
        (experienceMatch * 0.20) +
        (certificationMatch * 0.15)
      ),
      skillsMatch,
      projectsMatch,
      experienceMatch,
      certificationMatch
    };
  },

  generateFeedback: (score, skills = [], text = '', sections = {}) => {
    const lines = [];
    if (score >= 85) {
      lines.push('Excellent! Your resume exhibits standard ATS structural elements and clear readability.');
    } else if (score >= 60) {
      lines.push('Good foundation. Your resume structure is standard, but you must enrich role keywords.');
    } else {
      lines.push('Your resume needs improvements in length, key matching keywords, and formatting to pass ATS screenings.');
    }

    if (!sections.contact) {
      lines.push('Add clearly visible email and phone details near the header.');
    }
    if (!sections.experience) {
      lines.push('Include professional or internship history details.');
    }
    if (!sections.projects) {
      lines.push('Add a dedicated project section showing engineering implementation.');
    }
    if (!skills || skills.length < 5) {
      lines.push('Incorporate additional specialized tools and technical skills.');
    }

    return lines.join(' ');
  },

  // Role Match evaluation - Decoupled from ATS Score
  evaluateRoleMatch: (role, detectedSkills = [], text = '') => {
    const defaultRole = 'MERN Stack Developer';
    const targetRole = roleAnalyzer.ROLE_REQUIREMENTS[role] ? role : defaultRole;
    const requirements = roleAnalyzer.ROLE_REQUIREMENTS[targetRole];

    const lowerText = text ? text.toLowerCase() : '';
    const normalizedDetected = detectedSkills.map(s => s.toLowerCase());

    // 1. Required Skills Match (40%)
    const matchedRequired = requirements.skills.filter(s => {
      const sLower = s.toLowerCase();
      // equivalents check
      if (sLower === 'react' && (normalizedDetected.includes('reactjs') || normalizedDetected.includes('react.js'))) return true;
      if (sLower === 'node.js' && (normalizedDetected.includes('nodejs') || normalizedDetected.includes('node'))) return true;
      if (sLower === 'mongodb' && (normalizedDetected.includes('mongo') || normalizedDetected.includes('mongoose'))) return true;
      return normalizedDetected.includes(sLower);
    });
    const missingRequired = requirements.skills.filter(s => {
      const sLower = s.toLowerCase();
      if (sLower === 'react' && (normalizedDetected.includes('reactjs') || normalizedDetected.includes('react.js'))) return false;
      if (sLower === 'node.js' && (normalizedDetected.includes('nodejs') || normalizedDetected.includes('node'))) return false;
      if (sLower === 'mongodb' && (normalizedDetected.includes('mongo') || normalizedDetected.includes('mongoose'))) return false;
      return !normalizedDetected.includes(sLower);
    });

    const requiredScore = requirements.skills.length > 0 ? (matchedRequired.length / requirements.skills.length) * 100 : 100;

    // 2. Transferable & Inferred Skills Match (20%)
    const commonTransferable = ['Problem Solving', 'Git', 'REST API', 'Unit Testing', 'CI/CD', 'Agile', 'Scrum', 'Collaboration'];
    const matchedTransferable = commonTransferable.filter(skill => normalizedDetected.includes(skill.toLowerCase()));
    const transferableScore = (matchedTransferable.length / commonTransferable.length) * 100;

    // 3. Project Relevance (15%)
    const matchedProjectKeywords = requirements.expectedKeywords.filter(kw => lowerText.includes(kw));
    const projectRelevanceScore = (matchedProjectKeywords.length / requirements.expectedKeywords.length) * 100;

    // 4. Experience Relevance (15%)
    const hasExperienceKeywords = ['experience', 'internship', 'job', 'position', 'engineer', 'developer', 'work history'].some(w => lowerText.includes(w));
    const experienceRelevanceScore = hasExperienceKeywords ? 100 : 30;

    // 5. Certifications Relevance (10%)
    const hasCerts = /certificat|credentials|certified/i.test(lowerText);
    const certRelevanceScore = hasCerts ? 100 : 40;

    // Calculate Role Match percentage
    const roleMatchScore = Math.round(
      (requiredScore * 0.40) +
      (transferableScore * 0.20) +
      (projectRelevanceScore * 0.15) +
      (experienceRelevanceScore * 0.15) +
      (certRelevanceScore * 0.10)
    );

    return {
      role: targetRole,
      score: Math.min(100, Math.max(10, roleMatchScore)),
      requiredSkills: requirements.skills,
      matchedSkills: matchedRequired,
      missingRequirements: missingRequired,
      breakdown: {
        requiredSkillsMatch: Math.round(requiredScore),
        transferableSkillsMatch: Math.round(transferableScore),
        projectRelevance: Math.round(projectRelevanceScore),
        experienceRelevance: Math.round(experienceRelevanceScore),
        certificationsRelevance: Math.round(certRelevanceScore)
      }
    };
  },

  // Writing Quality analysis (spelling, grammar, verbs, action phrasing)
  getWritingQuality: (text, grammarScore) => {
    const actionVerbs = ['developed', 'engineered', 'optimized', 'led', 'architected', 'automated', 'implemented', 'scaled', 'debugged', 'orchestrated'];
    const matchedVerbs = actionVerbs.filter(v => new RegExp(`\\b${v}\\b`, 'i').test(text));
    
    const bulletPoints = (text.match(/^[•\-\*]/gm) || []).length;
    const hasMetrics = /\b\d+(%|x|\s*(percent|users|millions|k|ms|s))\b/gi.test(text);

    const reasons = [];
    if (grammarScore < 80) reasons.push('Identified grammatical or capitalization issues.');
    if (matchedVerbs.length < 3) reasons.push('Lacks strong action-oriented verbs. Replace weak descriptors like "worked on" or "helped".');
    if (!hasMetrics) reasons.push('Descriptions lack quantified results. Add metrics, percentage boosts, or time-reductions.');
    if (bulletPoints === 0) reasons.push('Resume does not use clean bullet points. Paragraph structures reduce readability.');

    if (reasons.length === 0) {
      reasons.push('Excellent writing quality. Action-driven verbs and clear structural readability.');
    }

    return {
      score: Math.round((grammarScore * 0.5) + (matchedVerbs.length > 3 ? 30 : matchedVerbs.length * 8) + (hasMetrics ? 20 : 0)),
      reasoning: `Writing Quality Analysis: Grammar Score is ${grammarScore}%. Found ${matchedVerbs.length} key action verbs and quantified achievements.`,
      reasons
    };
  },

  getInterviewReadiness: (detectedSkills = [], projectAnalysis = {}, internshipAnalysis = {}, certificationAnalysis = {}, hackathonAnalysis = {}, githubAnalysis = {}, linkedinAnalysis = {}, profileCompleteness = {}, text = '') => {
    const base = atsCalculator.getInterviewReadinessBase(detectedSkills, projectAnalysis, internshipAnalysis, certificationAnalysis, hackathonAnalysis, githubAnalysis, linkedinAnalysis, profileCompleteness, text);
    return {
      score: base.score,
      reasons: base.reasons,
      needsImprovement: base.needsImprovement,
      breakdown: {
        technicalReadiness: base.score >= 80 ? 'High' : base.score >= 60 ? 'Medium' : 'Low',
        behavioralReadiness: profileCompleteness.score >= 80 ? 'High' : 'Medium'
      }
    };
  },

  getInterviewReadinessBase: (detectedSkills, projectAnalysis, internshipAnalysis, certificationAnalysis, hackathonAnalysis, githubAnalysis, linkedinAnalysis, profileCompleteness, text) => {
    const skillsCount = detectedSkills ? detectedSkills.length : 0;
    const projectCount = projectAnalysis ? (projectAnalysis.count || 0) : 0;
    const experienceCount = internshipAnalysis ? (internshipAnalysis.count || 0) : 0;
    const certCount = (certificationAnalysis && certificationAnalysis.detected) ? certificationAnalysis.detected.length : 0;
    const hackathonCount = hackathonAnalysis ? (hackathonAnalysis.count || 0) : 0;
    const hasGithub = githubAnalysis ? (githubAnalysis.found || false) : false;
    const hasLinkedin = linkedinAnalysis ? (linkedinAnalysis.found || false) : false;
    
    const checks = (profileCompleteness && profileCompleteness.checks) ? profileCompleteness.checks : {};
    const hasAchievements = checks.achievements || false;
    
    const skillsScore = Math.min(100, Math.max(10, skillsCount * 10));
    const projectScore = projectCount === 0 ? 25 : projectCount === 1 ? 65 : 100;
    let experienceScore = experienceCount === 0 ? 30 : experienceCount === 1 ? 75 : 100;
    if (experienceCount === 0 && /experience|work history/i.test(text)) {
      experienceScore = 65;
    }
    const certScore = certCount > 0 ? 100 : 35;
    const achievementScore = hasAchievements ? 100 : 35;
    const githubScore = hasGithub ? 100 : 30;
    const hackathonScore = hackathonCount > 0 ? 100 : 30;

    const interviewReadinessScore = Math.round(
      (skillsScore * 0.25) +
      (projectScore * 0.20) +
      (experienceScore * 0.20) +
      (certScore * 0.15) +
      (achievementScore * 0.10) +
      (githubScore * 0.05) +
      (hackathonScore * 0.05)
    );

    const reasons = [];
    const needsImprovement = [];

    if (skillsCount >= 5) {
      reasons.push(`Strong skills portfolio containing ${skillsCount} technical credentials.`);
    } else {
      needsImprovement.push('Technical skills list is sparse. Add core tools and libraries.');
    }

    if (projectCount > 0) {
      reasons.push(`Hands-on implementation projects (${projectCount} detected) show practical coding skills.`);
    } else {
      needsImprovement.push('No projects found. Add 2-3 detailed projects describing technology and outcomes.');
    }

    if (experienceCount > 0) {
      reasons.push(`Prior work history or internships (${experienceCount} detected) show team capability.`);
    } else if (/experience|work history/i.test(text)) {
      reasons.push('Prior professional experience is represented in the resume.');
    } else {
      needsImprovement.push('Missing professional/internship experience listings.');
    }

    if (certCount > 0) {
      reasons.push(`Industry certifications found (${certCount} detected).`);
    } else {
      needsImprovement.push('Consider adding relevant industry certifications to prove credentials.');
    }

    if (hasAchievements) {
      reasons.push('Achievements or honors are present, showing high-performance indicators.');
    } else {
      needsImprovement.push('Include a dedicated achievements section to highlight key milestones.');
    }

    if (hasGithub) {
      reasons.push('GitHub repository links are provided for direct code verification.');
    } else {
      needsImprovement.push('Add your GitHub profile link near your contact details.');
    }

    if (hackathonCount > 0) {
      reasons.push(`Hackathon participation (${hackathonCount} matches) proves competitive competence.`);
    }

    if (reasons.length === 0) {
      reasons.push('Basic resume content parsed.');
    }

    return {
      score: Math.min(100, Math.max(15, interviewReadinessScore)),
      reasons,
      needsImprovement
    };
  },

  generateStrengthsWeaknesses: (skills = [], sections = {}, text = '') => {
    const strengths = [];
    const weaknesses = [];

    if (sections.experience) strengths.push('Clear work experience sections representing professional/academic history.');
    if (sections.projects) strengths.push('Implementation projects highlighted in the profile content.');
    if (skills && skills.length >= 6) strengths.push('Technical stack features multiple programming tools.');
    if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(text) && /linkedin\.com/i.test(text)) strengths.push('Direct networking profiles (LinkedIn URL) are clearly provided.');
    if (/\b\d+(%|x)/.test(text) || /improved|optimized|reduced/i.test(text)) strengths.push('Measurable achievements or percentages mentioned.');

    if (!sections.certifications) weaknesses.push('Add certified industry credentials to support technical claims.');
    if (!/github\.com/i.test(text)) weaknesses.push('Add repository link (GitHub) for code verification.');
    if (!/linkedin\.com/i.test(text)) weaknesses.push('Add networking profile link (LinkedIn URL) near contact details.');
    if (skills && skills.length < 5) weaknesses.push('Technical skills list is too sparse.');
    if (!/\b\d+(%|x)/.test(text)) weaknesses.push('Quantify accomplishments with metrics.');

    if (strengths.length === 0) strengths.push('Core academic credentials represented.');
    if (weaknesses.length === 0) weaknesses.push('Incorporate additional target role terms.');

    return { strengths, weaknesses };
  },

  generateRecruiterPerspective: (strengths = [], weaknesses = [], roleMatchScore = 0, atsScore = 0) => {
    const positivePoints = strengths.slice(0, 3);
    const concerns = weaknesses.slice(0, 3);

    let hiringReadiness = 'Moderate';
    if (atsScore >= 80 && roleMatchScore >= 75) hiringReadiness = 'Strong';
    else if (atsScore < 60) hiringReadiness = 'Needs Improvement';

    let interviewReadiness = 'Good fit';
    if (roleMatchScore < 50) interviewReadiness = 'Focus on role-specific project tasks';
    else if (roleMatchScore < 70) interviewReadiness = 'Refine domain terms in experience description';

    return {
      positivePoints,
      concerns,
      hiringReadiness,
      interviewReadiness,
      expectations: 'First Impression: Focus on showcasing clean system development methodologies, tech stack combinations, and testing.'
    };
  },

  generateCareerRoadmap: (role = 'MERN Stack Developer', missingSkills = [], sections = {}) => {
    const skillsToLearn = missingSkills.slice(0, 4);
    const isDev = role.toLowerCase().includes('dev') || role.toLowerCase().includes('engineer');

    return {
      skillsToLearn: skillsToLearn.length > 0 ? skillsToLearn : ['System Architecture', 'Design Patterns'],
      certificationsToObtain: isDev 
        ? ['AWS Certified Cloud Practitioner', 'MongoDB Associate Developer'] 
        : ['Google Data Analytics', 'Tableau Desktop Specialist'],
      projectsToBuild: isDev 
        ? ['Fullstack microservice platform', 'GitHub workflow automation'] 
        : ['Analytics dashboard with SQL/Python', 'Predictive metrics dataset project'],
      portfolioImprovements: [
        'Embed live demo URLs in projects',
        'Add a clear system design diagram to GitHub readmes',
        'Refine LinkedIn headline to target key roles'
      ],
      internshipRecommendations: sections.experience 
        ? ['Target specialized junior/mid positions'] 
        : ['Apply for open-source contributions', 'Target introductory internship schemes']
    };
  }
};

module.exports = atsCalculator;
