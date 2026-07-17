import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CompanyWiseTopics from '../components/CompanyWiseTopics'
import CodingStrategies from '../components/CodingStrategies'
import LanguageGuide from '../components/LanguageGuide'
import PracticeDashboard from '../components/PracticeDashboard'
import CodingRoadmap from '../components/CodingRoadmap'
import CodingResources from '../components/CodingResources'

export default function CodingGuide() {
  const [activeTab, setActiveTab] = useState('topics')
  const [totalCompleted, setTotalCompleted] = useState(0)

  // Load progress stats from PracticeDashboard storage to show in hero banner
  useEffect(() => {
    const handleUpdateProgress = () => {
      const saved = localStorage.getItem('coding_completed_tasks')
      if (saved) {
        const parsed = JSON.parse(saved)
        const completedCount = Object.values(parsed).filter(Boolean).length
        setTotalCompleted(completedCount)
      }
    }
    handleUpdateProgress()
    window.addEventListener('storage', handleUpdateProgress)
    return () => window.removeEventListener('storage', handleUpdateProgress)
  }, [activeTab])

  // Total tasks across all stages = 28
  const totalTasks = 28
  const progressPercentage = Math.round((totalCompleted / totalTasks) * 100) || 0

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeTab])

  const tabs = [
    { id: 'topics', label: 'Company & Topics' },
    { id: 'strategies', label: 'Optimization & Complexity' },
    { id: 'languages', label: 'Language Roadmaps' },
    { id: 'dashboard', label: 'Daily Practice' },
    { id: 'roadmaps', label: 'Prep Timelines' },
    { id: 'resources', label: 'Resources & Downloads' }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/placement-guide" className="hover:text-blue-600 font-medium transition-colors">
            Placement Guide
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Coding Round Prep</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-100">
                Module 2
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-950 mt-4 tracking-tight">
                Coding Round <span className="text-indigo-600">Preparation</span>
              </h1>
              <p className="text-gray-500 mt-3 text-base md:text-lg leading-relaxed max-w-2xl">
                Master Online Coding Assessments (OAs) and Technical Interviews. Transition from basics to advanced DSA and crack top companies.
              </p>

              {/* Grid guides */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center">
                    <span className="h-2 w-2 bg-indigo-600 rounded-full mr-2"></span>
                    Online Assessments
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Automated testing portals using time bounds (typically 1 second) and memory bounds. Acts as a strict elimination round.
                  </p>
                </div>
                <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center">
                    <span className="h-2 w-2 bg-indigo-600 rounded-full mr-2"></span>
                    Reading Problems
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Identify inputs, outputs, constraints (e.g. N &lt;= 10^5 indicates O(N log N) solution), edge cases, and hidden test cases.
                  </p>
                </div>
                <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center">
                    <span className="h-2 w-2 bg-indigo-600 rounded-full mr-2"></span>
                    Logical Thinking
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Build pattern recognition, draw dependency trees, dry run logic on paper, and write structured pseudocode first.
                  </p>
                </div>
              </div>
            </div>

            {/* Coding Readiness card */}
            <div className="lg:col-span-4 bg-gradient-to-br from-indigo-950 to-purple-950 text-white rounded-2xl p-6 shadow-md border border-indigo-900 flex flex-col justify-between h-full min-h-[220px]">
              <div>
                <h3 className="font-bold text-lg mb-1">Coding Readiness</h3>
                <p className="text-xs text-indigo-200">Stage checklist progress updates in real-time</p>
              </div>

              <div className="my-5">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-4xl font-extrabold tracking-tight">{progressPercentage}%</span>
                  <span className="text-xs text-indigo-300 font-medium">{totalCompleted} of {totalTasks} tasks</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-3 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-xs text-indigo-200 leading-relaxed">
                {progressPercentage === 100 
                  ? "🎉 Amazing! You are fully prepared for product and service coding rounds!" 
                  : progressPercentage > 50 
                    ? "💪 Great job! Focus on advanced graphs, dynamic programming, and mock OAs." 
                    : "💡 Navigate to the Daily Practice tab to start checking off preparation tasks."}
              </p>

              <div className="mt-4 pt-3 border-t border-indigo-900">
                <Link 
                  to="/practice-zone" 
                  className="block text-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-bold text-xs transition-colors shadow-sm"
                >
                  Open Coding Sandbox ⚡
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs list */}
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

        {/* Tab contents */}
        <div className="min-h-[400px]">
          {activeTab === 'topics' && <CompanyWiseTopics />}
          {activeTab === 'strategies' && <CodingStrategies />}
          {activeTab === 'languages' && <LanguageGuide />}
          {activeTab === 'dashboard' && <PracticeDashboard />}
          {activeTab === 'roadmaps' && <CodingRoadmap />}
          {activeTab === 'resources' && <CodingResources />}
        </div>
      </div>
    </div>
  )
}
