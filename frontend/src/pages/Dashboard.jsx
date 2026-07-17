import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import dashboardService from '../services/dashboardService'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState(null)
  const [quote, setQuote] = useState("Opportunity does not knock, it presents itself when you beat down the door.")
  const [checkedTasks, setCheckedTasks] = useState({})
  
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await dashboardService.getDashboardSummary()
      if (res.success) {
        setSummary(res.summary)
        if (res.summary.aiCoach?.motivationQuote) {
          setQuote(res.summary.aiCoach.motivationQuote)
        }
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to connect to the backend server. Please verify connectivity.')
      setLoading(false)
    }
  }

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  // Task click redirect mapping
  const handleTaskRedirect = (taskTitle) => {
    const title = taskTitle.toLowerCase()
    if (title.includes('resume') || title.includes('ats')) {
      navigate('/resume-analyzer')
    } else if (title.includes('aptitude') || title.includes('test')) {
      navigate('/practice-zone')
    } else if (title.includes('coding') || title.includes('problem') || title.includes('search')) {
      navigate('/practice-zone')
    } else if (title.includes('linkedin') || title.includes('github') || title.includes('portfolio')) {
      navigate('/placement-guide/profile-optimizer')
    } else if (title.includes('interview')) {
      navigate('/placement-guide/interview')
    } else {
      navigate('/placement-guide')
    }
  }

  const toggleTask = (idx) => {
    setCheckedTasks(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading placement preparation summary...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-red-100 shadow-lg text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h2>
          <p className="text-gray-500 mb-6 leading-relaxed">{error}</p>
          <button onClick={fetchSummary} className="px-6 py-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md">
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  const {
    studentName,
    targetRole,
    targetGoalPercentage,
    level,
    xp,
    overallReadinessScore,
    readinessLevel,
    totalPracticeHours,
    stats,
    practiceAnalytics,
    skillsList,
    weeklyActivityGraph,
    recentActivities,
    aiCoach,
    badges
  } = summary || {}

  // SVG Dial
  const radius = 65
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (overallReadinessScore / 100) * circumference

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 animate-fadeIn">
      {/* Top Welcome Panel */}
      <div className="text-white py-14 shadow-md transition-all" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-[10px] bg-white/20 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                PLACEMENT CO-PILOT
              </span>
              <h1 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">
                {getGreeting()}, <span className="text-indigo-200">{studentName || 'Student'}</span>
              </h1>
              <p className="text-indigo-100/90 mt-3 text-sm md:text-base italic leading-relaxed max-w-2xl font-medium">
                "{quote}"
              </p>
            </div>
            
            {/* Streaks mini drawer */}
            <div className="flex items-center gap-6 bg-white/15 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="text-center border-r border-white/20 pr-6">
                <span className="block text-2xl">🔥</span>
                <span className="block text-xl font-black mt-1">{practiceAnalytics?.dailyStreak || 0} Days</span>
                <span className="block text-[9px] text-indigo-200 uppercase font-extrabold tracking-wider">Daily Streak</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl">⚡</span>
                <span className="block text-xl font-black mt-1">Level {level || 1}</span>
                <span className="block text-[9px] text-indigo-200 uppercase font-extrabold tracking-wider">{xp || 0} Total XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="max-w-7xl mx-auto px-4 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Core readiness metrics, AI coach & Tasks */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Readiness Circle & AI explanation */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Gauge */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r={radius} className="text-slate-100" strokeWidth="12" stroke="currentColor" fill="transparent" />
                  <circle cx="80" cy="80" r={radius} className="text-indigo-600 transition-all duration-1000 ease-out" strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-gray-900 tracking-tight">{overallReadinessScore}%</span>
                  <span className="text-[9px] text-indigo-600 font-extrabold uppercase tracking-wider mt-0.5">{readinessLevel}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400 mt-2">Placement Readiness</span>
            </div>
            
            {/* AI Explanation block */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <span className="text-[10px] bg-indigo-50 text-indigo-650 font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                  AI Evaluation
                </span>
                <h3 className="text-xl font-extrabold text-gray-950 mt-2.5">Recruiter Match Insights</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {aiCoach?.aiReadinessExplanation || 'Your resume, aptitude, and code sandboxes have been evaluated. Recruiters look for active profiles with complete detail arrays.'}
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-700">Goal Tracking:</span>
                <div className="flex items-center gap-3.5 mt-1.5">
                  <span className="text-xs font-extrabold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                    {targetRole}
                  </span>
                  <div className="flex-grow h-2 bg-slate-150 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${targetGoalPercentage}%` }}></div>
                  </div>
                  <span className="text-xs font-black text-slate-800">{targetGoalPercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary Cards Grid */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="font-extrabold text-gray-900 text-base pb-3 border-b border-slate-50 mb-6">Performance Summaries</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Resume ATS Score', val: `${stats?.resumeAtsScore || 0}%`, sub: `Grade: ${stats?.resumeGrade || 'N/A'}`, color: 'text-blue-600', icon: '📄' },
                { label: 'GitHub Score', val: `${stats?.githubScore || 0}%`, sub: 'Audit Rating', color: 'text-indigo-600', icon: '🐙' },
                { label: 'LinkedIn Score', val: `${stats?.linkedinScore || 0}%`, sub: 'Recruiter Match', color: 'text-sky-600', icon: '💼' },
                { label: 'Aptitude Average', val: `${stats?.aptitudeAvg || 0}%`, sub: 'Mock Rounds', color: 'text-emerald-600', icon: '✏️' },
                { label: 'Coding Average', val: `${stats?.codingAvg || 0}%`, sub: 'Workspace Rating', color: 'text-purple-600', icon: '💻' },
                { label: 'Profile Complete', val: `${stats?.profileCompleteness || 0}%`, sub: 'Portfolio Details', color: 'text-amber-600', icon: '👤' },
                { label: 'XP Level', val: `Lvl ${level}`, sub: `${xp} Total Points`, color: 'text-rose-600', icon: '⚡' },
                { label: 'Practice Time', val: `${totalPracticeHours || 0} hrs`, sub: 'Total Logged', color: 'text-slate-600', icon: '⏳' }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between items-center text-center">
                  <span className="text-xl mb-1">{item.icon}</span>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.label}</span>
                  <span className={`block text-xl font-black mt-1.5 ${item.color}`}>{item.val}</span>
                  <span className="block text-[9px] text-gray-400 font-semibold mt-0.5">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Career Coach & Today's Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* AI Coach column */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[360px]">
              <div>
                <h3 className="font-extrabold text-gray-950 text-base pb-3 border-b border-slate-50 flex items-center gap-2">
                  <span>🧠</span> AI Career Coach
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-4 italic font-medium">
                  {aiCoach?.careerCoachAdvice || 'Your technical skills show excellent potential. We suggest focusing on quantitative problems and writing clean documentation for your projects.'}
                </p>
                
                {/* Suggestions List */}
                <div className="mt-5 space-y-3.5">
                  {aiCoach?.aiSuggestions?.slice(0, 3).map((sug, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-[10px] font-black uppercase text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded flex-shrink-0 mt-0.5">
                        {sug.category}
                      </span>
                      <p className="text-xs text-slate-600 leading-normal">{sug.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 pt-4 border-t border-slate-50">
                Personalized advice calculated dynamically from your weak modules.
              </div>
            </div>

            {/* Today's Tasks checklist */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[360px]">
              <div>
                <h3 className="font-extrabold text-gray-950 text-base pb-3 border-b border-slate-50 flex items-center justify-between">
                  <span className="flex items-center gap-2">📅 Today's Tasks</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-black">AI Generated</span>
                </h3>
                
                {/* Checklist items */}
                <div className="space-y-3.5 mt-4">
                  {aiCoach?.todaysTasks?.map((task, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={!!checkedTasks[idx]}
                          onChange={() => toggleTask(idx)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 mt-0.5 cursor-pointer"
                        />
                        <div>
                          <p 
                            onClick={() => handleTaskRedirect(task.title)}
                            className={`text-xs font-bold leading-tight cursor-pointer hover:underline ${
                              checkedTasks[idx] ? 'line-through text-slate-400' : 'text-slate-800'
                            }`}
                          >
                            {task.title}
                          </p>
                          <span className="text-[9px] text-slate-400 font-semibold mt-0.5 block">{task.time} estimated</span>
                        </div>
                      </div>
                      
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex-shrink-0 ${
                        task.impact === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {task.impact} Impact
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 pt-4 border-t border-slate-50">
                Click any task details to navigate directly to its corresponding module.
              </div>
            </div>

          </div>

          {/* Practice Analytics Detail Widget */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="font-extrabold text-gray-900 text-base pb-3 border-b border-slate-50 mb-6">Detailed Practice Analytics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <span className="block text-2xl font-black text-blue-600">{practiceAnalytics?.totalAptTests || 0}</span>
                <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">Aptitude Tests</span>
                <span className="block text-[9px] text-emerald-500 font-bold mt-0.5">{practiceAnalytics?.aptitudeAccuracy || 0}% Accuracy</span>
              </div>
              <div className="border-l border-slate-100 pl-4">
                <span className="block text-2xl font-black text-indigo-600">{practiceAnalytics?.problemsSolved || 0}</span>
                <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">Coding Solved</span>
                <span className="block text-[9px] text-emerald-500 font-bold mt-0.5">{practiceAnalytics?.codingAccuracy || 0}% Accuracy</span>
              </div>
              <div className="border-l border-slate-100 pl-4">
                <span className="block text-2xl font-black text-purple-600">{practiceAnalytics?.codingStreak || 0} Days</span>
                <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">Coding Streak</span>
                <span className="block text-[9px] text-purple-400 font-bold mt-0.5">Consecutive Solves</span>
              </div>
              <div className="border-l border-slate-100 pl-4">
                <span className="block text-2xl font-black text-amber-600">{practiceAnalytics?.weeklyProgress || 0}%</span>
                <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">Goal Completeness</span>
                <span className="block text-[9px] text-amber-500 font-bold mt-0.5">{practiceAnalytics?.monthlyProgress || 0}% Monthly progress</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Badges, charts, activities & goals */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Badge & Milestone system */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="font-extrabold text-gray-900 text-base pb-3 border-b border-slate-50 mb-4">Badges & Unlocks</h3>
            
            {/* Badges Cabinet */}
            <div className="grid grid-cols-4 gap-3.5">
              {[
                { id: 'first_resume', title: 'First Resume', icon: '📄', desc: 'Resume scan uploaded' },
                { id: 'resume_expert', title: 'ATS Expert', icon: '📝', desc: 'Resume score 80+' },
                { id: 'linkedin_optimizer', title: 'LinkedIn Opt', icon: '💼', desc: 'LinkedIn score 75+' },
                { id: 'github_expert', title: 'GitHub Expert', icon: '🐙', desc: 'GitHub score 75+' },
                { id: 'aptitude_beginner', title: 'Aptitude Beginner', icon: '✏️', desc: 'First mock round' },
                { id: 'aptitude_master', title: 'Aptitude Master', icon: '🎓', desc: '5+ tests, 80%+' },
                { id: 'coding_beginner', title: 'Coding Begin', icon: '💻', desc: 'First code solved' },
                { id: 'coding_champion', title: 'Coding Champ', icon: '🏆', desc: '5+ code solved' },
                { id: 'streak_7', title: '7-Day Strike', icon: '🔥', desc: 'Streak 7 days' },
                { id: 'streak_30', title: '30-Day Strike', icon: '⚡', desc: 'Streak 30 days' },
                { id: 'problem_solver', title: 'Problem Solver', icon: '🧩', desc: '10+ completed' },
                { id: 'interview_ready', title: 'Interview Ready', icon: '🎤', desc: 'Overall score 75+' },
                { id: 'placement_ready', title: 'Placement Ready', icon: '👑', desc: 'Overall score 85+' }
              ].map((badge) => {
                const isEarned = badges?.some(b => b.id === badge.id)
                return (
                  <div 
                    key={badge.id}
                    className={`h-14 rounded-2xl flex flex-col items-center justify-center relative cursor-help transition-all ${
                      isEarned 
                        ? 'bg-indigo-50 text-indigo-700 scale-100 font-bold border border-indigo-100 shadow-sm' 
                        : 'bg-slate-50 text-slate-350 opacity-40 border border-transparent'
                    }`}
                    title={`${badge.title}: ${badge.desc} (${isEarned ? 'UNLOCKED' : 'LOCKED'})`}
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    {!isEarned && (
                      <span className="absolute bottom-0 right-0 text-[8px] bg-slate-200 text-slate-650 rounded-full w-3.5 h-3.5 flex items-center justify-center">
                        🔒
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
            
            <p className="text-[10px] text-slate-400 mt-4 leading-normal text-center">
              Hover over badge items to inspect details and requirements.
            </p>
          </div>

          {/* Activity distribution chart */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="font-extrabold text-gray-900 text-base mb-4 pb-3 border-b border-slate-50">Weekly Activity Log</h3>
            <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2">
              {weeklyActivityGraph?.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 flex-grow group cursor-pointer">
                  <div className="w-full bg-indigo-50 group-hover:bg-indigo-100 rounded-lg h-28 relative flex items-end justify-center">
                    <div 
                      className="bg-indigo-650 rounded-lg w-full transition-all duration-1000" 
                      style={{ height: `${Math.max(8, item.value)}%` }}
                    ></div>
                    {/* Tooltip */}
                    <span className="absolute -top-6 text-[8px] bg-slate-900 text-white font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.value}%
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Lists */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-5">
            <div>
              <h3 className="font-bold text-emerald-600 text-xs uppercase tracking-wider mb-2.5 flex items-center">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                Strong Areas
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skillsList?.strong?.map((sk, i) => (
                  <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2.5 py-1 rounded-full">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-rose-500 text-xs uppercase tracking-wider mb-2.5 flex items-center">
                <span className="h-2 w-2 rounded-full bg-rose-500 mr-2"></span>
                Needs Focus
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skillsList?.weak?.map((sk, i) => (
                  <span key={i} className="text-[10px] bg-rose-50 text-rose-700 border border-rose-100 font-bold px-2.5 py-1 rounded-full">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming goals panel */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="font-extrabold text-gray-900 text-base pb-3 border-b border-slate-50 mb-4">Upcoming AI Goals</h3>
            <div className="space-y-4">
              {aiCoach?.upcomingGoals?.map((goal, idx) => (
                <div key={idx} className="flex gap-3.5 items-start">
                  <span className="h-5 w-5 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-[10px] font-black text-indigo-650 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-gray-950 text-xs leading-normal">{goal.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{goal.description}</p>
                    <span className="text-[8px] font-extrabold text-emerald-600 uppercase tracking-wider mt-1 block">
                      Expected Impact: {goal.expectedImpact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activities log */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="font-extrabold text-gray-900 text-base pb-3 border-b border-slate-50 mb-4">Recent Activities</h3>
            
            <div className="space-y-4">
              {recentActivities?.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">No logged history. Try uploading a resume or coding!</p>
              ) : (
                recentActivities?.map((act, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">{act.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 leading-tight">{act.text}</p>
                      <span className="text-[9px] text-slate-400 block mt-0.5">
                        {new Date(act.date).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
