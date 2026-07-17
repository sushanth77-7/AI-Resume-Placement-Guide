const User = require('../models/User');
const Skill = require('../models/Skill');
const Resume = require('../models/Resume');
const PortfolioAnalysis = require('../models/PortfolioAnalysis');
const AptitudeAttempt = require('../models/AptitudeAttempt');
const CodingAttempt = require('../models/CodingAttempt');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
const { getProfileImageBucket } = require('../config/gridfs');
const { Readable } = require('stream');

/**
 * Helper to call Groq to categorize certificate
 */
async function categorizeCertificateWithAI(certName, issuer) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.startsWith('your_')) {
    return null; // Fallback to keyword matching
  }

  try {
    const prompt = `
      You are an expert technical education assistant.
      Categorize the following certificate based on its title and issuer:
      Title: "${certName}"
      Issuer: "${issuer}"

      Allowed categories are exactly: "Programming", "Cloud", "AI", "Data Analytics", "Web Development", "Others".

      Respond with a strict, valid JSON object containing:
      {
        "category": "One of the allowed categories here"
      }
      Only return JSON. No conversation.
    `;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 8000
      }
    );

    const content = response?.data?.choices?.[0]?.message?.content || '';
    const parsed = JSON.parse(content);
    return parsed.category;
  } catch (err) {
    console.error('Groq certificate categorization failed:', err.message);
    return null;
  }
}

/**
 * Fallback keyword matching for certificate categorization
 */
function categorizeCertificateByKeywords(name, issuer) {
  const searchStr = `${name} ${issuer}`.toLowerCase();

  if (searchStr.includes('aws') || searchStr.includes('azure') || searchStr.includes('cloud') || searchStr.includes('devops') || searchStr.includes('docker') || searchStr.includes('kubernetes')) {
    return 'Cloud';
  }
  if (searchStr.includes('ai') || searchStr.includes('machine learning') || searchStr.includes('deep learning') || searchStr.includes('tensor') || searchStr.includes('neural') || searchStr.includes('natural language') || searchStr.includes('nlp')) {
    return 'AI';
  }
  if (searchStr.includes('data') || searchStr.includes('sql') || searchStr.includes('analytics') || searchStr.includes('power bi') || searchStr.includes('tableau') || searchStr.includes('pandas') || searchStr.includes('excel')) {
    return 'Data Analytics';
  }
  if (searchStr.includes('react') || searchStr.includes('web') || searchStr.includes('html') || searchStr.includes('css') || searchStr.includes('frontend') || searchStr.includes('angular') || searchStr.includes('vue') || searchStr.includes('javascript') || searchStr.includes('node') || searchStr.includes('express')) {
    return 'Web Development';
  }
  if (searchStr.includes('python') || searchStr.includes('java') || searchStr.includes('c++') || searchStr.includes('programming') || searchStr.includes('c#') || searchStr.includes('go') || searchStr.includes('rust') || searchStr.includes('kotlin') || searchStr.includes('swift') || searchStr.includes('ruby')) {
    return 'Programming';
  }
  return 'Others';
}

/**
 * Controller: Get full user profile dashboard & history
 */
exports.getProfileDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('skills');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
    const portfolioHistory = await PortfolioAnalysis.find({ userId })
      .select('scores targetRole createdAt githubUrl linkedinUrl screenshotPath')
      .sort({ createdAt: -1 });
    const aptitudeAttempts = await AptitudeAttempt.find({ userId }).sort({ completedAt: -1 });
    const codingAttempts = await CodingAttempt.find({ userId }).sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      profile: user,
      resumes,
      portfolioHistory,
      aptitudeAttempts,
      codingAttempts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: Update personal info (with optional avatar image upload)
 */
