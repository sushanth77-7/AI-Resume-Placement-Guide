const COMMON_SKILLS = [
  // Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'SQL', 'R', 'Ruby', 'Go', 'Rust', 'Kotlin', 'Swift', 'PHP', 'Bash', 'HTML5', 'CSS3', 'HTML', 'CSS',
  // Frameworks
  'React', 'Spring Boot', 'Express', 'MongoDB', 'Node.js', 'Redux', 'Vue', 'Angular', 'Next.js', 'Django', 'Flask', 'FastAPI', 'NestJS', 'Svelte', 'Bootstrap', 'Tailwind',
  // Databases
  'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Cassandra', 'Neo4j', 'Firebase', 'DynamoDB', 'MariaDB',
  // DevOps
  'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Jenkins', 'GitLab', 'Bitbucket', 'Terraform',
  // Tools
  'Git', 'GitHub', 'Webpack', 'Vite', 'JWT', 'OAuth', 'WebSockets', 'Maven', 'Excel', 'Tableau', 'PowerBI', 'Pandas', 'NumPy', 'Spark', 'Hadoop',
  // Soft Skills
  'Scrum', 'Agile', 'Communication', 'Leadership', 'Collaboration', 'Problem Solving', 'Critical Thinking', 'Time Management'
];

const SKILLS_NORMALIZATION = {
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'node.js': 'Node.js',
  'react': 'React',
  'reactjs': 'React',
  'react.js': 'React',
  'mongo': 'MongoDB',
  'mongodb': 'MongoDB',
  'springboot': 'Spring Boot',
  'spring boot': 'Spring Boot',
  'spring': 'Spring Boot',
  'aws': 'AWS',
  'gcp': 'GCP',
  'azure': 'Azure',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'k8s': 'Kubernetes',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'mysql': 'MySQL',
  'sqlite': 'SQLite',
  'html': 'HTML5',
  'html5': 'HTML5',
  'css': 'CSS3',
  'css3': 'CSS3',
  'tailwind': 'Tailwind',
  'bootstrap': 'Bootstrap',
  'redux': 'Redux',
  'jwt': 'JWT',
  'git': 'Git',
  'github': 'GitHub'
};

const SKILL_CATEGORIES = {
  programmingLanguages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'SQL', 'R', 'Ruby', 'Go', 'Rust', 'Kotlin', 'Swift', 'PHP', 'Bash', 'HTML5', 'CSS3'],
  frontend: ['HTML5', 'CSS3', 'React', 'Redux', 'Vue', 'Angular', 'Next.js', 'Bootstrap', 'Tailwind', 'Svelte', 'Sass', 'HTML', 'CSS'],
  backend: ['Node.js', 'Express', 'Spring Boot', 'Django', 'Flask', 'FastAPI', 'NestJS'],
  frameworks: ['React', 'Spring Boot', 'Express', 'Redux', 'Vue', 'Angular', 'Next.js', 'Django', 'Flask', 'FastAPI', 'NestJS', 'Svelte', 'Bootstrap', 'Tailwind', 'Node.js'],
  databases: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Cassandra', 'Neo4j', 'Firebase', 'DynamoDB', 'MariaDB'],
  cloud: ['AWS', 'Azure', 'GCP', 'Vercel', 'Heroku'],
  devops: ['Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Jenkins', 'GitLab', 'Bitbucket', 'Terraform'],
  tools: ['Git', 'GitHub', 'Webpack', 'Vite', 'JWT', 'OAuth', 'WebSockets', 'Maven', 'Excel', 'Tableau', 'PowerBI', 'Pandas', 'NumPy', 'Spark', 'Hadoop'],
  softSkills: ['Scrum', 'Agile', 'Communication', 'Leadership', 'Collaboration', 'Problem Solving', 'Critical Thinking', 'Time Management'],
  others: []
};

