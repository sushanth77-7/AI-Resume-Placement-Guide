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

const formatAnalyzer = {
  analyze: (text) => {
    const issues = [];
    let score = 100;

    if (!text) {
      return {
        score: 0,
        issues: ['Resume text is empty'],
        summary: 'No content was found to analyze.'
      };
    }

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const sectionsData = getSectionTexts(text);

    // 1. Spacing problems (double spaces, tabs, trailing space)
    Object.entries(sectionsData).forEach(([secName, secText]) => {
      const doubleSpaces = (secText.match(/[^\S\r\n]{2,}/g) || []).length;
      if (doubleSpaces > 0) {
        issues.push(`${secName.charAt(0).toUpperCase() + secName.slice(1)} section contains ${doubleSpaces} occurrences of double spaces.`);
        score -= Math.min(doubleSpaces * 2, 8);
      }
    });

    // 2. Missing spaces after commas
    Object.entries(sectionsData).forEach(([secName, secText]) => {
      const commaMatches = secText.match(/(\w+,\w+)/g) || [];
      if (commaMatches.length > 0) {
        commaMatches.forEach(match => {
          const parts = match.split(',');
          issues.push(`${secName.charAt(0).toUpperCase() + secName.slice(1)} section: Missing space after comma in "${match}" (should be "${parts[0]}, ${parts[1]}").`);
          score -= 3;
        });
      }
    });

    // 3. Repeated punctuation (e.g. !!, ,,, --, ..)
    Object.entries(sectionsData).forEach(([secName, secText]) => {
      const repeatedMatches = secText.match(/([.,!?;:])\1+/g) || [];
      if (repeatedMatches.length > 0) {
        repeatedMatches.forEach(match => {
          const correct = match[0];
          issues.push(`${secName.charAt(0).toUpperCase() + secName.slice(1)} section: Repeated punctuation "${match}" should be replaced with a single "${correct}".`);
          score -= 4;
        });
      }
    });

    // 4. Irregular Capitalization inside words
    Object.entries(sectionsData).forEach(([secName, secText]) => {
      const words = secText.split(/\s+/);
      const irregularWords = [];
      words.forEach(word => {
        const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        if (/^[a-z]+[A-Z]+[a-z]+/g.test(cleanWord) && !/^(iOS|macOS|jQuery|gRPC|d3|three\.js|chart\.js)$/i.test(cleanWord)) {
          if (!irregularWords.includes(cleanWord)) {
            irregularWords.push(cleanWord);
          }
        }
      });
      if (irregularWords.length > 0) {
        issues.push(`${secName.charAt(0).toUpperCase() + secName.slice(1)} section contains irregular capitalization in words: ${irregularWords.map(w => `"${w}"`).join(', ')}.`);
        score -= Math.min(irregularWords.length * 3, 10);
      }
    });

    // 5. Heading casing inconsistencies (Check if headings are lowercase)
    const targetHeadings = ['summary', 'objective', 'profile', 'experience', 'work history', 'projects', 'personal projects', 'skills', 'certifications', 'education'];
    lines.forEach(line => {
      const clean = line.toLowerCase().trim();
      if (targetHeadings.includes(clean)) {
        if (line === line.toLowerCase() && line.length > 2) {
          const capitalized = line.charAt(0).toUpperCase() + line.slice(1);
          issues.push(`Section heading "${line}" is written in lowercase. Capitalize it as "${capitalized}" or "${line.toUpperCase()}".`);
          score -= 8;
        }
      }
    });

    // 6. Poor sentence structure / long sentences
    Object.entries(sectionsData).forEach(([secName, secText]) => {
      const sentences = secText.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
      let longSentences = 0;
      sentences.forEach(sentence => {
        if (sentence.split(/\s+/).length > 28) {
          longSentences++;
        }
      });
      if (longSentences > 0) {
        issues.push(`${secName.charAt(0).toUpperCase() + secName.slice(1)} section contains ${longSentences} excessively long sentences (over 28 words).`);
        score -= Math.min(longSentences * 2, 8);
      }
    });

    // 7. Headings colon consistency (mixture of "Experience:" and "Projects" without colon)
    let hasColon = false;
    let noColon = false;
    lines.forEach(line => {
      const clean = line.toLowerCase().trim();
      const match = targetHeadings.find(h => clean.startsWith(h));
      if (match) {
        if (line.includes(':')) {
          hasColon = true;
        } else {
          noColon = true;
        }
      }
    });
    if (hasColon && noColon) {
      issues.push('Formatting Inconsistency: Some section headings use colons (e.g. "Experience:") while others do not. Keep heading styles uniform.');
      score -= 5;
    }

    score = Math.max(10, Math.min(100, score));

    if (issues.length === 0 || score >= 90) {
      issues.length = 0;
      issues.push("No significant formatting issues detected");
    }

    let summary = 'Formatting is generally clean and standard.';
    if (score < 85) {
      summary = 'Review layout alignment and double spacings across sections.';
    }

    return {
      score,
      issues,
      summary
    };
  }
};

module.exports = formatAnalyzer;
