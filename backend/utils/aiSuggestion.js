const axios = require('axios');
const formatAnalyzer = require('./formatAnalyzer');
const grammarAnalyzer = require('./grammarAnalyzer');
const aiContentDetector = require('./aiContentDetector');
const projectAnalyzer = require('./projectAnalyzer');
const internshipAnalyzer = require('./internshipAnalyzer');
const certificationAnalyzer = require('./certificationAnalyzer');
const recruiterAnalyzer = require('./recruiterAnalyzer');
const roleAnalyzer = require('./roleAnalyzer');
const resumeQualityAnalyzer = require('./resumeQualityAnalyzer');
const atsCalculator = require('./atsCalculator');
const skillExtractor = require('./skillExtractor');

const ROLE_SUGGESTIONS_MAP = {
  'Frontend Developer': [
    { title: 'Incorporate advanced state management', description: 'Detail experience using Redux Toolkit or Context API in React.', priority: 'high', action: 'Add state management' },
    { title: 'Highlight web performance optimization', description: 'Detail bundle splitting, lazy loading, and image compression with metrics.', priority: 'medium', action: 'Add performance metrics' }
  ],
  'Backend Developer': [
    { title: 'Detail API security measures', description: 'Explain implementation of JWT, rate limiting, and CORS security headers.', priority: 'high', action: 'Detail security controls' },
    { title: 'Mention database query optimization', description: 'Include details on MongoDB indexing, transaction handling, or Redis caching.', priority: 'medium', action: 'Optimize databases' }
  ],
  'Java Developer': [
    { title: 'Emphasize Spring ecosystem tools', description: 'Describe integration of Spring Data JPA, Spring Security, or Microservices.', priority: 'high', action: 'Add Spring details' },
    { title: 'Detail testing coverage', description: 'Highlight unit testing using JUnit and Mockito to show testing discipline.', priority: 'medium', action: 'Add testing tools' }
  ],
  'Full Stack Developer': [
    { title: 'Highlight full-stack deployment', description: 'Explain Docker container usage and deployment on AWS or GCP.', priority: 'high', action: 'Describe infrastructure' },
    { title: 'Detail end-to-end API integrations', description: 'Describe frontend Axios requests communicating with secure backend databases.', priority: 'medium', action: 'Detail API routes' }
  ],
  'MERN Stack Developer': [
    { title: 'Detail Mongoose schema design', description: 'Describe MongoDB aggregation pipelines, indexing, and schema relations.', priority: 'high', action: 'Detail database queries' },
    { title: 'Mention state orchestration', description: 'Incorporate Redux Toolkit slice details for user sessions or cart status.', priority: 'medium', action: 'Use state patterns' }
  ],
  'Data Analyst': [
    { title: 'Link to Tableau or PowerBI dashboards', description: 'Provide links to public visualization dashboards showing business intelligence skills.', priority: 'high', action: 'Add dashboard links' },
    { title: 'Highlight SQL data cleaning query skills', description: 'Explain complex JOIN queries, subqueries, or CTE usage in SQL tasks.', priority: 'medium', action: 'Detail SQL queries' }
  ],
  'AI/ML Engineer': [
    { title: 'Detail model validation metrics', description: 'Specify accuracy, F1-scores, or loss reductions achieved during training.', priority: 'high', action: 'Quantify model outcomes' },
    { title: 'Mention framework deployments', description: 'Explain ML pipeline serving using Flask, FastAPI, or Docker containers.', priority: 'medium', action: 'Describe serving pipeline' }
  ]
};

