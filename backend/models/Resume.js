const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileId: {
  type: mongoose.Schema.Types.ObjectId,
  required: true
},
  atsScore: {
    type: Number,
    default: 0
  },
  content: {
    type: String,
    required: true
  },
  skills: [{
    type: String
  }],
  detectedSkills: [{
    type: String
  }],
  missingSkills: [{
    type: String
  }],
  skillsAnalysis: {
    type: mongoose.Schema.Types.Mixed
  },
  aiSuggestions: [{
    title: String,
    description: String,
    priority: String,
    action: String
  }],
  feedback: {
    type: String
  },
  sectionAnalysis: {
    contact: Boolean,
    education: Boolean,
    experience: Boolean,
    projects: Boolean,
    certifications: Boolean
  },
  strengthsWeaknesses: {
    strengths: [String],
    weaknesses: [String]
  },
  aiAssistance: {
    type: mongoose.Schema.Types.Mixed
  },
  qualityAnalysis: {
    score: Number,
    formattingIssues: [String],
    strengths: [String],
    breakdown: {
      formatting: { type: Number, default: 0 },
      grammar: { type: Number, default: 0 },
      skills: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      readability: { type: Number, default: 0 },
      certifications: { type: Number, default: 0 },
      roleMatch: { type: Number, default: 0 }
    }
  },
  profileCompleteness: {
    checks: Object,
    score: Number,
    summary: [String],
    impacts: mongoose.Schema.Types.Mixed
  },
  roleMatch: {
    type: mongoose.Schema.Types.Mixed
  },
  roleReadiness: {
    role: String,
    readinesScore: Number,
    skillsMatch: Number,
    projectsMatch: Number,
    experienceMatch: Number,
    certificationMatch: Number
  },
  interviewReadiness: {
    type: mongoose.Schema.Types.Mixed
  },
  recruiterPerspective: {
    type: mongoose.Schema.Types.Mixed
  },
  recruiterFeedback: {
    type: mongoose.Schema.Types.Mixed
  },
  careerRoadmap: {
    type: mongoose.Schema.Types.Mixed
  },
  roadmap: {
    type: mongoose.Schema.Types.Mixed
  },
  resumeQuality: {
    type: mongoose.Schema.Types.Mixed
  },
  hiringProbability: {
    type: mongoose.Schema.Types.Mixed
  },
  scoreExplanation: {
    type: String
  },
  achievementSuggestions: [{ original: String, suggestion: String }],
  rewriteSuggestions: [{ original: String, suggestion: String }],
  atsBreakdown: [[Object]],
  formatAnalysis: {
    score: Number,
    issues: [String],
    summary: String
  },
  grammarAnalysis: {
    score: Number,
    misspellings: [{ wrong: String, correct: String }],
    grammarSuggestions: [String]
  },
  projectAnalysis: {
    type: mongoose.Schema.Types.Mixed
  },
  experienceAnalysis: {
    type: mongoose.Schema.Types.Mixed
  },
  internshipAnalysis: {
    count: Number,
    score: Number,
    recruiterValue: String,
    summary: String
  },
  certificationAnalysis: {
    detected: [String],
    score: Number,
    industryValue: String,
    recommended: [String]
  },
  hackathonAnalysis: {
    count: Number,
    score: Number,
    impact: String
  },
  githubAnalysis: {
    score: Number,
    found: Boolean,
    suggestions: [String]
  },
  linkedinAnalysis: {
    score: Number,
    found: Boolean,
    suggestions: [String]
  },
  resumeQualityScore: {
    type: Number,
    default: 0
  },
  grade: {
    type: mongoose.Schema.Types.Mixed
  },
  role: {
    type: String,
    default: 'MERN Stack Developer'
  },
  experience: [{
    company: String,
    position: String,
    duration: String,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    graduationYear: Number
  }],
  recommendations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recommendation'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
