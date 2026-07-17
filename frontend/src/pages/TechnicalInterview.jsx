import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import InterviewChatbot from '../components/InterviewChatbot'
import MockInterview from '../components/MockInterview'
import ProjectAssistant from '../components/ProjectAssistant'
import ResumeQuestionAssistant from '../components/ResumeQuestionAssistant'
import InterviewResources from '../components/InterviewResources'
import interviewService from '../services/interviewService'

export default function TechnicalInterview() {
  const [activeTab, setActiveTab] = useState('overview')
  const [role, setRole] = useState('Software Engineer')
  const [mode, setMode] = useState('Technical Interview')
  
  // FAQ state
  const [faqsData, setFaqsData] = useState(null)
  const [loadingFaqs, setLoadingFaqs] = useState(true)
  const [errorFaqs, setErrorFaqs] = useState(null)
  const [faqViewMode, setFaqViewMode] = useState('role') // 'role' | 'core'
  const [selectedFaqRole, setSelectedFaqRole] = useState('MERN')
  const [selectedFaqCoreCategory, setSelectedFaqCoreCategory] = useState('OOPS')
  const [expandedFaq, setExpandedFaq] = useState(null)

  // Playbook state
  const [showPlaybook, setShowPlaybook] = useState(true)
  const [playbookTab, setPlaybookTab] = useState('stages') // 'stages' | 'soft' | 'frameworks' | 'scenarios' | 'roles'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeTab])

  // Fetch static FAQs from backend
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoadingFaqs(true)
        const result = await interviewService.getFaqs()
        if (result.success && result.data) {
          setFaqsData(result.data)
        } else {
          setErrorFaqs("Failed to load curated FAQs.")
        }
      } catch (err) {
        console.error('Error loading static FAQs:', err)
        setErrorFaqs("Could not load Q&A pairs from backend server.")
      } finally {
        setLoadingFaqs(false)
      }
    }
    fetchFAQs()
  }, [])

  const tabs = [
    { id: 'overview', label: 'Overview & FAQs' },
    { id: 'chatbot', label: 'Interview Chatbot' },
    { id: 'mock', label: 'Mock Interview' },
    { id: 'project', label: 'Project Pitcher' },
    { id: 'resume', label: 'Resume Coach' },
    { id: 'resources', label: 'Resources' }
  ]

  // Filtered questions to display in FAQ Bank
  let displayedQuestions = []
  if (faqsData) {
    if (faqViewMode === 'role') {
      displayedQuestions = faqsData.roles?.[selectedFaqRole] || []
    } else {
      displayedQuestions = faqsData.coreCS?.[selectedFaqCoreCategory] || []
    }
  }

  const rolePrepPlans = {
    'MERN': 'Focus on JavaScript execution internals, React hooks, custom state providers (Context API/Redux), Express routing structure, MongoDB index types, JWT session tokens, and performance optimizations (code-splitting, lazy-loading).',
    'Full Stack': 'Master MVC architectures, REST API vs GraphQL query design, Docker container configuration, database migrations, security controls (XSS/CSRF), Redis caching, and horizontal scaling strategies.',
    'Java Developer': 'Review JVM memory layout (Heap vs Stack), Garbage Collection algorithms,HashMap internals, multithreaded concurrency (Executor frameworks), Spring Boot beans, Hibernate caching (L1 vs L2), and microservice coordination.',
    'AI/ML Engineer': 'Understand supervised/unsupervised model training, Bias-Variance tradeoff, gradient optimization algorithms (Adam/SGD), Regularization penalties (L1/L2), evaluation metrics (ROC-AUC), CNN/RNN layers, Transformers, and Vertex/SageMaker deployment.',
    'Data Analyst': 'Master complex SQL queries (window functions, recursive CTEs), clean raw data flows, use statistical metrics, conduct A/B hypothesis experiments, model Pandas data structures, and follow data visualization best practices.',
    'Python Developer': 'Know the Global Interpreter Lock (GIL) constraints, generator expressions, decorators, dunder methods, FastAPI/Django request execution, memory management, and multiprocessing configurations.',
    'Frontend Developer': 'Review CSS Box-Model, Grid/Flex layouts, JS closure structures, event propagation, accessibility criteria (WAI-ARIA), browser storage capacities, and virtual DOM comparisons.',
    'Backend Developer': 'Master RESTful design, B-Tree database indexes, rate-limiting counters, database connection pools, ACID compliance, load-balancing models (weighted round-robin), and MQ pub-sub networks.'
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/placement-guide" className="hover:text-blue-600 font-medium transition-colors">
            Placement Guide
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Technical Interview Prep</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-100">
                Module 2
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-950 mt-4 tracking-tight">
                Technical Interview <span className="text-indigo-600">Prep</span>
              </h1>
              <p className="text-gray-500 mt-3 text-base md:text-lg leading-relaxed max-w-2xl">
                Prepare for technical, project-based, and HR interviews. Practice with our AI Mock Interview assistant, generate project pitches, and review standard FAQs.
              </p>
            </div>

            {/* Profile summary card */}
            <div className="lg:col-span-4 bg-gradient-to-br from-indigo-950 to-purple-950 text-white rounded-2xl p-6 shadow-md border border-indigo-900 flex flex-col justify-between min-h-[180px]">
              <div>
                <h3 className="font-bold text-base mb-1">AI Assistant Status</h3>
                <p className="text-[11px] text-indigo-200">Equipped with Groq API llama-3.3-70b model</p>
              </div>

              <div className="my-4 space-y-1 text-xs text-indigo-200">
                <div className="flex justify-between">
                  <span>Selected Role:</span>
                  <span className="font-bold text-white">{role}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selected Mode:</span>
                  <span className="font-bold text-white">{mode}</span>
                </div>
              </div>

              <p className="text-[10px] text-indigo-300 leading-relaxed">
                Use the chatbot, mock simulation, and project pitch modules to test your readiness. Change parameters in the chatbot tab.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Interview Guidance & Strategy Section */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden transition-all duration-300">
          <div 
            onClick={() => setShowPlaybook(!showPlaybook)}
            className="p-6 bg-slate-900 text-white flex justify-between items-center cursor-pointer select-none"
          >
            <div className="flex items-center space-x-3">
              <span className="p-2 bg-indigo-600 text-white rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              <div>
                <h2 className="text-lg font-black tracking-tight">Interview Guidance & Strategy Playbook</h2>
                <p className="text-xs text-slate-400">Master interview stages, interviewer expectations, body language, STAR method, and roadmaps.</p>
              </div>
            </div>
            <button className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors">
              <svg className={`w-5 h-5 transform transition-transform duration-200 ${showPlaybook ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {showPlaybook && (
            <div className="p-6 border-t border-slate-100">
              {/* Playbook Tabs */}
              <div className="flex border-b border-gray-100 pb-3 mb-6 overflow-x-auto gap-2 no-scrollbar">
                {[
                  { id: 'stages', label: '1. Stages & Expectations' },
                  { id: 'soft', label: '2. Communication & Body Language' },
                  { id: 'frameworks', label: '3. Strategic Frameworks' },
                  { id: 'scenarios', label: '4. Sample Scenarios' },
                  { id: 'roles', label: '5. Role Roadmaps' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setPlaybookTab(t.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                      playbookTab === t.id 
                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-slate-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Playbook Tab Contents */}
              <div className="min-h-[250px] text-gray-600 leading-relaxed text-xs md:text-sm animate-fadeIn">
                {/* 1. Stages & Expectations */}
                {playbookTab === 'stages' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <h4 className="font-extrabold text-gray-900 text-sm mb-3 flex items-center">
                          <span className="h-2 w-2 bg-indigo-600 rounded-full mr-2"></span>
                          What are Technical Interviews?
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Technical interviews evaluate your engineering skills, analytical problem-solving, structural coding proficiency, and overall comprehension of computer systems. Interviewers don't just look for working code; they evaluate your thinking patterns and approach to constraints.
                        </p>
                      </div>

                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <h4 className="font-extrabold text-gray-900 text-sm mb-3 flex items-center">
                          <span className="h-2 w-2 bg-indigo-600 rounded-full mr-2"></span>
                          Interviewer Expectations
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500">
                          <div className="p-2 bg-white rounded-lg border border-slate-200/50">
                            <strong className="text-gray-800 block mb-0.5">Logical Clarity</strong> Breakdown complex criteria step-by-step.
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-slate-200/50">
                            <strong className="text-gray-800 block mb-0.5">Conceptual Depth</strong> Know execution models (memory, databases).
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-slate-200/50">
                            <strong className="text-gray-800 block mb-0.5">Clean Syntax</strong> Write readable, DRY, and well-structured code.
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-slate-200/50">
                            <strong className="text-gray-800 block mb-0.5">Coachability</strong> Listen to advice and adapt dynamically.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                      <h4 className="font-bold text-gray-900 text-sm mb-4">Standard Recruitment Stages</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { title: 'Online Assessment', desc: '60-90 min coding test covering 2-3 DSA questions and CS fundamental MCQs.' },
                          { title: 'Technical Rounds', desc: '45-60 min live coding, algorithmic design, debugging, or system queries.' },
                          { title: 'System / Project Round', desc: 'Review of your resume architecture, scaling issues, API calls, and db choices.' },
                          { title: 'HR & Culture Fit', desc: 'Behavioral interview matching core values, adaptability, and compensation.' }
                        ].map((stage, idx) => (
                          <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-colors">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-1">Stage 0{idx+1}</span>
                            <h5 className="font-bold text-gray-900 text-xs mb-1.5">{stage.title}</h5>
                            <p className="text-[11px] text-gray-400 leading-normal">{stage.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Communication & Body Language */}
                {playbookTab === 'soft' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 bg-indigo-50/20 border border-indigo-100/50 rounded-2xl">
                      <h4 className="font-bold text-indigo-900 text-sm mb-2.5 flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        Thinking Aloud Strategy
                      </h4>
                      <p className="text-[11px] text-indigo-950/70 leading-relaxed">
                        Avoid sitting in silence while writing code or solving a database schema. Talk continuously about what parameters you are validating, what data structures you are considering, and what time complexities you seek to minimize. This lets the interviewer assist you and evaluate your problem-solving flow even if your syntax fails.
                      </p>
                    </div>

                    <div className="p-5 bg-purple-50/20 border border-purple-100/50 rounded-2xl">
                      <h4 className="font-bold text-purple-900 text-sm mb-2.5 flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Confidence & Body Language
                      </h4>
                      <ul className="space-y-1.5 text-[11px] text-purple-950/70 list-disc pl-4">
                        <li>Maintain eye contact by looking at your webcam rather than standard windows.</li>
                        <li>Sit upright to convey alertness and professional attentiveness.</li>
                        <li>Nod to indicate active listening and prompt understanding.</li>
                        <li>Use hand gestures naturally when explaining data streams or system architectures.</li>
                      </ul>
                    </div>

                    <div className="p-5 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl">
                      <h4 className="font-bold text-emerald-900 text-sm mb-2.5 flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Dressing & Setup Tips
                      </h4>
                      <ul className="space-y-1.5 text-[11px] text-emerald-950/70 list-disc pl-4">
                        <li><strong>Dressing:</strong> Opt for neat, clean business-casual attire (e.g. collared shirts, ironed tops) even in virtual formats.</li>
                        <li><strong>Environment:</strong> Keep your room background simple, clear of clutter, and minimize ambient background noises.</li>
                        <li><strong>Lighting:</strong> Position your main light source in front of you to prevent dark silhouettes.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 3. Strategic Frameworks */}
                {playbookTab === 'frameworks' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-gray-900 text-sm mb-3">STAR Method (Behavioral Questions)</h4>
                        <div className="space-y-2">
                          <div className="text-[11px]"><strong className="text-indigo-600 uppercase">Situation:</strong> Define the context (e.g. "In my last team hackathon project...").</div>
                          <div className="text-[11px]"><strong className="text-indigo-600 uppercase">Task:</strong> Highlight the specific problem (e.g. "Our APIs were overloading the SQL database...").</div>
                          <div className="text-[11px]"><strong className="text-indigo-600 uppercase">Action:</strong> Explain what you coded/implemented (e.g. "I configured Redis for query caching...").</div>
                          <div className="text-[11px]"><strong className="text-indigo-600 uppercase">Result:</strong> Mention quantifiable achievements (e.g. "Database load decreased by 40%").</div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm mb-1">Group Discussion (GD) Strategies</h4>
                          <p className="text-[11px] text-gray-500 leading-relaxed">
                            Speak early to frame the discussion, support others with constructive transitions ("I agree with Rohit's idea, and to build on that..."), and help summarize when things go off-track.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm mb-1">Handling Unknown Questions</h4>
                          <p className="text-[11px] text-gray-500 leading-relaxed">
                            Never bluff or guess. Instead, structure your response: "I haven't implemented this framework directly, but looking at its architecture, I hypothesize that it handles state similarly to... Is that correct?"
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-50/20 border border-indigo-100/50 p-4 rounded-xl text-xs text-indigo-950">
                      💡 <strong>Project Discussion Strategy:</strong> When introducing a project, use the <strong>Why-What-How</strong> sequence. Start with the problem it resolves, list the technologies and why they were selected, and explain how you resolved a major scaling or API roadblock.
                    </div>
                  </div>
                )}

                {/* 4. Sample Scenarios */}
                {playbookTab === 'scenarios' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <h4 className="font-bold text-rose-600 text-xs uppercase tracking-wider mb-3">Scenario 1: Stuck on a DSA problem</h4>
                      <div className="space-y-3 text-[11px]">
                        <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-lg text-rose-950">
                          <strong className="block text-[10px] uppercase text-rose-700">❌ The Wrong Way (Silent Failure):</strong>
                          Candidate stares at the whiteboard/code for 5 minutes in absolute silence, sweated, and mutters, "I don't know how to solve this."
                        </div>
                        <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-950">
                          <strong className="block text-[10px] uppercase text-emerald-700">✅ The Right Way (Interactive Solving):</strong>
                          "I can see the brute force approach is O(N²) using nested loops. To optimize it, I am considering if we can use a hash set to store elements in a single pass to fetch items in O(1) time. Let me trace that logic..."
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <h4 className="font-bold text-rose-600 text-xs uppercase tracking-wider mb-3">Scenario 2: Explaining Project Bottlenecks</h4>
                      <div className="space-y-3 text-[11px]">
                        <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-lg text-rose-950">
                          <strong className="block text-[10px] uppercase text-rose-700">❌ The Wrong Way (Vague/Generic):</strong>
                          "Our database was having some bugs when many users registered, but we fixed them and it was working fine afterwards."
                        </div>
                        <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-950">
                          <strong className="block text-[10px] uppercase text-emerald-700">✅ The Right Way (Metrics-Driven):</strong>
                          "During load testing, our user auth API latency spiked to 2.5s. I analyzed DB query logs and found missing indexes on the token keys. By adding a compound index, query times fell to 40ms, correcting the spike."
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Role Roadmaps */}
                {playbookTab === 'roles' && (
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-4">Targeted Preparation Roadmap</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(rolePrepPlans).map(([rName, rPlan], idx) => (
                        <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-all">
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                            {rName}
                          </span>
                          <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                            {rPlan}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex border-b border-gray-200 overflow-x-auto mb-8 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 font-semibold text-sm border-b-2 whitespace-nowrap transition-all ${
                  isActive 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Dynamic Tab Panels */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* FAQ Section */}
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg mr-2.5">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      Interview FAQ Bank
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">Review curated database Q&A pairs commonly tested in screening interviews.</p>
                  </div>
                  
                  {/* Selectors for View Mode, Role, and CS Category */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                      <button
                        onClick={() => {
                          setFaqViewMode('role')
                          setExpandedFaq(null)
                        }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${faqViewMode === 'role' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                      >
                        Role Q&A
                      </button>
                      <button
                        onClick={() => {
                          setFaqViewMode('core')
                          setExpandedFaq(null)
                        }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${faqViewMode === 'core' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                      >
                        Core CS Fundamentals
                      </button>
                    </div>

                    {faqViewMode === 'role' ? (
                      <select
                        value={selectedFaqRole}
                        onChange={(e) => {
                          setSelectedFaqRole(e.target.value)
                          setExpandedFaq(null)
                        }}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
                      >
                        {['MERN', 'Full Stack', 'Java Developer', 'AI/ML Engineer', 'Data Analyst', 'Python Developer', 'Frontend Developer', 'Backend Developer'].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    ) : (
                      <select
                        value={selectedFaqCoreCategory}
                        onChange={(e) => {
                          setSelectedFaqCoreCategory(e.target.value)
                          setExpandedFaq(null)
                        }}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
                      >
                        {['OOPS', 'DBMS', 'OS', 'Computer Networks', 'SQL', 'DSA', 'HR', 'Behavioral Questions'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* FAQ Answers List */}
                {loadingFaqs ? (
                  <div className="flex items-center justify-center p-12 bg-white border border-gray-100 rounded-2xl animate-pulse">
                    <svg className="w-5 h-5 animate-spin text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.75 8.25" />
                    </svg>
                    <span className="text-xs text-gray-500 font-semibold">Loading FAQ database...</span>
                  </div>
                ) : errorFaqs ? (
                  <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center text-rose-700 text-xs font-semibold">
                    {errorFaqs}
                  </div>
                ) : (
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {displayedQuestions.map((q, idx) => {
                      const isExpanded = expandedFaq === idx
                      return (
                        <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4.5 shadow-sm transition-all hover:border-slate-200">
                          <button
                            onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                            className="w-full flex justify-between items-center text-left font-bold text-gray-900 text-sm md:text-base"
                          >
                            <span>{q.q}</span>
                            <span className="flex items-center space-x-2">
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-extrabold uppercase">
                                Q{idx+1}
                              </span>
                              <svg className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </span>
                          </button>
                          {isExpanded && (
                            <div className="mt-4 pt-3 border-t border-slate-50 text-xs md:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                              {q.a}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Best Practices Grid */}
              <div className="border-t border-gray-100 pt-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg mr-2.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  Communication & Confidence Tips
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 text-sm mb-2">1. Thinking Aloud Strategy</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Do not sit in silence while coding or solving. Speak your thoughts. Explain what algorithms you are considering, why you are selecting a data structure, and what trade-offs you see. This helps interviewers evaluate your logical path even if you get stuck.
                    </p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 text-sm mb-2">2. STAR Method Behavioral Alignment</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Hiring managers love stories. Explain project hurdles, bugs, or hackathon outcomes using Situation, Task, Action, and Result. Make it metrics-oriented (e.g. "reduced search latency by 40%").
                    </p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 text-sm mb-2">3. Handling Unknown Questions</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      If asked something you do not know, do not bluff. Say: "I haven't worked deeply with this topic, but based on my knowledge of related systems, I suspect it works like..." and explain your hypothesis. Or politely confirm you will review it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chatbot' && (
            <InterviewChatbot 
              role={role} 
              mode={mode} 
              setRole={setRole} 
              setMode={setMode} 
            />
          )}

          {activeTab === 'mock' && (
            <MockInterview 
              role={role} 
              mode={mode} 
            />
          )}

          {activeTab === 'project' && (
            <ProjectAssistant 
              role={role} 
            />
          )}

          {activeTab === 'resume' && (
            <ResumeQuestionAssistant 
              role={role} 
            />
          )}

          {activeTab === 'resources' && (
            <InterviewResources />
          )}
        </div>
      </div>
    </div>
  )
}
