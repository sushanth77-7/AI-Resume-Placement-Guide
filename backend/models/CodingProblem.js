const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  output: {
    type: String,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: true
  }
});

const codingProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  topic: {
    type: String,
    required: true
  },
  constraints: {
    type: String,
    required: true
  },
  inputFormat: {
    type: String,
    required: true
  },
  outputFormat: {
    type: String,
    required: true
  },
  sampleInput: {
    type: String,
    required: true
  },
  sampleOutput: {
    type: String,
    required: true
  },
  sampleExplanation: {
    type: String,
    default: ''
  },
  testCases: {
    type: [testCaseSchema],
    required: true
  },
  initialTemplates: {
    c: { type: String, default: '' },
    cpp: { type: String, default: '' },
    java: { type: String, default: '' },
    python: { type: String, default: '' },
    javascript: { type: String, default: '' },
    csharp: { type: String, default: '' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CodingProblem', codingProblemSchema);
