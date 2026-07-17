import React, { useState } from 'react'
import interviewService from '../services/interviewService'

export default function ProjectAssistant({ role }) {
  const [project, setProject] = useState({
    title: '',
    description: '',
    technologies: '',
    challenges: '',
    database: '',
    apis: '',
    deployment: '',
    scalability: '',
    security: ''
  })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!project.title.trim() || !project.description.trim()) return

    setLoading(true)
    setExplanation('')
    try {
      const result = await interviewService.processRequest({
        type: 'project',
        role,
        projectDetails: project
      })

      if (result.success) {
        setExplanation(result.response)
      } else {
        setExplanation("Failed to generate explanation. Please try again.")
      }
    } catch (err) {
      console.error(err)
      setExplanation("A network error occurred. Please verify your backend server is active.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
      {/* Input Form Column */}
      <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm self-start">
        <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
          <span className="p-1 bg-indigo-50 text-indigo-600 rounded mr-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </span>
          Project Description Form
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Project Title</label>
            <input 
              type="text"
              required
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
              placeholder="e.g. E-Commerce Microservices, AI Resume Analyzer"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Project Description</label>
            <textarea 
              required
              rows={4}
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
              placeholder="What does the project do? What is the main tech stack? Describe the features briefly."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Challenges Faced (Optional)</label>
            <textarea 
              rows={2}
              value={project.challenges}
              onChange={(e) => setProject({ ...project, challenges: e.target.value })}
              placeholder="e.g. Handling state mismatch, database query delays, security rate limits."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          {/* Advanced Technical Parameters Toggle */}
          <div className="border-t border-slate-100 pt-4 mt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider hover:text-indigo-600 transition-colors"
            >
              <span>Advanced Technical Parameters (Optional)</span>
              <svg className={`w-4 h-4 transform transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showAdvanced && (
              <div className="space-y-4 mt-4 animate-fadeIn">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Technologies Used</label>
                  <input 
                    type="text"
                    value={project.technologies}
                    onChange={(e) => setProject({ ...project, technologies: e.target.value })}
                    placeholder="e.g. React, Node.js, Express, Redux"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Database Configuration</label>
                    <input 
                      type="text"
                      value={project.database}
                      onChange={(e) => setProject({ ...project, database: e.target.value })}
                      placeholder="e.g. MongoDB, PostgreSQL"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">APIs Integrated</label>
                    <input 
                      type="text"
                      value={project.apis}
                      onChange={(e) => setProject({ ...project, apis: e.target.value })}
                      placeholder="e.g. Stripe, SendGrid, Auth0"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Deployment Platform</label>
                    <input 
                      type="text"
                      value={project.deployment}
                      onChange={(e) => setProject({ ...project, deployment: e.target.value })}
                      placeholder="e.g. AWS S3, Vercel, Heroku"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Scalability & Security</label>
                    <input 
                      type="text"
                      value={project.scalability}
                      onChange={(e) => setProject({ ...project, scalability: e.target.value })}
                      placeholder="e.g. Redis caching, CORS, Rate limits"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !project.title || !project.description}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 active:scale-95"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.75 8.25" />
                </svg>
                <span>Analyzing Architecture & Q&As...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate Pitch & Q&As</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Generated Explanation Column */}
      <div className="lg:col-span-7 flex flex-col justify-between h-full min-h-[450px]">
        {explanation ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[450px] relative">
            <div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-50">
                <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Recruiter Pitch & Q&A
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg border border-slate-200 hover:border-indigo-100 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>{copied ? 'Copied!' : 'Copy Explanation'}</span>
                </button>
              </div>

              {/* Display generated text with markdown styles */}
              <div className="text-xs md:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {explanation}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-50 text-[10px] text-gray-400">
              💡 Tip: Review this pitch and prepare for the 5 likely interviewer questions listed above before your interview.
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[450px]">
            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 mb-4 animate-bounce">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M9 17h6m-6-4h6m-6-4h3.5" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Recruiter Pitch Screen</h4>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Provide your project details on the left to get a structured explanation template and 5 likely technical interview questions with ideal answers.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
