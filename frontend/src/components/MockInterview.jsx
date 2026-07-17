import React, { useState } from 'react'
import interviewService from '../services/interviewService'

export default function MockInterview({ role, mode }) {
  const [step, setStep] = useState('setup') // 'setup' | 'question' | 'eval' | 'summary'
  const [loading, setLoading] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [studentAnswer, setStudentAnswer] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [sessionHistory, setSessionHistory] = useState([])
  const [modelAnswerTab, setModelAnswerTab] = useState('recruiter') // 'basic' | 'good' | 'recruiter'
  const [expandedReportIdx, setExpandedReportIdx] = useState(null)

  const startMockInterview = async () => {
    setLoading(true)
    setStep('question')
    setSessionHistory([])
    setStudentAnswer('')
    setEvaluation(null)
    
    try {
      const result = await interviewService.processRequest({
        type: 'mock_init',
        role,
        mode
      })
      if (result.success) {
        setCurrentQuestion(result.response)
      } else {
        setCurrentQuestion("Failed to initialize mock interview. Please try again.")
      }
    } catch (err) {
      console.error(err)
      setCurrentQuestion("A connection error occurred. Please verify your backend is running.")
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!studentAnswer.trim()) return

    setLoading(true)
    try {
      const result = await interviewService.processRequest({
        type: 'mock_eval',
        role,
        mode,
        question: currentQuestion,
        answer: studentAnswer
      })

      if (result.success && result.data) {
        setEvaluation(result.data)
        setStep('eval')
        setModelAnswerTab('recruiter') // reset to best answer tab
      } else {
        alert("Evaluation failed. Please try re-submitting your answer.")
      }
    } catch (err) {
      console.error(err)
      alert("A network error occurred while submitting your response.")
    } finally {
      setLoading(false)
    }
  }

  const handleNextQuestion = () => {
    // Add current round to session history
    setSessionHistory(prev => [
      ...prev,
      {
        question: currentQuestion,
        answer: studentAnswer,
        feedback: evaluation.feedback,
        basicAnswer: evaluation.basicAnswer,
        goodAnswer: evaluation.goodAnswer,
        recruiterAnswer: evaluation.recruiterAnswer,
        score: evaluation.score,
        rating: evaluation.rating
      }
    ])

    // Load next question
    setCurrentQuestion(evaluation.nextQuestion)
    setStudentAnswer('')
    setEvaluation(null)
    setStep('question')
  }

  const handleEndInterview = () => {
    const finalHistory = [
      ...sessionHistory
    ]
    if (evaluation) {
      finalHistory.push({
        question: currentQuestion,
        answer: studentAnswer,
        feedback: evaluation.feedback,
        basicAnswer: evaluation.basicAnswer,
        goodAnswer: evaluation.goodAnswer,
        recruiterAnswer: evaluation.recruiterAnswer,
        score: evaluation.score,
        rating: evaluation.rating
      })
    }
    setSessionHistory(finalHistory)
    setStep('summary')
  }

  // Calculate summary metrics
  const avgScore = sessionHistory.length > 0
    ? Math.round(sessionHistory.reduce((sum, h) => sum + Number(h.score || 0), 0) / sessionHistory.length * 10) / 10
    : 0

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm animate-fadeIn">
      {/* 1. SETUP STEP */}
      {step === 'setup' && (
        <div className="text-center py-10 max-w-xl mx-auto space-y-6">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl inline-block">
            <svg className="w-10 h-10 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900">Start Mock Interview</h3>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              We will conduct a step-by-step interview tailored to the **{role}** profile and the **{mode}** parameters. You will answer questions sequentially, receive live evaluations, scores, and feedback for each answer.
            </p>
          </div>
          <button
            onClick={startMockInterview}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95"
          >
            Start Mock Interview
          </button>
        </div>
      )}

      {/* 2. QUESTION STEP */}
      {step === 'question' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-50">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Question #{sessionHistory.length + 1}
            </span>
            <button
              onClick={handleEndInterview}
              className="text-xs font-semibold text-rose-500 hover:text-rose-700 px-3 py-1 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
            >
              End Interview
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
            <h4 className="text-gray-905 font-bold text-lg leading-relaxed">
              {loading && !currentQuestion ? 'Generating question...' : currentQuestion}
            </h4>
          </div>

          {!loading && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Your Answer</label>
              <textarea
                rows={5}
                required
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Type your detailed interview answer here... (Tip: cover concepts, architecture, and coding logic where relevant)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
              />

              <button
                onClick={submitAnswer}
                disabled={loading || !studentAnswer.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md active:scale-95"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.75 8.25" />
                    </svg>
                    <span>Evaluating Response...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Submit Answer</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. EVALUATION STEP */}
      {step === 'eval' && evaluation && (
        <div className="space-y-8">
          <div className="flex justify-between items-center pb-4 border-b border-slate-50">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Answer Evaluation
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleEndInterview}
                className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-3 py-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                End & Show Summary
              </button>
              <button
                onClick={handleNextQuestion}
                className="text-xs font-bold text-white px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center space-x-1"
              >
                <span>Next Question</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Question & Scorecard panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
            <div className="md:col-span-3 bg-slate-50 border border-slate-100 p-5 rounded-2xl">
              <h5 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Question Asked:</h5>
              <p className="text-gray-900 font-bold text-base leading-relaxed">{currentQuestion}</p>
            </div>

            <div className="md:col-span-1 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider block">Evaluation Score</span>
                <span className="text-3xl font-extrabold tracking-tight mt-1 inline-block">{evaluation.score || 0}/10</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border self-start ${
                evaluation.rating?.toLowerCase() === 'strong'
                  ? 'bg-emerald-955/20 text-emerald-400 border-emerald-800/40'
                  : evaluation.rating?.toLowerCase() === 'average'
                    ? 'bg-amber-955/20 text-amber-400 border-amber-800/40'
                    : 'bg-rose-955/20 text-rose-400 border-rose-800/40'
              }`}>
                {evaluation.rating || 'Average'}
              </span>
            </div>
          </div>

          {/* Feedback & Model Answers (3 categories) */}
          <div className="space-y-6">
            {/* Critique Feedback */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 text-sm mb-2.5 flex items-center">
                <span className="p-1 bg-indigo-50 text-indigo-600 rounded mr-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                  </svg>
                </span>
                Recruiter Feedback Critique (Weaknesses & Strengths)
              </h4>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed whitespace-pre-line">{evaluation.feedback}</p>
            </div>

            {/* Curated Model Answer Tiers */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-slate-200/60 pb-3 gap-2">
                <h4 className="font-bold text-gray-900 text-sm flex items-center">
                  <span className="p-1 bg-emerald-50 text-emerald-600 rounded mr-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Compare Answer Patterns
                </h4>
                
                {/* Answer Tiers selector */}
                <div className="flex bg-slate-200/60 p-0.5 rounded-lg text-[10px] font-bold self-start sm:self-auto">
                  <button
                    onClick={() => setModelAnswerTab('basic')}
                    className={`px-2.5 py-1 rounded transition-all ${modelAnswerTab === 'basic' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Basic Answer
                  </button>
                  <button
                    onClick={() => setModelAnswerTab('good')}
                    className={`px-2.5 py-1 rounded transition-all ${modelAnswerTab === 'good' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Good Answer
                  </button>
                  <button
                    onClick={() => setModelAnswerTab('recruiter')}
                    className={`px-2.5 py-1 rounded transition-all ${modelAnswerTab === 'recruiter' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Best Recruiter Answer
                  </button>
                </div>
              </div>

              <div className="text-xs md:text-sm text-gray-700 leading-relaxed whitespace-pre-line animate-fadeIn">
                {modelAnswerTab === 'basic' && (
                  <div className="p-4 bg-white border border-slate-200/50 rounded-xl">
                    <span className="text-[9px] bg-slate-100 text-slate-500 font-extrabold px-2 py-0.5 rounded uppercase mb-2 inline-block">Barely Passing</span>
                    <p className="text-gray-500 italic">"{evaluation.basicAnswer || 'Not available.'}"</p>
                  </div>
                )}
                {modelAnswerTab === 'good' && (
                  <div className="p-4 bg-white border border-slate-200/50 rounded-xl">
                    <span className="text-[9px] bg-indigo-50 text-indigo-600 font-extrabold px-2 py-0.5 rounded uppercase mb-2 inline-block">Technically Solid</span>
                    <p className="text-gray-600 font-medium">"{evaluation.goodAnswer || 'Not available.'}"</p>
                  </div>
                )}
                {modelAnswerTab === 'recruiter' && (
                  <div className="p-4 bg-white border border-emerald-200 rounded-xl shadow-sm">
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded uppercase mb-2 inline-block">Recruiter-Friendly & Impact-Driven</span>
                    <p className="text-emerald-950 font-semibold leading-relaxed">"{evaluation.recruiterAnswer || 'Not available.'}"</p>
                    <div className="mt-3 text-[10px] text-emerald-600 font-bold bg-emerald-50/55 p-2 rounded-lg">
                      💡 Pro Tip: Notice the structured delivery, use of technical terminology, and reference to system trade-offs.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUMMARY STEP */}
      {step === 'summary' && (
        <div className="space-y-8">
          <div className="text-center max-w-md mx-auto space-y-3">
            <span className="text-[10px] bg-slate-100 text-slate-600 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Session Report Card
            </span>
            <h3 className="text-2xl font-black text-gray-900">Mock Performance Review</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Congratulations on completing the mock interview! Below is your average scoring review and performance breakdown.
            </p>
          </div>

          {/* Average score card */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 max-w-sm mx-auto">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Average score</span>
            <span className="text-5xl font-black mt-2 tracking-tight">{avgScore} / 10</span>
            <span className="text-xs text-indigo-400 font-semibold mt-2 uppercase tracking-wider">
              {avgScore >= 8 ? 'Strong Performance' : avgScore >= 5 ? 'Average Readiness' : 'Needs Practice'}
            </span>
          </div>

          {/* Session breakdown */}
          <div className="space-y-5">
            <h4 className="font-bold text-gray-900 text-sm border-b border-slate-50 pb-2">Questions Breakdown</h4>
            {sessionHistory.map((h, idx) => {
              const isReportExpanded = expandedReportIdx === idx;
              return (
                <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-200 transition-colors">
                  <div 
                    onClick={() => setExpandedReportIdx(isReportExpanded ? null : idx)}
                    className="flex justify-between items-center cursor-pointer select-none"
                  >
                    <span className="text-xs font-bold text-gray-500">Question #{idx + 1}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                        h.rating?.toLowerCase() === 'strong'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : h.rating?.toLowerCase() === 'average'
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        Score: {h.score}/10 • {h.rating}
                      </span>
                      <svg className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${isReportExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-bold text-gray-900 text-xs mb-1.5">Question:</h5>
                    <p className="text-xs text-gray-600 leading-relaxed">{h.question}</p>
                  </div>

                  {isReportExpanded && (
                    <div className="space-y-4 pt-3 border-t border-slate-50 animate-fadeIn">
                      <div>
                        <h5 className="font-bold text-gray-800 text-xs mb-1">Your Answer:</h5>
                        <p className="text-xs text-gray-500 leading-relaxed italic">"{h.answer}"</p>
                      </div>
                      
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs text-gray-600 leading-relaxed">
                        <strong className="text-gray-900 block mb-1.5">Feedback & Critique:</strong>
                        {h.feedback}
                      </div>

                      {/* Summary Model Answers */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-slate-50 border border-slate-200/40 rounded-xl text-xs">
                          <strong className="text-gray-800 block mb-1">Basic Answer:</strong>
                          <p className="text-gray-500 italic">"{h.basicAnswer || 'Not available'}"</p>
                        </div>
                        <div className="p-3 bg-indigo-50/20 border border-indigo-100/30 rounded-xl text-xs">
                          <strong className="text-indigo-950 block mb-1">Good Answer:</strong>
                          <p className="text-indigo-900/80">"{h.goodAnswer || 'Not available'}"</p>
                        </div>
                        <div className="p-3 bg-emerald-50/20 border border-emerald-100/30 rounded-xl text-xs">
                          <strong className="text-emerald-950 block mb-1">Recruiter Answer:</strong>
                          <p className="text-emerald-900/85 font-semibold">"{h.recruiterAnswer || 'Not available'}"</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setStep('setup')}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95"
          >
            Restart Mock Session
          </button>
        </div>
      )}
    </div>
  )
}
