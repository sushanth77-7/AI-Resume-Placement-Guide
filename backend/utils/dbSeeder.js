const AptitudeQuestion = require('../models/AptitudeQuestion');
const CodingProblem = require('../models/CodingProblem');
const { easyQuestions, mediumQuestions, hardQuestions } = require('../data/practiceQuestionsSeed');
const codingProblems = require('../data/practiceProblemsSeed');

/**
 * Seeds the database on server startup if collections are empty.
 */
const seedDatabase = async () => {
  try {
    // 1. Check & Seed Aptitude Questions
    const questionCount = await AptitudeQuestion.countDocuments();
    if (questionCount === 0) {
      
      
      const allQuestions = [
        ...easyQuestions,
        ...mediumQuestions,
        ...hardQuestions
      ];

      await AptitudeQuestion.insertMany(allQuestions);
      
    } else {
      
    }

    // 2. Check & Seed Coding Problems
    const problemCount = await CodingProblem.countDocuments();
    if (problemCount === 0) {
      
      await CodingProblem.insertMany(codingProblems);
      
    } else {
      
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

module.exports = seedDatabase;
