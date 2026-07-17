const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let gridFSBucket;
let profileImageBucket;

const initGridFS = () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB connection not established.");
  }

  gridFSBucket = new GridFSBucket(db, {
    bucketName: "resumes",
  });

  profileImageBucket = new GridFSBucket(db, {
    bucketName: "profileImages",
  });

  console.log("✅ GridFS initialized");
};

const getGridFSBucket = () => {
  if (!gridFSBucket) {
    throw new Error("GridFS is not initialized.");
  }
  return gridFSBucket;
};

const getProfileImageBucket = () => {
  if (!profileImageBucket) {
    throw new Error("Profile GridFS is not initialized.");
  }
  return profileImageBucket;
};

module.exports = {
  initGridFS,
  getGridFSBucket,
  getProfileImageBucket,
};