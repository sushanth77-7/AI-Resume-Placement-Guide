function calculateOverallPresence(linkedinData = {}, githubData = {}) {
  const linkedinScore = linkedinData.overallLinkedInScore || 0;
  const githubScore = githubData.overallGitHubScore || 0;

  // 1. Overall Presence Score
  const overallPresenceScore = Math.round((linkedinScore + githubScore) / 2);

  // 2. Recruiter Readiness Calculation
  const completeness = linkedinData.completeness?.score || 0;
  const keywords = linkedinData.keywords?.score || 0;
  const visibility = linkedinData.recruiterVisibility || 0;
  const recruiterReadiness = Math.round((completeness * 0.4) + (keywords * 0.3) + (visibility * 0.3));

  // 3. Portfolio Readiness Calculation
  const readmes = githubData.readmeScore || 0;
  const quality = githubData.projectQualityScore || 0;
  const strength = githubData.portfolioStrengthScore || 0;
  const portfolioReadiness = Math.round((readmes * 0.3) + (quality * 0.3) + (strength * 0.4));

  // 4. Extract Strengths and Weaknesses
  const strengths = [];
  const weaknesses = [];

  // LinkedIn Checks
  if (linkedinData.headline?.score > 75) {
    strengths.push('Your LinkedIn headline is professionally styled and includes standard delimiters.');
  } else {
    weaknesses.push('Your LinkedIn headline is weak and lacks standard role delimiters or keywords.');
  }

  if (linkedinData.about?.score > 75) {
    strengths.push('Your LinkedIn About summary is detailed, structured, and includes a clear call to action.');
  } else {
    weaknesses.push('Your LinkedIn About summary is incomplete or lacks a dedicated skills section.');
  }

  if (keywords > 70) {
    strengths.push('Excellent keyword alignment on LinkedIn; recruiters can easily locate your profile.');
  } else {
    weaknesses.push('Your profiles are missing critical recruiter search keywords (MERN, SQL, APIs, etc.).');
  }

  // GitHub Checks
  if (githubData.repoCount >= 3) {
    strengths.push(`Good repository quantity (${githubData.repoCount} projects published on GitHub).`);
  } else {
    weaknesses.push('You have very few public repositories. Aim to publish at least 3 distinct projects.');
  }

  if (githubData.namingScore > 80) {
    strengths.push('Repository naming conventions are descriptive and clear.');
  } else {
    weaknesses.push('Some repository names are generic (e.g., "test", "my-app"). Use descriptive titles.');
  }

  if (readmes > 75) {
    strengths.push('Outstanding README documentation detailing setup steps and live URLs.');
  } else {
    weaknesses.push('Your repositories are missing README files, installation guides, or live demo links.');
  }

  if (githubData.projectCategorization?.advanced?.length >= 1) {
    strengths.push('Your GitHub showcases advanced full-stack architectural engineering.');
  } else {
    weaknesses.push('Your GitHub lacks an advanced project showcasing authentication, databases, or deployment.');
  }

  // Fallbacks
  if (strengths.length === 0) {
    strengths.push('You have successfully initialized professional profiles on LinkedIn and GitHub.');
  }
  if (weaknesses.length === 0) {
    weaknesses.push('No critical profile flaws detected. Focus on sharing regular technical posts.');
  }

  return {
    overallPresenceScore,
    recruiterReadiness,
    portfolioReadiness,
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 4)
  };
}

module.exports = {
  calculateOverallPresence
};
