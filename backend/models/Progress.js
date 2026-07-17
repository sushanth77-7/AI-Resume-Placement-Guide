const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumesAnalyzed: {
    type: Number,
    default: 0
  },
  averageAtsScore: {
    type: Number,
    default: 0
  },
  skillsIdentified: {
    type: Number,
    default: 0
  },
  recommendationsImplemented: {
    type: Number,
    default: 0
  },
  companiesViewed: {
    type: Number,
    default: 0
  },
  placementStatus: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Interview Stage', 'Offered', 'Placed', 'Rejected'],
    default: 'Not Started'
  },
  targetRole: {
    type: String,
    trim: true
  },
  targetCompanies: [{
    type: String
  }],
  milestones: [{
    title: String,
    description: String,
    completedAt: Date,
    completed: Boolean
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Progress', progressSchema);
