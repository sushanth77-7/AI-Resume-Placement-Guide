const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories
const picDir = path.join(__dirname, '../uploads/profile-pictures');
const certDir = path.join(__dirname, '../uploads/certificates');

if (!fs.existsSync(picDir)) {
  fs.mkdirSync(picDir, { recursive: true });
}
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
}

// Storage for Profile Pictures
const picStorage = multer.memoryStorage();

// Storage for Certificates
const certStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, certDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cert-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for profile pictures (images only)
const picFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, and PNG images are allowed for profile pictures'), false);
  }
};

// File filter for certificates (images or PDFs)
const certFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed for certificates'), false);
  }
};

const uploadPhoto = multer({
  storage: picStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: picFilter
});

const uploadCertificate = multer({
  storage: certStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: certFilter
});

module.exports = {
  uploadPhoto,
  uploadCertificate
};
