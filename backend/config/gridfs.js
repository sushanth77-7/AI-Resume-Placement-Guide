const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

// Separate GridFS buckets
let resumeBucket;
let profileImageBucket;

const initGridFS = () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB connection not established.");
  }

  // Bucket for Resume PDFs
  resumeBucket = new GridFSBucket(db, {
    bucketName: "resumes",
  });

  // Separate bucket for Profile Images
  profileImageBucket = new GridFSBucket(db, {
    bucketName: "profileImages",
  });

  console.log("✅ Resume GridFS initialized");
  console.log("✅ Profile Image GridFS initialized");
};

// Existing function - KEEP this for Resume PDFs
// This ensures your working Resume module does not break
const getGridFSBucket = () => {
  if (!resumeBucket) {
    throw new Error("Resume GridFS is not initialized.");
  }

  return resumeBucket;
};

// New function - Profile Images only
const getProfileImageBucket = () => {
  if (!profileImageBucket) {
    throw new Error("Profile Image GridFS is not initialized.");
  }

  return profileImageBucket;
};

module.exports = {
  initGridFS,
  getGridFSBucket,
  getProfileImageBucket,
};