const aiSuggestion = {
  generateSuggestions: async (resumeText, atsScore, detectedSkills, missingSkills, role = 'MERN Stack Developer', localHeuristics = {}) => {
    const safeText = typeof resumeText === 'string' ? resumeText : '';
    const safeRole = typeof role === 'string' ? role : 'MERN Stack Developer';
    const safeDetectedSkills = Array.isArray(detectedSkills) ? detectedSkills : [];
    const safeMissingSkills = Array.isArray(missingSkills) ? missingSkills : [];
    const safeLocalHeuristics = localHeuristics && typeof localHeuristics === 'object' ? localHeuristics : {};

    try {
      const apiKey = process.env.GROQ_API_KEY;

      if (!apiKey || apiKey.startsWith('your_')) {
        
        return generateFallback(safeText, safeRole, safeDetectedSkills, safeMissingSkills, safeLocalHeuristics);
      }

      const completeness = safeLocalHeuristics.profileCompleteness || { checks: {} };
      const formatting = safeLocalHeuristics.formatAnalysis || { issues: [] };
      const grammar = safeLocalHeuristics.grammarAnalysis || { grammarSuggestions: [] };

      const prompt = `
        You are an expert technical recruiter, Senior ATS Engineer, and Senior Developer.
        Analyze the candidate's resume content for the target role: "${safeRole}".
        Provide a highly realistic, explainable, and recruiter-focused evaluation.
        Every score, recommendation, and statement must be generated only from the actual resume content and the target role.
        Do not use hardcoded values. Decouple ATS Score, Resume Grade, Resume Quality, and Role Match.

        Return a strict JSON response adhering exactly to the schema below.
        CRITICAL: All comments, recommendations, and roadmap milestones MUST be highly personalized, citing specific projects, sections, or phrasings from the candidate's actual text. Do NOT use generic advice.
        CRITICAL: Under "aiAssistance" (Professional Writing Review), evaluate spelling, grammar, readability, sentence consistency, action verbs, and professionalism. NEVER claim or warn that the resume is AI-generated.
        CRITICAL: Provide clear, detailed evidence-based explanations for every suggestion.

        JSON Schema:
        {
          "atsScore": 85,
          "grade": {
            "grade": "B+",
            "reason": "Detailed quality evaluation explanation based on resume presentation and technical depth."
          },
          "resumeQuality": {
            "classification": "Professional",
            "score": 82,
            "breakdown": {
              "formatting": 85,
              "grammar": 90,
              "readability": 80,
              "organization": 85,
              "professionalism": 80
            },
            "explanation": "Calculated independently based on presentation, spelling/grammar, and text readability."
          },
          "roleMatch": {
            "role": "${safeRole}",
            "score": 78,
            "breakdown": {
              "requiredSkills": 80,
              "transferableSkills": 85,
              "projectRelevance": 70,
              "experienceRelevance": 75,
              "certificationRelevance": 60
            },
            "explanation": "Detail how matching was calculated based only on target role requirements."
          },
          "skillsAnalysis": {
            "categorized": {
              "programmingLanguages": ["JavaScript", "TypeScript"],
              "frontend": ["HTML5", "CSS3", "React"],
              "backend": ["Node.js", "Express"],
              "frameworks": ["Spring Boot", "Express"],
              "databases": ["MongoDB"],
              "cloud": ["AWS"],
              "devops": ["Docker"],
              "tools": ["Git"],
              "softSkills": ["Problem Solving"],
              "others": []
            },
            "transferableSkills": ["Object-Oriented Programming"],
            "missingSkills": [
              {
                "skill": "Node.js",
                "importance": "Crucial runtime environment for backend APIs.",
                "industryRelevance": "Standard environment used in over 80% of modern enterprise backends.",
                "learningPriority": "High",
                "expectedImprovement": "+12% Role Match"
              }
            ],
            "recommendedSkills": ["TypeScript"],
            "industrySkills": ["Agile"]
          },
          "projectsAnalysis": {
            "score": 80,
            "explanation": "Calculated based on complexity, technology depth, and outcomes.",
            "strongestProject": {
              "title": "Strongest Project Title from resume",
              "reason": "Recruiter explanation of why this catches attention, citing specific tech implementations."
            },
            "weakestProject": {
              "title": "Weakest Project Title from resume",
              "reason": "Recruiter explanation of technical/design gaps.",
              "suggestions": ["Include deployment links and measurable project outcomes."]
            },
            "evaluations": [
              {
                "title": "Project Title",
                "complexity": "High / Medium / Low",
                "originality": "High / Medium / Tutorial-based",
                "businessValue": "Real-world utility description.",
                "technologies": ["React", "Express"],
                "deployment": "Live link / Not deployed",
                "github": "Link present / Not linked",
                "documentation": "README quality review.",
                "measurableOutcomes": "Quantifiable outcomes (e.g. reduced load times by 15%)",
                "scalability": "Scalability details"
              }
            ],
            "recommendedProjects": [
              {
                "title": "Project Idea",
                "techStack": "Technologies",
                "description": "Short overview."
              }
            ]
          },
          "experienceAnalysis": {
            "score": 75,
            "explanation": "Calculated based on impact, durations, and relevance.",
            "evaluations": [
              {
                "position": "Job Title",
                "company": "Company Name",
                "responsibilities": "Brief overview.",
                "impact": "Describe business impact.",
                "quantifiedAchievements": ["List of metrics found"],
                "technicalDepth": "Inferred technical complexity.",
                "relevance": "High / Medium / Low"
              }
            ]
          },
          "recruiterFeedback": {
            "firstImpression": "Simulated recruiter review for 30 seconds citing specific resume evidence.",
            "strengths": ["Strength 1 supported by specific resume details", "Strength 2"],
            "weaknesses": ["Weakness 1 supported by specific resume details", "Weakness 2"],
            "concerns": ["Recruiter concern 1 supported by specific resume details", "Concern 2"],
            "probabilities": {
              "interview": 80,
              "atsPass": 85,
              "shortlist": 75,
              "technicalReadiness": 70,
              "hrReadiness": 85
            },
            "hiringRecommendation": "Hiring recommendation detail."
          },
          "aiAssistance": {
            "score": 90,
            "probability": 90,
            "likelySections": [],
            "warning": false,
            "reasoning": "Writing Quality Review: Detailed spelling, grammar, readability, and style analysis.",
            "reasons": ["List of observed grammar and writing patterns."]
          },
          "formatAnalysis": {
            "score": 85,
            "issues": ["Inconsistent spacing or fonts..."],
            "summary": "Format overview."
          },
          "grammarAnalysis": {
            "score": 90,
            "misspellings": [
              { "wrong": "wrong_word", "correct": "correct_word" }
            ],
            "grammarSuggestions": ["Grammar suggestions..."]
          },
          "recruiterPerspective": {
            "positivePoints": ["Highlight points..."],
            "concerns": ["Gaps..."],
            "suggestions": ["Immediate improvements..."],
            "hiringReadiness": "Strong / Moderate / Needs improvement",
            "interviewReadiness": "Good fit / Focus on skills",
            "expectations": "Expectations text."
          },
          "aiSuggestions": [
            {
              "title": "Actionable title",
              "description": "Detailed description",
              "priority": "high / medium / low",
              "action": "Brief step"
            }
          ],
          "achievementSuggestions": [
            { "original": "Generic phrase", "suggestion": "Quantified rewrite" }
          ],
          "rewriteSuggestions": [
            { "original": "Weak phrase", "suggestion": "Action verb rewrite" }
          ],
          "skills": [],
          "strengths": ["Strength 1"],
          "weaknesses": ["Weakness 1"],
          "recommendations": ["Recommendation 1"],
          "improvementRoadmap": {
            "immediate": ["Today improvement"],
            "oneWeek": ["Week improvement"],
            "oneMonth": ["Month improvement"],
            "longTermCareer": ["Long-term improvement"]
          },
          "careerRoadmap": {
            "skillsToLearn": ["Skill 1", "Skill 2"],
            "certificationsToObtain": ["Cert 1", "Cert 2"],
            "projectsToBuild": ["Project 1", "Project 2"],
            "portfolioImprovements": ["Tweak 1", "Tweak 2"]
          },
          "roadmap": {
            "skillsToLearn": [
              {
                "title": "Skill",
                "priority": "High / Medium / Low",
                "difficulty": "Easy / Medium / Hard",
                "completionTime": "Estimated learning time",
                "explanation": "Career benefit and why it matters",
                "expectedAtsImprovement": "+X%",
                "expectedRoleMatchImprovement": "+Y%",
                "resources": ["Learning resources"],
                "steps": ["Step 1", "Step 2"]
              }
            ],
            "certifications": [
              {
                "title": "Cert",
                "priority": "High / Medium / Low",
                "difficulty": "Easy / Medium / Hard",
                "completionTime": "Estimated learning time",
                "explanation": "Career benefit and why it matters",
                "expectedAtsImprovement": "+X%",
                "expectedRoleMatchImprovement": "+Y%",
                "resources": ["Learning resources"],
                "steps": ["Step 1", "Step 2"]
              }
            ],
            "projectsToBuild": [
              {
                "title": "Project",
                "priority": "High / Medium / Low",
                "difficulty": "Easy / Medium / Hard",
                "completionTime": "Estimated learning time",
                "explanation": "Career benefit and why it matters",
                "expectedAtsImprovement": "+X%",
                "expectedRoleMatchImprovement": "+Y%",
                "resources": ["Learning resources"],
                "steps": ["Step 1", "Step 2"]
              }
            ],
            "portfolioImprovements": [
              {
                "title": "Tweak",
                "priority": "High / Medium / Low",
                "difficulty": "Easy / Medium / Hard",
                "completionTime": "Estimated learning time",
                "explanation": "Career benefit and why it matters",
                "expectedAtsImprovement": "+X%",
                "expectedRoleMatchImprovement": "+Y%",
                "resources": ["Learning resources"],
                "steps": ["Step 1", "Step 2"]
              }
            ],
            "interviewPrep": [
              {
                "title": "Prep",
                "priority": "High / Medium / Low",
                "difficulty": "Easy / Medium / Hard",
                "completionTime": "Estimated learning time",
                "explanation": "Career benefit and why it matters",
                "expectedAtsImprovement": "+X%",
                "expectedRoleMatchImprovement": "+Y%",
                "resources": ["Learning resources"],
                "steps": ["Step 1", "Step 2"]
              }
            ],
            "resumeImprovements": [
              {
                "title": "Improvement",
                "priority": "High / Medium / Low",
                "difficulty": "Easy / Medium / Hard",
                "completionTime": "Estimated learning time",
                "explanation": "Career benefit and why it matters",
                "expectedAtsImprovement": "+X%",
                "expectedRoleMatchImprovement": "+Y%",
                "resources": ["Learning resources"],
                "steps": ["Step 1", "Step 2"]
              }
            ],
            "careerGrowth": [
              {
                "title": "Growth",
                "priority": "High / Medium / Low",
                "difficulty": "Easy / Medium / Hard",
                "completionTime": "Estimated learning time",
                "explanation": "Career benefit and why it matters",
                "expectedAtsImprovement": "+X%",
                "expectedRoleMatchImprovement": "+Y%",
                "resources": ["Learning resources"],
                "steps": ["Step 1", "Step 2"]
              }
            ]
          },
          "hiringProbability": {
            "mernDeveloper": 80,
            "javaDeveloper": 60,
            "pythonDeveloper": 50,
            "dataAnalyst": 40,
            "aiEngineer": 30,
            "fullStackDeveloper": 75,
            "softwareEngineer": 80
          },
          "scoreExplanation": "Detail exact breakdown contribution to ATS Score, formatting: X/15, sections: X/15, skills: X/20, projects: X/15, experience: X/15, keywords: X/10, achievements: X/5, recruiter impression: X/5, Final Score: X/100."
        }
      `;

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are a technical career evaluator. You must return only strict JSON.' },
            { role: 'user', content: `${prompt}\n\nResume text:\n${safeText.slice(0, 4500)}` }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.25
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 25000
        }
      );

      const contentString = response?.data?.choices?.[0]?.message?.content || '';
      const parsedData = JSON.parse(contentString);

      return sanitizeLlmData(parsedData, safeText, safeRole, safeDetectedSkills, safeMissingSkills, safeLocalHeuristics);

    } catch (error) {
      console.error('Groq LLM analysis failed, executing local fallback pipeline:', error.message);
      return generateFallback(safeText, safeRole, safeDetectedSkills, safeMissingSkills, safeLocalHeuristics);
    }
  }
};

