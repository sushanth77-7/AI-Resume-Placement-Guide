const mongoose = require('mongoose');

const aptitudeAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AptitudeQuestion'
    },
    category: String,
    topic: String,
    question: String,
    options: [{
      key: String,
      text: String
    }],
    answer: String,
    detailedSolution: String,
    shortcutMethod: String,
    formulaUsed: String,
    stepByStepExplanation: String
  }],
  answers: {
    type: Map,
    of: String, // Maps question index (0-29) or questionId to user's answer ('A', 'B', 'C', 'D' or empty)
    default: {}
  },
  score: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  correctAnswersCount: {
    type: Number,
    required: true
  },
  incorrectAnswersCount: {
    type: Number,
    required: true
  },
  unansweredCount: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number, // In seconds
    required: true
  },
  accuracy: {
    type: Number, // Percentage of answered questions that were correct
    required: true
  },
  topicWisePerformance: {
    type: Map,
    of: {
      correct: Number,
      total: Number
    }
  },
  strengths: [{
    type: String
  }],
  weaknesses: [{
    type: String
  }],
  personalizedSuggestions: [{
    type: String
  }],
  campusReadinessScore: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AptitudeAttempt', aptitudeAttemptSchema);
