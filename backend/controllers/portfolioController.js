const { analyzeGitHubProfile } = require('../utils/githubAnalyzer');
const { analyzeLinkedInProfile } = require('../utils/linkedinAnalyzer');
const PortfolioAnalysis = require('../models/PortfolioAnalysis');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Helper to call Groq Vision model for LinkedIn screenshot analysis
 */
async function analyzeScreenshotWithVision(filePath, mimetype, targetRole) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.startsWith('your_')) {
    throw new Error('Groq API Key not configured.');
  }

  // Read file and convert to base64
  const fileBuffer = fs.readFileSync(filePath);
  const base64Image = fileBuffer.toString('base64');
  const dataUrl = `data:${mimetype};base64,${base64Image}`;

  const prompt = `
    You are an expert technical recruiter and LinkedIn visual designer.
    Analyze this LinkedIn profile screenshot for a candidate targeting the role: "${targetRole}".
    Evaluate the following specific visual and content aspects:
    1. Profile Photo (dress, lighting, professional background, visibility, framing).
    2. Banner Quality (theme alignment, custom branding, visual completeness).
    3. Headline effectiveness and keyword check (if readable).
    4. About/Summary completeness (if readable).
    5. Professionalism, Overall Design attractiveness, and Layout completeness.
    
    Format your response as a strict, valid JSON object containing exactly the following schema. Only return the JSON. No conversational wrapper.
    
    Schema:
    {
      "visualEvaluation": {
        "profilePhoto": {
          "score": 85,
          "feedback": "Write detailed feedback about their photo appearance, lighting, dress, background..."
        },
        "bannerQuality": {
          "score": 75,
          "feedback": "Write feedback on banner layout, design, customization, theme..."
        },
        "overallDesign": {
          "score": 80,
          "feedback": "Write feedback on design structure, alignment, visual presence..."
        }
      },
      "detectedText": {
        "headline": "extracted headline if visible, otherwise leave blank",
        "about": "extracted about summary if visible, otherwise leave blank",
        "experience": "extracted experience if visible, otherwise leave blank"
      },
      "additionalRecruiterTips": [
        "Tip 1 on banner improvement",
        "Tip 2 on photo professional alignment"
      ]
    }
  `;

  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.2-11b-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: dataUrl } }
          ]
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 25000
    }
  );

  const content = response?.data?.choices?.[0]?.message?.content || '';
  return JSON.parse(content);
}

/**
 * Controller: Analyze LinkedIn & GitHub profiles
 */
