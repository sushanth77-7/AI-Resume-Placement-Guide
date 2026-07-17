import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AptitudeTopics from '../components/AptitudeTopics'
import AptitudeTips from '../components/AptitudeTips'
import SampleQuestions from '../components/SampleQuestions'
import Resources from '../components/Resources'

export default function AptitudeGuide() {
  const [activeTab, setActiveTab] = useState('overview')
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('aptitude_completed_topics')
    return saved ? JSON.parse(saved) : {}
  })

  // Total topics = 10 (Quant) + 7 (Logical) + 5 (Verbal) = 22
  const totalTopics = 22

  const toggleTopic = (topicId) => {
    setCompletedTopics(prev => {
      const updated = { ...prev, [topicId]: !prev[topicId] }
      localStorage.setItem('aptitude_completed_topics', JSON.stringify(updated))
      return updated
    })
  }

  const completedCount = Object.values(completedTopics).filter(Boolean).length
  const progressPercentage = Math.round((completedCount / totalTopics) * 100)

  // Scroll to top when active tab changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeTab])

  const tabs = [
    { id: 'overview', label: 'Syllabus & Topics' },
    { id: 'tips', label: 'Preparation Strategy' },
    { id: 'questions', label: 'Sample Questions' },
    { id: 'resources', label: 'Resources & Downloads' }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Back button and breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/placement-guide" className="hover:text-blue-600 font-medium transition-colors">
            Placement Guide
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Aptitude Prep</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">
                Module 2
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mt-4 tracking-tight">
                Aptitude Preparation <span className="text-blue-600">Guide</span>
              </h1>
              <p className="text-gray-500 mt-3 text-base md:text-lg leading-relaxed max-w-2xl">
                Master the first critical elimination round of campus placements. Evaluate your progress, learn shortcuts, and access curated study guides.
              </p>

              {/* Introduction Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-slate-50/80 border border-slate-100 p-4.5 rounded-2xl">
                  <h4 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center">
                    <span className="h-2 w-2 bg-blue-600 rounded-full mr-2"></span>
                    What is Aptitude?
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Testing of mathematical accuracy, logical deduction, and verbal comprehension under strict time constraints.
                  </p>
                </div>
                <div className="bg-slate-50/80 border border-slate-100 p-4.5 rounded-2xl">
                  <h4 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center">
                    <span className="h-2 w-2 bg-blue-600 rounded-full mr-2"></span>
                    Why Companies Test It?
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Assess raw problem-solving capability, logical clarity, speed, and standard communication skills.
                  </p>
                </div>
                <div className="bg-slate-50/80 border border-slate-100 p-4.5 rounded-2xl">
                  <h4 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center">
                    <span className="h-2 w-2 bg-blue-600 rounded-full mr-2"></span>
                    First Elimination Round?
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Acts as a fast filter to reduce thousands of resumes to a manageable list of students for interviewers.
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col justify-between h-full min-h-[200px]">
              <div>
                <h3 className="font-bold text-lg mb-1">Your Prep Progress</h3>
                <p className="text-xs text-slate-400">Checked topics represent your conceptual readiness</p>
              </div>

              <div className="my-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-4xl font-extrabold tracking-tight">{progressPercentage}%</span>
                  <span className="text-xs text-slate-400 font-medium">{completedCount} of {totalTopics} topics</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                {progressPercentage === 100 
                  ? "🎉 Incredible! You've covered all core topics. Take a mock test!" 
                  : progressPercentage > 50 
                    ? "👍 Doing great! Push harder on logical reasoning and mocks." 
                    : "💡 Check off topics in the syllabus tab as you study."}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800">
                <Link 
                  to="/practice-zone" 
                  className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-bold text-xs transition-colors shadow-sm"
                >
                  Launch Live Mock Tests ⚡
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Content Section */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200 overflow-x-auto mb-8 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 font-semibold text-sm border-b-2 whitespace-nowrap transition-all ${
                  isActive 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Dynamic Tab Contents */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <AptitudeTopics 
              completedTopics={completedTopics} 
              toggleTopic={toggleTopic} 
            />
          )}
          {activeTab === 'tips' && (
            <AptitudeTips />
          )}
          {activeTab === 'questions' && (
            <SampleQuestions />
          )}
          {activeTab === 'resources' && (
            <Resources />
          )}
        </div>
      </div>
    </div>
  )
}
