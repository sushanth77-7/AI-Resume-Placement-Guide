const multer = require("multer");
const path = require("path");

// Store uploaded PDF temporarily in memory
// It will then be stored permanently in MongoDB GridFS
const storage = multer.memoryStorage();

// Allow PDF files only
const fileFilter = (req, file, cb) => {
  const fileExt = path.extname(file.originalname).toLowerCase();

  if (
    file.mimetype === "application/pdf" &&
    fileExt === ".pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF resume files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024
  },
  fileFilter
});

module.exports = upload;