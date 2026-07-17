const { analyzeGitHubProfile } = require('../backend/utils/githubAnalyzer');
const { analyzeLinkedInProfile } = require('../backend/utils/linkedinAnalyzer');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

async function runTest() {
  console.log('--- Testing LinkedIn Analyzer ---');
  const sampleLinkedin = {
    headline: 'Frontend Engineer | React | Redux | TypeScript',
    about: 'I am a frontend developer specializing in React.js and user interface design. I list my skills here: React, HTML5, CSS3, JavaScript, TypeScript, Tailwind CSS, SASS.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'TypeScript', 'Redux', 'Tailwind CSS'],
    experience: ['Frontend Developer Intern at TechCorp'],
    certifications: ['Meta Frontend Developer'],
    projects: [{ title: 'Responsive Dashboard' }],
    activityLevel: 'Medium'
  };
  
  const linkedinResult = analyzeLinkedInProfile(sampleLinkedin, 'Frontend Developer');
  console.log('LinkedIn score:', linkedinResult.linkedinScore);
  console.log('Recruiter Visibility:', linkedinResult.recruiterVisibility);
  console.log('Completeness:', linkedinResult.profileCompleteness);
  console.log('Keywords Score:', linkedinResult.keywordOptimizationScore);
  console.log('Missing Keywords:', linkedinResult.keywords.missing.slice(0, 3));
  console.log('Suggested Headline:', linkedinResult.headline.improvedSuggestions[0]);

  console.log('\n--- Testing GitHub Analyzer (Using simulation check or public profile) ---');
  try {
    const githubResult = await analyzeGitHubProfile('sushanth-coder', 'Frontend Developer');
    console.log('GitHub Username:', githubResult.username);
    console.log('GitHub Score:', githubResult.githubScore);
    console.log('Quality Score:', githubResult.repoQualityScore);
    console.log('Documentation Score:', githubResult.documentationScore);
    console.log('Portfolio Strength:', githubResult.portfolioStrength);
    console.log('Role Alignment:', githubResult.roleAlignmentScore);
    console.log('Scanned repos count:', githubResult.scannedReposList.length);
    console.log('Activity level:', githubResult.commitActivity);
  } catch (err) {
    console.error('GitHub Analyzer failed:', err.message);
  }
}

runTest();