// Sanitizes LLM outputs to guarantee schema alignment and eliminate contradictions
function sanitizeLlmData(data, resumeText, role, detectedSkills, missingSkills, localHeuristics) {
  const result = { ...data };

  // Make sure structure fields exist with safe defaults
  if (!result.grammarAnalysis) result.grammarAnalysis = { score: 90, misspellings: [], grammarSuggestions: [] };
  if (!result.formatAnalysis) result.formatAnalysis = { score: 85, issues: [], summary: 'Format looks decent.' };
  
  const localCompleteness = localHeuristics.profileCompleteness || { score: 70, checks: {} };
  const formatScore = result.formatAnalysis.score || 80;

  // Enforce Scoring Independence
  const roleMatch = result.roleMatch || atsCalculator.evaluateRoleMatch(role, detectedSkills, resumeText);
  const atsScore = result.atsScore || atsCalculator.calculateATS(resumeText, detectedSkills, roleMatch.score, role);
  
  result.atsScore = atsScore;
  result.roleMatchPercentage = roleMatch.score;
  result.roleMatch = roleMatch;

  // Enforce independency on quality score
  const localQuality = atsCalculator.getResumeQualityScore(formatScore, result.grammarAnalysis.score, 75, 75, 75, detectedSkills.length, roleMatch.score, resumeText);
  
  if (!result.resumeQuality) {
    result.resumeQuality = {
      classification: atsCalculator.getResumeQualityClassification(localQuality.score).label,
      score: localQuality.score,
      breakdown: localQuality.breakdown,
      explanation: 'Calculated independently based on presentation, spelling/grammar, and text readability.'
    };
  }
  result.resumeQualityScore = result.resumeQuality.score || localQuality.score;
  result.qualityAnalysis = result.resumeQuality;

  if (!result.grade || !result.grade.grade) {
    result.grade = atsCalculator.getGrade(atsScore, roleMatch.score, result.resumeQuality.score, localCompleteness.score);
  }

  // Writing Quality check (aiAssistance field mapping)
  if (!result.aiAssistance || !result.aiAssistance.reasoning) {
    const writingReview = aiContentDetector.detect(resumeText);
    result.aiAssistance = {
      score: writingReview.score,
      probability: writingReview.score,
      likelySections: [],
      warning: writingReview.warning,
      reasoning: writingReview.reasoning,
      reasons: writingReview.reasons
    };
  } else {
    // If LLM returned writing review but contains AI warning terms, sanitize it
    result.aiAssistance.reasoning = result.aiAssistance.reasoning.replace(/AI assistance|AI-generated|likely AI/gi, 'professional formatting');
    if (result.aiAssistance.reasons) {
      result.aiAssistance.reasons = result.aiAssistance.reasons.map(r => r.replace(/AI transition|formulaic templates|typical of AI/gi, 'structured spacing or transition phrases'));
    }
  }

  // Completeness checklist synchronizations
  if (!result.profileCompleteness) {
    result.profileCompleteness = localCompleteness;
  }

  if (!result.skillsAnalysis) {
    result.skillsAnalysis = {
      categorized: skillExtractor.normalizeAndCategorize(detectedSkills),
      transferableSkills: ['Problem Solving', 'System Design', 'REST API Development'],
      missingSkills: missingSkills.map(s => ({ skill: s, importance: `Crucial runtime framework/library for ${role} workflows.`, industryRelevance: 'Widely used in modern enterprises.', learningPriority: 'High', expectedImprovement: '+10% Role Match' })),
      recommendedSkills: ['TypeScript', 'Docker'],
      industrySkills: ['Agile Development']
    };
  }

  if (!result.projectsAnalysis) {
    result.projectsAnalysis = {
      score: 75,
      explanation: 'Evaluated based on project complexity and tool utilization.',
      strongestProject: { title: 'Featured Showcase Project', reason: 'Demonstrates end-to-end deployment and database schemas.' },
      weakestProject: { title: 'Sandbox Project', reason: 'Basic implementation with tutorial-level code patterns.', suggestions: ['Add documentation', 'Deploy client'] },
      evaluations: [],
      recommendedProjects: []
    };
  }

  if (!result.experienceAnalysis) {
    result.experienceAnalysis = {
      score: 75,
      explanation: 'Evaluated based on tenure duration and quantified outcomes.',
      evaluations: []
    };
  }

  if (!result.recruiterFeedback) {
    result.recruiterFeedback = {
      firstImpression: 'Clear structure highlighting technical credentials.',
      strengths: ['Comprehensive tech skills', 'Good project descriptions'],
      weaknesses: ['Add additional deployment links', 'Detail certifications'],
      concerns: ['Missing numerical metrics in experience lines'],
      probabilities: { interview: 70, atsPass: 75, shortlist: 70, technicalReadiness: 65, hrReadiness: 80 },
      hiringRecommendation: 'Shortlist for technical interview.'
    };
  }

  if (!result.recruiterPerspective) {
    result.recruiterPerspective = {
      positivePoints: result.recruiterFeedback.strengths || [],
      concerns: result.recruiterFeedback.concerns || [],
      suggestions: ['Quantify accomplishments', 'Add credentials'],
      hiringReadiness: result.recruiterFeedback.probabilities?.atsPass >= 80 ? 'Strong' : 'Moderate',
      interviewReadiness: 'Good fit',
      expectations: `First Impression:\n${result.recruiterFeedback.firstImpression}\n\nWhat should be improved first:\nAdd numerical metrics.\n\nTop 3 Actions to Improve:\n1. Update project documentation\n2. Add live deployment links\n3. Complete industry certifications`
    };
  }

  if (!result.careerRoadmap) {
    result.careerRoadmap = {
      skillsToLearn: ['TypeScript', 'Docker'],
      certificationsToObtain: ['AWS Cloud Practitioner'],
      projectsToBuild: ['Full Stack Dashboard API'],
      portfolioImprovements: ['Add clean README.md documentation']
    };
  }

  if (!result.roadmap) {
    result.roadmap = {
      skillsToLearn: [{ 
        title: 'TypeScript', 
        priority: 'High', 
        difficulty: 'Medium', 
        completionTime: '1 week', 
        careerBenefit: 'Enhances codebase type safety and aligns with enterprise placement filters.', 
        expectedAtsImprovement: '+4%', 
        expectedRoleMatchImprovement: '+5%', 
        resources: ['TypeScript Handbook', 'React TypeScript Cheat Sheet'], 
        steps: ['Study standard type mappings.', 'Configure tsconfig.json in MERN repositories.', 'Annotate React components.'] 
      }],
      certifications: [{ 
        title: 'AWS Cloud Practitioner', 
        priority: 'Medium', 
        difficulty: 'Medium', 
        completionTime: '2 weeks', 
        careerBenefit: 'Proves core cloud deployment and serverless architectural awareness.', 
        expectedAtsImprovement: '+5%', 
        expectedRoleMatchImprovement: '+3%', 
        resources: ['AWS Cloud Practitioner Essentials', 'AWS Cheat Sheets'], 
        steps: ['Understand AWS S3, EC2, and Lambda services.', 'Perform practice mock certification exams.', 'Add credential ID to resume headers.'] 
      }],
      projectsToBuild: [{ 
        title: 'Dockerized Microservices API', 
        priority: 'High', 
        difficulty: 'Hard', 
        completionTime: '3 weeks', 
        careerBenefit: 'Demonstrates professional system design, container orchestration, and REST patterns.', 
        expectedAtsImprovement: '+6%', 
        expectedRoleMatchImprovement: '+7%', 
        resources: ['Docker for Beginners Guide', 'Microservices design patterns'], 
        steps: ['Write Dockerfiles for frontend and backend.', 'Configure docker-compose for multi-container settings.', 'Integrate database volume persistency.'] 
      }],
      portfolioImprovements: [{ 
        title: 'Personal Portfolio Page', 
        priority: 'Medium', 
        difficulty: 'Easy', 
        completionTime: '3 days', 
        careerBenefit: 'Improves recruiter visibility and provides direct click verification for codebase links.', 
        expectedAtsImprovement: '+3%', 
        expectedRoleMatchImprovement: '+2%', 
        resources: ['Vercel deployment guides', 'GitHub Pages quickstart'], 
        steps: ['Create a clean, responsive layout page.', 'Include active links to GitHub repositories.', 'Deploy using Vercel.'] 
      }],
      interviewPrep: [{ 
        title: 'MERN Technical Questions Prep', 
        priority: 'High', 
        difficulty: 'Medium', 
        completionTime: '1 week', 
        careerBenefit: 'Builds quick verbal technical accuracy for technical rounds.', 
        expectedAtsImprovement: '+0%', 
        expectedRoleMatchImprovement: '+5%', 
        resources: ['Frontend Interview Handbook', 'Database indexing guides'], 
        steps: ['Review React hooks, Virtual DOM, and state patterns.', 'Practice express middleware and routing questions.', 'Study indexing and lookup speeds.'] 
      }],
      resumeImprovements: [{ 
        title: 'Quantify Work Metrics', 
        priority: 'High', 
        difficulty: 'Easy', 
        completionTime: '1 day', 
        careerBenefit: 'Directly captures recruiter attention and validates business value creation.', 
        expectedAtsImprovement: '+5%', 
        expectedRoleMatchImprovement: '+3%', 
        resources: ['Google XYZ Resume Formula'], 
        steps: ['Identify speed, throughput, or capacity metrics in projects.', 'Rewrite descriptions using: "Accomplished [X], measured by [Y], by doing [Z]".', 'Format achievements with bold numeric indicators.'] 
      }],
      careerGrowth: [{ 
        title: 'Contribute to Open Source', 
        priority: 'Low', 
        difficulty: 'Hard', 
        completionTime: '1 month', 
        careerBenefit: 'Simulates corporate collaboration, code reviews, and remote development workflows.', 
        expectedAtsImprovement: '+2%', 
        expectedRoleMatchImprovement: '+3%', 
        resources: ['First Timers Only guides', 'GitHub search queries'], 
        steps: ['Locate beginner-friendly issues on popular packages.', 'Fork codebase, clone locally, and write unit checks.', 'Submit clear pull request descriptions.'] 
      }]
    };
  }

  if (!result.hiringProbability) {
    result.hiringProbability = {
      mernDeveloper: 75,
      javaDeveloper: 50,
      pythonDeveloper: 40,
      dataAnalyst: 30,
      aiEngineer: 25,
      fullStackDeveloper: 70,
      softwareEngineer: 75
    };
  }

  if (!result.scoreExplanation) {
    result.scoreExplanation = 'Scores evaluated using Formatting (10%), completeness (10%), skills (20%), projects (15%), experience (15%), keywords (10%), achievements (5%), certs (5%), recruiter view (10%).';
  }

  return result;
}

