const Resume = require('../models/Resume');
const Recommendation = require('../models/Recommendation');
const User = require('../models/User');
const resumeParser = require('../utils/resumeParser');
const atsCalculator = require('../utils/atsCalculator');
const skillExtractor = require('../utils/skillExtractor');
const recommendationEngine = require('../utils/recommendationEngine');
const aiSuggestion = require('../utils/aiSuggestion');
const aiContentDetector = require('../utils/aiContentDetector');



// Upload and Analyze Resume
exports.uploadResume = async (req, res) => {
  try {
    // 1. PDF Upload Verification
    if (!req.file) {
      console.error('Multer file receipt verification failed: req.file is undefined');
      return res.status(400).json({ error: 'Resume upload failed: File not received by server.' });
    }
    
    
    
    
    

    // 2. Resume Text Extraction Verification
    
    const resumeContent = await resumeParser.parse(req.file.path);
    if (!resumeContent || resumeContent.trim().length === 0) {
      console.error('PDF text extraction verification failed: Content is empty.');
      return res.status(400).json({ error: 'Resume text extraction failed: Extracted content is empty.' });
    }
    
    
    // Explicit and Inferred Skill Extraction
    let detectedSkills = await skillExtractor.extractSkills(resumeContent);
    let missingSkills = skillExtractor.getMissingSkills(detectedSkills, req.body.role);
    const profileCompleteness = atsCalculator.analyzeProfileCompleteness(resumeContent);
    const sectionAnalysis = atsCalculator.detectSectionAnalysis(resumeContent);

    
    

    // Local heuristic calculations
    const formatAnalysis = atsCalculator.analyzeFormat(resumeContent);
    const grammarAnalysis = atsCalculator.analyzeGrammar(resumeContent);
    const projectAnalysis = atsCalculator.analyzeProjects(resumeContent);
    const internshipAnalysis = atsCalculator.analyzeInternships(resumeContent);
    const certificationAnalysis = atsCalculator.analyzeCertifications(resumeContent, req.body.role);
    const hackathonAnalysis = atsCalculator.analyzeHackathons(resumeContent);
    const githubAnalysis = atsCalculator.analyzeGitHub(resumeContent);
    const linkedinAnalysis = atsCalculator.analyzeLinkedIn(resumeContent);

    // Synchronize sections presence with counts to avoid contradictions
    const hasProjects = profileCompleteness.checks.projects || sectionAnalysis.projects || projectAnalysis.count > 0;
    const hasExperience = profileCompleteness.checks.experience || sectionAnalysis.experience || internshipAnalysis.count > 0;
    const hasCertifications = profileCompleteness.checks.certifications || sectionAnalysis.certifications || certificationAnalysis.detected.length > 0;

    profileCompleteness.checks.projects = hasProjects;
    sectionAnalysis.projects = hasProjects;
    if (hasProjects && projectAnalysis.count === 0) {
      projectAnalysis.count = 1;
      projectAnalysis.score = Math.max(projectAnalysis.score, 50);
      projectAnalysis.quality = 'Personal/academic projects detected in resume content.';
    }

    profileCompleteness.checks.experience = hasExperience;
    sectionAnalysis.experience = hasExperience;
    if (hasExperience && internshipAnalysis.count === 0) {
      internshipAnalysis.count = 1;
      internshipAnalysis.score = Math.max(internshipAnalysis.score, 60);
      internshipAnalysis.summary = 'Professional experience detected in resume content.';
    }

    profileCompleteness.checks.certifications = hasCertifications;
    sectionAnalysis.certifications = hasCertifications;
    if (hasCertifications && certificationAnalysis.detected.length === 0) {
      certificationAnalysis.detected = ['TECHNICAL CERTIFICATION'];
      certificationAnalysis.score = Math.max(certificationAnalysis.score, 60);
      certificationAnalysis.industryValue = 'Professional certifications detected in resume content.';
    }

    const role = req.body.role || 'MERN Stack Developer';

    // 3. AI Request Auditing
    
    
    
    // Call LLM for dynamic suggestions and additional metadata
    const llmResult = await aiSuggestion.generateSuggestions(
      resumeContent,
      0, // Recomputed later
      detectedSkills,
      missingSkills,
      role,
      {
        projectAnalysis,
        internshipAnalysis,
        certificationAnalysis,
        formatAnalysis,
        grammarAnalysis,
        profileCompleteness
      }
    );

    // 4. AI Response Auditing
    
    if (!llmResult) {
      throw new Error('AI suggestion parser returned null/undefined response.');
    }
    

    // 5. Response Mapping & Normalization
    
    const roleMatch = llmResult.roleMatch || atsCalculator.evaluateRoleMatch(role, detectedSkills, resumeContent);
    const roleMatchScore = roleMatch.score !== undefined ? roleMatch.score : (llmResult.roleMatchPercentage !== undefined ? llmResult.roleMatchPercentage : 50);
    const finalAtsScore = llmResult.atsScore !== undefined ? llmResult.atsScore : (llmResult.overallScore !== undefined ? llmResult.overallScore : atsCalculator.calculateATS(resumeContent, detectedSkills, roleMatchScore, role));

    const mergedFormat = llmResult.formatAnalysis || formatAnalysis;
    const mergedGrammar = llmResult.grammarAnalysis || grammarAnalysis;

    // Writing Quality Check (replaces AI check)
    const writingReview = llmResult.aiAssistance || aiContentDetector.detect(resumeContent);
    const mergedAIAssistance = {
      score: writingReview.score || 80,
      probability: writingReview.probability || 80,
      likelySections: writingReview.likelySections || [],
      warning: writingReview.warning || false,
      reasoning: writingReview.reasoning || '',
      reasons: writingReview.reasons || []
    };

    // Skills analysis checks
    const finalSkillsAnalysis = llmResult.skillsAnalysis || {
      categorized: skillExtractor.normalizeAndCategorize(detectedSkills),
      transferableSkills: ['Problem Solving', 'System Design', 'REST API Development'],
      missingSkills: missingSkills.map(s => ({ skill: s, importance: `Crucial runtime framework/library for ${role} workflows.`, roleMatchImpact: 10 })),
      recommendedSkills: role.includes('Java') ? ['Maven', 'JUnit'] : ['TypeScript', 'Docker'],
      industrySkills: ['Agile Development']
    };

    const finalProjectsAnalysis = llmResult.projectsAnalysis || projectAnalysis;
    const finalExperienceAnalysis = llmResult.experienceAnalysis || internshipAnalysis;
    const recruiterPerspective = llmResult.recruiterFeedback || llmResult.recruiterPerspective || {};
    
    // Dynamic mappings for dashboard
    if (!recruiterPerspective.positivePoints || recruiterPerspective.positivePoints.length === 0) {
      const localRecruiter = atsCalculator.generateRecruiterPerspective(
        atsCalculator.generateStrengthsWeaknesses(detectedSkills, sectionAnalysis, resumeContent).strengths,
        atsCalculator.generateStrengthsWeaknesses(detectedSkills, sectionAnalysis, resumeContent).weaknesses,
        roleMatchScore,
        finalAtsScore
      );
      recruiterPerspective.positivePoints = localRecruiter.positivePoints || [];
      recruiterPerspective.concerns = localRecruiter.concerns || [];
      recruiterPerspective.suggestions = localRecruiter.suggestions || [];
      recruiterPerspective.hiringReadiness = localRecruiter.hiringReadiness;
      recruiterPerspective.interviewReadiness = localRecruiter.interviewReadiness;
      recruiterPerspective.expectations = localRecruiter.expectations || '';
    }

    // Quality Score
    const qualityResult = atsCalculator.getResumeQualityScore(
      mergedFormat.score,
      mergedGrammar.score,
      projectAnalysis.score,
      internshipAnalysis.score,
      certificationAnalysis.score,
      detectedSkills.length,
      roleMatchScore,
      resumeContent
    );
    const resumeQualityScore = llmResult.resumeQualityScore || qualityResult.score;
    const resumeQuality = llmResult.resumeQuality || atsCalculator.getResumeQualityClassification(resumeQualityScore);

    const grade = llmResult.grade || atsCalculator.getGrade(
      finalAtsScore,
      roleMatchScore,
      resumeQualityScore,
      profileCompleteness.score
    );

    const feedback = atsCalculator.generateFeedback(finalAtsScore, detectedSkills, resumeContent, sectionAnalysis);
    
    const strengthsWeaknesses = {
      strengths: llmResult.strengths || atsCalculator.generateStrengthsWeaknesses(detectedSkills, sectionAnalysis, resumeContent).strengths,
      weaknesses: llmResult.weaknesses || atsCalculator.generateStrengthsWeaknesses(detectedSkills, sectionAnalysis, resumeContent).weaknesses
    };

    const careerRoadmap = llmResult.careerRoadmap || atsCalculator.generateCareerRoadmap(role, missingSkills, sectionAnalysis);
    const roadmap = llmResult.roadmap || {};
    const hiringProbability = llmResult.hiringProbability || {};
    const scoreExplanation = llmResult.scoreExplanation || 'ATS evaluation calculated independently from formatting (10%), section completeness (10%), skills (20%), projects (15%), experience (15%), keywords (10%), achievements (5%), certifications (5%), and recruiter impression (10%).';

    const atsBreakdown = atsCalculator.getATSBreakdown(resumeContent, detectedSkills, sectionAnalysis, roleMatchScore, role);

    const aiSuggestions = llmResult.aiSuggestions || [];
    const achievementSuggestions = llmResult.achievementSuggestions || [];
    const rewriteSuggestions = llmResult.rewriteSuggestions || [];

    // 6. Response Validation (Strict checks to throw exceptions on invalid shapes)
    
    if (!profileCompleteness || profileCompleteness.score === undefined) {
      throw new Error('Validation failed: profileCompleteness details missing or empty.');
    }
    if (!Array.isArray(detectedSkills)) {
      throw new Error('Validation failed: detectedSkills must be a valid array.');
    }
    if (!Array.isArray(strengthsWeaknesses.strengths) || strengthsWeaknesses.strengths.length === 0) {
      throw new Error('Validation failed: strengths must be a populated array.');
    }
    if (!Array.isArray(strengthsWeaknesses.weaknesses) || strengthsWeaknesses.weaknesses.length === 0) {
      throw new Error('Validation failed: weaknesses must be a populated array.');
    }
    if (!careerRoadmap || !careerRoadmap.skillsToLearn) {
      throw new Error('Validation failed: careerRoadmap object structure is missing or corrupt.');
    }

    

    // Create resume record
    const resume = await Resume.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      fileUrl: `/uploads/resumes/${req.file.filename}`,
      content: resumeContent,
      skills: detectedSkills,
      detectedSkills,
      missingSkills,
      skillsAnalysis: finalSkillsAnalysis,
      aiSuggestions,
      feedback,
      atsScore: finalAtsScore,
      sectionAnalysis,
      strengthsWeaknesses,
      aiAssistance: mergedAIAssistance,
      qualityAnalysis: {
        score: resumeQualityScore,
        formattingIssues: mergedFormat.issues,
        strengths: strengthsWeaknesses.strengths,
        breakdown: qualityResult.breakdown
      },
      profileCompleteness,
      roleMatch,
      roleReadiness: atsCalculator.getRoleReadiness(role, roleMatch, projectAnalysis, internshipAnalysis, certificationAnalysis),
      interviewReadiness: atsCalculator.getInterviewReadiness(
        detectedSkills,
        projectAnalysis,
        internshipAnalysis,
        certificationAnalysis,
        hackathonAnalysis,
        githubAnalysis,
        linkedinAnalysis,
        profileCompleteness,
        resumeContent
      ),
      recruiterPerspective,
      recruiterFeedback: llmResult.recruiterFeedback || {},
      careerRoadmap,
      roadmap,
      resumeQuality,
      hiringProbability,
      scoreExplanation,
      achievementSuggestions,
      rewriteSuggestions,
      atsBreakdown,
      formatAnalysis: mergedFormat,
      grammarAnalysis: mergedGrammar,
      projectAnalysis: finalProjectsAnalysis,
      experienceAnalysis: finalExperienceAnalysis,
      certificationAnalysis,
      hackathonAnalysis,
      githubAnalysis,
      linkedinAnalysis,
      resumeQualityScore,
      grade,
      role
    });

    // Update user's resumes
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { resumes: resume._id } }
    );

    
    
    
    

    res.status(201).json({
      success: true,
      resume,
      atsScore: finalAtsScore,
      feedback,
      detectedSkills,
      missingSkills,
      aiSuggestions,
      sectionAnalysis,
      strengthsWeaknesses,
      aiAssistance: mergedAIAssistance,
      qualityAnalysis: {
        score: resumeQualityScore,
        formattingIssues: mergedFormat.issues,
        strengths: strengthsWeaknesses.strengths,
        breakdown: qualityResult.breakdown
      },
      profileCompleteness,
      roleMatch,
      recruiterPerspective,
      recruiterFeedback: llmResult.recruiterFeedback || {},
      careerRoadmap,
      roadmap,
      resumeQuality,
      hiringProbability,
      scoreExplanation,
      achievementSuggestions,
      atsBreakdown,
      grade,
      fileName: req.file.originalname,
      role,
      skillsAnalysis: finalSkillsAnalysis,
      projectsAnalysis: finalProjectsAnalysis,
      experienceAnalysis: finalExperienceAnalysis
    });
  } catch (error) {
    console.error('CRITICAL: Resume controller execution failed:', error);
    res.status(500).json({ error: `Resume evaluation failed: ${error.message}` });
  }
};

// Get All Resumes
exports.getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id })
      .populate('recommendations');

    res.status(200).json({
      success: true,
      resumes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Resume
exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id)
      .populate('recommendations');

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.status(200).json({
      success: true,
      resume
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate Recommendations
exports.generateRecommendations = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const recommendations = await recommendationEngine.generate(resume);

    // Save recommendations to database
    const savedRecommendations = [];
    for (const rec of recommendations) {
      const recommendation = await Recommendation.create({
        resumeId: resume._id,
        userId: req.user.id,
        ...rec
      });
      savedRecommendations.push(recommendation);
      resume.recommendations.push(recommendation._id);
    }

    await resume.save();

    res.status(201).json({
      success: true,
      recommendations: savedRecommendations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Resume Feedback
exports.updateResumeFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;

    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { feedback, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({
      success: true,
      resume
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Resume
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Delete associated recommendations
    await Recommendation.deleteMany({ resumeId: resume._id });

    // Remove resume from user
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { resumes: resume._id } }
    );

    await Resume.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
