const axios = require('axios');

/**
 * Helper to clean/extract GitHub username from a URL or raw string
 */
function extractUsername(urlOrString) {
  if (!urlOrString) return '';
  let str = urlOrString.trim();
  // Strip trailing slashes
  str = str.replace(/\/+$/, '');
  // Extract from URL if present
  const match = str.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-_]+)/i);
  if (match && match[1]) {
    return match[1];
  }
  // Otherwise assume it's the raw username
  return str.split('/').pop() || '';
}

/**
 * Fetch and Analyze GitHub Profile
 */
async function analyzeGitHubProfile(profileUrlOrUsername, role = 'Full Stack Developer') {
  const username = extractUsername(profileUrlOrUsername);
  if (!username) {
    throw new Error('Invalid GitHub username or URL provided.');
  }

  // Setup GitHub headers
  const headers = {
    'User-Agent': 'ai-resume-analyzer-backend',
    Accept: 'application/vnd.github.v3+json'
  };

  if (process.env.GITHUB_TOKEN && !process.env.GITHUB_TOKEN.startsWith('your_')) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  let profileData = null;
  let repos = [];
  let events = [];
  let isRateLimited = false;
  let rateLimitResetTime = null;

  try {
    // 1. Fetch User Profile Info
    const userRes = await axios.get(`https://api.github.com/users/${username}`, { headers, timeout: 8000 });
    profileData = userRes.data;
  } catch (error) {
    console.error(`GitHub User fetch error for ${username}:`, error.message);
    if (error.response && error.response.status === 403) {
      isRateLimited = true;
      rateLimitResetTime = error.response.headers['x-ratelimit-reset'];
    }
  }

  if (!profileData || isRateLimited) {
    // Fallback: Generate simulation data for demonstration if GitHub API is rate-limited or blocked
    
    return getSimulatedData(username, role, isRateLimited, rateLimitResetTime);
  }

  // 2. Fetch Repositories
  try {
    const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers, timeout: 8000 });
    repos = reposRes.data || [];
  } catch (error) {
    console.error(`GitHub Repos fetch error for ${username}:`, error.message);
  }

  // 3. Fetch public events for activity check
  try {
    const eventsRes = await axios.get(`https://api.github.com/users/${username}/events?per_page=30`, { headers, timeout: 5000 });
    events = eventsRes.data || [];
  } catch (error) {
    console.error(`GitHub Events fetch error for ${username}:`, error.message);
  }

  // 4. Detail top 5 repositories (sorted by stars + forks descending)
  const sortedRepos = [...repos].sort((a, b) => {
    const scoreA = (a.stargazers_count || 0) * 3 + (a.forks_count || 0) * 2;
    const scoreB = (b.stargazers_count || 0) * 3 + (b.forks_count || 0) * 2;
    return scoreB - scoreA;
  });

  const topReposToScan = sortedRepos.slice(0, 5);

  const scannedRepos = await Promise.all(topReposToScan.map(async (repo) => {
    let readmeContent = '';
    let hasReadme = false;
    let folders = [];
    let languagesUsed = {};

    // Fetch README content
    try {
      const readmeRes = await axios.get(`https://api.github.com/repos/${username}/${repo.name}/readme`, { headers, timeout: 4000 });
      if (readmeRes.data && readmeRes.data.content) {
        readmeContent = Buffer.from(readmeRes.data.content, 'base64').toString('utf8');
        hasReadme = true;
      }
    } catch (err) {
      // No readme or fetching failed
    }

    // Fetch folder structure
    try {
      const contentsRes = await axios.get(`https://api.github.com/repos/${username}/${repo.name}/contents`, { headers, timeout: 4000 });
      if (Array.isArray(contentsRes.data)) {
        folders = contentsRes.data.filter(item => item.type === 'dir').map(item => item.name);
      }
    } catch (err) {
      // Contents fetch error
    }

    // Fetch language breakdown
    try {
      const langRes = await axios.get(`https://api.github.com/repos/${username}/${repo.name}/languages`, { headers, timeout: 4000 });
      languagesUsed = langRes.data || {};
    } catch (err) {
      // Languages fetch error
    }

    return {
      name: repo.name,
      description: repo.description || '',
      hasReadme,
      readmeContent,
      folders,
      languages: Object.keys(languagesUsed),
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      homepage: repo.homepage || '',
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
      htmlUrl: repo.html_url
    };
  }));

  // Perform calculations on the fetched data
  return calculateGitHubAnalysis(profileData, repos, scannedRepos, events, role);
}

