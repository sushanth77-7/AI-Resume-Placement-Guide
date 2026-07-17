import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import practiceService from '../services/practiceService'

export default function AptitudePracticeTest() {
  const [searchParams] = useSearchParams()
  const difficulty = searchParams.get('difficulty') || 'Easy'
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Test State
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({}) // index -> key ('A', 'B', etc.)
  const [markedForReview, setMarkedForReview] = useState({}) // index -> boolean
  const [visited, setVisited] = useState({ 0: true }) // index -> boolean
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Flow State
  const [testStarted, setTestStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes in seconds
  const [submitting, setSubmitting] = useState(false)
  
  const timerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchQuestions()
    return () => clearInterval(timerRef.current)
  }, [])

  // Fetch 30 questions matching difficulty
  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const data = await practiceService.getAptitudeQuestions(difficulty)
      setQuestions(data.questions || [])
      
      // Load saved answers from localStorage if any, for auto-save resumption
      const savedState = localStorage.getItem(`apt_test_${difficulty}`)
      if (savedState) {
        const parsed = JSON.parse(savedState)
        // Only load if it's the same set of questions
        const sameQuestions = parsed.questionIds?.every((id, idx) => id === data.questions[idx]?._id)
        if (sameQuestions) {
          setAnswers(parsed.answers || {})
          setMarkedForReview(parsed.markedForReview || {})
          setVisited(parsed.visited || { 0: true })
          setCurrentIndex(parsed.currentIndex || 0)
          setTimeLeft(parsed.timeLeft || 1800)
          setTestStarted(parsed.testStarted || false)
        }
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Error fetching questions:', err)
      setError('Could not retrieve aptitude questions. Check backend connectivity.')
      setLoading(false)
    }
  }

  // Auto-Save Answers to localStorage whenever state changes
  useEffect(() => {
    if (testStarted && questions.length > 0) {
      const stateToSave = {
        questionIds: questions.map(q => q._id),
        answers,
        markedForReview,
        visited,
        currentIndex,
        timeLeft,
        testStarted
      }
      localStorage.setItem(`apt_test_${difficulty}`, JSON.stringify(stateToSave))
    }
  }, [answers, markedForReview, visited, currentIndex, timeLeft, testStarted, questions])

  // Timer mechanism
  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            autoSubmitTest()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [testStarted])

  // Reset/Shuffle questions before starting
  const handleResetQuestions = async () => {
    if (testStarted) return
    localStorage.removeItem(`apt_test_${difficulty}`)
    setAnswers({})
    setMarkedForReview({})
    setVisited({ 0: true })
    setCurrentIndex(0)
    setTimeLeft(1800)
    await fetchQuestions()
  }

  const handleStartTest = () => {
    setTestStarted(true)
  }

  const navigateQuestion = (index) => {
    setVisited(prev => ({ ...prev, [index]: true }))
    setCurrentIndex(index)
  }

  const handleAnswerSelect = (optionKey) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: optionKey }))
  }

  const handleClearAnswer = () => {
    setAnswers(prev => {
      const updated = { ...prev }
      delete updated[currentIndex]
      return updated
    })
  }

  const toggleMarkReview = () => {
    setMarkedForReview(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      navigateQuestion(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      navigateQuestion(currentIndex - 1)
    }
  }

  // Submit test to backend
  const handleSubmitTest = async () => {
    // Confirm dialogue
    const confirmSubmit = window.confirm('Are you sure you want to submit your test? This cannot be undone.')
    if (!confirmSubmit) return
    
    submitResults()
  }

  const autoSubmitTest = () => {
    alert('Time is up! Your answers are being submitted automatically.')
    submitResults()
  }

  const submitResults = async () => {
    try {
      setSubmitting(true)
      clearInterval(timerRef.current)

      const questionIds = questions.map(q => q._id)
      const formattedAnswers = {}
      
      // Convert mapping index -> key to database array matching order
      questionIds.forEach((_, idx) => {
        formattedAnswers[idx] = answers[idx] || ''
      })

      const data = await practiceService.submitAptitudeTest(
        difficulty,
        formattedAnswers,
        1800 - timeLeft, // Time elapsed
        questionIds
      )

      // Clear cached state
      localStorage.removeItem(`apt_test_${difficulty}`)
      setSubmitting(false)
      navigate(`/practice-zone/aptitude/report/${data.attemptId}`)
    } catch (err) {
      console.error('Error submitting test:', err)
      alert('Failed to submit test. Please check network connection.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Generating random placement questions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-red-100 shadow-lg text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Start</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button onClick={() => navigate('/practice-zone')} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Format Time Left: MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60)
    const remainingSecs = secs % 60
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`
  }

  // Start Screen before test begins
  if (!testStarted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-100 rounded-3xl max-w-2xl w-full p-8 md:p-10 shadow-lg">
          <div className="flex justify-between items-center pb-5 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Placement Assessment Room</h2>
              <p className="text-xs text-gray-500 mt-0.5">Campus Mock Aptitude Round</p>
            </div>
            <span className={`text-xs font-black px-3 py-1 rounded-full ${
              difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' : difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
            }`}>
              {difficulty} Level
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-800 text-sm mb-2.5">Mock Test Details:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="block text-xs text-slate-400 font-bold uppercase">Questions</span>
                  <span className="text-xl font-black text-slate-800 mt-1 block">30 MCQs</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="block text-xs text-slate-400 font-bold uppercase">Duration</span>
                  <span className="text-xl font-black text-slate-800 mt-1 block">30 Minutes</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-5 text-xs text-slate-600 leading-relaxed space-y-2">
              <h4 className="font-bold text-blue-800 text-sm flex items-center mb-1">
                <span className="mr-1.5">📢</span> Important Instructions
              </h4>
              <p>1. The timer begins immediately upon clicking <strong>"Start Test"</strong>.</p>
              <p>2. You can navigate between any of the 30 questions using the question palette.</p>
              <p>3. Use <strong>"Mark for Review"</strong> to flag questions to revisit.</p>
              <p>4. Your progress is saved automatically in the browser in case of connectivity issues.</p>
              <p>5. Clicking "Reset Questions" shuffles a brand new set of 30 questions.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4 border-t border-slate-50">
              <button
                onClick={handleResetQuestions}
                className="w-full sm:w-auto px-6 py-3 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl font-bold transition-all text-sm bg-white"
              >
                🔄 Reset Questions
              </button>
              
              <button
                onClick={handleStartTest}
                className="w-full sm:w-auto px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md text-sm"
              >
                Start Test ⚡
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Active Exam UI
  const currentQuestion = questions[currentIndex]
  const answeredCount = Object.keys(answers).length
  const isTimeCritical = timeLeft < 300 // Under 5 minutes turns red

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between animate-fadeIn">
      {/* Exam Header */}
      <div className="bg-white border-b border-slate-100 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center gap-4">
          <div>
            <h2 className="text-lg font-black text-gray-900">Aptitude Mock Round ({difficulty})</h2>
            <div className="flex items-center space-x-3 text-xs text-gray-400 font-semibold mt-0.5">
              <span>Progress: {answeredCount} / 30 Answered</span>
              <span>•</span>
              <span className="text-orange-500">{Object.keys(markedForReview).filter(k => markedForReview[k]).length} Marked</span>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border font-bold text-sm transition-all ${
            isTimeCritical 
              ? 'bg-rose-50 border-rose-100 text-rose-600 animate-pulse' 
              : 'bg-slate-50 border-slate-100 text-slate-800'
          }`}>
            <span>⏳</span>
            <span className="font-mono text-base">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Main Workspace split */}
      <div className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Question Pane */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm min-h-[460px] flex flex-col justify-between">
          <div>
            {/* Header info */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-50 mb-6">
              <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Question {currentIndex + 1} of 30
              </span>
              <span className="text-xs text-gray-400 font-semibold">
                Topic: {currentQuestion.topic}
              </span>
            </div>

            {/* Question Text */}
            <div className="mb-8">
              <p className="text-base md:text-lg font-bold text-gray-800 leading-relaxed whitespace-pre-wrap">
                {currentQuestion.question}
              </p>
            </div>

            {/* Choices list */}
            <div className="space-y-3.5">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentIndex] === option.key
                return (
                  <button
                    key={option.key}
                    onClick={() => handleAnswerSelect(option.key)}
                    className={`w-full flex items-start space-x-4 p-4 rounded-2xl border text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/30 text-blue-800 font-bold shadow-sm scale-[1.01]'
                        : 'border-slate-100 hover:border-slate-300 hover:shadow-sm hover:-translate-y-0.5 text-gray-700 bg-slate-50/30 hover:bg-slate-50/80'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                      isSelected 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border border-slate-200 text-slate-500'
                    }`}>
                      {option.key}
                    </span>
                    <span className="text-sm font-medium leading-relaxed">{option.text}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap justify-between gap-4 mt-10 pt-6 border-t border-slate-50">
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4.5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent rounded-xl font-bold transition-all text-xs"
              >
                &larr; Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="px-4.5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent rounded-xl font-bold transition-all text-xs"
              >
                Next &rarr;
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={toggleMarkReview}
                className={`px-4.5 py-2.5 rounded-xl font-bold transition-all text-xs border ${
                  markedForReview[currentIndex]
                    ? 'bg-orange-50 border-orange-200 text-orange-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🔖 {markedForReview[currentIndex] ? 'Unmark Review' : 'Mark for Review'}
              </button>

              {answers[currentIndex] && (
                <button
                  onClick={handleClearAnswer}
                  className="px-4 py-2.5 text-xs text-rose-500 hover:underline font-bold"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Palette / Nav Side Panel */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[460px]">
          <div>
            <h3 className="font-extrabold text-gray-900 text-sm pb-3 border-b border-slate-50 mb-4">Question Palette</h3>
            
            {/* Palette grid 1 to 30 */}
            <div className="grid grid-cols-5 gap-2.5">
              {questions.map((_, idx) => {
                const isSelected = currentIndex === idx
                const isAnswered = answers[idx] !== undefined
                const isMarked = markedForReview[idx]
                const isVisited = visited[idx]

                let btnColor = 'bg-slate-100 text-slate-400' // Not visited
                let borderStroke = 'border-transparent'

                if (isSelected) {
                  borderStroke = 'ring-2 ring-blue-600'
                }

                if (isMarked) {
                  btnColor = 'bg-orange-500 text-white' // Marked for review
                } else if (isAnswered) {
                  btnColor = 'bg-emerald-500 text-white' // Answered
                } else if (isVisited) {
                  btnColor = 'bg-rose-500 text-white' // Visited but unanswered
                }

                return (
                  <button
                    key={idx}
                    onClick={() => navigateQuestion(idx)}
                    className={`h-9 w-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${btnColor} ${borderStroke}`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>

            {/* Legend guide */}
            <div className="mt-8 pt-4 border-t border-slate-50 grid grid-cols-2 gap-3 text-[10px] text-gray-400 font-bold uppercase">
              <div className="flex items-center">
                <span className="h-3 w-3 bg-emerald-500 rounded mr-2"></span>
                <span>Answered</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 bg-rose-500 rounded mr-2"></span>
                <span>Unanswered</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 bg-orange-500 rounded mr-2"></span>
                <span>Marked</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 bg-slate-100 rounded mr-2"></span>
                <span>Not Visited</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-50">
            <button
              onClick={handleSubmitTest}
              disabled={submitting}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-bold transition-all shadow-md text-xs uppercase tracking-wider"
            >
              {submitting ? 'Submitting Test...' : 'Submit Assessment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
