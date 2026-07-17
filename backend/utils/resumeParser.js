const pdfParse = require("pdf-parse");

const resumeParser = {
  parse: async (fileBuffer, fileName) => {
    try {
      const ext = fileName.split(".").pop().toLowerCase();

      if (ext === "pdf") {
        const pdfData = await pdfParse(fileBuffer);
        return pdfData.text;
      }

      if (ext === "docx") {
        return fileBuffer.toString("utf8");
      }

      return fileBuffer.toString("utf8");
    } catch (error) {
      throw new Error(`Failed to parse resume: ${error.message}`);
    }
  }
};

module.exports = resumeParser;