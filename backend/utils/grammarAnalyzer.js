const COMMON_MISSPELLINGS = {
  hacathon: 'hackathon',
  hithub: 'github',
  expereince: 'experience',
  projecct: 'project',
  certifcation: 'certification',
  intership: 'internship',
  develope: 'develop',
  backendd: 'backend',
  fronted: 'frontend',
  databasee: 'database',
  reponsible: 'responsible',
  achievment: 'achievement',
  managment: 'management',
  programing: 'programming',
  softare: 'software',
  analystt: 'analyst',
  enginer: 'engineer',
  javascrip: 'javascript',
  recruitr: 'recruiter',
  applicaion: 'application',
  developement: 'development',
  responsibilty: 'responsibility',
  libary: 'library',
  enviroment: 'environment',
  implemention: 'implementation',
  utilze: 'utilize',
  technolgy: 'technology',
  frameworks: 'frameworks',
  datbase: 'database'
};

const PROPER_CASING = {
  mongodb: 'MongoDB',
  react: 'React',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  html: 'HTML',
  css: 'CSS',
  nodejs: 'Node.js',
  sql: 'SQL',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  aws: 'AWS',
  redux: 'Redux',
  docker: 'Docker',
  express: 'Express',
  mysql: 'MySQL',
  bootstrap: 'Bootstrap',
  jquery: 'jQuery',
  api: 'API',
  apis: 'APIs'
};

const WEAK_ACTION_VERBS = [
  'did', 'made', 'worked', 'helped', 'assisted', 'took care of', 'responsible for'
];

const getSectionTexts = (text) => {
  const sections = {
    summary: '',
    experience: '',
    projects: '',
    skills: '',
    certifications: ''
  };
  
  const lines = text.split('\n');
  let currentSection = 'summary';
  
  lines.forEach(line => {
    const lowerLine = line.toLowerCase().trim();
    if (/summary|objective|profile|about/i.test(lowerLine)) {
      currentSection = 'summary';
    } else if (/experience|work\s+history|employment|professional\s+background/i.test(lowerLine)) {
      currentSection = 'experience';
    } else if (/projects|personal\s+projects|academic\s+projects/i.test(lowerLine)) {
      currentSection = 'projects';
    } else if (/skills|technologies|technical/i.test(lowerLine)) {
      currentSection = 'skills';
    } else if (/certifications|credentials|licenses/i.test(lowerLine)) {
      currentSection = 'certifications';
    }
    
    sections[currentSection] += line + '\n';
  });
  
  return sections;
};

const grammarAnalyzer = {
  analyze: (text) => {
    const misspellings = [];
    const grammarSuggestions = [];
    let score = 100;

    if (!text) {
      return {
        score: 0,
        misspellings: [],
        grammarSuggestions: ['No text to analyze']
      };
    }

    const sectionsData = getSectionTexts(text);

    // 1. Spell Checking per section
    Object.entries(sectionsData).forEach(([secName, secText]) => {
      const lowerSecText = secText.toLowerCase();
      Object.entries(COMMON_MISSPELLINGS).forEach(([wrong, correct]) => {
        const regex = new RegExp(`\\b${wrong}\\b`, 'g');
        const matches = lowerSecText.match(regex);
        if (matches) {
          misspellings.push({ wrong, correct });
          score -= 10;
          grammarSuggestions.push(`${secName.charAt(0).toUpperCase() + secName.slice(1)} section contains spelling error: "${wrong}" should be corrected to "${correct}".`);
        }
      });
    });

    // 1b. Casing/Capitalization checks for technical terms
    Object.entries(sectionsData).forEach(([secName, secText]) => {
      Object.entries(PROPER_CASING).forEach(([term, proper]) => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        const matches = secText.match(regex);
        if (matches) {
          matches.forEach(match => {
            if (match !== proper && match.toLowerCase() === term.toLowerCase()) {
              const exists = misspellings.some(m => m.wrong === match && m.correct === proper);
              if (!exists) {
                misspellings.push({ wrong: match, correct: proper });
                score -= 3;
                grammarSuggestions.push(`${secName.charAt(0).toUpperCase() + secName.slice(1)} section contains inconsistent casing: "${match}" should be corrected to "${proper}".`);
              }
            }
          });
        }
      });
    });

    // 2. Repeated adjacent words per section
    Object.entries(sectionsData).forEach(([secName, secText]) => {
      const repeated = secText.match(/\b(\w+)\b\s+\1\b/gi);
      if (repeated) {
        repeated.forEach(wordGroup => {
          score -= 5;
          grammarSuggestions.push(`${secName.charAt(0).toUpperCase() + secName.slice(1)} section contains repeated words: "${wordGroup}".`);
        });
      }
    });

    // 3. Weak Action Verbs per section
    Object.entries(sectionsData).forEach(([secName, secText]) => {
      const foundWeak = [];
      WEAK_ACTION_VERBS.forEach(verb => {
        const regex = new RegExp(`\\b${verb}\\b`, 'gi');
        if (regex.test(secText)) {
          foundWeak.push(verb);
          score -= 3;
        }
      });
      if (foundWeak.length > 0) {
        grammarSuggestions.push(`${secName.charAt(0).toUpperCase() + secName.slice(1)} section: Replace weak words/phrases [${foundWeak.join(', ')}] with active verbs (e.g. "spearheaded", "engineered").`);
      }
    });

    // 4. Casing pronoun "I"
    Object.entries(sectionsData).forEach(([secName, secText]) => {
      const lowercaseSelfRef = secText.match(/\bi\b/g);
      if (lowercaseSelfRef) {
        score -= 2;
        grammarSuggestions.push(`${secName.charAt(0).toUpperCase() + secName.slice(1)} section: Personal pronoun "I" should be capitalized.`);
      }
    });

    score = Math.max(10, Math.min(100, score));

    return {
      score,
      misspellings,
      grammarSuggestions
    };
  }
};

module.exports = grammarAnalyzer;
exportSectionTexts = getSectionTexts;
