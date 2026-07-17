const { analyzeLinkedInProfile } = require('../utils/linkedinAnalyzer');
const { analyzeGitHubProfile } = require('../utils/githubAnalyzer');
const { calculateOverallPresence } = require('../utils/profileScorer');
const { getSuggestionsForRole } = require('../utils/roleSuggestionEngine');

exports.analyzeProfiles = async (req, res) => {
  try {
    const { linkedinDetails = {}, githubRepos = [], targetRole = 'Full Stack Developer' } = req.body;

    const linkedinData = analyzeLinkedInProfile(linkedinDetails, targetRole);
    const githubData = analyzeGitHubProfile(githubRepos, targetRole);
    const scoreData = calculateOverallPresence(linkedinData, githubData);

    res.status(200).json({
      success: true,
      linkedin: linkedinData,
      github: githubData,
      scores: scoreData,
      role: targetRole
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRoleSuggestions = async (req, res) => {
  try {
    const { role } = req.params;
    if (!role) {
      return res.status(400).json({ error: 'Role parameter is required' });
    }

    const suggestions = getSuggestionsForRole(role);

    res.status(200).json({
      success: true,
      suggestions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
