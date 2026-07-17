const ACTION_VERBS = [
  'developed', 'built', 'created', 'designed', 'engineered', 'implemented', 'spearheaded', 'orchestrated'
];

const COMPLEXITY_KEYWORDS = [
  'scalability', 'optimized', 'aggregation', 'microservices', 'indexing', 'concurrency', 
  'async', 'security', 'encryption', 'authentication', 'multithreading', 'pipeline', 
  'redis', 'docker', 'kubernetes', 'terraform', 'aws', 'gcp', 'cloud'
];

const IMPACT_KEYWORDS = [
  'users', 'active', 'response time', 'latency', 'reduction', 'cost', 'efficiency', 
  'performance', 'speed', 'automated', 'improved', 'increased', 'decreased'
];

const projectAnalyzer = {
  analyze: (text) => {
    if (!text) {
      return {
        count: 0,
        score: 0,
        quality: 'No content to analyze'
      };
    }

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let count = 0;
    const detectedProjects = [];

    // 1. Check for explicit project markers or section headers
    const projectSectionIndex = lines.findIndex(line => 
      /^(projects?|personal projects|key projects|academic projects)(:|\s|$)/i.test(line)
    );

    if (projectSectionIndex !== -1) {
      let i = projectSectionIndex + 1;
      let currentProject = null;
      
      while (i < lines.length) {
        const line = lines[i];
        
        if (/^(experience|education|skills|certifications|summary|languages|hobbies)(:|\s|$)/i.test(line)) {
          break;
        }

        const isProjectHeader = 
          /^[A-Z][A-Za-z0-9\s-]{3,30}(\s*-\s*|\s*\|\s*|\s*\()([A-Za-z0-9,\s.+/]{3,})/i.test(line) ||
          (line.length < 50 && ACTION_VERBS.some(v => line.toLowerCase().startsWith(v))) ||
          /^(project|app|system|website|platform)\s*\d+/i.test(line);

        if (isProjectHeader) {
          if (currentProject) {
            detectedProjects.push(currentProject);
          }
          currentProject = {
            name: line,
            descriptions: []
          };
          count++;
        } else if (currentProject && (line.startsWith('-') || line.startsWith('*') || line.startsWith('•'))) {
          currentProject.descriptions.push(line);
        }

        i++;
      }
      if (currentProject) {
        detectedProjects.push(currentProject);
      }
    }

    // 2. Heuristic fallback if count is 0
    if (count === 0) {
      lines.forEach(line => {
        const isProjectLine = 
          (/(^|\s)(project|app|system|platform|website)\b/i.test(line) && ACTION_VERBS.some(verb => line.toLowerCase().includes(verb))) ||
          (/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/i.test(line));

        if (isProjectLine) {
          count++;
          detectedProjects.push({ name: line, descriptions: [line] });
        }
      });
    }

    if (count === 0) {
      return {
        count: 0,
        score: 0,
        quality: 'No projects identified. Include 2-3 detailed projects to showcase hands-on skills.'
      };
    }

    // Evaluate Quality Metrics of Project Descriptions
    const descText = detectedProjects.map(p => p.descriptions.join(' ') + ' ' + p.name).join(' ').toLowerCase();

    // A. Tech stack score (up to 30 points)
    const uniqueTechKeywords = ['react', 'node', 'express', 'mongodb', 'sql', 'postgres', 'docker', 'kubernetes', 'aws', 'python', 'java', 'spring', 'typescript', 'javascript', 'html', 'css', 'tailwind', 'redux', 'jwt'];
    let techScore = 0;
    uniqueTechKeywords.forEach(tech => {
      if (descText.includes(tech)) {
        techScore += 6;
      }
    });
    techScore = Math.min(30, techScore);

    // B. Complexity score (up to 30 points)
    let complexityScore = 0;
    COMPLEXITY_KEYWORDS.forEach(kw => {
      if (descText.includes(kw)) {
        complexityScore += 7;
      }
    });
    complexityScore = Math.min(30, complexityScore);

    // C. Business Impact & Outcomes (up to 20 points)
    let impactScore = 0;
    IMPACT_KEYWORDS.forEach(kw => {
      if (descText.includes(kw)) {
        impactScore += 5;
      }
    });
    // Check for numerical metrics (percentages, sizes, response time numbers)
    if (/\b\d+(%|x|\s*(percent|users|millions|k|ms|s))\b/i.test(descText)) {
      impactScore += 10;
    }
    impactScore = Math.min(20, impactScore);

    // D. Documentation & Code Sharing (up to 20 points)
    let docScore = 0;
    if (descText.includes('github.com') || descText.includes('repository') || descText.includes('git')) {
      docScore += 10;
    }
    if (descText.includes('readme') || descText.includes('documentation') || descText.includes('guide') || descText.includes('setup')) {
      docScore += 10;
    }

    // Compute base score
    let baseScore = techScore + complexityScore + impactScore + docScore;

    // Reward technically strong projects even if deployment is missing
    const isStrongTech = techScore >= 18 && complexityScore >= 14;
    const hasDeployment = descText.includes('live') || descText.includes('deploy') || descText.includes('host') || descText.includes('vercel') || descText.includes('heroku') || descText.includes('netlify');
    
    if (isStrongTech && !hasDeployment) {
      baseScore = Math.min(100, baseScore + 15); // Reward tech depth
    }

    baseScore = Math.max(40, Math.min(100, Math.round(baseScore)));

    let quality = 'Moderate. Projects are present but lack quantifiable outcomes or technical complexity metrics.';
    if (baseScore >= 85) {
      quality = 'Excellent. Projects showcase high architectural complexity, technical depth, and documented outcomes.';
    } else if (baseScore >= 70) {
      quality = 'Strong. Projects utilize standard libraries and tools with descriptive details.';
    } else if (baseScore < 55) {
      quality = 'Basic. Projects are simple sandbox prototypes. Add domain-specific microservices or layout optimizations.';
    }

    return {
      count,
      score: baseScore,
      quality
    };
  }
};

module.exports = projectAnalyzer;
