const grammarAnalyzer = require('./grammarAnalyzer');

const ACTION_VERBS = [
  'developed', 'built', 'created', 'designed', 'engineered', 'implemented', 'spearheaded', 'orchestrated',
  'optimized', 'led', 'architected', 'automated', 'scaled', 'debugged', 'pioneered', 'formulated'
];

const WEAK_VERBS = [
  'did', 'made', 'worked', 'helped', 'assisted', 'took care of', 'responsible for'
];

const aiContentDetector = {
  detect: (text) => {
    if (!text) {
      return {
        score: 0,
        probability: 0,
        likelySections: [],
        likelyHumanSections: [],
        warning: false,
        reasoning: 'No text content available to analyze.',
        reasons: []
      };
    }

    const lowerText = text.toLowerCase();
    const grammarResult = grammarAnalyzer.analyze(text);
    const grammarScore = grammarResult.score;

    const matchedActionVerbs = ACTION_VERBS.filter(v => new RegExp(`\\b${v}\\b`, 'i').test(text));
    const matchedWeakVerbs = WEAK_VERBS.filter(v => new RegExp(`\\b${v}\\b`, 'i').test(text));

    const numberMatches = text.match(/\b\d+(%|x|\s*(percent|users|millions|k|ms|s))\b/gi) || [];
    const bulletCount = (text.match(/^[•\-\*]/gm) || []).length;

    let writingScore = 100;
    const explanations = [];

    // 1. Evaluate Spelling & Grammar (30%)
    writingScore -= (100 - grammarScore) * 0.3;
    if (grammarResult.misspellings && grammarResult.misspellings.length > 0) {
      explanations.push(`Contains spelling/casing issues: ${grammarResult.misspellings.slice(0, 3).map(m => `"${m.wrong}"`).join(', ')}.`);
    }

    // 2. Evaluate Action Verbs (25%)
    if (matchedActionVerbs.length >= 6) {
      explanations.push('Excellent action-driven writing style with strong industry-aligned verbs.');
    } else {
      explanations.push(`Lacks strong action verbs (found ${matchedActionVerbs.length} key action verbs). Replace weak descriptions with terms like "pioneered" or "architected".`);
      writingScore -= 15;
    }

    // 3. Avoid Weak Verbs (15%)
    if (matchedWeakVerbs.length > 0) {
      explanations.push(`Contains generic phrasing: [${matchedWeakVerbs.map(w => `"${w}"`).join(', ')}]. Rewrite to use active voice.`);
      writingScore -= Math.min(15, matchedWeakVerbs.length * 4);
    }

    // 4. Quantifiable metrics (15%)
    if (numberMatches.length >= 3) {
      explanations.push('Strong density of quantifiable business outcomes and metrics.');
    } else {
      explanations.push('Achievements are descriptive rather than quantified. Add numerical metrics (e.g. percentages, loading times, cost reductions).');
      writingScore -= 15;
    }

    // 5. Layout readability (15%)
    if (bulletCount > 0) {
      explanations.push('Uses clean bullet structures, which optimizes readability for tracking systems.');
    } else {
      explanations.push('Contains paragraph-heavy blocks. Reorganize descriptions into clear, scannable bullet points.');
      writingScore -= 10;
    }

    writingScore = Math.max(20, Math.min(100, Math.round(writingScore)));
    const warning = writingScore < 60;

    const reasoning = `Professional Writing Review: This resume achieves a writing quality rating of ${writingScore}%. Phrasing is ${writingScore >= 80 ? 'highly professional and ATS-friendly' : 'standard but requires stronger metrics and action verbs'}.`;

    return {
      score: writingScore,
      probability: writingScore, // kept for key compatibility
      likelySections: [],
      likelyHumanSections: [],
      warning,
      reasoning,
      reasons: explanations
    };
  }
};

module.exports = aiContentDetector;
