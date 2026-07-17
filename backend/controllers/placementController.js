const Progress = require('../models/Progress');
const Resume = require('../models/Resume');
const User = require('../models/User');

// Get User Progress
exports.getUserProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user.id });

    if (!progress) {
      progress = await Progress.create({ userId: req.user.id });
    }

    res.status(200).json({
      success: true,
      progress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Progress
exports.updateProgress = async (req, res) => {
  try {
    const { targetRole, targetCompanies, placementStatus } = req.body;

    let progress = await Progress.findOne({ userId: req.user.id });

    if (!progress) {
      progress = await Progress.create({
        userId: req.user.id,
        targetRole,
        targetCompanies,
        placementStatus
      });
    } else {
      progress.targetRole = targetRole || progress.targetRole;
      progress.targetCompanies = targetCompanies || progress.targetCompanies;
      progress.placementStatus = placementStatus || progress.placementStatus;
      progress.lastUpdated = Date.now();
      await progress.save();
    }

    res.status(200).json({
      success: true,
      progress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Milestone
exports.addMilestone = async (req, res) => {
  try {
    const { title, description } = req.body;

    let progress = await Progress.findOne({ userId: req.user.id });

    if (!progress) {
      progress = await Progress.create({ userId: req.user.id });
    }

    progress.milestones.push({
      title,
      description,
      completed: false
    });

    await progress.save();

    res.status(201).json({
      success: true,
      progress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Complete Milestone
exports.completeMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;

    const progress = await Progress.findOne({ userId: req.user.id });

    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    const milestone = progress.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    milestone.completed = true;
    milestone.completedAt = Date.now();
    progress.lastUpdated = Date.now();

    await progress.save();

    res.status(200).json({
      success: true,
      progress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Progress Summary
exports.getProgressSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const resumes = await Resume.find({ userId: req.user.id });
    let progress = await Progress.findOne({ userId: req.user.id });

    if (!progress) {
      progress = await Progress.create({ userId: req.user.id });
    }

    const resumesAnalyzed = resumes.length;
    const averageAtsScore = resumes.length > 0
      ? resumes.reduce((sum, r) => sum + r.atsScore, 0) / resumes.length
      : 0;
    const skillsIdentified = user.skills.length;

    res.status(200).json({
      success: true,
      summary: {
        resumesAnalyzed,
        averageAtsScore: Math.round(averageAtsScore),
        skillsIdentified,
        placementStatus: progress.placementStatus,
        targetRole: progress.targetRole,
        targetCompanies: progress.targetCompanies,
        milestonesCompleted: progress.milestones.filter(m => m.completed).length,
        totalMilestones: progress.milestones.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
