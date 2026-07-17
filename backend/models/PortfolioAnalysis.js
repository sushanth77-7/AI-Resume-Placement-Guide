const mongoose = require('mongoose');

const portfolioAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetRole: {
    type: String,
    required: true,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  },
  linkedinUrl: {
    type: String,
    trim: true
  },
  screenshotPath: {
    type: String,
    trim: true
  },
  scores: {
    githubScore: { type: Number, default: 0 },
    linkedinScore: { type: Number, default: 0 },
    overallPresenceScore: { type: Number, default: 0 },
    recruiterReadiness: { type: Number, default: 0 },
    portfolioReadiness: { type: Number, default: 0 },
    roleAlignmentScore: { type: Number, default: 0 }
  },
  githubDetails: {
    type: mongoose.Schema.Types.Mixed
  },
  linkedinDetails: {
    type: mongoose.Schema.Types.Mixed
  },
  dashboard: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PortfolioAnalysis', portfolioAnalysisSchema);
