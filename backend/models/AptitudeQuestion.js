const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D']
  },
  text: {
    type: String,
    required: true
  }
});

const aptitudeQuestionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability']
  },
  topic: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [optionSchema],
    validate: [arr => arr.length === 4, 'A question must have exactly 4 options']
  },
  answer: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D']
  },
  detailedSolution: {
    type: String,
    required: true
  },
  shortcutMethod: {
    type: String,
    default: ''
  },
  formulaUsed: {
    type: String,
    default: ''
  },
  stepByStepExplanation: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);
