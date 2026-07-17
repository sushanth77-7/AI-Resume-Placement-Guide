import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import practiceService from '../services/practiceService'

export default function CodingWorkspace() {
  const [searchParams] = useSearchParams()
  const difficulty = searchParams.get('difficulty') || 'Easy'
  
  const navigate = useNavigate()
  const location = useLocation()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Problems states
  const [problems, setProblems] = useState([])
  const [activeProbIdx, setActiveProbIdx] = useState(0) // 0 or 1
  
  // Editor configuration states
  const [editorLanguage, setEditorLanguage] = useState('javascript')
  const [editorTheme, setEditorTheme] = useState('dark') // 'dark' or 'light'
  const [codeMap, setCodeMap] = useState({}) // problemId_language -> code
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Running/Submitting states
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [consoleOpen, setConsoleOpen] = useState(false)
  const [activeConsoleTab, setActiveConsoleTab] = useState('console') // 'console', 'report', 'solution'
  
  // Results states
  const [testResult, setTestResult] = useState(null) // Run results
  const [submitResult, setSubmitResult] = useState(null) // Submit results
  const [solutionTab, setSolutionTab] = useState('optimal') // 'brute', 'better', 'optimal'

  // Refs for custom scroll synchronization
  const linesRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    // Check if we are opening a previous attempt from state
    if (location.state && location.state.viewAttempt) {
      loadPastAttempt(location.state.viewAttempt)
    } else {
      fetchProblems()
    }
  }, [difficulty])

  // Fetch 2 problems
  const fetchProblems = async () => {
    try {
      setLoading(true)
      const data = await practiceService.getCodingProblemsSession(difficulty)
      setProblems(data.problems || [])
      
      // Initialize code templates
      const initialMap = {}
      data.problems.forEach(p => {
        const langKeys = ['c', 'cpp', 'java', 'python', 'javascript', 'csharp']
        langKeys.forEach(l => {
          initialMap[`${p._id}_${l}`] = p.initialTemplates[l] || ''
        })
      })
      setCodeMap(initialMap)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching coding problems:', err)
      setError('Could not retrieve coding problems. Please verify backend server.')
      setLoading(false)
    }
  }

  // Load a past attempt for read-only view
  const loadPastAttempt = (attempt) => {
    const mockProblem = {
      _id: attempt.problemId._id,
      title: attempt.problemId.title,
      description: 'Review of past code submission.',
      difficulty: attempt.problemId.difficulty,
      topic: attempt.problemId.topic,
      constraints: 'See original constraints',
      inputFormat: 'N/A',
      outputFormat: 'N/A',
      sampleInput: 'N/A',
      sampleOutput: 'N/A',
      sampleExplanation: 'Review mode',
      initialTemplates: { [attempt.language]: attempt.code },
      testCases: []
    }
    setProblems([mockProblem])
    setActiveProbIdx(0)
    setEditorLanguage(attempt.language)
    setCodeMap({ [`${mockProblem._id}_${attempt.language}`]: attempt.code })
    setSubmitResult({
      status: attempt.status,
      testCasesPassed: attempt.testCasesPassed,
      totalTestCases: attempt.totalTestCases,
      runtime: attempt.runtime,
      memory: attempt.memory,
      timeComplexity: attempt.timeComplexity,
      spaceComplexity: attempt.spaceComplexity,
      review: attempt.review
    })
    setConsoleOpen(true)
    setActiveConsoleTab('report')
    setLoading(false)
  }

  const handleResetSession = async () => {
    const confirmReset = window.confirm('Generate 2 new coding questions? Current code will be discarded.')
    if (!confirmReset) return
    setTestResult(null)
    setSubmitResult(null)
    setConsoleOpen(false)
    await fetchProblems()
  }

  const handleLanguageChange = (e) => {
    setEditorLanguage(e.target.value)
    // Clear results on language change
    setTestResult(null)
    setSubmitResult(null)
  }

  const getActiveCode = () => {
    if (problems.length === 0) return ''
    const currentId = problems[activeProbIdx]._id
    return codeMap[`${currentId}_${editorLanguage}`] || ''
  }

  const handleCodeChange = (e) => {
    const currentId = problems[activeProbIdx]._id
    const val = e.target.value
    setCodeMap(prev => ({
      ...prev,
      [`${currentId}_${editorLanguage}`]: val
    }))
  }

  // Auto scroll line numbers with textarea scroll
  const handleScroll = () => {
    if (linesRef.current && textareaRef.current) {
      linesRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  // Tab key indent & Bracket auto-closing handlers
  const handleKeyDown = (e) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const val = textarea.value

    // Tab key inserts 4 spaces
    if (e.key === 'Tab') {
      e.preventDefault()
      const newVal = val.substring(0, start) + '    ' + val.substring(end)
      const currentId = problems[activeProbIdx]._id
      setCodeMap(prev => ({ ...prev, [`${currentId}_${editorLanguage}`]: newVal }))
      
      // Reset cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4
      }, 0)
    }

    // Bracket auto-closing
    const pairs = {
      '{': '}',
      '(': ')',
      '[': ']',
      '"': '"',
      "'": "'"
    }

    if (pairs[e.key] !== undefined) {
      e.preventDefault()
      const closingChar = pairs[e.key]
      const newVal = val.substring(0, start) + e.key + closingChar + val.substring(end)
      const currentId = problems[activeProbIdx]._id
      setCodeMap(prev => ({ ...prev, [`${currentId}_${editorLanguage}`]: newVal }))

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1
      }, 0)
    }
  }

  // Execute visible sample cases
  const handleRunCode = async () => {
    if (problems.length === 0) return
    try {
      setRunning(true)
      setConsoleOpen(true)
      setActiveConsoleTab('console')
      setTestResult(null)

      const activeProblem = problems[activeProbIdx]
      const activeCode = getActiveCode()

      const data = await practiceService.runCodingCode(
        activeProblem._id,
        editorLanguage,
        activeCode
      )

      setTestResult(data)
      setRunning(false)
    } catch (err) {
      console.error('Run error:', err)
      setTestResult({ status: 'Error', error: err.message || 'Failed to execute code.' })
      setRunning(false)
    }
  }

  // Submit code for full test cases & review
  const handleSubmitCode = async () => {
    if (problems.length === 0) return
    try {
      setSubmitting(true)
      setConsoleOpen(true)
      setActiveConsoleTab('report')
      setSubmitResult(null)

      const activeProblem = problems[activeProbIdx]
      const activeCode = getActiveCode()

      const data = await practiceService.submitCodingCode(
        activeProblem._id,
        editorLanguage,
        activeCode
      )

      setSubmitResult(data)
      setSubmitting(false)
    } catch (err) {
      console.error('Submission error:', err)
      setSubmitResult({ status: 'Error', error: err.message || 'Failed to submit solution.' })
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Creating your coding workspace...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-red-100 shadow-lg text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">IDE Initialization Error</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button onClick={() => navigate('/practice-zone')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const activeProblem = problems[activeProbIdx]
  const activeCode = getActiveCode()

  // Generate lines array for display
  const linesCount = activeCode.split('\n').length
  const linesArr = Array.from({ length: Math.max(linesCount, 15) }, (_, i) => i + 1)

  return (
    <div className={`flex flex-col justify-between transition-all duration-300 ${
      editorTheme === 'dark' ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-800'
    } ${
      isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen' : 'min-h-[calc(screen-16)] py-6 px-4'
    }`}>
      
      {/* Workspace Controls */}
      <div className={`max-w-7xl w-full mx-auto border rounded-2xl p-4 shadow-sm flex flex-wrap justify-between items-center gap-4 mb-4 transition-all duration-300 ${
        editorTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-705'
      }`}>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/practice-zone')} 
            className={`text-xs font-bold mr-2 transition-all ${
              editorTheme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            &larr; Exit Sandbox
          </button>
          
          {/* Problem selection buttons */}
          {problems.map((prob, idx) => (
            <button
              key={prob._id}
              onClick={() => {
                setActiveProbIdx(idx)
                setTestResult(null)
                setSubmitResult(null)
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeProbIdx === idx
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : editorTheme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              Problem {idx + 1}: {prob.title}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          {/* Reset button */}
          {!location.state?.viewAttempt && (
            <button
              onClick={handleResetSession}
              className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${
                editorTheme === 'dark'
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-205 hover:bg-slate-50 text-slate-600'
              }`}
            >
              🔄 Reset Questions
            </button>
          )}

          {/* Full screen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 border rounded-xl text-xs font-bold transition-all ${
              editorTheme === 'dark'
                ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                : 'border-slate-205 hover:bg-slate-50 text-slate-600'
            }`}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? '🗎 Window' : '🗖 Fullscreen'}
          </button>
        </div>
      </div>

      {/* Main Splits Panel */}
      <div className={`max-w-7xl w-full mx-auto flex-grow grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch ${
        isFullscreen ? 'h-[calc(100vh-130px)] px-4' : 'min-h-[620px]'
      }`}>
        
        {/* LEFT COLUMN: Problem description details */}
        <div className={`lg:col-span-5 border rounded-3xl p-6 shadow-sm overflow-y-auto no-scrollbar flex flex-col justify-between transition-all duration-300 ${
          editorTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
        }`}>
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-6">
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                editorTheme === 'dark' ? 'bg-slate-800 text-indigo-400' : 'bg-slate-100 text-slate-600'
              }`}>
                {activeProblem.topic}
              </span>
              
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider ${
                activeProblem.difficulty === 'Easy'
                  ? editorTheme === 'dark' ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                  : activeProblem.difficulty === 'Medium'
                    ? editorTheme === 'dark' ? 'bg-amber-950/40 text-amber-400' : 'bg-amber-50 text-amber-600'
                    : editorTheme === 'dark' ? 'bg-red-950/40 text-red-400' : 'bg-red-50 text-red-600'
              }`}>
                {activeProblem.difficulty}
              </span>
            </div>

            {/* Description */}
            <h2 className={`text-xl font-black mb-3 ${editorTheme === 'dark' ? 'text-white' : 'text-gray-950'}`}>{activeProblem.title}</h2>
            <div className={`prose prose-sm max-w-none mb-8 leading-relaxed whitespace-pre-wrap ${
              editorTheme === 'dark' ? 'text-slate-450' : 'text-slate-600'
            }`}>
              {activeProblem.description}
            </div>

            {/* Format grids */}
            <div className="space-y-5 text-xs">
              <div className={`p-4.5 rounded-2xl border ${
                editorTheme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-100'
              }`}>
                <span className={`block font-bold mb-1 ${editorTheme === 'dark' ? 'text-slate-200' : 'text-gray-800'}`}>Constraints:</span>
                <code className={`block font-mono whitespace-pre-wrap ${editorTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{activeProblem.constraints}</code>
              </div>

              <div>
                <span className={`block font-bold mb-1 ${editorTheme === 'dark' ? 'text-slate-200' : 'text-gray-800'}`}>Input Format:</span>
                <p className={editorTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>{activeProblem.inputFormat}</p>
              </div>

              <div>
                <span className={`block font-bold mb-1 ${editorTheme === 'dark' ? 'text-slate-200' : 'text-gray-800'}`}>Output Format:</span>
                <p className={editorTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>{activeProblem.outputFormat}</p>
              </div>
            </div>

            {/* Sample Cases */}
            <div className="mt-8 space-y-4">
              <h4 className={`font-extrabold text-xs uppercase tracking-wider ${editorTheme === 'dark' ? 'text-slate-350' : 'text-gray-800'}`}>Sample Test Case</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${
                  editorTheme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sample Input</span>
                  <code className={`font-mono text-xs whitespace-pre-wrap ${editorTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{activeProblem.sampleInput}</code>
                </div>
                <div className={`p-4 rounded-xl border ${
                  editorTheme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sample Output</span>
                  <code className={`font-mono text-xs whitespace-pre-wrap ${editorTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{activeProblem.sampleOutput}</code>
                </div>
              </div>
              {activeProblem.sampleExplanation && (
                <p className="text-xs text-slate-400 leading-normal italic">
                  <strong>Explanation:</strong> {activeProblem.sampleExplanation}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-slate-50 text-[10px] text-gray-400">
            Powered by Antigravity VM sandbox execution engines.
          </div>
        </div>

        {/* RIGHT COLUMN: Code editor + Resizable Console */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          
          {/* Top IDE Toolbar */}
          <div className={`rounded-3xl p-4.5 shadow-md flex flex-wrap justify-between items-center gap-4 border transition-all duration-300 ${
            editorTheme === 'dark'
              ? 'bg-slate-900 border-slate-800 text-slate-200'
              : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <select
                value={editorLanguage}
                onChange={handleLanguageChange}
                disabled={location.state?.viewAttempt}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl outline-none cursor-pointer border transition-all ${
                  editorTheme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-slate-200 focus:border-indigo-500'
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-400'
                }`}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python 3</option>
                <option value="cpp">C++ (GCC)</option>
                <option value="java">Java 17</option>
                <option value="c">C (Clang)</option>
                <option value="csharp">C# (.NET)</option>
              </select>

              {/* Theme Selector */}
              <button
                onClick={() => setEditorTheme(editorTheme === 'dark' ? 'light' : 'dark')}
                className={`text-xs font-bold flex items-center transition-all ${
                  editorTheme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{editorTheme === 'dark' ? '☀️ Light' : '🌙 Dark'} Mode</span>
              </button>
            </div>

            <div className="flex items-center space-x-2.5">
              {!location.state?.viewAttempt && (
                <>
                  <button
                    onClick={handleRunCode}
                    disabled={running || submitting}
                    className={`px-4.5 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      editorTheme === 'dark'
                        ? 'text-slate-300 bg-slate-800 hover:bg-slate-700 border-slate-700'
                        : 'text-slate-705 bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {running ? 'Running...' : 'Run Code'}
                  </button>
                  
                  <button
                    onClick={handleSubmitCode}
                    disabled={running || submitting}
                    className="px-5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-600/35"
                  >
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Code Editor Body */}
          <div className={`relative flex-grow rounded-3xl overflow-hidden border ${
            editorTheme === 'dark'
              ? 'bg-slate-950 border-slate-900 text-slate-300'
              : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="absolute top-0 bottom-0 left-0 right-0 flex items-stretch">
              
              {/* Synchronized Line Numbers */}
              <div
                ref={linesRef}
                className={`w-12 select-none text-right pr-3 pt-4 border-r font-mono text-xs overflow-hidden leading-6 ${
                  editorTheme === 'dark'
                    ? 'bg-slate-900/40 border-slate-900 text-slate-600'
                    : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}
              >
                {linesArr.map(n => (
                  <div key={n}>{n}</div>
                ))}
              </div>

              {/* Textarea Code Space */}
              <textarea
                ref={textareaRef}
                value={activeCode}
                onChange={handleCodeChange}
                onScroll={handleScroll}
                onKeyDown={handleKeyDown}
                readOnly={!!location.state?.viewAttempt}
                className="flex-grow bg-transparent p-4 font-mono text-xs leading-6 outline-none resize-none overflow-y-auto"
                style={{ tabSize: 4 }}
                placeholder="// Start coding here..."
                spellCheck="false"
              />
            </div>
          </div>

          {/* CONSOLE DRAWER ACCORDION */}
          {consoleOpen && (
            <div className={`border rounded-3xl shadow-lg p-5 flex flex-col justify-between min-h-[300px] max-h-[400px] overflow-y-auto no-scrollbar animate-slideUp transition-all duration-300 ${
              editorTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-850'
            }`}>
              
              {/* Drawer Toolbar */}
              <div className={`flex justify-between items-center pb-3 border-b mb-4 ${
                editorTheme === 'dark' ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <div className="flex space-x-4 text-xs font-bold">
                  {testResult && (
                    <button
                      onClick={() => setActiveConsoleTab('console')}
                      className={`pb-1 border-b-2 transition-all ${
                        activeConsoleTab === 'console' 
                          ? 'border-indigo-500 text-indigo-500' 
                          : editorTheme === 'dark' 
                            ? 'border-transparent text-slate-400 hover:text-slate-200' 
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Console Outcomes
                    </button>
                  )}
                  {submitResult && (
                    <button
                      onClick={() => setActiveConsoleTab('report')}
                      className={`pb-1 border-b-2 transition-all ${
                        activeConsoleTab === 'report' 
                          ? 'border-indigo-500 text-indigo-500' 
                          : editorTheme === 'dark' 
                            ? 'border-transparent text-slate-400 hover:text-slate-200' 
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Evaluation Report
                    </button>
                  )}
                  {submitResult?.review && (
                    <button
                      onClick={() => setActiveConsoleTab('solution')}
                      className={`pb-1 border-b-2 transition-all ${
                        activeConsoleTab === 'solution' 
                          ? 'border-indigo-500 text-indigo-500' 
                          : editorTheme === 'dark' 
                            ? 'border-transparent text-slate-400 hover:text-slate-200' 
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Optimal Solutions
                    </button>
                  )}
                </div>

                <button 
                  onClick={() => setConsoleOpen(false)} 
                  className={`text-xs font-extrabold uppercase transition-all ${
                    editorTheme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  ✕ Close Console
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-grow overflow-y-auto no-scrollbar text-xs">
                
                {/* 1. RUN CODE TAB */}
                {activeConsoleTab === 'console' && testResult && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider ${
                        testResult.status === 'Passed'
                          ? editorTheme === 'dark' ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                          : editorTheme === 'dark' ? 'bg-red-950/40 text-red-400' : 'bg-red-50 text-red-600'
                      }`}>
                        {testResult.status}
                      </span>
                      <span className={`font-bold ${editorTheme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                        Sample Cases Passed: {testResult.passed} / {testResult.total}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {testResult.results?.map((res, i) => (
                        <div key={i} className={`border rounded-xl p-3.5 leading-relaxed font-mono ${
                          editorTheme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-100'
                        }`}>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Test Case {i+1} ({res.passed ? 'PASSED' : 'FAILED'})</p>
                          <p className={editorTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'}><span className={`font-bold ${editorTheme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Input:</span> {res.input}</p>
                          <p className={editorTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'}><span className={`font-bold ${editorTheme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Expected:</span> {res.expected}</p>
                          <p className={`font-semibold ${res.passed ? 'text-emerald-500' : 'text-rose-500'}`}>
                            <span className={`font-bold ${editorTheme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Actual:</span> {res.actual}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. EVALUATION REPORT TAB */}
                {activeConsoleTab === 'report' && submitResult && (
                  <div className="space-y-5">
                    {/* Top Stats Banner */}
                    <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                          submitResult.status === 'Passed' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                        }`}>
                          {submitResult.status}
                        </span>
                        <h4 className="text-sm font-black mt-1">Cases Passed: {submitResult.testCasesPassed} / {submitResult.totalTestCases}</h4>
                      </div>

                      <div className="flex gap-4 text-center">
                        <div>
                          <span className="block text-indigo-400 font-black text-sm">{submitResult.runtime}ms</span>
                          <span className="block text-[8px] text-slate-400 font-bold uppercase">Runtime</span>
                        </div>
                        <div className="border-l border-slate-800 pl-4">
                          <span className="block text-indigo-400 font-black text-sm">{submitResult.memory}KB</span>
                          <span className="block text-[8px] text-slate-400 font-bold uppercase">Memory</span>
                        </div>
                        <div className="border-l border-slate-800 pl-4">
                          <span className="block text-indigo-400 font-black text-sm">{submitResult.review?.overallCodingScore || 0}%</span>
                          <span className="block text-[8px] text-slate-400 font-bold uppercase">Overall Score</span>
                        </div>
                      </div>
                    </div>

                    {/* Complexity mapping */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Time Complexity</span>
                        <code className="block text-sm font-bold text-indigo-600 mt-0.5">{submitResult.timeComplexity}</code>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Space Complexity</span>
                        <code className="block text-sm font-bold text-indigo-600 mt-0.5">{submitResult.spaceComplexity}</code>
                      </div>
                    </div>

                    {/* AI Feedback columns */}
                    {submitResult.review && (
                      <div className="space-y-4">
                        <div className="border-b border-slate-50 pb-2.5">
                          <span className="block font-bold text-slate-800 mb-1">Code Quality Review:</span>
                          <p className="text-slate-600 leading-relaxed">{submitResult.review.codeQualityReview}</p>
                        </div>
                        <div className="border-b border-slate-50 pb-2.5">
                          <span className="block font-bold text-slate-800 mb-1">Optimization Advice:</span>
                          <p className="text-slate-600 leading-relaxed">{submitResult.review.optimizationSuggestions}</p>
                        </div>
                        <div className="border-b border-slate-50 pb-2.5">
                          <span className="block font-bold text-slate-800 mb-1">Style & Formatting Review:</span>
                          <p className="text-slate-600 leading-relaxed">{submitResult.review.codingStyleReview}</p>
                        </div>
                        {submitResult.review.edgeCasesMissed?.length > 0 && (
                          <div className="border-b border-slate-50 pb-2.5">
                            <span className="block font-bold text-rose-600 mb-1">Edge Cases Missed:</span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-600">
                              {submitResult.review.edgeCasesMissed.map((ec, i) => <li key={i}>{ec}</li>)}
                            </ul>
                          </div>
                        )}
                        <div className="bg-blue-50/30 border border-blue-100/50 p-4 rounded-2xl">
                          <span className="block font-bold text-blue-800 mb-1">Simulated Recruiter & Interview Feedback:</span>
                          <p className="text-slate-600 leading-relaxed italic">{submitResult.review.recruiterFeedback}</p>
                          <p className="text-[10px] font-bold text-blue-900 mt-2">Interview Readiness Grade: {submitResult.review.interviewReadiness}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. OPTIMAL SOLUTIONS TAB */}
                {activeConsoleTab === 'solution' && submitResult?.review && (
                  <div className="space-y-4">
                    {/* Solution Sub-tabs */}
                    <div className="flex gap-2 border-b border-slate-100 pb-2">
                      <button
                        onClick={() => setSolutionTab('brute')}
                        className={`px-3 py-1 rounded text-[11px] font-bold ${
                          solutionTab === 'brute' ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        Brute Force
                      </button>
                      {submitResult.review.better && (
                        <button
                          onClick={() => setSolutionTab('better')}
                          className={`px-3 py-1 rounded text-[11px] font-bold ${
                            solutionTab === 'better' ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          Better
                        </button>
                      )}
                      <button
                        onClick={() => setSolutionTab('optimal')}
                        className={`px-3 py-1 rounded text-[11px] font-bold ${
                          solutionTab === 'optimal' ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        Optimal Approach
                      </button>
                    </div>

                    {/* Active Approach Display */}
                    {(() => {
                      const approach = submitResult.review[solutionTab]
                      if (!approach) return <p className="text-gray-400 italic">No alternative approach specified.</p>
                      
                      return (
                        <div className="space-y-3 font-sans">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                            <span>Complexity: {approach.complexity}</span>
                          </div>
                          
                          <p className="text-slate-600 leading-normal">{approach.explanation}</p>
                          
                          <div className="bg-slate-950 text-slate-300 rounded-xl p-4 border border-slate-900 overflow-x-auto">
                            <pre className="font-mono text-[10px] leading-relaxed">{approach.code}</pre>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  )
}
