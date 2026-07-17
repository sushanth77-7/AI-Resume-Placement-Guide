import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import resumeService from '../services/resumeService'
import interviewService from '../services/interviewService'

export default function ResumeQuestionAssistant({ role }) {
  const [resumes, setResumes] = useState([])
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [questionsData, setQuestionsData] = useState(null)
  
  // Tab/Accordion UI states
  const [activeCategory, setActiveCategory] = useState('skills')
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState(null)

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const result = await resumeService.getUserResumes()
        if (result.success && Array.isArray(result.resumes)) {
          setResumes(result.resumes)
          if (result.resumes.length > 0) {
            setSelectedResumeId(result.resumes[0]._id)
          }
        }
      } catch (err) {
        console.error('Failed to load user resumes:', err)
      } finally {
        setLoadingResumes(false)
      }
    }
    loadResumes()
  }, [])

  const handleGenerate = async () => {
    if (!selectedResumeId) return

    setLoadingQuestions(true)
    setQuestionsData(null)
    setExpandedQuestionIdx(null)
    try {
      const selectedResume = resumes.find(r => r._id === selectedResumeId)
      if (!selectedResume || !selectedResume.content) {
        alert("Selected resume has no parsed text content. Try re-analyzing your resume.")
        setLoadingQuestions(false)
        return
      }

      const result = await interviewService.processRequest({
        type: 'resume',
        role,
        resumeContent: selectedResume.content
      })

      if (result.success && result.data) {
        setQuestionsData(result.data)
        // Find first category with questions to activate
        const categories = [
          'skills', 'projects', 'internships', 'certifications', 
          'achievements', 'github_linkedin', 'technical_concepts', 'hr', 'resume_based'
        ]
        const firstActive = categories.find(cat => Array.isArray(result.data[cat]) && result.data[cat].length > 0)
        if (firstActive) {
          setActiveCategory(firstActive)
        } else {
          setActiveCategory('skills')
        }
      } else {
        alert("Failed to analyze resume. Please try again.")
      }
    } catch (err) {
      console.error(err)
      alert("A network error occurred. Please verify your backend server is active.")
    } finally {
      setLoadingQuestions(false)
    }
  }

  if (loadingResumes) {
    return (
      <div className="flex items-center justify-center p-12 bg-white border border-gray-100 rounded-2xl animate-pulse">
        <svg className="w-6 h-6 animate-spin text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.75 8.25" />
        </svg>
        <span className="text-sm text-gray-500 font-semibold">Loading your resumes...</span>
      </div>
    )
  }

  const categories = [
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'internships', label: 'Internships' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'github_linkedin', label: 'GitHub/LinkedIn' },
    { id: 'technical_concepts', label: 'Technical Concepts' },
    { id: 'hr', label: 'HR Questions' },
    { id: 'resume_based', label: 'Resume Questions' }
  ]

  // Get current questions list
  const currentQuestions = questionsData ? (questionsData[activeCategory] || []) : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
      {/* Selector Column */}
      <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm self-start">
        <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
          <span className="p-1 bg-indigo-50 text-indigo-600 rounded mr-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          Profile Selector
        </h3>

        {resumes.length > 0 ? (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Choose Uploaded Resume</label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer font-medium"
              >
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.fileName} (ATS Score: {r.atsScore}%)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loadingQuestions || !selectedResumeId}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              {loadingQuestions ? (
                <>
                  <svg className="w-5 h-5 animate-spin text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.75 8.25" />
                  </svg>
                  <span>Extracting Resume Q&A...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>Generate Custom Q&A</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center p-6 border border-dashed border-slate-200 rounded-xl space-y-4">
            <p className="text-xs text-gray-400 leading-relaxed">
              No analyzed resumes found in your dashboard profile. You must scan a resume first to generate questions customized to your actual experience.
            </p>
            <Link 
              to="/resume-analyzer"
              className="inline-block bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
            >
              Analyze Resume First
            </Link>
          </div>
        )}
      </div>

      {/* Questions Column */}
      <div className="lg:col-span-8 flex flex-col justify-between h-full min-h-[450px]">
        {questionsData ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[450px] relative">
            
            {/* Category tabs */}
            <div className="flex border-b border-gray-100 pb-3 mb-6 overflow-x-auto gap-2 no-scrollbar">
              {categories.map(cat => {
                const count = questionsData[cat.id]?.length || 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id)
                      setExpandedQuestionIdx(null)
                    }}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                      activeCategory === cat.id 
                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${activeCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-gray-500'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Questions accordion */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {currentQuestions.length > 0 ? (
                currentQuestions.map((qObj, idx) => {
                  const isExpanded = expandedQuestionIdx === idx
                  return (
                    <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4.5 shadow-sm transition-all hover:border-slate-200">
                      <button
                        onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                        className="w-full flex justify-between items-center text-left font-bold text-gray-900 text-xs md:text-sm"
                      >
                        <span>{qObj.question}</span>
                        <svg className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 flex-shrink-0 ml-2 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-200/60 space-y-4 animate-fadeIn text-xs">
                          {/* Interviewer Intent Box */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-150">
                            <div>
                              <strong className="text-indigo-600 uppercase text-[9px] block mb-1">Why Interviewer Asks It:</strong>
                              <p className="text-gray-600 leading-normal">{qObj.why}</p>
                            </div>
                            <div>
                              <strong className="text-indigo-600 uppercase text-[9px] block mb-1">What Interviewer Expects:</strong>
                              <p className="text-gray-600 leading-normal">{qObj.expects}</p>
                            </div>
                          </div>

                          {/* Comparison grid: Weak vs Strong */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-rose-50/30 border border-rose-100/50 p-4 rounded-xl text-rose-950">
                              <strong className="text-rose-700 uppercase text-[9px] block mb-1">❌ Weak Answer Example:</strong>
                              <p className="italic">"{qObj.weak}"</p>
                            </div>
                            <div className="bg-emerald-50/30 border border-emerald-100/50 p-4 rounded-xl text-emerald-950">
                              <strong className="text-emerald-700 uppercase text-[9px] block mb-1">✅ Strong Answer Example:</strong>
                              <p className="font-medium">"{qObj.strong}"</p>
                            </div>
                          </div>

                          {/* Answer Structure blueprint */}
                          <div className="bg-indigo-50/20 border border-indigo-100/30 p-4 rounded-xl text-indigo-950">
                            <strong className="text-indigo-900 uppercase text-[9px] block mb-1.5">🔑 Ideal Answer Blueprint Structure:</strong>
                            <p className="leading-relaxed">{qObj.structure}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <svg className="w-8 h-8 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-xs">No questions extracted for the {activeCategory} category.</p>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100 text-[10px] text-gray-400">
              💡 Tip: Match your resume answers with the structured blueprints to ensure a highly focused and impactful recruiter evaluation.
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[450px]">
            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 mb-4 animate-pulse">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 00-2 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Resume Interview Coach</h4>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Choose one of your scanned resumes on the left to extract custom-tailored interview questions and ideal response points.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
