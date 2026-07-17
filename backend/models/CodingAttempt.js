const mongoose = require('mongoose');

const approachSchema = new mongoose.Schema({
  code: String,
  complexity: String,
  explanation: String
});

const codingAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingProblem',
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['c', 'cpp', 'java', 'python', 'javascript', 'csharp']
  },
  code: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Passed', 'Failed', 'Compile Error', 'Time Limit Exceeded']
  },
  testCasesPassed: {
    type: Number,
    required: true
  },
  totalTestCases: {
    type: Number,
    required: true
  },
  runtime: {
    type: Number, // In milliseconds
    default: 0
  },
  memory: {
    type: Number, // In kilobytes
    default: 0
  },
  timeComplexity: {
    type: String,
    default: 'N/A'
  },
  spaceComplexity: {
    type: String,
    default: 'N/A'
  },
  review: {
    codeQualityReview: { type: String, default: '' },
    optimizationSuggestions: { type: String, default: '' },
    codingStyleReview: { type: String, default: '' },
    edgeCasesMissed: [{ type: String }],
    recruiterFeedback: { type: String, default: '' },
    interviewReadiness: { type: String, default: '' },
    overallCodingScore: { type: Number, default: 0 },
    bruteForce: approachSchema,
    better: approachSchema,
    optimal: approachSchema
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CodingAttempt', codingAttemptSchema);