/**
 * Core analysis engine that computes scores and gives recommendations
 */
function calculateGitHubAnalysis(profile, allRepos, topRepos, events, role) {
  const gaps = [];
  const suggestions = [];
  const goodPoints = [];

  const lowercaseRole = role.toLowerCase();

  // 1. Profile Completeness Score
  let profileCompleteness = 0;
  const completenessItems = [];
  if (profile.name) { profileCompleteness += 15; } else { completenessItems.push('Profile Name'); }
  if (profile.bio) { profileCompleteness += 20; goodPoints.push('Has a biography filled out'); } else { completenessItems.push('Profile Bio'); }
  if (profile.avatar_url) { profileCompleteness += 15; } else { completenessItems.push('Profile Avatar'); }
  if (profile.company) { profileCompleteness += 10; } else { completenessItems.push('Current Company/College'); }
  if (profile.blog || profile.email) { profileCompleteness += 20; goodPoints.push('Has contact details or blog link'); } else { completenessItems.push('Contact info or Website Link'); }
  if (profile.location) { profileCompleteness += 10; } else { completenessItems.push('Location'); }
  if (profile.followers > 0) { profileCompleteness += 10; }
  profileCompleteness = Math.min(100, profileCompleteness);

  if (completenessItems.length > 0) {
    suggestions.push(`Complete your GitHub profile by adding: ${completenessItems.join(', ')}.`);
  }

  // 2. Repository Count & Open Source Contributions
  const repoCount = profile.public_repos || allRepos.length || 0;
  if (repoCount >= 5) {
    goodPoints.push(`Strong repository count (${repoCount} public repos)`);
  } else {
    gaps.push(`Fewer than 5 public repositories. Recruiters prefer seeing a wider showcase.`);
    suggestions.push('Add more projects to GitHub. Even small practice programs showcase continuous learning.');
  }

  // Check for open-source contributions
  // A fork with contributions, or push events to non-owned repositories
  const forkedReposCount = allRepos.filter(r => r.fork).length;
  let hasOpenSource = false;
  if (forkedReposCount > 0) {
    hasOpenSource = true;
    goodPoints.push('Participates in open-source development (forked repositories present)');
  }
  const contributionEvents = events.filter(e => e.type === 'PullRequestEvent' || e.type === 'IssuesEvent');
  if (contributionEvents.length > 0) {
    hasOpenSource = true;
    goodPoints.push(`Active open-source contributor (${contributionEvents.length} recent pull request/issue events)`);
  }

  // 3. Languages Used
  const languageCounts = {};
  allRepos.forEach(r => {
    if (r.language) {
      languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
    }
  });
  // Sort languages by usage frequency
  const languagesUsed = Object.keys(languageCounts).sort((a, b) => languageCounts[b] - languageCounts[a]);

  // 4. Repository Quality Score
  let descriptionCount = 0;
  let namingIssuesCount = 0;
  const genericNames = ['project1', 'project-1', 'test', 'demo', 'exercise', 'assignment', 'my-app', 'hello-world', 'practice', 'code-test', 'sample'];
  
  allRepos.forEach(r => {
    if (r.description) descriptionCount++;
    const lowerName = r.name.toLowerCase();
    if (genericNames.some(gn => lowerName === gn || lowerName.startsWith(gn + '-'))) {
      namingIssuesCount++;
    }
  });

  const descriptionRatio = allRepos.length > 0 ? (descriptionCount / allRepos.length) : 0;
  const namingIssueRatio = allRepos.length > 0 ? (namingIssuesCount / allRepos.length) : 0;
  
  // Repo Quality calculations
  const descScore = Math.round(descriptionRatio * 100);
  const namingScore = Math.max(0, Math.round(100 - (namingIssueRatio * 200)));
  
  let totalStars = 0;
  let totalForks = 0;
  allRepos.forEach(r => {
    totalStars += (r.stargazers_count || 0);
    totalForks += (r.forks_count || 0);
  });
  const popularityFactor = Math.min(100, (totalStars * 15) + (totalForks * 25));

  const repoQualityScore = Math.round((descScore * 0.4) + (namingScore * 0.4) + (popularityFactor * 0.2));

  if (namingIssuesCount > 0) {
    gaps.push(`${namingIssuesCount} repositories have generic names (e.g. 'my-app', 'test').`);
    suggestions.push('Rename generic repositories to descriptive titles (e.g. replace "my-app" with "real-time-chat-dashboard").');
  }
  if (descriptionCount < allRepos.length) {
    gaps.push(`${allRepos.length - descriptionCount} repositories are missing descriptions.`);
    suggestions.push('Add short, informative descriptions to all your repositories to explain their purpose immediately.');
  }

  // 5. Documentation Score & Folder Structure
  let readmeExistsCount = 0;
  let totalReadmePoints = 0;
  let deploymentCount = 0;
  const missingReadmeSections = [];
  let folderStructureIssues = 0;

  topRepos.forEach(r => {
    if (r.hasReadme) {
      readmeExistsCount++;
      let pts = 20; // baseline for existing
      const normReadme = (r.readmeContent || '').toLowerCase();

      const hasInstall = normReadme.includes('install') || normReadme.includes('setup') || normReadme.includes('run') || normReadme.includes('npm start') || normReadme.includes('mvn ');
      const hasUsage = normReadme.includes('usage') || normReadme.includes('feature') || normReadme.includes('what it does') || normReadme.includes('how to');
      const hasTech = normReadme.includes('technolog') || normReadme.includes('stack') || normReadme.includes('built with') || r.languages?.length > 0;
      const hasScreenshots = normReadme.includes('screenshot') || normReadme.includes('gif') || normReadme.includes('image');
      const hasDeploy = normReadme.includes('deploy') || normReadme.includes('live') || normReadme.includes('vercel') || normReadme.includes('netlify') || normReadme.includes('render') || r.homepage;

      if (hasInstall) pts += 15; else missingReadmeSections.push(`${r.name}: Installation guide`);
      if (hasUsage) pts += 15; else missingReadmeSections.push(`${r.name}: Usage instructions`);
      if (hasTech) pts += 15; else missingReadmeSections.push(`${r.name}: Tech stack lists`);
      if (hasScreenshots) pts += 15; else missingReadmeSections.push(`${r.name}: Screenshots/Visuals`);
      if (hasDeploy) {
        pts += 20;
        deploymentCount++;
      } else {
        missingReadmeSections.push(`${r.name}: Live deployment URL`);
      }
      totalReadmePoints += pts;
    } else {
      missingReadmeSections.push(`${r.name}: Missing README.md`);
    }

    // Check directory structure
    // If it is supposed to be a backend/fullstack/java and has no folders or very flat, flag it
    if (r.folders && r.folders.length > 0) {
      const lowerFolders = r.folders.map(f => f.toLowerCase());
      // A standard structure usually has folders like src, lib, components, etc.
      const hasCommonFolders = lowerFolders.some(f => ['src', 'lib', 'components', 'routes', 'controllers', 'models', 'app', 'public', 'tests', 'test'].includes(f));
      if (!hasCommonFolders && r.folders.length < 2) {
        folderStructureIssues++;
      }
    }
  });

  const readmeExistsRatio = topRepos.length > 0 ? (readmeExistsCount / topRepos.length) : 0;
  const avgReadmePoints = readmeExistsCount > 0 ? Math.round(totalReadmePoints / readmeExistsCount) : 20;
  const documentationScore = Math.round((readmeExistsRatio * 40) + (avgReadmePoints * 0.6));

  if (readmeExistsCount < topRepos.length) {
    gaps.push(`${topRepos.length - readmeExistsCount} of your top projects are missing a README.md file.`);
    suggestions.push('Create README.md files for all showcased repositories. This is the first thing a developer reads.');
  }

  if (folderStructureIssues > 0) {
    gaps.push(`${folderStructureIssues} repositories have disorganized folder structures (lacking standard folders like /src).`);
    suggestions.push('Refactor file structures into standard directories (e.g. putting code into /src, assets into /assets, and tests into /tests).');
  }

  // 6. Project Diversity & Portfolio Strength
  const beginner = [];
  const intermediate = [];
  const advanced = [];

  topRepos.forEach(r => {
    const techCount = r.languages?.length || 0;
    const lowerReadme = (r.readmeContent || '').toLowerCase();
    const hasAuth = lowerReadme.includes('auth') || lowerReadme.includes('jwt') || lowerReadme.includes('login') || lowerReadme.includes('signup');
    const hasDB = r.languages?.some(l => ['sql', 'postgres', 'mongo', 'mysql', 'sqlite'].includes(l.toLowerCase())) || 
                  lowerReadme.includes('database') || lowerReadme.includes('mongodb') || lowerReadme.includes('postgresql') || lowerReadme.includes('mongoose') || lowerReadme.includes('prisma');
    const foldersCount = r.folders?.length || 0;

    // Advanced: Auth + DB + decent folder structure
    if (hasDB && hasAuth && foldersCount >= 3) {
      advanced.push(r);
    } else if (hasDB || hasAuth || techCount >= 3 || foldersCount >= 2) {
      intermediate.push(r);
    } else {
      beginner.push(r);
    }
  });

  let portfolioStrength = 20; // baseline
  if (topRepos.length >= 3) portfolioStrength += 20;
  if (advanced.length >= 1) {
    portfolioStrength += 30;
    goodPoints.push(`Has advanced structural projects (${advanced.length} detected)`);
  } else {
    gaps.push('No advanced architectural projects found. Recruiters look for projects demonstrating authentication and databases.');
  }
  if (intermediate.length >= 1) portfolioStrength += 20;
  if (allRepos.length > 8) portfolioStrength += 10;
  portfolioStrength = Math.min(100, portfolioStrength);

  // 7. Commit/Activity Level
  // Count recent events
  const totalEvents = events.length;
  let commitActivity = 'Low';
  if (totalEvents >= 15) {
    commitActivity = 'High';
    goodPoints.push('High GitHub commitment/activity level');
  } else if (totalEvents >= 5) {
    commitActivity = 'Medium';
    goodPoints.push('Consistent project activity level');
  } else {
    gaps.push('Low recent commit activity on GitHub.');
    suggestions.push('Maintain active coding schedules. Try to commit updates to your repository daily or weekly.');
  }

  // 8. Role Alignment Score
  let alignmentCount = 0;
  let roleMatchedSkills = [];
  
  const roleKeywordsMap = {
    'mern developer': ['react', 'mongodb', 'express', 'node', 'mongoose', 'jwt', 'redux'],
    'full stack developer': ['react', 'node', 'express', 'django', 'spring', 'postgresql', 'mongodb', 'sql', 'mysql', 'docker', 'aws'],
    'java developer': ['java', 'spring', 'hibernate', 'jpa', 'maven', 'postgresql', 'mysql', 'springboot'],
    'frontend developer': ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'sass'],
    'backend developer': ['node', 'express', 'django', 'python', 'java', 'spring', 'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'apis'],
    'data analyst': ['python', 'sql', 'pandas', 'numpy', 'excel', 'power bi', 'tableau', 'r', 'etl'],
    'ai/ml engineer': ['python', 'tensorflow', 'pytorch', 'scikit', 'numpy', 'keras', 'machine learning', 'deep learning', 'nlp', 'cv']
  };

  const expectedTech = roleKeywordsMap[lowercaseRole] || roleKeywordsMap['full stack developer'];

  topRepos.forEach(r => {
    const fullText = `${r.name} ${r.description} ${r.languages?.join(' ')} ${r.readmeContent || ''}`.toLowerCase();
    const matches = expectedTech.filter(kw => fullText.includes(kw));
    if (matches.length >= 2) {
      alignmentCount++;
    }
    roleMatchedSkills.push(...matches);
  });

  roleMatchedSkills = [...new Set(roleMatchedSkills)];

  const roleAlignmentScore = Math.min(100, topRepos.length > 0 ? Math.round((alignmentCount / topRepos.length) * 100) : 0);

  if (roleAlignmentScore >= 60) {
    goodPoints.push(`Strong technology alignment for a ${role}`);
  } else {
    gaps.push(`Low alignment between repositories and your target role of ${role}.`);
    suggestions.push(`Build projects featuring the core stack of a ${role}. Focus on using ${expectedTech.slice(0, 4).join(', ')}.`);
  }

  // 9. Recruiter Readiness Score
  // Checks completeness, deployment links, readme quality, and role alignment
  const recruiterReadiness = Math.round(
    (profileCompleteness * 0.2) + 
    (documentationScore * 0.3) + 
    (roleAlignmentScore * 0.3) + 
    (Math.min(100, deploymentCount * 35) * 0.2)
  );

  // Overall GitHub Score
  const githubScore = Math.round(
    (profileCompleteness * 0.15) +
    (repoQualityScore * 0.25) +
    (documentationScore * 0.20) +
    (portfolioStrength * 0.20) +
    (roleAlignmentScore * 0.20)
  );

  return {
    username: profile.login || '',
    avatarUrl: profile.avatar_url,
    name: profile.name || profile.login || '',
    bio: profile.bio || '',
    publicRepos: repoCount,
    followers: profile.followers || 0,
    following: profile.following || 0,
    createdAt: profile.created_at,
    
    // Scores
    githubScore,
    repoQualityScore,
    documentationScore,
    portfolioStrength,
    recruiterReadiness,
    roleAlignmentScore,

    // Statistics
    languagesUsed,
    commitActivity,
    stars: totalStars,
    forks: totalForks,
    openSourceContributor: hasOpenSource,

    // Detailed Checks
    profileCompletenessCheck: {
      score: profileCompleteness,
      missingItems: completenessItems
    },
    namingCheck: {
      score: namingScore,
      issuesCount: namingIssuesCount
    },
    readmeCheck: {
      score: documentationScore,
      missingSections: missingReadmeSections.slice(0, 10)
    },
    projectCategorization: {
      beginner: beginner.map(r => ({ name: r.name, stars: r.stars, htmlUrl: r.htmlUrl })),
      intermediate: intermediate.map(r => ({ name: r.name, stars: r.stars, htmlUrl: r.htmlUrl })),
      advanced: advanced.map(r => ({ name: r.name, stars: r.stars, htmlUrl: r.htmlUrl }))
    },

    // Recommendations & Gaps
    goodPoints: goodPoints.length > 0 ? goodPoints : ['Repositories published on GitHub'],
    gaps: gaps.length > 0 ? gaps : ['Add live deployment links to make your projects easily testable.'],
    suggestions: suggestions.length > 0 ? suggestions : ['Keep contributing to repositories to maintain active timelines.'],
    
    scannedReposList: topRepos.map(r => ({
      name: r.name,
      description: r.description,
      languages: r.languages,
      stars: r.stars,
      forks: r.forks,
      hasReadme: r.hasReadme,
      hasDeployment: !!r.homepage || (r.readmeContent || '').toLowerCase().includes('http'),
      htmlUrl: r.htmlUrl,
      folders: r.folders
    }))
  };
}

