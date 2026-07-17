const AptitudeQuestion = require('../models/AptitudeQuestion');
const AptitudeAttempt = require('../models/AptitudeAttempt');
const CodingProblem = require('../models/CodingProblem');
const CodingAttempt = require('../models/CodingAttempt');
const codeRunner = require('../utils/codeRunner');

// ==================== APTITUDE SECTION ====================

// Get 30 Random Questions based on difficulty
exports.getAptitudeQuestions = async (req, res) => {
  try {
    const { difficulty } = req.query;
    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    // Fetch questions from DB
    let pool = await AptitudeQuestion.find({ difficulty });

    if (pool.length === 0) {
      return res.status(404).json({ error: 'No questions found for this difficulty level' });
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    
    // Select 30 questions (or less if the pool is smaller)
    const selected = shuffled.slice(0, Math.min(30, shuffled.length));

    res.status(200).json({
      success: true,
      difficulty,
      count: selected.length,
      questions: selected.map((q, idx) => ({
        _id: q._id,
        category: q.category,
        topic: q.topic,
        question: q.question,
        options: q.options,
        index: idx
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit Aptitude Test and calculate score
exports.submitAptitudeTest = async (req, res) => {
  try {
    const { difficulty, answers, timeTaken, questionIds } = req.body;
    const userId = req.user.id;

    if (!difficulty || !questionIds || !Array.isArray(questionIds)) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Fetch the original questions to verify answers
    const questions = await AptitudeQuestion.find({ _id: { $in: questionIds } });
    
    // Maintain ordering as submitted
    const orderedQuestions = questionIds.map(id => questions.find(q => q._id.toString() === id.toString())).filter(Boolean);

    let correctAnswersCount = 0;
    let incorrectAnswersCount = 0;
    let unansweredCount = 0;

    const topicStats = {};

    orderedQuestions.forEach((q, idx) => {
      const userAnswer = answers[idx] || '';
      const isCorrect = userAnswer === q.answer;

      if (!userAnswer) {
        unansweredCount++;
      } else if (isCorrect) {
        correctAnswersCount++;
      } else {
        incorrectAnswersCount++;
      }

      // Track topic performance
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { correct: 0, total: 0 };
      }
      topicStats[q.topic].total++;
      if (isCorrect) {
        topicStats[q.topic].correct++;
      }
    });

    const totalQuestions = orderedQuestions.length;
    const score = correctAnswersCount; // 1 mark per correct answer
    const percentage = Math.round((correctAnswersCount / totalQuestions) * 100);
    const accuracy = correctAnswersCount + incorrectAnswersCount > 0
      ? Math.round((correctAnswersCount / (correctAnswersCount + incorrectAnswersCount)) * 100)
      : 0;

    // Strengths and Weaknesses
    const strengths = [];
    const weaknesses = [];
    const personalizedSuggestions = [];

    Object.entries(topicStats).forEach(([topic, stats]) => {
      const topicPct = (stats.correct / stats.total) * 100;
      if (topicPct >= 75) {
        strengths.push(topic);
      } else if (topicPct < 60) {
        weaknesses.push(topic);
        personalizedSuggestions.push(`Practice more questions on "${topic}" to improve your accuracy.`);
      }
    });

    // Handle empty strengths/weaknesses with generic fallbacks
    if (strengths.length === 0) strengths.push('General Concepts');
    if (weaknesses.length === 0) {
      weaknesses.push('None! Great job.');
      personalizedSuggestions.push('You performed exceptionally. Try taking tests at a higher difficulty level.');
    } else {
      personalizedSuggestions.push('Focus on speed optimization by applying shortcut techniques for calculations.');
    }

    // Campus Readiness Score (scaled by difficulty)
    let campusReadinessScore = percentage;
    if (difficulty === 'Easy') {
      campusReadinessScore = Math.round(percentage * 0.8);
    } else if (difficulty === 'Medium') {
      campusReadinessScore = Math.min(100, Math.round(percentage * 0.9 + 5));
    } else if (difficulty === 'Hard') {
      campusReadinessScore = Math.min(100, Math.round(percentage * 0.95 + 10));
    }

    // Save attempt
    const attempt = await AptitudeAttempt.create({
      userId,
      difficulty,
      questions: orderedQuestions.map(q => ({
        questionId: q._id,
        category: q.category,
        topic: q.topic,
        question: q.question,
        options: q.options,
        answer: q.answer,
        detailedSolution: q.detailedSolution,
        shortcutMethod: q.shortcutMethod,
        formulaUsed: q.formulaUsed,
        stepByStepExplanation: q.stepByStepExplanation
      })),
      answers,
      score,
      percentage,
      correctAnswersCount,
      incorrectAnswersCount,
      unansweredCount,
      timeTaken,
      accuracy,
      topicWisePerformance: topicStats,
      strengths,
      weaknesses,
      personalizedSuggestions,
      campusReadinessScore
    });

    res.status(201).json({
      success: true,
      attemptId: attempt._id,
      score,
      totalQuestions,
      percentage,
      accuracy,
      correctAnswersCount,
      incorrectAnswersCount,
      unansweredCount,
      timeTaken,
      strengths,
      weaknesses,
      personalizedSuggestions,
      campusReadinessScore,
      topicWisePerformance: topicStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Past Aptitude Attempts
exports.getAptitudeHistory = async (req, res) => {
  try {
    const attempts = await AptitudeAttempt.find({ userId: req.user.id })
      .select('difficulty score percentage correctAnswersCount incorrectAnswersCount unansweredCount timeTaken completedAt campusReadinessScore')
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      attempts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Detail of a Specific Attempt
exports.getAptitudeAttemptDetail = async (req, res) => {
  try {
    const attempt = await AptitudeAttempt.findOne({ _id: req.params.id, userId: req.user.id });
    if (!attempt) {
      return res.status(404).json({ error: 'Aptitude attempt not found' });
    }
    res.status(200).json({
      success: true,
      attempt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ==================== CODING SECTION ====================

// Get 2 Random Coding Problems based on difficulty
exports.getCodingProblemsSession = async (req, res) => {
  try {
    const { difficulty } = req.query;
    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    const pool = await CodingProblem.find({ difficulty });
    if (pool.length === 0) {
      return res.status(404).json({ error: 'No coding problems found for this difficulty' });
    }

    // Shuffle and pick 2
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 2);

    res.status(200).json({
      success: true,
      difficulty,
      count: selected.length,
      problems: selected.map(p => ({
        _id: p._id,
        title: p.title,
        description: p.description,
        difficulty: p.difficulty,
        topic: p.topic,
        constraints: p.constraints,
        inputFormat: p.inputFormat,
        outputFormat: p.outputFormat,
        sampleInput: p.sampleInput,
        sampleOutput: p.sampleOutput,
        sampleExplanation: p.sampleExplanation,
        initialTemplates: p.initialTemplates,
        visibleTestCases: p.testCases.filter(tc => !tc.isHidden).map(tc => ({ input: tc.input, output: tc.output }))
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Run Coding Code (sample cases only)
exports.runCodingCode = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;
    if (!problemId || !language || !code) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const problem = await CodingProblem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Get visible test cases
    const visibleTestCases = problem.testCases.filter(tc => !tc.isHidden);

    let runResults;
    if (language === 'javascript') {
      runResults = codeRunner.runLocalJS(code, visibleTestCases);
    } else {
      // Use fallback heuristics or Groq to evaluate other languages
      runResults = await codeRunner.evaluateCodeWithAI(problem, language, code, visibleTestCases);
    }

    res.status(200).json({
      success: true,
      passed: runResults.passed || (runResults.status === 'Passed' ? visibleTestCases.length : 0),
      total: visibleTestCases.length,
      status: runResults.status || (runResults.passed === visibleTestCases.length ? 'Passed' : 'Failed'),
      results: runResults.results || runResults.results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit Coding Code (hidden + AI analysis)
exports.submitCodingCode = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;
    const userId = req.user.id;

    if (!problemId || !language || !code) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const problem = await CodingProblem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Get all test cases
    const allTestCases = problem.testCases;

    // Use AI (or heuristic fallback) to compile and review the code
    const gradeResults = await codeRunner.evaluateCodeWithAI(problem, language, code, allTestCases);

    // If JavaScript, we double check accuracy with absolute local execution
    if (language === 'javascript') {
      const jsRun = codeRunner.runLocalJS(code, allTestCases);
      gradeResults.testCasesPassed = jsRun.passed;
      gradeResults.status = jsRun.passed === allTestCases.length ? 'Passed' : 'Failed';
      gradeResults.results = jsRun.results;
      if (jsRun.passed === allTestCases.length) {
        gradeResults.review.overallCodingScore = Math.max(gradeResults.review.overallCodingScore, 90);
      }
    }

    // Save coding attempt
    const attempt = await CodingAttempt.create({
      userId,
      problemId,
      language,
      code,
      status: gradeResults.status,
      testCasesPassed: gradeResults.testCasesPassed,
      totalTestCases: allTestCases.length,
      runtime: gradeResults.runtime || 0,
      memory: gradeResults.memory || 0,
      timeComplexity: gradeResults.timeComplexity || 'N/A',
      spaceComplexity: gradeResults.spaceComplexity || 'N/A',
      review: gradeResults.review
    });

    res.status(201).json({
      success: true,
      attemptId: attempt._id,
      status: attempt.status,
      testCasesPassed: attempt.testCasesPassed,
      totalTestCases: attempt.totalTestCases,
      runtime: attempt.runtime,
      memory: attempt.memory,
      timeComplexity: attempt.timeComplexity,
      spaceComplexity: attempt.spaceComplexity,
      review: attempt.review,
      results: gradeResults.results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Past Coding Attempts
exports.getCodingHistory = async (req, res) => {
  try {
    const attempts = await CodingAttempt.find({ userId: req.user.id })
      .populate('problemId', 'title difficulty topic')
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      attempts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ==================== PERFORMANCE ANALYTICS ====================

// Get Global Performance Analytics & Recommendations
exports.getPerformanceAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all attempts
    const aptitudeAttempts = await AptitudeAttempt.find({ userId }).sort({ completedAt: 1 });
    const codingAttempts = await CodingAttempt.find({ userId }).populate('problemId', 'title difficulty topic').sort({ completedAt: 1 });

    // 1. Solve counts
    const totalAptitudeTests = aptitudeAttempts.length;
    const totalCodingAttempts = codingAttempts.length;
    
    // Distinct coding problems solved
    const solvedProblemIds = new Set();
    codingAttempts.forEach(att => {
      if (att.status === 'Passed') {
        solvedProblemIds.add(att.problemId?._id?.toString() || att.problemId?.toString());
      }
    });
    const codingProblemsSolved = solvedProblemIds.size;

    // 2. Average Scores and Accuracy
    let totalAptitudeScore = 0;
    let totalAptitudePct = 0;
    let totalAptitudeAccuracy = 0;
    let totalAptitudeTime = 0;

    aptitudeAttempts.forEach(att => {
      totalAptitudeScore += att.score;
      totalAptitudePct += att.percentage;
      totalAptitudeAccuracy += att.accuracy;
      totalAptitudeTime += att.timeTaken;
    });

    const avgAptitudePercentage = totalAptitudeTests > 0 ? Math.round(totalAptitudePct / totalAptitudeTests) : 0;
    const avgAptitudeAccuracy = totalAptitudeTests > 0 ? Math.round(totalAptitudeAccuracy / totalAptitudeTests) : 0;
    const avgSolvingTimePerTest = totalAptitudeTests > 0 ? Math.round(totalAptitudeTime / totalAptitudeTests) : 0;

    let totalCodingCasesPassed = 0;
    let totalCodingCasesCount = 0;
    let codingScoreSum = 0;

    codingAttempts.forEach(att => {
      totalCodingCasesPassed += att.testCasesPassed;
      totalCodingCasesCount += att.totalTestCases;
      codingScoreSum += (att.review?.overallCodingScore || 0);
    });

    const avgCodingScore = totalCodingAttempts > 0 ? Math.round(codingScoreSum / totalCodingAttempts) : 0;
    const codingAccuracy = totalCodingCasesCount > 0 ? Math.round((totalCodingCasesPassed / totalCodingCasesCount) * 100) : 0;

    // 3. Overall Placement Readiness Score
    // Compiles: Aptitude readiness, coding pass rate, and quantities
    const aptitudeWeight = avgAptitudePercentage;
    const codingWeight = codingAccuracy;
    const activityBonus = Math.min(15, (totalAptitudeTests * 3) + (codingProblemsSolved * 5)); // Reward volume
    
    let overallPlacementReadiness = 0;
    if (totalAptitudeTests > 0 && totalCodingAttempts > 0) {
      overallPlacementReadiness = Math.min(100, Math.round((aptitudeWeight * 0.4) + (codingWeight * 0.45) + activityBonus));
    } else if (totalAptitudeTests > 0) {
      overallPlacementReadiness = Math.min(80, Math.round(aptitudeWeight * 0.8 + activityBonus));
    } else if (totalCodingAttempts > 0) {
      overallPlacementReadiness = Math.min(80, Math.round(codingWeight * 0.8 + activityBonus));
    } else {
      overallPlacementReadiness = 10; // Base starting readiness
    }

    // 4. Strengths & Weaknesses compilation
    const aptitudeTopicPerformance = {};
    const codingTopicPerformance = {};

    aptitudeAttempts.forEach(att => {
      if (att.topicWisePerformance) {
        for (let [topic, stats] of att.topicWisePerformance.entries()) {
          if (!aptitudeTopicPerformance[topic]) {
            aptitudeTopicPerformance[topic] = { correct: 0, total: 0 };
          }
          aptitudeTopicPerformance[topic].correct += stats.correct;
          aptitudeTopicPerformance[topic].total += stats.total;
        }
      }
    });

    codingAttempts.forEach(att => {
      const topic = att.problemId?.topic || 'Algorithms';
      if (!codingTopicPerformance[topic]) {
        codingTopicPerformance[topic] = { passed: 0, total: 0 };
      }
      codingTopicPerformance[topic].passed += att.testCasesPassed;
      codingTopicPerformance[topic].total += att.totalTestCases;
    });

    const strongestTopics = [];
    const weakestTopics = [];

    // Compile from Aptitude
    Object.entries(aptitudeTopicPerformance).forEach(([topic, stats]) => {
      const rate = (stats.correct / stats.total) * 100;
      if (rate >= 75) strongestTopics.push({ topic, score: Math.round(rate), type: 'Aptitude' });
      if (rate < 60) weakestTopics.push({ topic, score: Math.round(rate), type: 'Aptitude' });
    });

    // Compile from Coding
    Object.entries(codingTopicPerformance).forEach(([topic, stats]) => {
      const rate = (stats.passed / stats.total) * 100;
      if (rate >= 80) strongestTopics.push({ topic, score: Math.round(rate), type: 'Coding' });
      if (rate < 60) weakestTopics.push({ topic, score: Math.round(rate), type: 'Coding' });
    });

    // 5. Streaks (Daily streak calculation)
    let dailyStreak = 0;
    const uniqueDates = new Set();

    aptitudeAttempts.forEach(att => uniqueDates.add(new Date(att.completedAt).toDateString()));
    codingAttempts.forEach(att => uniqueDates.add(new Date(att.completedAt).toDateString()));

    const sortedDates = Array.from(uniqueDates).map(d => new Date(d)).sort((a,b) => b-a); // Descending order
    
    if (sortedDates.length > 0) {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      const latestDateString = sortedDates[0].toDateString();
      const hasActivityRecently = latestDateString === today.toDateString() || latestDateString === yesterday.toDateString();

      if (hasActivityRecently) {
        dailyStreak = 1;
        let prevDate = sortedDates[0];
        for (let i = 1; i < sortedDates.length; i++) {
          const diffTime = Math.abs(prevDate - sortedDates[i]);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            dailyStreak++;
            prevDate = sortedDates[i];
          } else if (diffDays > 1) {
            break;
          }
        }
      }
    }

    // 6. Badges & Achievements
    const badges = [];
    if (totalAptitudeTests > 0) badges.push({ id: 'apt_rookie', title: 'Aptitude Starter', description: 'Completed your first Aptitude Mock round.', icon: '🎓' });
    if (totalAptitudeTests >= 5) badges.push({ id: 'apt_veteran', title: 'Placement Ready', description: 'Completed 5+ full-length Aptitude tests.', icon: '🏆' });
    if (codingProblemsSolved > 0) badges.push({ id: 'code_rookie', title: 'Debugger', description: 'Solved your first coding problem.', icon: '💻' });
    if (codingProblemsSolved >= 5) badges.push({ id: 'code_warrior', title: 'DSA Knight', description: 'Passed 5+ distinct coding problems.', icon: '🛡️' });
    if (dailyStreak >= 3) badges.push({ id: 'streak_3', title: 'Consistency', description: 'Maintained a 3-day coding streak.', icon: '🔥' });

    // 7. Progress timelines
    // Group attempts by month/week
    const recentActivity = [];
    // Last 7 tests/submissions
    const mergedHistory = [
      ...aptitudeAttempts.map(a => ({ type: 'Aptitude', score: a.percentage, date: a.completedAt })),
      ...codingAttempts.map(c => ({ type: 'Coding', score: c.review?.overallCodingScore || 0, date: c.completedAt }))
    ].sort((a,b) => new Date(a.date) - new Date(b.date)).slice(-10); // get last 10 points

    // 8. Auto Recommendations
    const weakTopicsToImprove = weakestTopics.map(w => w.topic);
    const suggestedAptitudeTests = [];
    const suggestedCodingQuestions = [];
    const learningResources = [];

    if (weakTopicsToImprove.length > 0) {
      suggestedAptitudeTests.push({ topic: weakTopicsToImprove[0], difficulty: 'Easy', reason: 'To build basic concepts.' });
      if (weakTopicsToImprove[1]) {
        suggestedAptitudeTests.push({ topic: weakTopicsToImprove[1], difficulty: 'Medium', reason: 'To practice standard questions.' });
      }
    } else {
      suggestedAptitudeTests.push({ topic: 'Quantitative Aptitude', difficulty: 'Medium', reason: 'General placement refresh.' });
      suggestedAptitudeTests.push({ topic: 'Logical Reasoning', difficulty: 'Hard', reason: 'Challenge yourself.' });
    }

    // Coding recommendations
    const solvedTitles = new Set(codingAttempts.filter(c => c.status === 'Passed').map(c => c.problemId?.title).filter(Boolean));
    const allProblems = await CodingProblem.find({});
    
    allProblems.forEach(prob => {
      if (!solvedTitles.has(prob.title) && suggestedCodingQuestions.length < 3) {
        suggestedCodingQuestions.push({
          problemId: prob._id,
          title: prob.title,
          difficulty: prob.difficulty,
          topic: prob.topic
        });
      }
    });

    // Resources list
    learningResources.push({ title: 'TCS NQT Placement Crack Sheet', link: 'https://youtube.com', type: 'Video' });
    learningResources.push({ title: 'Top 50 Aptitude Shortcuts & Formulas', link: '/placement-guide/aptitude', type: 'Guide' });
    learningResources.push({ title: 'LeetCode 75 placement roadmap', link: '/placement-guide/coding', type: 'Roadmap' });

    res.status(200).json({
      success: true,
      analytics: {
        streak: dailyStreak,
        badges,
        overallPlacementReadiness,
        aptitude: {
          totalTests: totalAptitudeTests,
          averagePercentage: avgAptitudePercentage,
          averageAccuracy: avgAptitudeAccuracy,
          averageTimeSeconds: avgSolvingTimePerTest
        },
        coding: {
          totalSubmissions: totalCodingAttempts,
          problemsSolved: codingProblemsSolved,
          averageScore: avgCodingScore,
          accuracyPercentage: codingAccuracy
        },
        strengths: strongestTopics.slice(0, 5),
        weaknesses: weakestTopics.slice(0, 5),
        recentActivityGraph: mergedHistory,
        recommendations: {
          weakTopics: weakTopicsToImprove,
          suggestedAptitudeTests,
          suggestedCodingQuestions,
          learningResources,
          interviewTopics: ['DBMS Fundamentals', 'OOPs in Java/C++', 'Operating System Processes']
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
