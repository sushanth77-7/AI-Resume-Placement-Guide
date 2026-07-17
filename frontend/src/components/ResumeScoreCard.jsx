import React, { useState } from 'react'

export default function ResumeScoreCard({
  score = 0, // ATS Score
  role = 'MERN Stack Developer',
  aiAssistance = {},
  qualityAnalysis = {},
  profileCompleteness = {},
  roleMatch = {},
  recruiterPerspective = {},
  careerRoadmap = {},
  grade = {},
  detectedSkills = [],
  missingSkills = [],
  aiSuggestions = [],
  formatAnalysis = {},
  grammarAnalysis = {},
  projectAnalysis = {},
  internshipAnalysis = {},
  certificationAnalysis = {}
}) {
  const [activeTab, setActiveTab] = useState('overview')

  // Spelled corrections and writing suggestions lists
  const formattingIssuesList = formatAnalysis.issues || qualityAnalysis.formattingIssues || []
  const spellingMistakes = grammarAnalysis.misspellings || []
  const grammarSuggestionsList = grammarAnalysis.grammarSuggestions || []

  // Profile Completeness checklist fallbacks (Summary, Skills, Experience, Projects, Certifications, GitHub, LinkedIn, Portfolio, Achievements, Hackathons)
  const completenessChecks = profileCompleteness.checks || {
    summary: /summary|objective|profile|about/i.test(recruiterPerspective.expectations || ''),
    skills: detectedSkills.length > 0,
    experience: internshipAnalysis?.count > 0 || !recruiterPerspective.concerns?.some(c => c.includes('internships') || c.includes('experience')),
    projects: projectAnalysis?.count > 0 || !recruiterPerspective.concerns?.some(c => c.includes('projects')),
    certifications: certificationAnalysis?.detected?.length > 0 || !recruiterPerspective.concerns?.some(c => c.includes('certifications')),
    github: detectedSkills.length > 3,
    linkedin: detectedSkills.length > 2,
    portfolio: false,
    achievements: false,
    hackathons: false
  }

  const completenessLabels = [
    { key: 'summary', label: 'Summary' },
    { key: 'skills', label: 'Skills' },
    { key: 'experience', label: 'Experience' },
    { key: 'projects', label: 'Projects' },
    { key: 'certifications', label: 'Certifications' },
    { key: 'github', label: 'GitHub Profile' },
    { key: 'linkedin', label: 'LinkedIn Profile' },
    { key: 'portfolio', label: 'Portfolio Link' },
    { key: 'achievements', label: 'Achievements' },
    { key: 'hackathons', label: 'Hackathons' }
  ]

  // Calculated Completeness Score
  const completenessCount = Object.values(completenessChecks).filter(Boolean).length
  const completenessScore = profileCompleteness.score || Math.round((completenessCount / 10) * 100)

  // Quality Breakdown mapping fallbacks (Formatting, Skills, Projects, Experience, Certifications, and Role Alignment)
  const qualityBreakdown = qualityAnalysis.breakdown || {
    formatting: formatAnalysis.score || 75,
    skills: Math.min(100, 30 + detectedSkills.length * 8),
    projects: projectAnalysis.score || 60,
    experience: internshipAnalysis.score || 60,
    certifications: certificationAnalysis.score || 50,
    roleMatch: roleMatch.score || 50
  }

  const qualityLabels = [
    { key: 'formatting', label: 'Formatting' },
    { key: 'skills', label: 'Skills' },
    { key: 'projects', label: 'Projects' },
    { key: 'experience', label: 'Experience' },
    { key: 'certifications', label: 'Certifications' },
    { key: 'roleMatch', label: 'Role Alignment' }
  ]

  // Overall Quality Rating (Qualitative)
  const qualityScore = qualityAnalysis.score || Math.round(
    (qualityBreakdown.formatting * 0.15) +
    (qualityBreakdown.skills * 0.15) +
    (qualityBreakdown.projects * 0.20) +
    (qualityBreakdown.experience * 0.20) +
    (qualityBreakdown.certifications * 0.15) +
    (qualityBreakdown.roleMatch * 0.15)
  )

  const getQualityLabel = (val) => {
    if (val >= 80) return { label: 'Professional', color: 'text-emerald-700 bg-emerald-50 border-emerald-100' }
    if (val >= 60) return { label: 'Standard', color: 'text-amber-700 bg-amber-50 border-amber-100' }
    return { label: 'Needs Review', color: 'text-rose-700 bg-rose-50 border-rose-100' }
  }
  const qualityLabel = getQualityLabel(qualityScore)

  // ATS Score border/background color mapping
  const getATSColor = (val) => {
    if (val >= 80) return 'text-emerald-600 bg-emerald-50/50'
    if (val >= 60) return 'text-amber-600 bg-amber-50/50'
    return 'text-rose-600 bg-rose-50/50'
  }

  const getMetricProgressColor = (val) => {
    if (val >= 80) return 'bg-emerald-500'
    if (val >= 60) return 'bg-amber-500'
    return 'bg-rose-500'
  }

  // Tabs structure
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: 'Skills' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'recruiter', label: 'Recruiter View' },
    { id: 'roadmap', label: 'Roadmap' }
  ]

  return (
    <div className="space-y-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-xl max-w-7xl mx-auto font-sans">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
            Role Match Analysis
          </span>
          <h2 className="text-2xl font-black text-slate-800 mt-2 tracking-tight">{role}</h2>
          <p className="text-slate-400 text-xs mt-1 font-medium">Data-driven scoring matching industry hiring filters.</p>
        </div>

        {/* Grade remarks */}
        <div className="flex items-center gap-4 bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
          <span className="text-[40px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 w-16 h-16 rounded-xl flex items-center justify-center shadow-inner animate-pulse">
            {grade.grade || 'C'}
          </span>
          <div className="max-w-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Overall Grade</span>
            <p className="text-xs font-semibold text-slate-700 leading-snug mt-1">
              {grade.reason || 'Check suggestions below to improve metrics.'}
            </p>
          </div>
        </div>
      </div>

      {/* TOP DASHBOARD (ATS Score, Resume Grade, Role Match, Resume Quality) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* ATS Score */}
        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ATS Score</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-800">{score}%</span>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${getATSColor(score)}`}>
              {score >= 80 ? 'ATS Friendly' : score >= 60 ? 'Moderate' : 'Low compat'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div className="h-1.5 rounded-full bg-indigo-600" style={{ width: `${score}%` }}></div>
          </div>
        </div>

        {/* Resume Grade */}
        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resume Grade</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-indigo-600">{grade.grade || 'C'}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 font-medium">Aggregate grading tier</p>
        </div>

        {/* Role Match */}
        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role Match</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-800">{roleMatch.score || 0}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div className="h-1.5 rounded-full bg-indigo-600" style={{ width: `${roleMatch.score || 0}%` }}></div>
          </div>
        </div>

        {/* Resume Quality */}
        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resume Quality</span>
          <div className="flex items-baseline mt-2">
            <span className={`text-sm font-extrabold px-3 py-1 rounded-xl border ${qualityLabel.color}`}>
              {qualityLabel.label}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 font-medium">Layout, spelling, & section analysis</p>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-100 mt-6 flex overflow-x-auto gap-2 scrollbar-none pb-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-xs font-bold whitespace-nowrap rounded-t-xl transition-all ${
              activeTab === tab.id 
                ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50/25' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-55'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABS CONTAINER */}
      <div className="mt-4 min-h-[380px]">
        
        {/* OVERVIEW TAB (Strengths, Weaknesses, Resume Completeness, Writing Review) */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            
            {/* Strengths, Weaknesses, Writing Review */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Strengths */}
              <div className="bg-emerald-50/20 border border-emerald-100 rounded-2xl p-5">
                <h4 className="text-sm font-black text-emerald-800 flex items-center gap-2 mb-3">
                  ✓ Strengths
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700 leading-snug">
                  {(qualityAnalysis.strengths || []).map((str, idx) => (
                    <li key={idx} className="flex gap-2 items-start font-medium text-emerald-950">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-rose-50/20 border border-rose-100 rounded-2xl p-5">
                <h4 className="text-sm font-black text-rose-800 flex items-center gap-2 mb-3">
                  ✗ Weaknesses
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700 leading-snug">
                  {(recruiterPerspective.concerns || []).map((con, idx) => (
                    <li key={idx} className="flex gap-2 items-start font-medium text-rose-950">
                      <span className="text-rose-400 font-bold">✗</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Writing Review */}
              <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/40">
                <h4 className="text-sm font-bold text-slate-800 mb-2">✍️ Writing Review</h4>
                <p className="text-[11px] text-slate-400 mb-3">Scans spelling, punctuation spacing, repeated words, and weak action verbs in sections.</p>
                
                <div className="space-y-3">
                  {/* Spelling Mistakes */}
                  {spellingMistakes.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {spellingMistakes.map((spell, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-rose-50 border border-rose-100 text-rose-700 text-[10px] rounded-lg">
                          "{spell.wrong}" ➔ <strong className="text-emerald-700">{spell.correct}</strong>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Other writing suggestions */}
                  {grammarSuggestionsList.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {grammarSuggestionsList.map((sugg, idx) => (
                        <li key={idx} className="bg-white border border-slate-100 rounded-xl p-3 flex gap-2 items-start shadow-sm font-medium">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{sugg}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    spellingMistakes.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No spelling or grammar errors identified in the text.</p>
                    )
                  )}
                </div>
              </div>

            </div>

            {/* Resume Completeness Checklist */}
            <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-2">Resume Completeness</h4>
                <p className="text-[11px] text-slate-400 mb-4">Evaluates presence of 10 vital checklist sections.</p>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {completenessLabels.map(item => {
                    const present = completenessChecks[item.key] || false
                    return (
                      <div key={item.key} className="flex justify-between items-center bg-slate-50/50 border border-slate-100 px-3 py-2 rounded-lg text-xs">
                        <span className="font-semibold text-slate-700">{item.label}</span>
                        <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px] ${
                          present ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {present ? 'Present' : 'Missing'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Completeness Score:</span>
                <span className="text-lg font-black text-indigo-600">{completenessScore}%</span>
              </div>
            </div>

          </div>
        )}

        {/* SKILLS TAB (Detected Skills, Missing Skills, Role Requirements) */}
        {activeTab === 'skills' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Detected Skills */}
              <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/30">
                <h4 className="text-xs font-bold text-slate-400 block mb-3 uppercase tracking-wider">
                  Detected Skills ({detectedSkills.length})
                </h4>
                {detectedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {detectedSkills.map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-xs">No technical skills detected.</p>
                )}
              </div>

              {/* Missing Skills */}
              <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/30">
                <h4 className="text-xs font-bold text-slate-400 block mb-3 uppercase tracking-wider">
                  Missing Skills ({missingSkills.length})
                </h4>
                {missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-lg">
                        + {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-xs">All key required skills matched!</p>
                )}
              </div>

            </div>

            {/* Role Requirements */}
            <div className="border border-slate-100 rounded-2xl p-5 bg-white">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Role Skill Requirements for {role}</h4>
              <div className="flex flex-wrap gap-2">
                {(roleMatch.requiredSkills || []).map((skill, idx) => {
                  const isMatched = roleMatch.matchedSkills && roleMatch.matchedSkills.some(s => s.toLowerCase() === skill.toLowerCase())
                  return (
                    <span key={idx} className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
                      isMatched 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}>
                      <span>{isMatched ? '✓' : '○'}</span>
                      <span>{skill}</span>
                    </span>
                  )
                })}
              </div>
            </div>

          </div>
        )}

        {/* ANALYSIS TAB (Formatting Issues, Content Authenticity Review, Resume Quality Breakdown) */}
        {activeTab === 'analysis' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            
            {/* Formatting & Authenticity review */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Content Authenticity Review */}
              <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
                  🤖 Content Authenticity Review
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                  {aiAssistance.reasoning}
                </p>
                
                {aiAssistance.reasons && aiAssistance.reasons.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Observed Patterns</span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {aiAssistance.reasons.map((reason, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Formatting Issues */}
              <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50">
                <h4 className="text-sm font-bold text-slate-800 mb-3">📐 Formatting Issues</h4>
                {formattingIssuesList.length > 0 ? (
                  <ul className="space-y-2 text-xs text-slate-700 max-h-56 overflow-y-auto pr-1">
                    {formattingIssuesList.map((issue, idx) => (
                      <li key={idx} className="bg-white border border-slate-100 rounded-xl p-3 flex gap-2 items-start shadow-sm font-medium">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No formatting issues detected.</p>
                )}
              </div>

            </div>

            {/* Quality Breakdown (6 bars) */}
            <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-2">Resume Quality Breakdown</h4>
                <p className="text-[11px] text-slate-400 mb-4">Detailed rating metrics showing relative score levels.</p>
                
                <div className="grid grid-cols-1 gap-4">
                  {qualityLabels.map(item => {
                    const progress = qualityBreakdown[item.key] || 0
                    return (
                      <div key={item.key} className="space-y-1 text-xs">
                        <div className="flex justify-between font-semibold text-slate-600">
                          <span>{item.label}</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className={`h-2 rounded-full ${getMetricProgressColor(progress)}`} style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* RECRUITER VIEW TAB (Recruiter Perspective, Hiring Strengths, Missing Requirements) */}
        {activeTab === 'recruiter' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            
            {/* Expectations & Strengths */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">Recruiter Expectations</span>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  {recruiterPerspective.expectations || 'Focus on showcasing clean system development methodologies, tech stack combinations, and testing.'}
                </p>
              </div>

              {/* Hiring Strengths */}
              <div className="bg-emerald-50/20 border border-emerald-100 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-emerald-800 block mb-3 uppercase tracking-wider text-xs">
                  ✓ Hiring Strengths (Highlighting Details)
                </h4>
                <ul className="list-disc pl-4 space-y-2 text-xs text-slate-700 font-semibold">
                  {(recruiterPerspective.positivePoints || []).map((point, idx) => <li key={idx}>{point}</li>)}
                </ul>
              </div>

            </div>

            {/* Missing Requirements */}
            <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3">Missing Requirements</h4>
                {recruiterPerspective.concerns && recruiterPerspective.concerns.length > 0 ? (
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    {recruiterPerspective.concerns.map((point, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No gaps or concerns identified.</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase">Hiring Readiness:</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{recruiterPerspective.hiringReadiness || 'Moderate'}</span>
              </div>
            </div>

          </div>
        )}

        {/* ROADMAP TAB (Skills to Learn, Certifications, Projects to Build, Portfolio Improvements) */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Step-by-Step Learning & Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                <span className="font-black text-indigo-700 block mb-2 uppercase tracking-wider text-[10px]">Skills to Learn</span>
                <ul className="space-y-1.5 text-slate-600 list-disc pl-4 font-semibold">
                  {(careerRoadmap.skillsToLearn || []).map((skill, idx) => <li key={idx}>{skill}</li>)}
                </ul>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                <span className="font-black text-indigo-700 block mb-2 uppercase tracking-wider text-[10px]">Certifications</span>
                <ul className="space-y-1.5 text-slate-600 list-disc pl-4 font-semibold">
                  {(careerRoadmap.certificationsToObtain || []).map((cert, idx) => <li key={idx}>{cert}</li>)}
                </ul>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                <span className="font-black text-indigo-700 block mb-2 uppercase tracking-wider text-[10px]">Projects to Build</span>
                <ul className="space-y-1.5 text-slate-600 list-disc pl-4 font-semibold">
                  {(careerRoadmap.projectsToBuild || []).map((project, idx) => <li key={idx}>{project}</li>)}
                </ul>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                <span className="font-black text-indigo-700 block mb-2 uppercase tracking-wider text-[10px]">Portfolio Improvements</span>
                <ul className="space-y-1.5 text-slate-600 list-disc pl-4 font-semibold">
                  {(careerRoadmap.portfolioImprovements || []).map((tweak, idx) => <li key={idx}>{tweak}</li>)}
                </ul>
              </div>

            </div>

            {/* Personalized Recommendations list */}
            <div className="border border-slate-100 rounded-2xl p-5 bg-white">
              <h4 className="text-sm font-bold text-slate-800 mb-4">💡 Personalized Recommendations</h4>
              {aiSuggestions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiSuggestions.map((rec, index) => {
                    const priorityColor = 
                      rec.priority === 'high' ? 'text-rose-700 bg-rose-50 border-rose-100' :
                      rec.priority === 'medium' ? 'text-amber-700 bg-amber-50 border-amber-100' :
                      'text-emerald-700 bg-emerald-50 border-emerald-100';

                    return (
                      <div key={index} className="border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h5 className="font-bold text-slate-800 text-xs leading-snug">{rec.title}</h5>
                            <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${priorityColor}`}>
                              {rec.priority}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs leading-relaxed mb-4">{rec.description}</p>
                        </div>
                        {rec.action && (
                          <div className="text-[10px] text-indigo-600 font-bold border-t border-slate-50 pt-2 flex justify-between items-center">
                            <span>Step:</span>
                            <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded">{rec.action}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-400 italic text-xs text-center py-4">No suggestions recommendations needed.</p>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