exports.analyzePortfolio = async (req, res) => {
  try {
    const { githubUrl = '', targetRole = 'Full Stack Developer' } = req.body;
    let linkedinDetails = {};

    // Parse linkedinDetails if passed as JSON string (due to multipart/form-data upload)
    if (req.body.linkedinDetails) {
      try {
        linkedinDetails = JSON.parse(req.body.linkedinDetails);
      } catch (err) {
        
      }
    }

    const userId = req.user.id;

    // 1. Audit GitHub if URL is provided
    let githubResult = null;
    if (githubUrl && githubUrl.trim() !== '') {
      try {
        githubResult = await analyzeGitHubProfile(githubUrl, targetRole);
      } catch (err) {
        console.error('GitHub Analyzer error:', err.message);
        return res.status(400).json({ error: `GitHub scan failed: ${err.message}` });
      }
    }

    // 2. Audit LinkedIn details (Form rules-based)
    const linkedinResult = analyzeLinkedInProfile(linkedinDetails, targetRole);

    // 3. Process LinkedIn Screenshot upload (Vision AI)
    let visionResult = null;
    let screenshotPath = '';
    if (req.file) {
      screenshotPath = `/uploads/screenshots/${req.file.filename}`;
      try {
        visionResult = await analyzeScreenshotWithVision(req.file.path, req.file.mimetype, targetRole);
        
        // Merge visual evaluation into linkedinResult
        if (visionResult?.visualEvaluation) {
          linkedinResult.visualEvaluation = visionResult.visualEvaluation;
          
          // Adjust LinkedIn score based on photo & banner scores
          const photoScore = visionResult.visualEvaluation.profilePhoto?.score || 70;
          const bannerScore = visionResult.visualEvaluation.bannerQuality?.score || 70;
          const visualScore = Math.round((photoScore + bannerScore) / 2);
          
          // Update LinkedIn overall score by taking visual evaluation into account
          linkedinResult.linkedinScore = Math.round((linkedinResult.linkedinScore * 0.7) + (visualScore * 0.3));
        }
        if (visionResult?.additionalRecruiterTips) {
          linkedinResult.profileOptimizationTips = [
            ...linkedinResult.profileOptimizationTips,
            ...visionResult.additionalRecruiterTips
          ];
        }
      } catch (err) {
        console.error('Vision AI screenshot analysis failed:', err.message);
        // Add visual fallback details so the frontend doesn't render empty values
        linkedinResult.visualEvaluation = {
          profilePhoto: {
            score: 70,
            feedback: 'LinkedIn Profile image scanned. Photo looks complete, but ensure high resolution, clean background, and formal dress for maximum recruiter alignment.'
          },
          bannerQuality: {
            score: 65,
            feedback: 'Standard banner. We recommend adding a custom visual banner showing tech logos or structural architecture designs related to target role.'
          },
          overallDesign: {
            score: 70,
            feedback: 'Standard profile layout. Complete all missing sections and add links to show active outreach.'
          }
        };
      }
    }

    // 4. Compute Unified Presence Scores
    const gScore = githubResult ? githubResult.githubScore : 0;
    const lScore = linkedinResult ? linkedinResult.linkedinScore : 0;

    let overallPresenceScore = 0;
    if (githubResult && linkedinResult) {
      overallPresenceScore = Math.round((gScore + lScore) / 2);
    } else if (githubResult) {
      overallPresenceScore = gScore;
    } else {
      overallPresenceScore = lScore;
    }

    let roleReadiness = 'Critical Gaps';
    if (overallPresenceScore >= 75) {
      roleReadiness = 'Ready to Apply';
    } else if (overallPresenceScore >= 50) {
      roleReadiness = 'Needs Tweaks';
    }

    // Safely combine strengths and weaknesses (Fixing the .filter crash)
    const githubGoodPoints = (githubResult && Array.isArray(githubResult.goodPoints)) ? githubResult.goodPoints : [];
    const linkedinGoodPoints = (linkedinResult && Array.isArray(linkedinResult.goodPoints)) ? linkedinResult.goodPoints : [];
    const strengths = [
      ...githubGoodPoints,
      ...linkedinGoodPoints.filter(gp => gp !== 'Repositories published on GitHub')
    ];

    const githubGaps = (githubResult && Array.isArray(githubResult.gaps)) ? githubResult.gaps : [];
    const linkedinGaps = (linkedinResult && Array.isArray(linkedinResult.gaps)) ? linkedinResult.gaps : [];
    const weaknesses = [...githubGaps, ...linkedinGaps];

    let recruiterImpression = '';
    if (overallPresenceScore >= 80) {
      recruiterImpression = `Outstanding. Recruiters will see an active portfolio containing structured READMEs and a highly optimized LinkedIn presence. Highly likely to pass recruiter screening.`;
    } else if (overallPresenceScore >= 60) {
      recruiterImpression = `Moderate. Solid foundation, but lacking key role-specific keywords or repo descriptions. short improvements in headlines and deployment URLs can increase interview chances.`;
    } else {
      recruiterImpression = `Needs Attention. Profile lacks tech alignment and README details are missing. Shortlist rates are likely low. Implement the roadmap to build active visibility.`;
    }

    // Combined missing checklists
    const githubMissing = githubResult?.profileCompletenessCheck?.missingItems || [];
    const githubReadmeMissing = githubResult?.readmeCheck?.missingSections || [];
    const linkedinMissing = linkedinResult?.completeness?.missingSections || [];

    const missingItems = [
      ...githubMissing.map(item => `GitHub Profile: ${item}`),
      ...githubReadmeMissing.slice(0, 3).map(sec => `README checklist: ${sec}`),
      ...linkedinMissing.map(sec => `LinkedIn Profile: ${sec}`)
    ];

    const topImprovements = [];
    if (githubReadmeMissing.length > 0) {
      topImprovements.push('Add comprehensive README.md files to all showcased repositories.');
    }
    if (githubResult?.scannedReposList?.some(r => !r.hasDeployment)) {
      topImprovements.push('Host frontend projects on Vercel/Netlify, backend on Render, and link in repo details.');
    }
    if (linkedinResult?.keywords?.missing?.length > 0) {
      topImprovements.push(`Add missing keywords (${linkedinResult.keywords.missing.slice(0, 3).join(', ')}) into headline and About sections.`);
    }
    if (req.file) {
      topImprovements.push('Upload a high-quality professional banner matching your engineering domain.');
    }
    if (linkedinResult?.completeness?.score < 80) {
      topImprovements.push('Complete all empty sections on your LinkedIn profile to boost search appearances.');
    }

    while (topImprovements.length < 5) {
      topImprovements.push('Publish at least one technical post per week on your project updates.');
    }

    // 5. Query LLM for custom suggestions if key present (else fallback)
    let aiSuggestions = null;
    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey && !apiKey.startsWith('your_')) {
      try {
        const aiPrompt = `
          You are a professional career optimizer. Provide highly personalized recommendations based on the details:
          - Target Career Path: ${targetRole}
          - GitHub Bio: "${githubResult?.bio || 'None'}"
          - Tech Stack on GitHub: ${(githubResult?.languagesUsed || []).join(', ')}
          - Repositories: ${(githubResult?.scannedReposList || []).map(r => r.name).join('; ')}
          - LinkedIn Headline: "${linkedinDetails.headline || 'None'}"
          - LinkedIn About: "${linkedinDetails.about || 'None'}"
          - LinkedIn Skills: ${(linkedinDetails.skills || []).join(', ')}
          
          Provide a JSON object containing:
          1. "headline": An optimized headline using pipes "|" and role keywords.
          2. "about": A professional About summary (150 words) mentioning their skills and projects.
          3. "recommendedProjects": Array of 2 new custom projects they should build (with "title", "techStack", "features").
          4. "portfolioEnhancementPlan": Array of 4 weekly items (with "week", "action").
          
          Only return the JSON object matching:
          {
            "headline": "...",
            "about": "...",
            "recommendedProjects": [{ "title": "...", "techStack": "...", "features": "..." }],
            "portfolioEnhancementPlan": [{ "week": "Week 1: title", "action": "..." }]
          }
        `;

        const aiResponse = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: 'You are a career planner. Output JSON only.' },
              { role: 'user', content: aiPrompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 15000
          }
        );

        const content = aiResponse?.data?.choices?.[0]?.message?.content || '';
        aiSuggestions = JSON.parse(content);
      } catch (err) {
        console.error('Groq suggestions call failed:', err.message);
      }
    }

    if (!aiSuggestions) {
      aiSuggestions = {
        headline: linkedinResult.headline.improvedSuggestions[0] || 'Software Engineer | React | Node.js | Database Developer',
        about: linkedinResult.about.improvedVersion,
        recommendedProjects: (linkedinResult.projectsAnalysis?.recommended || []).slice(0, 2).map((projTitle, idx) => ({
          title: projTitle,
          techStack: targetRole.includes('Java') ? 'Spring Boot, Hibernate, MySQL' : 'Node.js, Express, MongoDB/PostgreSQL',
          features: idx === 0 
            ? 'User session authentication (JWT), database schemas, CRUD forms, and responsive layouts.' 
            : 'Real-time WebSocket integrations, analytical data aggregation widgets, and cloud deployments.'
        })),
        portfolioEnhancementPlan: [
          { week: 'Week 1: Search Optimization', action: `Integrate missing keywords (${(linkedinResult.keywords?.missing || []).slice(0, 4).join(', ') || 'React, API'}) into headline and summary.` },
          { week: 'Week 2: Repository READMEs', action: 'Write clean README files for top repositories containing setup instructions, schemas, and live links.' },
          { week: 'Week 3: Deployment & Hosting', action: 'Host client pages on Vercel/Netlify, API services on Render, and insert hyperlinks into GitHub cards.' },
          { week: 'Week 4: Recruiter Connection', action: 'Draft custom connection invites and share weekly coding logs on your LinkedIn feed.' }
        ]
      };
    }

    // Assemble the complete dashboard payload
    const dashboardPayload = {
      roleReadiness,
      strengths: strengths.slice(0, 6),
      weaknesses: weaknesses.slice(0, 6),
      missingItems: missingItems.slice(0, 6),
      recruiterImpression,
      topImprovements: topImprovements.slice(0, 5),
      recommendedProjects: aiSuggestions.recommendedProjects,
      recommendedCertifications: linkedinResult.certificationsAnalysis?.recommended || [],
      portfolioEnhancementPlan: aiSuggestions.portfolioEnhancementPlan,
      aiHeadline: aiSuggestions.headline,
      aiAbout: aiSuggestions.about
    };

    const finalScores = {
      githubScore: gScore,
      linkedinScore: lScore,
      overallPresenceScore,
      recruiterReadiness: githubResult ? githubResult.recruiterReadiness : linkedinResult.recruiterVisibility,
      portfolioReadiness: githubResult ? githubResult.readmeCheck.score : 0,
      roleAlignmentScore: githubResult ? githubResult.roleAlignmentScore : linkedinResult.keywordOptimizationScore
    };

    // 6. Save in Database
    const savedAnalysis = await PortfolioAnalysis.create({
      userId,
      targetRole,
      githubUrl: githubUrl || '',
      linkedinUrl: linkedinDetails.profileUrl || '',
      screenshotPath,
      scores: finalScores,
      githubDetails: githubResult,
      linkedinDetails: linkedinResult,
      dashboard: dashboardPayload
    });

    res.status(200).json({
      success: true,
      data: savedAnalysis
    });

  } catch (error) {
    console.error('Portfolio Controller overall error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: Get user history list
 */
exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await PortfolioAnalysis.find({ userId })
      .select('_id targetRole scores createdAt githubUrl linkedinUrl screenshotPath')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Get User History error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: Get specific scan detail
 */
exports.getHistoryDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const scanId = req.params.id;

    const scan = await PortfolioAnalysis.findOne({ _id: scanId, userId });
    if (!scan) {
      return res.status(404).json({ error: 'Scan record not found or access denied.' });
    }

    res.status(200).json({
      success: true,
      data: scan
    });
  } catch (error) {
    console.error('Get Scan Detail error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: Delete specific scan
 */
exports.deleteHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const scanId = req.params.id;

    const scan = await PortfolioAnalysis.findOne({ _id: scanId, userId });
    if (!scan) {
      return res.status(404).json({ error: 'Scan record not found or access denied.' });
    }

    // Delete uploaded screenshot file if it exists
    if (scan.screenshotPath) {
      const fullPath = path.join(__dirname, '..', scan.screenshotPath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await PortfolioAnalysis.deleteOne({ _id: scanId });

    res.status(200).json({
      success: true,
      message: 'Scan history record deleted successfully.'
    });
  } catch (error) {
    console.error('Delete Scan error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
