import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import practiceService from '../services/practiceService'

export default function PracticeZone() {
  const [activeSection, setActiveSection] = useState('overview') // 'overview', 'aptitude', 'coding', 'history'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Dashboard Analytics States
  const [analytics, setAnalytics] = useState(null)
  const [aptitudeAttempts, setAptitudeAttempts] = useState([])
  const [codingAttempts, setCodingAttempts] = useState([])

  // Selection configurations
  const [selectedAptDifficulty, setSelectedAptDifficulty] = useState('Easy')
  const [selectedCodDifficulty, setSelectedCodDifficulty] = useState('Easy')

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const [analyticsData, aptHistData, codHistData] = await Promise.all([
        practiceService.getPerformanceAnalytics(),
        practiceService.getAptitudeHistory(),
        practiceService.getCodingHistory()
      ])

      setAnalytics(analyticsData.analytics)
      setAptitudeAttempts(aptHistData.attempts || [])
      setCodingAttempts(codHistData.attempts || [])
      setLoading(false)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err.message || 'Failed to load performance analytics. Please try logging in again.')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading your placement dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    const isAuthErr = error.toLowerCase().includes('token') || error.toLowerCase().includes('auth') || error.toLowerCase().includes('login') || !localStorage.getItem('token')
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-red-100 shadow-lg text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h2>
          <p className="text-gray-500 mb-6 leading-relaxed">{error}</p>
          {isAuthErr ? (
            <button onClick={() => navigate('/login')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md">
              Go to Login Page
            </button>
          ) : (
            <button onClick={fetchDashboardData} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md">
              Retry Connection
            </button>
          )}
        </div>
      </div>
    )
  }

  const {
    streak = 0,
    badges = [],
    overallPlacementReadiness = 10,
    aptitude = { totalTests: 0, averagePercentage: 0, averageAccuracy: 0 },
    coding = { totalSubmissions: 0, problemsSolved: 0, averageScore: 0, accuracyPercentage: 0 },
    strengths = [],
    weaknesses = [],
    recentActivityGraph = [],
    recommendations = { weakTopics: [], suggestedAptitudeTests: [], suggestedCodingQuestions: [], learningResources: [], interviewTopics: [] }
  } = analytics || {}

  // Helper to draw custom circular SVG dial
  const renderReadinessDial = (score) => {
    const radius = 70
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (score / 100) * circumference

    return (
      <div className="relative flex flex-col items-center justify-center">
        <svg className="w-44 h-44 transform -rotate-90">
          <circle cx="88" cy="88" r={radius} className="text-slate-100" strokeWidth="12" stroke="currentColor" fill="transparent" />
          <circle cx="88" cy="88" r={radius} className="text-indigo-600 transition-all duration-1000 ease-out" strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-gray-900 tracking-tight">{score}%</span>
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-1">Ready</span>
        </div>
      </div>
    )
  }

  // Draw custom SVG bar chart for Category Accuracy
  const renderCategoryAccuracyBarChart = () => {
    const data = [
      { label: 'Aptitude Avg', value: aptitude.averagePercentage, color: '#2563eb' },
      { label: 'Aptitude Accuracy', value: aptitude.averageAccuracy, color: '#3b82f6' },
      { label: 'Coding Accuracy', value: coding.accuracyPercentage, color: '#4f46e5' },
      { label: 'Avg Code Score', value: coding.averageScore, color: '#6366f1' }
    ]

    return (
      <svg className="w-full h-48" viewBox="0 0 400 200">
        {/* Grid lines */}
        <line x1="40" y1="20" x2="380" y2="20" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="40" y1="70" x2="380" y2="70" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="40" y1="120" x2="380" y2="120" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="40" y1="170" x2="380" y2="170" stroke="#f1f5f9" strokeWidth="1" />

        {/* Y Axis Labels */}
        <text x="30" y="25" fill="#94a3b8" fontSize="10" textAnchor="end">100%</text>
        <text x="30" y="75" fill="#94a3b8" fontSize="10" textAnchor="end">70%</text>
        <text x="30" y="125" fill="#94a3b8" fontSize="10" textAnchor="end">40%</text>
        <text x="30" y="175" fill="#94a3b8" fontSize="10" textAnchor="end">0%</text>

        {/* Bars */}
        {data.map((bar, idx) => {
          const x = 50 + idx * 85
          const barHeight = (bar.value / 100) * 150
          const y = 170 - barHeight
          return (
            <g key={idx} className="group">
              <rect x={x} y={y} width="35" height={barHeight} fill={bar.color} rx="4" className="transition-all duration-500 hover:opacity-85 cursor-pointer" />
              <text x={x + 17.5} y={y - 8} fill="#1e293b" fontSize="11" fontWeight="bold" textAnchor="middle">{bar.value}%</text>
              <text x={x + 17.5} y="188" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">{bar.label}</text>
            </g>
          )
        })}
      </svg>
    )
  }

  // Draw custom SVG Line chart for scores trend
  const renderTrendLineChart = () => {
    if (recentActivityGraph.length === 0) {
      return (
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm italic">
          Complete some practice sessions to unlock your performance trend chart!
        </div>
      )
    }

    const points = recentActivityGraph.map((item, idx) => {
      const x = 40 + idx * (340 / Math.max(1, recentActivityGraph.length - 1))
      const y = 170 - (item.score / 100) * 140
      return { x, y, ...item }
    })

    const pathData = points.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`
    }, '')

    // Add a closed polygon path under the line for the gradient fill
    const fillPathData = points.length > 1
      ? `${pathData} L ${points[points.length - 1].x} 170 L ${points[0].x} 170 Z`
      : ''

    return (
      <svg className="w-full h-48" viewBox="0 0 400 200">
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <line x1="40" y1="30" x2="380" y2="30" stroke="#f8fafc" strokeWidth="1" />
        <line x1="40" y1="100" x2="380" y2="100" stroke="#f8fafc" strokeWidth="1" />
        <line x1="40" y1="170" x2="380" y2="170" stroke="#e2e8f0" strokeWidth="1.5" />

        {points.length > 1 && (
          <>
            <path d={fillPathData} fill="url(#trendGradient)" />
            <path d={pathData} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {points.map((p, idx) => (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="#6366f1" strokeWidth="3" className="cursor-pointer hover:r-7 transition-all" />
            <text x={p.x} y={p.y - 10} fill="#1e293b" fontSize="9" fontWeight="bold" textAnchor="middle">{p.score}%</text>
            <text x={p.x} y="186" fill="#94a3b8" fontSize="8" textAnchor="middle">{p.type[0] + (idx+1)}</text>
          </g>
        ))}
      </svg>
    )
  }

  const startAptitudeTest = () => {
    navigate(`/practice-zone/aptitude/test?difficulty=${selectedAptDifficulty}`)
  }

  const startCodingSession = () => {
    navigate(`/practice-zone/coding/workspace?difficulty=${selectedCodDifficulty}`)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 animate-fadeIn">
      {/* Top Banner */}
      <div className="text-white py-14 shadow-md transition-all" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-[10px] bg-white/20 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                New Sandbox Platform
              </span>
              <h1 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">
                Practice <span className="text-indigo-200">Zone</span>
              </h1>
              <p className="text-blue-100 mt-2 text-sm md:text-base leading-relaxed max-w-xl">
                Master quantitative, logical, and verbal rounds alongside coding test cases. Targeted practice styled for Indian campus placements.
              </p>
            </div>
            
            {/* Streak & Solver mini counters */}
            <div className="flex items-center gap-6 bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="text-center border-r border-white/20 pr-6">
                <span className="block text-2xl">🔥</span>
                <span className="block text-xl font-black mt-1">{streak} Days</span>
                <span className="block text-[10px] text-indigo-200 uppercase font-bold">Daily Streak</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl">⚡</span>
                <span className="block text-xl font-black mt-1">
                  {aptitude.totalTests * 30 + coding.problemsSolved}
                </span>
                <span className="block text-[10px] text-indigo-200 uppercase font-bold">Questions Solved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overall Progress' },
            { id: 'aptitude', label: 'Aptitude Practice' },
            { id: 'coding', label: 'Coding Practice' },
            { id: 'history', label: 'Previous Attempts' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`py-4 px-6 font-semibold text-sm border-b-2 whitespace-nowrap transition-all ${
                activeSection === tab.id
                  ? 'border-indigo-600 text-indigo-700 font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* LOADING ANCHOR / SECTION SWITCHER */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            
            {/* Top Row: Dial, Achievements & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Placement Readiness Dial */}
              <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-between min-h-[280px]">
                <div className="text-center w-full pb-3 border-b border-slate-50">
                  <h3 className="font-extrabold text-gray-900 text-base">Placement Readiness Score</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Weighted metric based on solve speed & correctness</p>
                </div>
                {renderReadinessDial(overallPlacementReadiness)}
                <div className="w-full text-center">
                  <p className="text-xs font-semibold text-slate-600">
                    {overallPlacementReadiness >= 85 
                      ? '🚀 Excellent! You exceed standard TCS/Infosys cutoffs.' 
                      : overallPlacementReadiness >= 65 
                        ? '👍 Good! Keep practicing to secure product-tier company readiness.' 
                        : '💡 Attempt more mock exams to scale your readiness level.'}
                  </p>
                </div>
              </div>

              {/* Achievements & Badges */}
              <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base mb-4 pb-3 border-b border-slate-50">Badges & Achievements</h3>
                  {badges.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
                      <span className="text-4xl">🎖️</span>
                      <p className="text-xs font-semibold mt-2">No achievements unlocked yet.</p>
                      <p className="text-[10px] mt-1">Complete aptitude tests or code solutions to earn badges!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {badges.map((badge, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center space-x-3.5 hover:shadow-sm transition-shadow">
                          <span className="text-3xl">{badge.icon}</span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 text-xs truncate">{badge.title}</h4>
                            <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{badge.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sub Stats Row */}
                <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 mt-6 text-center">
                  <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <span className="block text-lg font-black text-blue-600">{aptitude.totalTests}</span>
                    <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Aptitude Tests</span>
                  </div>
                  <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <span className="block text-lg font-black text-indigo-600">{coding.totalSubmissions}</span>
                    <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Code Attempts</span>
                  </div>
                  <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <span className="block text-lg font-black text-purple-600">{coding.problemsSolved}</span>
                    <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Coding Solved</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category accuracy bar chart */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                <h3 className="font-extrabold text-gray-900 text-base mb-4 pb-3 border-b border-slate-50">Accuracy & Performance Stats</h3>
                <div className="mt-4 flex items-center justify-center">
                  {renderCategoryAccuracyBarChart()}
                </div>
              </div>

              {/* Progress trend line graph */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                <h3 className="font-extrabold text-gray-900 text-base mb-4 pb-3 border-b border-slate-50">Recent History Score Trend</h3>
                <div className="mt-4 flex items-center justify-center">
                  {renderTrendLineChart()}
                </div>
              </div>
            </div>

            {/* Recommendations & Strengths/Weaknesses */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Strengths & Weaknesses */}
              <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 space-y-6">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm mb-3 uppercase tracking-wider text-emerald-600 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                    Strongest Areas
                  </h3>
                  <ul className="space-y-2">
                    {strengths.length > 0 ? (
                      strengths.map((str, idx) => (
                        <li key={idx} className="bg-emerald-50/30 text-emerald-700 text-xs font-semibold px-3.5 py-2 rounded-xl border border-emerald-100/50 flex justify-between items-center">
                          <span>{str.topic || str}</span>
                          <span className="text-[10px] text-emerald-500 font-extrabold">▲ Good</span>
                        </li>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">Strengths will populate as you solve tests.</p>
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm mb-3 uppercase tracking-wider text-rose-500 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
                    Needs Improvement
                  </h3>
                  <ul className="space-y-2">
                    {weaknesses.length > 0 ? (
                      weaknesses.map((wk, idx) => (
                        <li key={idx} className="bg-rose-50/30 text-rose-700 text-xs font-semibold px-3.5 py-2 rounded-xl border border-rose-100/50 flex justify-between items-center">
                          <span>{wk.topic || wk}</span>
                          <span className="text-[10px] text-rose-400 font-extrabold">▼ Focus</span>
                        </li>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">No critical weak topics. Excellent work!</p>
                    )}
                  </ul>
                </div>
              </div>

              {/* Placement Recommendations */}
              <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base mb-4 pb-3 border-b border-slate-50">Automated Smart Recommendations</h3>
                  
                  <div className="space-y-4">
                    {/* Suggested coding problem */}
                    {recommendations.suggestedCodingQuestions?.length > 0 && (
                      <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-indigo-50/30 border border-indigo-100/50">
                        <span className="text-xl mt-0.5">💻</span>
                        <div className="min-w-0 flex-grow">
                          <h4 className="font-bold text-gray-900 text-xs">Recommended Coding Problem</h4>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Solve <span className="font-semibold text-slate-800">"{recommendations.suggestedCodingQuestions[0].title}"</span> ({recommendations.suggestedCodingQuestions[0].topic})
                          </p>
                          <Link to="/practice-zone" onClick={() => setActiveSection('coding')} className="inline-block text-[10px] text-indigo-600 font-bold hover:underline mt-1">
                            Go solve it now &rarr;
                          </Link>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          recommendations.suggestedCodingQuestions[0].difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {recommendations.suggestedCodingQuestions[0].difficulty}
                        </span>
                      </div>
                    )}

                    {/* Suggested Aptitude difficulty test */}
                    {recommendations.suggestedAptitudeTests?.length > 0 && (
                      <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-blue-50/30 border border-blue-100/50">
                        <span className="text-xl mt-0.5">✏️</span>
                        <div className="min-w-0 flex-grow">
                          <h4 className="font-bold text-gray-900 text-xs">Aptitude Refresher Recommended</h4>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Take a <span className="font-semibold text-slate-800">{recommendations.suggestedAptitudeTests[0].difficulty} Aptitude Test</span>.
                          </p>
                          <Link to="/practice-zone" onClick={() => setActiveSection('aptitude')} className="inline-block text-[10px] text-blue-600 font-bold hover:underline mt-1">
                            Start test &rarr;
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Quick interview resources */}
                    <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-purple-50/30 border border-purple-100/50">
                      <span className="text-xl mt-0.5">📖</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-xs">Interview Core Prep Topics</h4>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {recommendations.interviewTopics?.map((topic, i) => (
                            <span key={i} className="text-[10px] bg-purple-100/40 text-purple-700 font-medium px-2 py-0.5 rounded-full border border-purple-100">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video/Resource links */}
                <div className="border-t border-slate-50 pt-4 mt-6 flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-medium">Suggested resources:</span>
                  <div className="flex gap-4">
                    {recommendations.learningResources?.slice(0, 2).map((res, i) => (
                      <a key={i} href={res.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center hover:underline">
                        <span>{res.title}</span>
                        <span className="text-[10px] text-slate-400 font-medium ml-1">({res.type})</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* APTITUDE PRACTICE SECTION */}
        {activeSection === 'aptitude' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Aptitude Mock Round Sandbox</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Simulates real-world recruitment drives conducted by TCS, Infosys, Accenture, Cognizant, and others. Each test generates exactly 30 unique questions matching the selected difficulty level.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { level: 'Easy', time: '30 min', target: 'Service Companies (Wipro, Cognizant)', pct: '80%+ expected' },
                  { level: 'Medium', time: '30 min', target: 'MNCs & Banks (TCS Digital, Accenture)', pct: '70%+ expected' },
                  { level: 'Hard', time: '30 min', target: 'Product Companies (IBM, Deloitte)', pct: '60%+ expected' }
                ].map((item) => (
                  <button
                    key={item.level}
                    onClick={() => setSelectedAptDifficulty(item.level)}
                    className={`text-left p-6 rounded-2xl border-2 transition-all relative ${
                      selectedAptDifficulty === item.level
                        ? 'border-blue-600 bg-blue-50/30'
                        : 'border-slate-100 hover:border-slate-200 bg-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-black text-gray-900">{item.level}</span>
                      <span className="text-xs bg-slate-100 font-extrabold text-slate-600 px-2 py-0.5 rounded">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 leading-snug">{item.target}</p>
                    <p className="text-[10px] text-slate-400 mt-2">Target Cutoff: {item.pct}</p>
                    {selectedAptDifficulty === item.level && (
                      <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600"></span>
                    )}
                  </button>
                ))}
              </div>

              {/* Start Info Panel */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 text-xs text-slate-500 space-y-2">
                <h4 className="font-bold text-gray-800 text-sm mb-2">Round Rules:</h4>
                <p>• Exactly 30 multiple-choice questions will be generated.</p>
                <p>• A countdown timer of 30 minutes starts immediately when you click "Start Test".</p>
                <p>• The "Reset Questions" button is available only BEFORE starting, which shuffles a new set.</p>
                <p>• Auto-submission will trigger when the timer ends.</p>
                <p>• Solutions, shortcut methods, and detailed explanations are generated post-submission.</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={startAptitudeTest}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span>Start Aptitude Mock Test</span>
                  <span>🚀</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CODING PRACTICE SECTION */}
        {activeSection === 'coding' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Coding Placement Sandbox</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Practice DSA questions asked in Indian campus recruitment drives. Each session provides exactly 2 coding problems. Complete them in our interactive IDE featuring multiple language templates.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { level: 'Easy', topics: 'Arrays, Strings, Simple Hashing', target: 'Service & Startup rounds' },
                  { level: 'Medium', topics: 'Sliding Window, Stacks, Trees', target: 'Core Dev & System rounds' },
                  { level: 'Hard', topics: 'DP, Monotonic Queues, Graphs', target: 'Premium Product OA rounds' }
                ].map((item) => (
                  <button
                    key={item.level}
                    onClick={() => setSelectedCodDifficulty(item.level)}
                    className={`text-left p-6 rounded-2xl border-2 transition-all relative ${
                      selectedCodDifficulty === item.level
                        ? 'border-indigo-600 bg-indigo-50/30'
                        : 'border-slate-100 hover:border-slate-200 bg-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-black text-gray-900">{item.level}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 leading-snug">{item.target}</p>
                    <p className="text-[10px] text-indigo-500 font-extrabold mt-3">{item.topics}</p>
                    {selectedCodDifficulty === item.level && (
                      <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-600"></span>
                    )}
                  </button>
                ))}
              </div>

              {/* IDE Info Panel */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 text-xs text-slate-500 space-y-2">
                <h4 className="font-bold text-gray-800 text-sm mb-2">Sandbox Features:</h4>
                <p>• Multi-language editor supporting: C, C++, Java, Python, JavaScript, and C#.</p>
                <p>• Split screen layout with resizable editor and console drawers.</p>
                <p>• "Run Code" executes only visible sample cases.</p>
                <p>• "Submit Code" runs against all hidden inputs and logs score, complexities, and quality reports.</p>
                <p>• "Reset Questions" regenerates two completely new questions of the same difficulty level.</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={startCodingSession}
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span>Open Coding IDE</span>
                  <span>💻</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HISTORY & LOGS SECTION */}
        {activeSection === 'history' && (
          <div className="space-y-10">
            {/* Aptitude Mock Test History */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h3 className="font-extrabold text-gray-900 text-base mb-4 pb-3 border-b border-slate-50">Aptitude Practice History</h3>
              {aptitudeAttempts.length === 0 ? (
                <p className="text-gray-400 text-sm italic text-center py-6">You have not completed any Aptitude Mock Rounds yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-gray-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Difficulty</th>
                        <th className="py-3 px-4">Correct / Total</th>
                        <th className="py-3 px-4">Score %</th>
                        <th className="py-3 px-4">Time Taken</th>
                        <th className="py-3 px-4">Readiness</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {aptitudeAttempts.map((att) => (
                        <tr key={att._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-4 font-semibold text-slate-700">
                            {new Date(att.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                              att.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' : att.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {att.difficulty}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-800">
                            {att.correctAnswersCount} / {att.correctAnswersCount + att.incorrectAnswersCount + att.unansweredCount}
                          </td>
                          <td className="py-4 px-4 font-extrabold text-slate-800">{att.percentage}%</td>
                          <td className="py-4 px-4 text-slate-500">
                            {Math.floor(att.timeTaken / 60)}m {att.timeTaken % 60}s
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-extrabold text-blue-600">{att.campusReadinessScore}%</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Link to={`/practice-zone/aptitude/report/${att._id}`} className="inline-block bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 px-3 py-1 rounded font-bold transition-all">
                              Review Solutions
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Coding Submissions History */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h3 className="font-extrabold text-gray-900 text-base mb-4 pb-3 border-b border-slate-50">Coding Submission History</h3>
              {codingAttempts.length === 0 ? (
                <p className="text-gray-400 text-sm italic text-center py-6">You have not submitted any coding solutions yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-gray-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Problem</th>
                        <th className="py-3 px-4">Lang</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Cases Passed</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4">Complexity</th>
                        <th className="py-3 px-4 text-right">View Code</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {codingAttempts.map((att) => (
                        <tr key={att._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-4 font-semibold text-slate-700">
                            {new Date(att.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <span className="font-bold text-slate-800">{att.problemId?.title || 'Unknown'}</span>
                              <span className="block text-[9px] text-slate-400 font-bold">{att.problemId?.topic}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-slate-600 font-mono uppercase">{att.language}</td>
                          <td className="py-4 px-4">
                            <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                              att.status === 'Passed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {att.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-800">
                            {att.testCasesPassed} / {att.totalTestCases}
                          </td>
                          <td className="py-4 px-4 font-extrabold text-indigo-600">
                            {att.review?.overallCodingScore || 0}%
                          </td>
                          <td className="py-4 px-4 font-mono text-[10px] text-slate-500">
                            T: {att.timeComplexity} | S: {att.spaceComplexity}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => {
                                navigate(`/practice-zone/coding/workspace`, { state: { viewAttempt: att } })
                              }}
                              className="bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 px-3 py-1 rounded font-bold transition-all"
                            >
                              Open Workspace
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
