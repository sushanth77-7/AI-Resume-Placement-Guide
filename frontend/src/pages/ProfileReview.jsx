import React, { useState, useEffect } from 'react';
import profileOptimizerService from '../services/profileOptimizerService';
import LinkedInAnalyzer from '../components/LinkedInAnalyzer';
import GitHubAnalyzer from '../components/GitHubAnalyzer';
import PortfolioDashboard from '../components/PortfolioDashboard';
import ImprovementSuggestions from '../components/ImprovementSuggestions';
import PortfolioHistory from '../components/PortfolioHistory';

export default function ProfileReview() {
  const [viewMode, setViewMode] = useState('scan'); // 'scan' | 'history'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'linkedin' | 'github' | 'suggestions'
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [githubUrl, setGithubUrl] = useState('sushanth-coder');
  const [error, setError] = useState('');
  const [historyList, setHistoryList] = useState([]);

  // Demo initial state to avoid blank inputs on initial load
  const [formData, setFormData] = useState({
    linkedin: {
      profileUrl: 'https://linkedin.com/in/sushanth-coder',
      headline: 'Computer Science Student at ABC College | Python | JavaScript',
      about: 'I am a CS student passionate about programming and building web applications. I have built a few HTML projects and want to learn databases.',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'Python'],
      experience: ['Web Developer Intern at local startup'],
      projects: [{ title: 'Personal Portfolio' }],
      certifications: ['Intro to CS Certificate'],
      education: ['B.Tech in Computer Science & Engineering'],
      achievements: ['College Hackathon Runner-up'],
      activityLevel: 'Low'
    }
  });

  const roles = [
    'MERN Developer',
    'Full Stack Developer',
    'Java Developer',
    'Frontend Developer',
    'Backend Developer',
    'Data Analyst',
    'AI/ML Engineer'
  ];

  // Fetch History List
  const loadHistory = async () => {
    try {
      const res = await profileOptimizerService.getHistory();
      if (res && res.success) {
        setHistoryList(res.history || []);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err.message);
    }
  };

  // Trigger analysis
  const runAnalysis = async (payload) => {
    try {
      setLoading(true);
      setError('');
      
      let dataToSend;
      
      // If payload is already FormData (from LinkedIn screenshot upload)
      if (payload instanceof FormData) {
        dataToSend = payload;
        // Also append GitHub URL to LinkedIn form data if present
        if (githubUrl && !dataToSend.has('githubUrl')) {
          dataToSend.append('githubUrl', githubUrl);
        }
      } else {
        // Standard text/github analyze click triggers
        dataToSend = {
          githubUrl: githubUrl,
          linkedinDetails: payload || formData.linkedin,
          targetRole: selectedRole
        };
      }

      const result = await profileOptimizerService.analyzeProfiles(dataToSend);
      if (result.success) {
        setAnalysisResult(result.data);
        setViewMode('scan');
        setActiveTab('dashboard');
        // Reload history so the new scan is visible
        loadHistory();
      } else {
        setError(result.error || 'Failed to analyze profiles.');
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message || 'An error occurred while connecting to the server. Please ensure the backend server is running and you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  // Load history item details
  const handleLoadPastScan = async (scanId) => {
    try {
      setLoading(true);
      setError('');
      const res = await profileOptimizerService.getHistoryDetail(scanId);
      if (res && res.success && res.data) {
        setAnalysisResult(res.data);
        setSelectedRole(res.data.targetRole);
        setGithubUrl(res.data.githubUrl || '');
        
        // Populate inputs back to form fields if possible
        if (res.data.linkedinDetails) {
          setFormData(prev => ({
            ...prev,
            linkedin: {
              ...prev.linkedin,
              ...res.data.linkedinDetails
            }
          }));
        }

        setViewMode('scan');
        setActiveTab('dashboard');
      } else {
        setError('Failed to load past audit details.');
      }
    } catch (err) {
      console.error('Failed loading scan detail:', err.message);
      setError('Connection failed. Could not fetch historical audit.');
    } finally {
      setLoading(false);
    }
  };

  // Delete past scan
  const handleDeletePastScan = async (scanId) => {
    if (!window.confirm('Are you sure you want to delete this scan result?')) return;
    try {
      setLoading(true);
      const res = await profileOptimizerService.deleteHistory(scanId);
      if (res && res.success) {
        // If current active report is deleted, clear it
        if (analysisResult && analysisResult._id === scanId) {
          setAnalysisResult(null);
        }
        loadHistory();
      }
    } catch (err) {
      console.error('Failed deleting past scan:', err.message);
      setError('Could not delete history item.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch history list on mount
  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-950 to-slate-950 text-white py-12 px-4 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative z-10 animate-fadeIn">
          <span className="text-xs bg-indigo-500/20 text-indigo-300 font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/30">
            Module 3: Portfolio Optimizer
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mt-4">
            LinkedIn & <span className="text-indigo-400">GitHub Optimizer</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl leading-relaxed font-semibold">
            Evaluate repository structures, deploy status, LinkedIn photo styling, and keyword density. Compare scores historically over time.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Global Navigation - Audit vs History */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setViewMode('scan')}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition-all ${
              viewMode === 'scan' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🔎 Profile Audit Scanner
          </button>
          <button
            onClick={() => {
              setViewMode('history');
              loadHistory();
            }}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
              viewMode === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🗄️ Audit History ({historyList.length})
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs md:text-sm font-semibold p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
            <button onClick={() => setError('')} className="text-rose-500 hover:text-rose-700 font-extrabold text-[10px] px-2.5 py-1 bg-white rounded-lg border border-rose-100 transition-all uppercase">Dismiss</button>
          </div>
        )}

        {viewMode === 'scan' ? (
          <>
            {/* Role Selector Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <span>🎯</span> Target Engineering Path
                </h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Select your target career path to compare matching keyword density and directory structure alignment.
                </p>
              </div>
              
              <div className="w-full md:w-72">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl font-bold text-sm bg-white cursor-pointer"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sub Tabs Switcher */}
            <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm max-w-3xl overflow-x-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex-1 py-3 px-5 font-bold text-xs md:text-sm rounded-xl transition-all whitespace-nowrap ${
                  activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                📊 Portfolio Dashboard
              </button>
              
              <button
                onClick={() => setActiveTab('linkedin')}
                className={`flex-1 py-3 px-5 font-bold text-xs md:text-sm rounded-xl transition-all whitespace-nowrap ${
                  activeTab === 'linkedin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                🔗 LinkedIn Reviewer
              </button>

              <button
                onClick={() => setActiveTab('github')}
                className={`flex-1 py-3 px-5 font-bold text-xs md:text-sm rounded-xl transition-all whitespace-nowrap ${
                  activeTab === 'github' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                🐙 GitHub Scanner
              </button>

              <button
                onClick={() => setActiveTab('suggestions')}
                className={`flex-1 py-3 px-5 font-bold text-xs md:text-sm rounded-xl transition-all whitespace-nowrap ${
                  activeTab === 'suggestions' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                🚀 Action Roadmap
              </button>
            </div>

            {/* Dynamic Tabs Content */}
            <div>
              {activeTab === 'dashboard' && (
                <PortfolioDashboard analysisResult={analysisResult} />
              )}

              {activeTab === 'linkedin' && (
                <LinkedInAnalyzer
                  linkedinData={analysisResult?.linkedin}
                  formData={formData}
                  setFormData={setFormData}
                  loading={loading}
                  onAnalyze={runAnalysis}
                  selectedRole={selectedRole}
                />
              )}

              {activeTab === 'github' && (
                <GitHubAnalyzer
                  githubData={analysisResult?.github}
                  githubUrl={githubUrl}
                  setGithubUrl={setGithubUrl}
                  loading={loading}
                  onAnalyze={() => runAnalysis()}
                  selectedRole={selectedRole}
                />
              )}

              {activeTab === 'suggestions' && (
                <ImprovementSuggestions analysisResult={analysisResult} />
              )}
            </div>
          </>
        ) : (
          <PortfolioHistory
            historyList={historyList}
            onLoadScan={handleLoadPastScan}
            onDeleteScan={handleDeletePastScan}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
