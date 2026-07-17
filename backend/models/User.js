const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters long'],
    match: [/^[A-Za-z ]+$/, 'Name can contain only alphabets and spaces']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/i, 'Email must be a valid Gmail address ending with @gmail.com']
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  college: {
    type: String,
    trim: true
  },
  graduationYear: {
    type: Number
  },
  gpa: {
    type: Number
  },
  bio: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  personalInfo: {
    branch: { type: String, default: '' },
    yearOfStudy: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' }
  },
  careerInfo: {
    targetRole: { type: String, default: 'MERN Stack Developer' },
    preferredStack: [{ type: String }],
    dreamCompany: { type: String, default: '' },
    expectedPackage: { type: String, default: '' },
    currentSkillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Beginner' },
    placementGoal: { type: String, default: '' },
    preferredLocation: { type: String, default: '' }
  },
  educationHistory: [{
    institution: { type: String, default: '' },
    degree: { type: String, default: '' },
    field: { type: String, default: '' },
    graduationYear: { type: Number },
    gpa: { type: Number }
  }],
  portfolioLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    leetcode: { type: String, default: '' },
    codechef: { type: String, default: '' },
    hackerrank: { type: String, default: '' },
    codeforces: { type: String, default: '' }
  },
  certificates: [{
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: Date },
    fileUrl: { type: String, required: true },
    category: { type: String, enum: ['Programming', 'Cloud', 'AI', 'Data Analytics', 'Web Development', 'Others'], default: 'Others' }
  }],
  settings: {
    notificationsEnabled: { type: Boolean, default: true },
    darkModeEnabled: { type: Boolean, default: false }
  },
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  resumes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  }],
  progress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Progress'
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
