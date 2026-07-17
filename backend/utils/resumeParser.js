const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const resumeParser = {
  parse: async (filePath) => {
    try {
      const ext = path.extname(filePath).toLowerCase();

      if (ext === '.pdf') {
        // Parse PDF
        const pdfBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(pdfBuffer);
        return pdfData.text;
      } else if (ext === '.docx') {
        // For DOCX, you might want to use a library like docx-parser
        // For now, returning placeholder
        return fs.readFileSync(filePath, 'utf8');
      } else {
        // Plain text
        return fs.readFileSync(filePath, 'utf8');
      }
    } catch (error) {
      throw new Error(`Failed to parse resume: ${error.message}`);
    }
  }
};

module.exports = resumeParser;
