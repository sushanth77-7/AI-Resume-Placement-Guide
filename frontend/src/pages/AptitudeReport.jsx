import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import practiceService from '../services/practiceService'

export default function AptitudeReport() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(null)
  const [filterType, setFilterType] = useState('all') // 'all', 'correct', 'incorrect', 'unanswered', 'marked'

  useEffect(() => {
    fetchReport()
  }, [id])

  const fetchReport = async () => {
    try {
      setLoading(true)
      const data = await practiceService.getAptitudeAttemptDetail(id)
      setAttempt(data.attempt)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching report:', err)
      setError('Could not retrieve mock test report details.')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Generating your scorecard report...</p>
        </div>
      </div>
    )
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-red-100 shadow-lg text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h2>
          <p className="text-gray-500 mb-6">{error || 'Attempt detail does not exist.'}</p>
          <Link to="/practice-zone" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const {
    difficulty,
    score,
    percentage,
    correctAnswersCount,
    incorrectAnswersCount,
    unansweredCount,
    timeTaken,
    accuracy,
    strengths = [],
    weaknesses = [],
    personalizedSuggestions = [],
    campusReadinessScore,
    questions = [],
    answers = {},
    completedAt
  } = attempt

  // Filter questions based on filter selection
  const filteredQuestions = questions.map((q, idx) => ({ ...q, originalIndex: idx })).filter(q => {
    const userAnswer = answers[q.originalIndex] || '';
    if (filterType === 'correct') return userAnswer === q.answer;
    if (filterType === 'incorrect') return userAnswer && userAnswer !== q.answer;
    if (filterType === 'unanswered') return !userAnswer;
    return true; // 'all'
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 animate-fadeIn">
      {/* Breadcrumb & Title */}
      <div className="max-w-7xl mx-auto px-4 pt-6 mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link to="/practice-zone" className="hover:text-blue-600 font-medium transition-colors">
            Practice Zone
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Test Report</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Assessment Scorecard</h1>
            <p className="text-gray-400 text-xs mt-0.5">
              Completed on {new Date(completedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          
          <Link to="/practice-zone" className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs shadow-sm transition-all">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Score Summary Panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Score Metrics Grid */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
            <h3 className="font-extrabold text-gray-900 text-base pb-3 border-b border-slate-50 mb-6">Performance Summary</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {/* Score Percentage */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 text-center">
                <span className="text-3xl font-black text-blue-600">{percentage}%</span>
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">Score</span>
              </div>

              {/* Accuracy Rate */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 text-center">
                <span className="text-3xl font-black text-indigo-600">{accuracy}%</span>
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">Accuracy</span>
              </div>

              {/* Time Taken */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 text-center">
                <span className="text-2xl font-black text-slate-800">
                  {Math.floor(timeTaken / 60)}m {timeTaken % 60}s
                </span>
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2.5">Time Taken</span>
              </div>

              {/* Campus Readiness */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-center text-white">
                <span className="text-3xl font-black text-indigo-400">{campusReadinessScore}%</span>
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Campus Readiness</span>
              </div>
            </div>

            {/* Micro details correct / incorrect */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-50 text-center">
              <div>
                <span className="block text-base font-extrabold text-emerald-600">{correctAnswersCount}</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Correct</span>
              </div>
              <div className="border-x border-slate-100">
                <span className="block text-base font-extrabold text-rose-500">{incorrectAnswersCount}</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Incorrect</span>
              </div>
              <div>
                <span className="block text-base font-extrabold text-slate-500">{unansweredCount}</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Unanswered</span>
              </div>
            </div>
          </div>

          {/* Solutions & Explanations Review List */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="font-extrabold text-gray-900 text-lg">Question & Answer Review</h3>
              
              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 bg-white border border-slate-100 p-1.5 rounded-xl shadow-sm text-xs font-semibold">
                {[
                  { id: 'all', label: 'All (30)' },
                  { id: 'correct', label: `Correct (${correctAnswersCount})` },
                  { id: 'incorrect', label: `Incorrect (${incorrectAnswersCount})` },
                  { id: 'unanswered', label: `Unanswered (${unansweredCount})` }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterType(f.id)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      filterType === f.id
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions mapping */}
            <div className="space-y-6">
              {filteredQuestions.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center text-gray-400 italic">
                  No questions match the selected filter.
                </div>
              ) : (
                filteredQuestions.map((q, idx) => {
                  const userAnswer = answers[q.originalIndex] || '';
                  const isCorrect = userAnswer === q.answer;
                  const isUnanswered = !userAnswer;

                  return (
                    <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
                      
                      {/* Q Header */}
                      <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-50 mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-slate-500">Q.{q.originalIndex + 1}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {q.topic}
                          </span>
                        </div>
                        
                        {/* Status Label */}
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider ${
                          isUnanswered 
                            ? 'bg-slate-100 text-slate-500' 
                            : isCorrect 
                              ? 'bg-emerald-50 text-emerald-600' 
                              : 'bg-rose-50 text-rose-600'
                        }`}>
                          {isUnanswered ? 'Unanswered' : isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>

                      {/* Question Text */}
                      <p className="text-sm font-bold text-gray-800 leading-relaxed mb-6 whitespace-pre-wrap">
                        {q.question}
                      </p>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        {q.options.map((option) => {
                          const optionIsCorrect = option.key === q.answer
                          const optionIsSelected = userAnswer === option.key

                          let borderStyle = 'border-slate-100 bg-slate-50/20'
                          let labelBg = 'bg-white border border-slate-200 text-slate-400'

                          if (optionIsCorrect) {
                            borderStyle = 'border-emerald-500 bg-emerald-50/10 text-emerald-800 font-bold'
                            labelBg = 'bg-emerald-500 text-white'
                          } else if (optionIsSelected) {
                            borderStyle = 'border-rose-500 bg-rose-50/10 text-rose-800 font-bold'
                            labelBg = 'bg-rose-500 text-white'
                          }

                          return (
                            <div key={option.key} className={`flex items-start space-x-3 p-3.5 rounded-2xl border text-xs leading-relaxed ${borderStyle}`}>
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] flex-shrink-0 ${labelBg}`}>
                                {option.key}
                              </span>
                              <span>{option.text}</span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Solutions Drawer Accordion */}
                      <div className="mt-6 pt-6 border-t border-slate-50 bg-slate-50/50 -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-6 md:p-8 rounded-b-3xl">
                        <h4 className="font-extrabold text-gray-800 text-xs uppercase tracking-wider mb-4 flex items-center">
                          <span className="mr-1.5">💡</span> Explanation & Solution
                        </h4>

                        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                          {/* Step by Step */}
                          <div>
                            <span className="block font-bold text-gray-700 mb-1">Step-by-step Explanation:</span>
                            <p className="whitespace-pre-wrap">{q.stepByStepExplanation}</p>
                          </div>

                          {/* Formula used */}
                          {q.formulaUsed && (
                            <div className="bg-blue-50/40 border border-blue-100/50 p-3 rounded-xl">
                              <span className="block font-bold text-blue-800 mb-0.5">Formula Used:</span>
                              <code className="font-mono text-[11px] text-blue-900">{q.formulaUsed}</code>
                            </div>
                          )}

                          {/* Shortcut Method */}
                          {q.shortcutMethod && (
                            <div className="bg-amber-50/40 border border-amber-100/50 p-3 rounded-xl">
                              <span className="block font-bold text-amber-800 mb-0.5">Shortcut / Quick Technique:</span>
                              <p className="text-amber-900 italic font-medium">{q.shortcutMethod}</p>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  )
                })
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Strengths & Suggestions Column */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Readiness Gauge Info */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 text-center">
            <h3 className="font-extrabold text-gray-900 text-sm mb-3">Campus Placement Readiness</h3>
            <div className="w-24 h-24 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-2xl mx-auto mb-4 border-4 border-indigo-500 shadow-md">
              {campusReadinessScore}%
            </div>
            <p className="text-xs text-slate-500 font-semibold px-4 leading-relaxed">
              {campusReadinessScore >= 80 
                ? 'Excellent! You are ready for elite tech assessments.' 
                : campusReadinessScore >= 60 
                  ? 'Good preparation. Practice shortcuts to increase speed.' 
                  : 'Focus on clearing basic formulas first.'}
            </p>
          </div>

          {/* Strengths & Weaknesses lists */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 space-y-6">
            <div>
              <h3 className="font-bold text-emerald-600 text-xs uppercase tracking-wider mb-3 flex items-center">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                Strong Topics
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {strengths.map((str, i) => (
                  <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2.5 py-1 rounded-full">
                    {str}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-rose-500 text-xs uppercase tracking-wider mb-3 flex items-center">
                <span className="h-2 w-2 rounded-full bg-rose-500 mr-2"></span>
                Weak Topics
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {weaknesses.map((wk, i) => (
                  <span key={i} className="text-[10px] bg-rose-50 text-rose-700 border border-rose-100 font-bold px-2.5 py-1 rounded-full">
                    {wk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Suggestions List */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <h3 className="font-extrabold text-gray-900 text-sm pb-3 border-b border-slate-50 mb-4">Personalized Tips</h3>
            
            <ul className="space-y-3.5">
              {personalizedSuggestions.map((sug, i) => (
                <li key={i} className="flex items-start text-xs text-slate-600 leading-relaxed">
                  <span className="text-blue-500 mr-2 font-bold text-base">•</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  )
}