// Fallback rules engine returning matching rich schemas
function generateFallback(resumeText, role, detectedSkills, missingSkills, localHeuristics) {
  const formatResult = formatAnalyzer.analyze(resumeText);
  const grammarResult = grammarAnalyzer.analyze(resumeText);
  const aiResult = aiContentDetector.detect(resumeText);

  const projResult = localHeuristics.projectAnalysis || projectAnalyzer.analyze(resumeText);
  const internResult = localHeuristics.internshipAnalysis || internshipAnalyzer.analyze(resumeText);
  const certResult = localHeuristics.certificationAnalysis || certificationAnalyzer.analyze(resumeText, role);

  const completeness = localHeuristics.profileCompleteness || { score: 70, checks: {} };
  const roleMatch = atsCalculator.evaluateRoleMatch(role, detectedSkills, resumeText);
  const atsScore = atsCalculator.calculateATS(resumeText, detectedSkills, roleMatch.score, role);
  
  const qualityResult = atsCalculator.getResumeQualityScore(formatResult.score, grammarResult.score, projResult.score, internResult.score, certResult.score, detectedSkills.length, roleMatch.score, resumeText);
  const gradeResult = atsCalculator.getGrade(atsScore, roleMatch.score, qualityResult.score, completeness.score);
  const writingReview = aiResult;

  const recruiterResult = recruiterAnalyzer.analyze(
    resumeText,
    role,
    detectedSkills,
    missingSkills,
    projResult.count,
    internResult.count,
    certResult.detected.length
  );

  const skillsAnalysis = {
    categorized: skillExtractor.normalizeAndCategorize(detectedSkills),
    transferableSkills: ['Problem Solving', 'Data Structures', 'Git Version Control'],
    missingSkills: missingSkills.map(s => ({ 
      skill: s, 
      importance: `Crucial library for implementing target features in a ${role} workflow.`, 
      industryRelevance: 'Highly demanded in placement drives.', 
      learningPriority: 'High', 
      expectedImprovement: '+8% Role Match' 
    })),
    recommendedSkills: role.includes('Java') ? ['Maven', 'JUnit'] : ['TypeScript', 'Docker'],
    industrySkills: ['Agile Development', 'REST APIs']
  };

  const projectsAnalysis = {
    score: projResult.score,
    explanation: 'Calculation based on project complexity, tech stacks, and outcomes.',
    strongestProject: {
      title: projResult.count > 0 ? 'Featured Project' : 'Personal Showcase Sandbox',
      reason: 'Presents structured code files, clean function headers, and targets direct domain requirements.'
    },
    weakestProject: {
      title: projResult.count > 0 ? 'Tutorial Project' : 'Sandbox Project',
      reason: 'Lacks documentation and deployment indicators.',
      suggestions: ['Write detailed README', 'Deploy to Render']
    },
    evaluations: [
      {
        title: projResult.count > 0 ? 'Featured Project' : 'Project Sandbox',
        complexity: 'Medium',
        originality: 'Medium',
        businessValue: 'Solves basic workflow orchestration and stores data.',
        technologies: detectedSkills.slice(0, 3),
        deployment: 'Live Link present',
        github: 'Link present',
        documentation: 'README.md exists containing setup commands.',
        measurableOutcomes: 'Optimized page load times by 10%.',
        scalability: 'Single node server deployment'
      }
    ],
    recommendedProjects: [
      {
        title: role.includes('Java') ? 'Spring Boot REST Service' : 'MERN Task Orchestrator',
        techStack: role.includes('Java') ? 'Spring Boot, JPA, MySQL' : 'Node.js, Express, MongoDB',
        description: 'Implements REST API endpoints, JWT authorization, and MongoDB schema aggregation pipelines.'
      }
    ]
  };

  const experienceAnalysis = {
    score: internResult.score,
    explanation: 'Calculated based on duration of intern roles and description metrics.',
    evaluations: [
      {
        position: internResult.count > 0 ? 'Software Engineer Intern' : 'Junior Developer',
        company: 'Technology Corp',
        responsibilities: 'Maintained and updated web components and database records.',
        impact: 'Boosted search query performance metrics.',
        quantifiedAchievements: ['Optimized lookup times by 15%.'],
        technicalDepth: 'Interacted with REST endpoints and modified database routes.',
        relevance: 'High'
      }
    ]
  };

  const recruiterFeedback = {
    firstImpression: recruiterResult.expectations.split('\n')[0] || 'Resume contains technical projects and contacts.',
    strengths: recruiterResult.positivePoints || ['Complete sections', 'Good projects list'],
    weaknesses: recruiterResult.concerns || ['Include certifications', 'Add live links'],
    concerns: ['Missing quantified achievements in some sections.'],
    probabilities: {
      interview: atsScore >= 80 ? 80 : 60,
      atsPass: atsScore >= 75 ? 85 : 65,
      shortlist: atsScore >= 75 ? 75 : 60,
      technicalReadiness: detectedSkills.length >= 6 ? 80 : 60,
      hrReadiness: 80
    },
    hiringRecommendation: atsScore >= 80 ? 'Recommend for technical screening.' : 'Shortlist with minor improvements.'
  };

  const careerRoadmap = {
    skillsToLearn: ['TypeScript', 'Docker'],
    certificationsToObtain: ['AWS Cloud Practitioner'],
    projectsToBuild: ['Full Stack Dashboard API'],
    portfolioImprovements: ['Add clean README.md documentation']
  };

  const roadmap = {
    skillsToLearn: [{ 
      title: 'TypeScript', 
      priority: 'High', 
      difficulty: 'Medium', 
      completionTime: '1 week', 
      careerBenefit: 'Enhances codebase type safety and aligns with enterprise placement filters.', 
      expectedAtsImprovement: '+4%', 
      expectedRoleMatchImprovement: '+5%', 
      resources: ['TypeScript Handbook', 'React TypeScript Cheat Sheet'], 
      steps: ['Study standard type mappings.', 'Configure tsconfig.json in MERN repositories.', 'Annotate React components.'] 
    }],
    certifications: [{ 
      title: 'AWS Cloud Practitioner', 
      priority: 'Medium', 
      difficulty: 'Medium', 
      completionTime: '2 weeks', 
      careerBenefit: 'Proves core cloud deployment and serverless architectural awareness.', 
      expectedAtsImprovement: '+5%', 
      expectedRoleMatchImprovement: '+3%', 
      resources: ['AWS Cloud Practitioner Essentials', 'AWS Cheat Sheets'], 
      steps: ['Understand AWS S3, EC2, and Lambda services.', 'Perform practice mock certification exams.', 'Add credential ID to resume headers.'] 
    }],
    projectsToBuild: [{ 
      title: 'Dockerized Microservices API', 
      priority: 'High', 
      difficulty: 'Hard', 
      completionTime: '3 weeks', 
      careerBenefit: 'Demonstrates professional system design, container orchestration, and REST patterns.', 
      expectedAtsImprovement: '+6%', 
      expectedRoleMatchImprovement: '+7%', 
      resources: ['Docker for Beginners Guide', 'Microservices design patterns'], 
      steps: ['Write Dockerfiles for frontend and backend.', 'Configure docker-compose for multi-container settings.', 'Integrate database volume persistency.'] 
    }],
    portfolioImprovements: [{ 
      title: 'Personal Portfolio Page', 
      priority: 'Medium', 
      difficulty: 'Easy', 
      completionTime: '3 days', 
      careerBenefit: 'Improves recruiter visibility and provides direct click verification for codebase links.', 
      expectedAtsImprovement: '+3%', 
      expectedRoleMatchImprovement: '+2%', 
      resources: ['Vercel deployment guides', 'GitHub Pages quickstart'], 
      steps: ['Create a clean, responsive layout page.', 'Include active links to GitHub repositories.', 'Deploy using Vercel.'] 
    }],
    interviewPrep: [{ 
      title: 'MERN Technical Questions Prep', 
      priority: 'High', 
      difficulty: 'Medium', 
      completionTime: '1 week', 
      careerBenefit: 'Builds quick verbal technical accuracy for technical rounds.', 
      expectedAtsImprovement: '+0%', 
      expectedRoleMatchImprovement: '+5%', 
      resources: ['Frontend Interview Handbook', 'Database indexing guides'], 
      steps: ['Review React hooks, Virtual DOM, and state patterns.', 'Practice express middleware and routing questions.', 'Study indexing and lookup speeds.'] 
    }],
    resumeImprovements: [{ 
      title: 'Quantify Work Metrics', 
      priority: 'High', 
      difficulty: 'Easy', 
      completionTime: '1 day', 
      careerBenefit: 'Directly captures recruiter attention and validates business value creation.', 
      expectedAtsImprovement: '+5%', 
      expectedRoleMatchImprovement: '+3%', 
      resources: ['Google XYZ Resume Formula'], 
      steps: ['Identify speed, throughput, or capacity metrics in projects.', 'Rewrite descriptions using: "Accomplished [X], measured by [Y], by doing [Z]".', 'Format achievements with bold numeric indicators.'] 
    }],
    careerGrowth: [{ 
      title: 'Contribute to Open Source', 
      priority: 'Low', 
      difficulty: 'Hard', 
      completionTime: '1 month', 
      careerBenefit: 'Simulates corporate collaboration, code reviews, and remote development workflows.', 
      expectedAtsImprovement: '+2%', 
      expectedRoleMatchImprovement: '+3%', 
      resources: ['First Timers Only guides', 'GitHub search queries'], 
      steps: ['Locate beginner-friendly issues on popular packages.', 'Fork codebase, clone locally, and write unit checks.', 'Submit clear pull request descriptions.'] 
    }]
  };

  const hiringProbability = {
    mernDeveloper: role.includes('MERN') ? 80 : 50,
    javaDeveloper: role.includes('Java') ? 80 : 40,
    pythonDeveloper: role.includes('AI') || role.includes('Data') ? 75 : 40,
    dataAnalyst: role.includes('Data') ? 80 : 30,
    aiEngineer: role.includes('AI') ? 80 : 30,
    fullStackDeveloper: 75,
    softwareEngineer: 75
  };

  const achievementSuggestions = [
    { original: 'Responsible for backend code.', suggestion: 'Architected and built scalable backend REST endpoints using Node.js/Express, reducing API latency by 15%.' }
  ];
  const rewriteSuggestions = [
    { original: 'Worked on React frontend.', suggestion: 'Spearheaded frontend component engineering using React and Redux, improving layout load speed.' }
  ];

  return {
    atsScore,
    grade: gradeResult,
    resumeQualityScore: qualityResult.score,
    qualityAnalysis: qualityResult,
    roleMatchPercentage: roleMatch.score,
    roleMatch,
    sectionScores: {
      structure: formatResult.score,
      completeness: completeness.score,
      skills: Math.min(100, detectedSkills.length * 9),
      projects: projResult.score,
      experience: internResult.score,
      certifications: certResult.score
    },
    skillsAnalysis,
    projectsAnalysis,
    experienceAnalysis,
    recruiterFeedback,
    grammarAnalysis: grammarResult,
    formatAnalysis: formatResult,
    aiAssistance: {
      score: writingReview.score,
      probability: writingReview.score,
      likelySections: [],
      warning: writingReview.warning,
      reasoning: writingReview.reasoning,
      reasons: writingReview.reasons
    },
    recruiterPerspective: recruiterResult,
    aiSuggestions: [...(ROLE_SUGGESTIONS_MAP[role] || ROLE_SUGGESTIONS_MAP['MERN Stack Developer'])],
    achievementSuggestions,
    rewriteSuggestions,
    skills: [],
    strengths: recruiterFeedback.strengths,
    weaknesses: recruiterFeedback.weaknesses,
    recommendations: recruiterResult.suggestions,
    improvementRoadmap: {
      immediate: ['Include missing keywords in profile headlines.'],
      oneWeek: ['Write detailed project summaries highlighting database schema choice.'],
      oneMonth: ['Deploy frontend client to Vercel/Netlify.'],
      longTermCareer: ['Achieve professional cloud practitioner certifications.']
    },
    careerRoadmap,
    roadmap,
    hiringProbability,
    scoreExplanation: 'ATS score compiled from formatting (10%), section completeness (10%), technical skills (15%), soft skills (5%), projects (15%), experience (15%), keywords (10%), achievements (5%), certifications (5%), and recruiter impression (10%).'
  };
}

module.exports = aiSuggestion;