exports.updatePersonalInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, college, graduationYear, gpa, bio, branch, yearOfStudy, city, state } = req.body;

    const updateFields = {
      name,
      phone,
      college,
      graduationYear: graduationYear ? Number(graduationYear) : undefined,
      gpa: gpa ? Number(gpa) : undefined,
      bio,
      personalInfo: {
        branch: branch || '',
        yearOfStudy: yearOfStudy || '',
        city: city || '',
        state: state || ''
      },
      updatedAt: Date.now()
    };

    if (req.file) {
      const bucket = getProfileImageBucket();
      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
        metadata: { userId }
      });

      await new Promise((resolve, reject) => {
        Readable.from(req.file.buffer)
          .pipe(uploadStream)
          .on("error", reject)
          .on("finish", resolve);
      });

      // Save uploadStream.id to updateFields.profilePicture
      updateFields.profilePicture = uploadStream.id;

      // Delete the previous image only if it is a valid GridFS ObjectId
      const oldUser = await User.findById(userId);
      if (oldUser && oldUser.profilePicture) {
        const oldPic = oldUser.profilePicture;
        if (mongoose.Types.ObjectId.isValid(oldPic) && !oldPic.toString().startsWith('/uploads/')) {
          try {
            await bucket.delete(new mongoose.Types.ObjectId(oldPic));
          } catch (deleteError) {
            console.error('Failed to delete old profile photo:', deleteError.message);
          }
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true })
      .populate('skills');

    res.status(200).json({
      success: true,
      profile: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: Update career target placement details
 */
exports.updateCareerInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetRole, preferredStack, dreamCompany, expectedPackage, currentSkillLevel, placementGoal, preferredLocation } = req.body;

    const stackArray = Array.isArray(preferredStack) 
      ? preferredStack 
      : preferredStack 
        ? preferredStack.split(',').map(s => s.trim()) 
        : [];

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        careerInfo: {
          targetRole: targetRole || 'MERN Stack Developer',
          preferredStack: stackArray,
          dreamCompany: dreamCompany || '',
          expectedPackage: expectedPackage || '',
          currentSkillLevel: currentSkillLevel || 'Beginner',
          placementGoal: placementGoal || '',
          preferredLocation: preferredLocation || ''
        },
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('skills');

    res.status(200).json({
      success: true,
      profile: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: Add a skill
 */
exports.addSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skillName, proficiency, category, progress } = req.body;

    if (!skillName) {
      return res.status(400).json({ error: 'Skill Name is required' });
    }

    const newSkill = await Skill.create({
      userId,
      skillName: skillName.trim(),
      proficiency: proficiency || 'Beginner',
      category: category || 'Programming Languages',
      progress: progress ? Number(progress) : 0
    });

    const user = await User.findById(userId);
    user.skills.push(newSkill._id);
    await user.save();

    const populatedUser = await User.findById(userId).populate('skills');

    res.status(201).json({
      success: true,
      skill: newSkill,
      profile: populatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: Delete a skill
 */
exports.deleteSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const skillId = req.params.id;

    await Skill.deleteOne({ _id: skillId, userId });
    
    const user = await User.findById(userId);
    user.skills = user.skills.filter(id => id.toString() !== skillId);
    await user.save();

    const populatedUser = await User.findById(userId).populate('skills');

    res.status(200).json({
      success: true,
      profile: populatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: Add education history record
 */
exports.addEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { institution, degree, field, graduationYear, gpa } = req.body;

    const user = await User.findById(userId);
    user.educationHistory.push({
      institution,
      degree,
      field,
      graduationYear: graduationYear ? Number(graduationYear) : undefined,
      gpa: gpa ? Number(gpa) : undefined
    });

    await user.save();
    const populatedUser = await User.findById(userId).populate('skills');

    res.status(201).json({
      success: true,
      profile: populatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: Delete education history record
 */
exports.deleteEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const eduId = req.params.id;

    const user = await User.findById(userId);
    user.educationHistory = user.educationHistory.filter(edu => edu._id.toString() !== eduId);
    await user.save();

    const populatedUser = await User.findById(userId).populate('skills');

    res.status(200).json({
      success: true,
      profile: populatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: Upload and categorize certificate file
 */
exports.uploadCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, issuer, date } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Certificate file upload is required' });
    }

    if (!name || !issuer) {
      return res.status(400).json({ error: 'Certificate name and issuer are required' });
    }

    const fileUrl = `/uploads/certificates/${req.file.filename}`;

    // Auto categorize via Groq / Fallback
    let category = await categorizeCertificateWithAI(name, issuer);
    if (!category) {
      category = categorizeCertificateByKeywords(name, issuer);
    }

    const user = await User.findById(userId);
    user.certificates.push({
      name,
      issuer,
      date: date ? new Date(date) : undefined,
      fileUrl,
      category
    });

    // Add dynamic XP for uploading certificates
    user.xp = (user.xp || 0) + 150;
    user.level = Math.min(10, Math.floor(user.xp / 1000) + 1);

    await user.save();
    const populatedUser = await User.findById(userId).populate('skills');

    res.status(201).json({
      success: true,
      profile: populatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: Delete certificate
 */
exports.deleteCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const certId = req.params.id;

    const user = await User.findById(userId);
    const cert = user.certificates.id(certId);

    if (!cert) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Delete the file from filesystem
    const fullPath = path.join(__dirname, '..', cert.fileUrl);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    user.certificates = user.certificates.filter(c => c._id.toString() !== certId);
    await user.save();

    const populatedUser = await User.findById(userId).populate('skills');

    res.status(200).json({
      success: true,
      profile: populatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: Update portfolio social URLs
 */
exports.updatePortfolioLinks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { github, linkedin, portfolio, leetcode, codechef, hackerrank, codeforces } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        portfolioLinks: {
          github: github || '',
          linkedin: linkedin || '',
          portfolio: portfolio || '',
          leetcode: leetcode || '',
          codechef: codechef || '',
          hackerrank: hackerrank || '',
          codeforces: codeforces || ''
        },
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('skills');

    res.status(200).json({
      success: true,
      profile: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: Update notification and theme settings
 */
exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationsEnabled, darkModeEnabled } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        settings: {
          notificationsEnabled: !!notificationsEnabled,
          darkModeEnabled: !!darkModeEnabled
        },
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('skills');

    res.status(200).json({
      success: true,
      profile: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: Export all user details to a single JSON payload
 */
exports.exportProfileData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).populate('skills');
    const resumes = await Resume.find({ userId });
    const portfolioScans = await PortfolioAnalysis.find({ userId });
    const aptitudeAttempts = await AptitudeAttempt.find({ userId });
    const codingAttempts = await CodingAttempt.find({ userId });

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      studentPersonalInfo: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        graduationYear: user.graduationYear,
        gpa: user.gpa,
        bio: user.bio,
        personalInfo: user.personalInfo,
        educationHistory: user.educationHistory
      },
      careerInfo: user.careerInfo,
      portfolioLinks: user.portfolioLinks,
      skills: user.skills.map(s => ({ name: s.skillName, proficiency: s.proficiency, category: s.category, progress: s.progress })),
      certificates: user.certificates.map(c => ({ name: c.name, issuer: c.issuer, category: c.category, date: c.date })),
      progressSummary: {
        xp: user.xp || 0,
        level: user.level || 1,
        resumesAnalyzed: resumes.length,
        githubScans: portfolioScans.length,
        aptitudeAttemptsCount: aptitudeAttempts.length,
        codingAttemptsCount: codingAttempts.length
      },
      rawResumesHistory: resumes,
      rawPortfolioHistory: portfolioScans,
      rawAptitudeHistory: aptitudeAttempts,
      rawCodingHistory: codingAttempts
    };

    res.setHeader('Content-disposition', `attachment; filename=placement-prep-export-${userId}.json`);
    res.setHeader('Content-type', 'application/json');
    res.write(JSON.stringify(exportPayload, null, 2), 'utf-8');
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: Delete user account completely and all related documents
 */
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete uploaded files
    const user = await User.findById(userId);
    if (user) {
      // Delete avatar picture
      if (user.profilePicture) {
        const avatarPath = path.join(__dirname, '..', user.profilePicture);
        if (fs.existsSync(avatarPath)) {
          fs.unlinkSync(avatarPath);
        }
      }

      // Delete certificate files
      for (const cert of user.certificates) {
        const certPath = path.join(__dirname, '..', cert.fileUrl);
        if (fs.existsSync(certPath)) {
          fs.unlinkSync(certPath);
        }
      }
    }

    // Delete records from database
    await User.deleteOne({ _id: userId });
    await Skill.deleteMany({ userId });
    await Resume.deleteMany({ userId });
    await PortfolioAnalysis.deleteMany({ userId });
    await AptitudeAttempt.deleteMany({ userId });
    await CodingAttempt.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: 'Your placement preparation account and all related portfolio history have been permanently deleted.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: Retrieve and stream profile photo from GridFS
 */
exports.getProfilePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid profile photo ID' });
    }

    const bucket = getProfileImageBucket();
    const objectId = new mongoose.Types.ObjectId(id);

    // Find file metadata to get Content-Type
    const files = await bucket.find({ _id: objectId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'Profile photo not found' });
    }

    const file = files[0];
    res.setHeader('Content-Type', file.contentType || 'image/jpeg');

    const downloadStream = bucket.openDownloadStream(objectId);
    downloadStream.on('error', (err) => {
      if (!res.headersSent) {
        res.status(404).json({ error: 'Error downloading profile photo' });
      }
    });
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
