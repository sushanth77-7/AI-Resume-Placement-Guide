const User = require('../models/User');
const Resume = require('../models/Resume');
const PortfolioAnalysis = require('../models/PortfolioAnalysis');
const AptitudeAttempt = require('../models/AptitudeAttempt');
const CodingAttempt = require('../models/CodingAttempt');
const Skill = require('../models/Skill');
const axios = require('axios');

/**
 * Helper: Calculate consecutive streaks from activity dates
 */
function calculateActivityStreak(activityDates) {
  if (activityDates.length === 0) return 0;
  
  // Normalize dates to YYYY-MM-DD strings and remove duplicates
  const uniqueDates = [...new Set(activityDates.map(d => new Date(d).toISOString().split('T')[0]))];
  uniqueDates.sort((a, b) => new Date(b) - new Date(a)); // Sort descending (today first)

  let streak = 0;
  let expectedDate = new Date();
  
  // If the latest activity is older than yesterday, streak is broken
  const latestActivity = new Date(uniqueDates[0]);
  const diffTime = Math.abs(expectedDate.setHours(0,0,0,0) - latestActivity.setHours(0,0,0,0));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > 1) {
    return 0;
  }

  expectedDate = latestActivity;
  for (let i = 0; i < uniqueDates.length; i++) {
    const currentActDate = new Date(uniqueDates[i]);
    const expectedStr = expectedDate.toISOString().split('T')[0];
    const currentActStr = currentActDate.toISOString().split('T')[0];

    if (currentActStr === expectedStr) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1); // Subtract 1 day
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Controller: Get dynamic Dashboard aggregates
 */
exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch collections
    const user = await User.findById(userId).populate('skills');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
    const portfolioHistory = await PortfolioAnalysis.find({ userId }).sort({ createdAt: -1 });
    const aptitudeAttempts = await AptitudeAttempt.find({ userId }).sort({ completedAt: -1 });
    const codingAttempts = await CodingAttempt.find({ userId }).sort({ completedAt: -1 });

    // 1. Calculate Profile Completeness
    let completenessCount = 0;
    if (user.name) completenessCount += 10;
    if (user.email) completenessCount += 10;
    if (user.phone) completenessCount += 10;
    if (user.college) completenessCount += 10;
    if (user.bio) completenessCount += 10;
    if (user.personalInfo?.branch) completenessCount += 10;
    if (user.careerInfo?.targetRole) completenessCount += 10;
    if (user.educationHistory?.length > 0) completenessCount += 10;
    if (user.portfolioLinks?.github || user.portfolioLinks?.linkedin) completenessCount += 10;
    if (resumes.length > 0 || user.certificates?.length > 0) completenessCount += 10;

    const profileCompleteness = Math.min(100, completenessCount);

    // 2. Fetch specific metric scores
    const latestResume = resumes[0] || null;
    const latestPortfolio = portfolioHistory[0] || null;

    const resumeScore = latestResume ? (latestResume.atsScore || latestResume.resumeQualityScore || 0) : 0;
    const resumeGradeRaw = latestResume ? (latestResume.grade || 'N/A') : 'N/A';
    const resumeGrade = typeof resumeGradeRaw === 'object' && resumeGradeRaw !== null 
      ? (resumeGradeRaw.grade || 'N/A') 
      : resumeGradeRaw;
    const githubScore = latestPortfolio ? (latestPortfolio.scores?.githubScore || 0) : 0;
    const linkedinScore = latestPortfolio ? (latestPortfolio.scores?.linkedinScore || 0) : 0;

    // 3. Aptitude Averages
    const totalAptTests = aptitudeAttempts.length;
    const avgAptPercentage = totalAptTests > 0
      ? Math.round(aptitudeAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalAptTests)
      : 0;
    const avgAptAccuracy = totalAptTests > 0
      ? Math.round(aptitudeAttempts.reduce((sum, a) => sum + (a.accuracy || 0), 0) / totalAptTests)
      : 0;

    // 4. Coding Averages
    const totalCodingSubmissions = codingAttempts.length;
    // Count successful coding attempts (e.g. status Passed)
    const codingProblemsSolved = codingAttempts.filter(c => c.status === 'Passed' || c.testCasesPassed === c.totalTestCases).length;
    
    // Average coding score based on percentage of testcases passed
    const avgCodingScore = totalCodingSubmissions > 0
      ? Math.round(codingAttempts.reduce((sum, c) => {
          const total = c.totalTestCases || 1;
          const passed = c.testCasesPassed || 0;
          return sum + ((passed / total) * 100);
        }, 0) / totalCodingSubmissions)
      : 0;

    const codingAccuracy = totalCodingSubmissions > 0
      ? Math.round((codingProblemsSolved / totalCodingSubmissions) * 100)
      : 0;

    // 5. Streaks calculation
    const allActivityDates = [
      ...resumes.map(r => r.createdAt),
      ...portfolioHistory.map(p => p.createdAt),
      ...aptitudeAttempts.map(a => a.completedAt),
      ...codingAttempts.map(c => c.completedAt)
    ];

    const dailyStreak = calculateActivityStreak(allActivityDates);
    const codingStreak = calculateActivityStreak(codingAttempts.map(c => c.completedAt));

    // Calculate total hours spent on tests/IDE (mocked estimate: 30m per test + 45m per code submission)
    const estTotalHours = Math.round((totalAptTests * 0.5) + (totalCodingSubmissions * 0.75));

    // 6. Placement Readiness Score (Weighted Average)
    const readinessScore = Math.round(
      (resumeScore * 0.20) +
      (linkedinScore * 0.15) +
      (githubScore * 0.15) +
      (avgAptPercentage * 0.20) +
      (avgCodingScore * 0.20) +
      (profileCompleteness * 0.10)
    );

    let readinessLevel = 'Beginner';
    if (readinessScore >= 90) {
      readinessLevel = 'Placement Ready';
    } else if (readinessScore >= 80) {
      readinessLevel = 'Excellent';
    } else if (readinessScore >= 66) {
      readinessLevel = 'Good';
    } else if (readinessScore >= 45) {
      readinessLevel = 'Improving';
    }

    // 7. Dynamic Badge System
    const badgeChecks = [
      { id: 'first_resume', title: 'First Resume Analysis', icon: '📄', desc: 'Analyzed your first resume.', earned: resumes.length >= 1 },
      { id: 'resume_expert', title: 'Resume Expert', icon: '📝', desc: 'Scored 80+ on ATS resume checks.', earned: resumes.some(r => r.atsScore >= 80) },
      { id: 'linkedin_optimizer', title: 'LinkedIn Optimizer', icon: '💼', desc: 'Optimized LinkedIn profile beyond 75%.', earned: portfolioHistory.some(p => p.scores?.linkedinScore >= 75) },
      { id: 'github_expert', title: 'GitHub Expert', icon: '🐙', desc: 'Maintained outstanding GitHub portfolio score.', earned: portfolioHistory.some(p => p.scores?.githubScore >= 75) },
      { id: 'aptitude_beginner', title: 'Aptitude Beginner', icon: '✏️', desc: 'Completed your first mock assessment.', earned: totalAptTests >= 1 },
      { id: 'aptitude_master', title: 'Aptitude Master', icon: '🎓', desc: 'Completed 5+ tests with 80%+ average.', earned: totalAptTests >= 5 && avgAptPercentage >= 80 },
      { id: 'coding_beginner', title: 'Coding Beginner', icon: '💻', desc: 'Solved your first programming problem.', earned: codingProblemsSolved >= 1 },
      { id: 'coding_champion', title: 'Coding Champion', icon: '🏆', desc: 'Solved 5+ coding challenges successfully.', earned: codingProblemsSolved >= 5 },
      { id: 'streak_7', title: '7-Day Streak', icon: '🔥', desc: 'Practiced for 7 consecutive days.', earned: dailyStreak >= 7 },
      { id: 'streak_30', title: '30-Day Streak', icon: '⚡', desc: 'Maintained placement drive fire for 30 days.', earned: dailyStreak >= 30 },
      { id: 'problem_solver', title: 'Problem Solver', icon: '🧩', desc: 'Completed 10+ total mock modules.', earned: (totalAptTests + codingProblemsSolved) >= 10 },
      { id: 'interview_ready', title: 'Interview Ready', icon: '🎤', desc: 'Achieved 75%+ overall readiness grade.', earned: readinessScore >= 75 },
      { id: 'placement_ready', title: 'Placement Ready', icon: '👑', desc: 'Exceeded 85%+ readiness, ready to deploy!', earned: readinessScore >= 85 }
    ];

    const badges = badgeChecks.filter(b => b.earned);

    // 8. Gamification Level Progression
    // Resume (+150 XP), Portfolio Analysis (+200 XP), Aptitude test (+100 XP + 5 XP per correct), Coding solve (+250 XP), Profile details (+50 XP per filled field)
    const baseProfileFields = [user.phone, user.college, user.bio, user.personalInfo?.branch, user.careerInfo?.targetRole].filter(Boolean).length;
    const certsCount = user.certificates?.length || 0;

    let computedXp = (resumes.length * 150) +
                     (portfolioHistory.length * 200) +
                     (totalAptTests * 100) +
                     (aptitudeAttempts.reduce((sum, a) => sum + (a.correctAnswersCount || 0) * 5, 0)) +
                     (codingProblemsSolved * 250) +
                     (baseProfileFields * 50) +
                     (certsCount * 150);

    const xp = Math.max(0, computedXp);
    const level = Math.min(10, Math.floor(xp / 1000) + 1);

    // 9. Detect Skills
    // Strong skills = Skill models with progress >= 75 or Advanced/Expert proficiency
    // Weak skills = Skill models with progress < 50
    const strongSkills = user.skills.filter(s => s.progress >= 75 || ['Advanced', 'Expert'].includes(s.proficiency)).map(s => s.skillName);
    const weakSkills = user.skills.filter(s => s.progress < 50).map(s => s.skillName);

    // Fallbacks if no custom skills added
    if (strongSkills.length === 0) {
      if (user.careerInfo?.preferredStack?.length > 0) {
        strongSkills.push(...user.careerInfo.preferredStack.slice(0, 3));
      } else {
        strongSkills.push('JavaScript', 'Problem Solving');
      }
    }
    if (weakSkills.length === 0) {
      weakSkills.push('Aptitude Speed', 'System Design');
    }

    // 10. Weekly Activity Graph (distribution over last 7 days)
    const recentActivityGraph = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayName = weekdays[d.getDay()];
      const dStr = d.toISOString().split('T')[0];

      const resCount = resumes.filter(r => new Date(r.createdAt).toISOString().split('T')[0] === dStr).length;
      const portCount = portfolioHistory.filter(p => new Date(p.createdAt).toISOString().split('T')[0] === dStr).length;
      const aptCount = aptitudeAttempts.filter(a => new Date(a.completedAt).toISOString().split('T')[0] === dStr).length;
      const codCount = codingAttempts.filter(c => new Date(c.completedAt).toISOString().split('T')[0] === dStr).length;
      
      const totalActivities = resCount + portCount + aptCount + codCount;
      recentActivityGraph.push({
        label: dayName,
        value: Math.min(10, totalActivities * 2) // scaled percentage index
      });
    }

    // 11. Chronological Recent Activities list (max 5)
    const rawActivities = [
      ...resumes.map(r => ({ text: `Resume analyzed (Score: ${r.atsScore}%, Grade: ${r.grade})`, date: r.createdAt, icon: '📄' })),
      ...portfolioHistory.map(p => ({ text: `LinkedIn & GitHub portfolio optimized (Presence: ${p.scores?.overallPresenceScore}%)`, date: p.createdAt, icon: '💼' })),
      ...aptitudeAttempts.map(a => ({ text: `Aptitude assessment mock test completed (${a.correctAnswersCount}/30 correct)`, date: a.completedAt, icon: '✏️' })),
      ...codingAttempts.map(c => ({ text: `Coding sandbox challenge solved (${c.problemId?.title || 'Problem'}, Language: ${c.language})`, date: c.completedAt, icon: '💻' })),
      ...(user.certificates || []).map(cert => ({ text: `Uploaded certificate: "${cert.name}" (${cert.category})`, date: cert.date || user.updatedAt, icon: '🎖️' }))
    ];

    rawActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentActivities = rawActivities.slice(0, 5);

    // 12. Dynamic target placement goal tracking
    const targetRole = user.careerInfo?.targetRole || 'Full Stack Developer';
    const targetGoalPercentage = Math.round((readinessScore + profileCompleteness) / 2);

    // 13. Query Groq for AI Coach recommendations if key present (else fallback)
    let aiCoachResult = null;
    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey && !apiKey.startsWith('your_')) {
      try {
        const coachPrompt = `
          Analyze this student's placement drive status:
          - Target Career Path: ${targetRole}
          - Overall Placement Readiness: ${readinessScore}% (Level: ${readinessLevel})
          - Profile Completeness: ${profileCompleteness}%
          - Resume ATS Score: ${resumeScore}%
          - LinkedIn Score: ${linkedinScore}%
          - GitHub Score: ${githubScore}%
          - Aptitude Average: ${avgAptPercentage}% (Accuracy: ${avgAptAccuracy}%)
          - Coding Problems Attempted: ${totalCodingSubmissions} (Accuracy: ${codingAccuracy}%)
          - Strengths: ${strongSkills.join(', ')}
          - Weak areas: ${weakSkills.join(', ')}
          
          Provide a JSON response containing:
          1. "motivationQuote": A brief motivational quote related to tech campus recruitment.
          2. "aiReadinessExplanation": A 60-word description explaining why their readiness score is at ${readinessScore}% and what recruiters will notice.
          3. "careerCoachAdvice": A paragraph of actionable advice targeting their weak areas.
          4. "todaysTasks": Array of 3 items. Each item must have "title", "time" (e.g. "45 mins"), and "impact" (e.g. "High", "Medium").
          5. "upcomingGoals": Array of 3 future goals. Each goal must have "title", "description", and "expectedImpact" (e.g. "+5% Readiness").
          6. "aiSuggestions": Array of 4 suggestions with "category" (e.g. "Certification", "Project", "Interview Topic", "Soft Skill") and "text" description.
          
          Only return the JSON object matching:
          {
            "motivationQuote": "...",
            "aiReadinessExplanation": "...",
            "careerCoachAdvice": "...",
            "todaysTasks": [{ "title": "...", "time": "...", "impact": "..." }],
            "upcomingGoals": [{ "title": "...", "description": "...", "expectedImpact": "..." }],
            "aiSuggestions": [{ "category": "...", "text": "..." }]
          }
        `;

        const coachResponse = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: 'You are an AI Career Coach. Output JSON only.' },
              { role: 'user', content: coachPrompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }
        );

        const content = coachResponse?.data?.choices?.[0]?.message?.content || '';
        aiCoachResult = JSON.parse(content);
      } catch (err) {
        console.error('Groq AI Coach dashboard suggestions call failed:', err.message);
      }
    }

    // Rules-based fallback if Groq call failed or key absent
    if (!aiCoachResult) {
      const fallbackTasks = [];
      const fallbackGoals = [];
      const fallbackSuggestions = [];

      // Determine task list based on scores
      if (resumeScore < 70) {
        fallbackTasks.push({ title: 'Upload/Audit a new resume on the Analyzer', time: '20 mins', impact: 'High' });
        fallbackGoals.push({ title: 'Achieve ATS Score 80+', description: 'Incorporate active action verbs and correct contact links in your resume header.', expectedImpact: '+8% Readiness' });
      }
      if (githubScore < 60) {
        fallbackTasks.push({ title: 'Add a README.md file to your top GitHub repository', time: '30 mins', impact: 'Medium' });
      }
      if (avgAptPercentage < 70) {
        fallbackTasks.push({ title: 'Practice 2 mock Aptitude Tests (Easy/Medium difficulty)', time: '40 mins', impact: 'High' });
        fallbackGoals.push({ title: 'Improve Averages & Percentages Math speed', description: 'Solve 30 aptitude problems to clear placement rounds for Wipro and TCS.', expectedImpact: '+5% Readiness' });
      } else {
        fallbackTasks.push({ title: 'Challenge yourself with a Hard Aptitude mock round', time: '30 mins', impact: 'Medium' });
      }
      if (codingProblemsSolved === 0) {
        fallbackTasks.push({ title: 'Solve 1 basic Coding Problem in the sandbox', time: '45 mins', impact: 'High' });
      } else {
        fallbackTasks.push({ title: 'Optimize your previous code submission on complexity', time: '30 mins', impact: 'Medium' });
      }

      // Add default items if array is too small
      while (fallbackTasks.length < 3) {
        fallbackTasks.push({ title: 'Add LinkedIn profile link to your portfolio settings', time: '10 mins', impact: 'Medium' });
      }
      if (fallbackGoals.length === 0) {
        fallbackGoals.push({ title: 'Complete Cloud Certification', description: 'Get AWS Certified Cloud Practitioner or similar to boost resume strength.', expectedImpact: '+10% Readiness' });
        fallbackGoals.push({ title: 'Build a MERN stack project', description: 'Deploy on Vercel/Render and link to GitHub.', expectedImpact: '+12% Readiness' });
      }
      while (fallbackGoals.length < 3) {
        fallbackGoals.push({ title: 'Solve 50 coding problems', description: 'Achieve intermediate competency on DSA arrays and strings.', expectedImpact: '+8% Readiness' });
      }

      fallbackSuggestions.push(
        { category: 'Technology', text: targetRole.includes('Java') ? 'Master Spring Boot frameworks and Hibernate ORM.' : 'Study React.js state hooks and Node.js REST API structures.' },
        { category: 'Certification', text: 'AWS Solutions Architect, Google Cloud Associate, or Certified Kubernetes Administrator.' },
        { category: 'Aptitude / Coding', text: 'Deep dive into Time & Work problems and Binary Search structures.' },
        { category: 'Soft Skill', text: 'Practice 1-minute elevator pitches summarizing your top MERN or Java engineering projects.' }
      );

      const quotes = [
        "Opportunities don't happen, you create them. – Chris Grosser",
        "The best way to predict the future is to create it. – Peter Drucker",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. – Winston Churchill",
        "Your talent determines what you can do. Your motivation determines how much you are willing to do. – Lou Holtz"
      ];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

      let readinessExplanation = '';
      if (readinessScore >= 80) {
        readinessExplanation = `Excellent job! With a readiness score of ${readinessScore}%, you possess strong technical alignments, solid resume scoring, and reliable practice metrics. You exceed standard TCS, Wipro, and Infosys recruitment thresholds.`;
      } else if (readinessScore >= 60) {
        readinessExplanation = `Good progress! At ${readinessScore}% readiness, you have a solid foundation but have visual or keyword gaps in your resume, or need to increase your speed in aptitude mock rounds.`;
      } else {
        readinessExplanation = `Preparation in early stages. At ${readinessScore}% readiness, we recommend scanning a resume immediately and completing at least 2 coding problems to clear initial screenings.`;
      }

      aiCoachResult = {
        motivationQuote: randomQuote,
        aiReadinessExplanation: readinessExplanation,
        careerCoachAdvice: `Focus on bridging your technical gaps. Based on your skill analytics, we suggest dedicating 30 minutes daily to quantitative aptitude and pushing a clean, README-documented project to GitHub.`,
        todaysTasks: fallbackTasks.slice(0, 3),
        upcomingGoals: fallbackGoals.slice(0, 3),
        aiSuggestions: fallbackSuggestions
      };
    }

    // 14. Return compiled dashboard
    res.status(200).json({
      success: true,
      summary: {
        studentName: user.name,
        targetRole,
        targetGoalPercentage,
        level,
        xp,
        overallReadinessScore: readinessScore,
        readinessLevel,
        totalPracticeHours: estTotalHours,
        stats: {
          resumeAtsScore: resumeScore,
          resumeGrade,
          linkedinScore,
          githubScore,
          aptitudeAvg: avgAptPercentage,
          codingAvg: avgCodingScore,
          profileCompleteness
        },
        practiceAnalytics: {
          totalAptTests,
          aptitudeAccuracy: avgAptAccuracy,
          totalCodingSubmissions,
          problemsSolved: codingProblemsSolved,
          codingAccuracy,
          codingStreak,
          dailyStreak,
          weeklyProgress: Math.min(100, Math.round((badges.length / badgeChecks.length) * 100)),
          monthlyProgress: Math.min(100, Math.round((xp / 10000) * 100))
        },
        skillsList: {
          strong: strongSkills.slice(0, 5),
          weak: weakSkills.slice(0, 5)
        },
        weeklyActivityGraph: recentActivityGraph,
        recentActivities,
        aiCoach: aiCoachResult,
        badges
      }
    });

  } catch (error) {
    console.error('Dashboard Controller error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};