const ROLE_SKILLS = {
  'Frontend Developer': ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind', 'Git', 'Redux', 'Next.js', 'Vite', 'GitHub'],
  'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'SQL', 'PostgreSQL', 'Git', 'Docker', 'AWS', 'Redis', 'JWT'],
  'Java Developer': ['Java', 'Spring Boot', 'SQL', 'Git', 'Docker', 'AWS', 'JUnit', 'Hibernate', 'MySQL'],
  'MERN Stack Developer': ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Git', 'GitHub', 'Redux', 'JWT'],
  'Full Stack Developer': ['React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'PostgreSQL', 'JavaScript', 'TypeScript', 'Git', 'Docker', 'AWS'],
  'Data Analyst': ['SQL', 'Python', 'Excel', 'Tableau', 'PowerBI', 'Pandas', 'NumPy', 'Data Science', 'Statistics'],
  'AI/ML Engineer': ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'NLP', 'Data Science', 'NumPy', 'Pandas', 'Git']
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const containsSkill = (text, skill) => {
  const escapedSkill = escapeRegExp(skill);
  let patternStr = '';
  if (/[+#]$/.test(skill)) {
    patternStr = `(?:^|\\s|[,.;:()|])${escapedSkill}(?:$|\\s|[,.;:()|])`;
  } else {
    patternStr = `\\b${escapedSkill}\\b`;
  }
  const pattern = new RegExp(patternStr, 'i');
  return pattern.test(text);
};

const skillExtractor = {
  extractSkills: async (resumeContent) => {
    try {
      if (!resumeContent) return [];
      
      const text = resumeContent.toLowerCase();
      const extracted = new Set();

      // 1. Explicit checks across the entire document
      COMMON_SKILLS.forEach(skill => {
        if (containsSkill(resumeContent, skill)) {
          extracted.add(skill);
        }
      });

      // Check normalization abbreviations
      Object.keys(SKILLS_NORMALIZATION).forEach(synonym => {
        if (containsSkill(resumeContent, synonym)) {
          extracted.add(synonym);
        }
      });

      // 2. Inferred checks from project/experience phrasing
      if (text.includes('mongoose') || text.includes('aggregation pipeline') || text.includes('document store')) {
        extracted.add('MongoDB');
        extracted.add('Node.js');
      }
      if (text.includes('express routing') || text.includes('router.use') || text.includes('express.json')) {
        extracted.add('Express');
        extracted.add('Node.js');
      }
      if (text.includes('react hooks') || text.includes('use-state') || text.includes('use-effect') || text.includes('virtual dom') || text.includes('jsx')) {
        extracted.add('React');
        extracted.add('JavaScript');
      }
      if (text.includes('pip install') || text.includes('import pandas') || text.includes('import numpy') || text.includes('sklearn')) {
        extracted.add('Python');
      }
      if (text.includes('pom.xml') || text.includes('spring boot') || text.includes('hibernate')) {
        extracted.add('Java');
      }
      if (text.includes('dockerfile') || text.includes('docker-compose') || text.includes('containerized')) {
        extracted.add('Docker');
      }
      if (text.includes('aws s3') || text.includes('ec2 instance') || text.includes('aws lambda')) {
        extracted.add('AWS');
      }
      if (text.includes('github actions') || text.includes('jenkins pipeline') || text.includes('ci/cd pipeline')) {
        extracted.add('CI/CD');
      }
      if (text.includes('rest endpoints') || text.includes('api controller') || text.includes('json response')) {
        extracted.add('JWT');
      }

      // 3. Normalization & Deduplication
      const normalizedList = Array.from(extracted).map(skill => {
        const lower = skill.toLowerCase();
        return SKILLS_NORMALIZATION[lower] || skill;
      });

      return [...new Set(normalizedList)];
    } catch (error) {
      throw new Error(`Failed to extract skills: ${error.message}`);
    }
  },

  getMissingSkills: (detectedSkills, role = 'MERN Stack Developer') => {
    const requiredSkills = ROLE_SKILLS[role] || ROLE_SKILLS['MERN Stack Developer'];
    const normalizedDetected = detectedSkills.map(s => s.toLowerCase());

    return requiredSkills.filter(skill => {
      const skillLower = skill.toLowerCase();
      // Handle equivalents to prevent false negatives
      if (skillLower === 'react' && (normalizedDetected.includes('reactjs') || normalizedDetected.includes('react.js'))) return false;
      if (skillLower === 'node.js' && (normalizedDetected.includes('nodejs') || normalizedDetected.includes('node'))) return false;
      if (skillLower === 'mongodb' && (normalizedDetected.includes('mongo') || normalizedDetected.includes('mongoose'))) return false;
      
      return !normalizedDetected.includes(skillLower);
    });
  },

  normalizeAndCategorize: (skillsList) => {
    const categorized = {
      programmingLanguages: [],
      frontend: [],
      backend: [],
      frameworks: [],
      databases: [],
      cloud: [],
      devops: [],
      tools: [],
      softSkills: [],
      others: []
    };

    const allSkills = [...new Set(skillsList.map(s => {
      const lower = s.toLowerCase();
      return SKILLS_NORMALIZATION[lower] || s;
    }))];

    allSkills.forEach(skill => {
      let matched = false;
      for (const [category, list] of Object.entries(SKILL_CATEGORIES)) {
        if (category === 'others') continue;
        if (list.some(item => item.toLowerCase() === skill.toLowerCase())) {
          categorized[category].push(skill);
          matched = true;
          break;
        }
      }
      if (!matched) {
        categorized.others.push(skill);
      }
    });

    return categorized;
  }
};

module.exports = skillExtractor;
