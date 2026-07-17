const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillName: {
    type: String,
    required: true,
    trim: true
  },
  proficiency: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  },
  endorsements: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['Programming Languages', 'Frontend', 'Backend', 'Databases', 'Frameworks', 'Cloud', 'AI & Machine Learning', 'Data Analytics', 'Tools', 'Soft Skills', 'Technical', 'Languages', 'Other'],
    default: 'Programming Languages'
  },
  progress: {
    type: Number,
    default: 0
  },
  yearsOfExperience: {
    type: Number,
    default: 0
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

module.exports = mongoose.model('Skill', skillSchema);