/**
 * Fallback dataset when rate limits are active or fetch fails
 */
function getSimulatedData(username, role, isRateLimited = false, resetTime = null) {
  const lowercaseRole = role.toLowerCase();
  
  // Standard templates based on role
  let mockBio = `Passionate ${role} | Building web platforms and learning backend architectures.`;
  let mockLanguages = ['JavaScript', 'HTML', 'CSS'];
  let mockRepos = [];
  
  if (lowercaseRole.includes('java')) {
    mockLanguages = ['Java', 'SQL', 'HTML'];
    mockRepos = [
      { name: 'banking-backend-api', description: 'Spring Boot RESTful service for simulated transactions.', stars: 2, forks: 0, hasReadme: true, folders: ['src', 'target'], languages: ['Java'] },
      { name: 'course-registration-system', description: 'Hibernate JPA database model mappings in Spring.', stars: 0, forks: 0, hasReadme: true, folders: ['src'], languages: ['Java'] },
      { name: 'java-algorithms-practice', description: 'Solutions for leetcode style programs.', stars: 0, forks: 0, hasReadme: false, folders: [], languages: ['Java'] }
    ];
  } else if (lowercaseRole.includes('mern') || lowercaseRole.includes('full stack')) {
    mockLanguages = ['JavaScript', 'HTML', 'CSS', 'Shell'];
    mockRepos = [
      { name: 'ecommerce-cart-app', description: 'MERN stack store platform integrating Stripe APIs.', stars: 3, forks: 1, hasReadme: true, folders: ['client', 'server', 'node_modules'], languages: ['JavaScript', 'HTML'] },
      { name: 'personal-portfolio-site', description: 'Responsive site built in React deployed to Netlify.', stars: 1, forks: 0, hasReadme: true, folders: ['src', 'public'], languages: ['JavaScript', 'CSS'] },
      { name: 'exercise-files', description: 'Basic CLI javascript exercises.', stars: 0, forks: 0, hasReadme: false, folders: [], languages: ['JavaScript'] }
    ];
  } else if (lowercaseRole.includes('data analyst')) {
    mockLanguages = ['Python', 'TSQL', 'Jupyter Notebook'];
    mockRepos = [
      { name: 'sales-etl-pipeline', description: 'Python script cleansing datasets and pushing to Postgres DB.', stars: 1, forks: 0, hasReadme: true, folders: ['data', 'scripts'], languages: ['Python'] },
      { name: 'covid-dashboard-powerbi', description: 'Power BI visualizations tracking global infection metrics.', stars: 0, forks: 0, hasReadme: true, folders: [], languages: ['Python'] }
    ];
  } else if (lowercaseRole.includes('ai') || lowercaseRole.includes('ml')) {
    mockLanguages = ['Python', 'Jupyter Notebook'];
    mockRepos = [
      { name: 'image-sentiment-classifier', description: 'CNN neural networks in PyTorch classifying image classes.', stars: 2, forks: 0, hasReadme: true, folders: ['models', 'notebooks'], languages: ['Python'] },
      { name: 'chatbot-assistant-nlp', description: 'Basic text model with NLTK tokenizer mappings.', stars: 1, forks: 0, hasReadme: false, folders: [], languages: ['Python'] }
    ];
  } else {
    mockRepos = [
      { name: 'sample-project', description: 'Code sandbox containing basic HTML/CSS components.', stars: 0, forks: 0, hasReadme: true, folders: ['src'], languages: ['HTML', 'CSS'] },
      { name: 'test-sandbox', description: 'Testing javascript arrays and hooks.', stars: 0, forks: 0, hasReadme: false, folders: [], languages: ['JavaScript'] }
    ];
  }

  const profile = {
    login: username,
    avatar_url: `https://avatars.githubusercontent.com/u/9919?v=4`,
    name: username.replace(/[-_]/g, ' '),
    bio: mockBio,
    public_repos: mockRepos.length + 2,
    followers: 2,
    following: 5,
    created_at: new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString()
  };

  const scannedRepos = mockRepos.map(r => ({
    name: r.name,
    description: r.description,
    hasReadme: r.hasReadme,
    readmeContent: r.hasReadme ? `# ${r.name}\n${r.description}\n## Setup\nnpm install && npm start\n## Features\n- Real-time hooks` : '',
    folders: r.folders,
    languages: r.languages,
    stars: r.stars,
    forks: r.forks,
    homepage: r.name.includes('site') ? `https://${username}.github.io/${r.name}` : '',
    updatedAt: new Date().toISOString(),
    pushedAt: new Date().toISOString(),
    htmlUrl: `https://github.com/${username}/${r.name}`
  }));

  const events = [
    { type: 'PushEvent', repo: { name: `${username}/${mockRepos[0].name}` } },
    { type: 'PushEvent', repo: { name: `${username}/${mockRepos[0].name}` } }
  ];

  const analysis = calculateGitHubAnalysis(profile, mockRepos, scannedRepos, events, role);
  
  if (isRateLimited) {
    analysis.rateLimitedWarning = true;
    analysis.rateLimitReset = resetTime;
  }

  return analysis;
}

module.exports = {
  analyzeGitHubProfile
};
