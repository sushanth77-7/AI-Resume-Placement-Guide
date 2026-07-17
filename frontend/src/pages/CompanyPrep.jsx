import React, { useState, useEffect } from 'react'
import companyService from '../services/companyService'

export default function CompanyPrep() {
  const [activeHubTab, setActiveHubTab] = useState('insights') // 'insights' | 'compare' | 'recommend'
  
  // Tab 1: Insights States
  const [companies, setCompanies] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('product') // 'product' | 'service'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCompanyId, setSelectedCompanyId] = useState('amazon')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState(null)

  // Tab 2: Compare States
  const [compAId, setCompAId] = useState('google')
  const [compBId, setCompBId] = useState('tcs')
  const [comparisonResult, setComparisonResult] = useState(null)
  const [loadingComparison, setLoadingComparison] = useState(false)

  // Tab 3: Recommendation States
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer')
  const [recommendations, setRecommendations] = useState(null)
  const [loadingRecs, setLoadingRecs] = useState(false)

  // Load initial list of companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoadingList(true)
        const result = await companyService.getAllCompanies({ category: categoryFilter })
        if (result.success && Array.isArray(result.companies)) {
          setCompanies(result.companies)
          // Default selection to first available if not already selected
          if (result.companies.length > 0) {
            const hasSelected = result.companies.some(c => c.id === selectedCompanyId)
            if (!hasSelected) {
              setSelectedCompanyId(result.companies[0].id)
            }
          }
        }
      } catch (err) {
        console.error('Failed to load companies:', err)
      } finally {
        setLoadingList(false)
      }
    }
    fetchCompanies()
  }, [categoryFilter])

  // Load detailed profile for selected company
  useEffect(() => {
    if (!selectedCompanyId) return
    const fetchCompanyDetails = async () => {
      try {
        setLoadingDetails(true)
        setExpandedFaq(null)
        const result = await companyService.getCompanyById(selectedCompanyId)
        if (result.success && result.company) {
          setSelectedCompany(result.company)
        }
      } catch (err) {
        console.error('Failed to load company details:', err)
      } finally {
        setLoadingDetails(false)
      }
    }
    fetchCompanyDetails()
  }, [selectedCompanyId])

  // Run comparison on Tab 2 load or change
  const handleCompare = async () => {
    if (!compAId || !compBId) return
    try {
      setLoadingComparison(true)
      const result = await companyService.compareCompanies(compAId, compBId)
      if (result.success && result.comparison) {
        setComparisonResult(result.comparison)
      }
    } catch (err) {
      console.error('Failed to fetch comparison:', err)
    } finally {
      setLoadingComparison(false)
    }
  }

  useEffect(() => {
    if (activeHubTab === 'compare') {
      handleCompare()
    }
  }, [activeHubTab, compAId, compBId])

  // Run recommendations on Tab 3 load or change
  const handleRecommend = async () => {
    if (!selectedRole) return
    try {
      setLoadingRecs(true)
      const result = await companyService.recommendCompanies(selectedRole)
      if (result.success && result.recommendations) {
        setRecommendations(result.recommendations)
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err)
    } finally {
      setLoadingRecs(false)
    }
  }

  useEffect(() => {
    if (activeHubTab === 'recommend') {
      handleRecommend()
    }
  }, [activeHubTab, selectedRole])

  // Local helper for difficulty badges
  const getDifficultyBadge = (difficulty) => {
    const level = (difficulty || '').toLowerCase()
    if (level === 'hard' || level === 'very hard') {
      return 'bg-rose-50 text-rose-600 border border-rose-100'
    } else if (level === 'medium' || level === 'medium-hard') {
      return 'bg-amber-50 text-amber-600 border border-amber-100'
    }
    return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
  }

  // Filter local sidebar search list
  const filteredList = companies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.overview.businessDomain.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const rolesList = [
    'MERN Stack Developer',
    'Full Stack Developer',
    'Java Developer',
    'Data Analyst',
    'AI/ML Engineer',
    'Frontend Developer',
    'Backend Developer'
  ]

  // All 20 companies list for compare dropdowns
  const compareDropdownOptions = [
    { id: 'amazon', name: 'Amazon' },
    { id: 'microsoft', name: 'Microsoft' },
    { id: 'google', name: 'Google' },
    { id: 'flipkart', name: 'Flipkart' },
    { id: 'zoho', name: 'Zoho' },
    { id: 'oracle', name: 'Oracle' },
    { id: 'adobe', name: 'Adobe' },
    { id: 'sap', name: 'SAP' },
    { id: 'salesforce', name: 'Salesforce' },
    { id: 'cisco', name: 'Cisco' },
    { id: 'tcs', name: 'TCS' },
    { id: 'infosys', name: 'Infosys' },
    { id: 'wipro', name: 'Wipro' },
    { id: 'accenture', name: 'Accenture' },
    { id: 'cognizant', name: 'Cognizant' },
    { id: 'capgemini', name: 'Capgemini' },
    { id: 'hcl', name: 'HCL' },
    { id: 'tech-mahindra', name: 'Tech Mahindra' },
    { id: 'ltimindtree', name: 'LTIMindtree' },
    { id: 'mphasis', name: 'Mphasis' }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-950 to-slate-950 text-white py-12 px-4 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-xs bg-indigo-500/20 text-indigo-300 font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/30">
            Module 3: Career Opportunities Hub
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mt-4">
            Company Insights & <span className="text-indigo-400">Hiring Tracker</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl leading-relaxed">
            Research hiring patterns, package structures, rounds timelines, prepare company-specific questions, run comparisons, and get target role recommendations.
          </p>
        </div>
      </div>

      {/* Main Hub Tabs */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm max-w-lg">
          <button
            onClick={() => setActiveHubTab('insights')}
            className={`flex-1 py-2.5 px-4 font-bold text-xs md:text-sm rounded-xl transition-all ${
              activeHubTab === 'insights' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            🏢 Company Insights
          </button>
          <button
            onClick={() => setActiveHubTab('compare')}
            className={`flex-1 py-2.5 px-4 font-bold text-xs md:text-sm rounded-xl transition-all ${
              activeHubTab === 'compare' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            ⚔️ Compare Companies
          </button>
          <button
            onClick={() => setActiveHubTab('recommend')}
            className={`flex-1 py-2.5 px-4 font-bold text-xs md:text-sm rounded-xl transition-all ${
              activeHubTab === 'recommend' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            🎯 Role Recommendations
          </button>
        </div>
      </div>

      {/* Dynamic Tab Body */}
      <div className="max-w-7xl mx-auto px-4">
        
        {/* TAB 1: COMPANY INSIGHTS */}
        {activeHubTab === 'insights' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar List */}
            <div className="lg:col-span-4 bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-5">
              
              {/* Category selector */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setCategoryFilter('product')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    categoryFilter === 'product' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Product Companies
                </button>
                <button
                  onClick={() => setCategoryFilter('service')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    categoryFilter === 'service' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Service Companies
                </button>
              </div>

              {/* Search bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or domain..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
                <span className="absolute left-3.5 top-3 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>

              {/* Company list scroll */}
              <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                {loadingList ? (
                  <div className="text-center py-12 text-xs text-gray-400 animate-pulse">Loading list...</div>
                ) : filteredList.length > 0 ? (
                  filteredList.map((c) => {
                    const isSelected = selectedCompanyId === c.id
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCompanyId(c.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer select-none transition-all ${
                          isSelected 
                            ? 'bg-slate-900 border-slate-950 text-white shadow-md' 
                            : 'bg-white border-slate-100 hover:border-slate-200 text-gray-800'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm">{c.name}</h4>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            {c.placementInsights.highestSalaryRange}
                          </span>
                        </div>
                        <p className={`text-[10px] mt-1.5 line-clamp-1 ${isSelected ? 'text-slate-400' : 'text-gray-400'}`}>
                          {c.overview.businessDomain}
                        </p>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-12 text-xs text-gray-400">No matching companies.</div>
                )}
              </div>
            </div>

            {/* Profile Panel */}
            <div className="lg:col-span-8">
              {loadingDetails || !selectedCompany ? (
                <div className="bg-white border border-gray-100 rounded-3xl p-20 text-center shadow-sm flex flex-col items-center justify-center animate-pulse min-h-[500px]">
                  <svg className="w-10 h-10 animate-spin text-indigo-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.75 8.25" />
                  </svg>
                  <span className="text-xs text-gray-500 font-semibold">Loading company profile details...</span>
                </div>
              ) : (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Header card */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-40 h-40 bg-indigo-50 rounded-full blur-2xl"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {selectedCompany.category}
                        </span>
                        <h2 className="text-2xl font-black text-gray-950 mt-2">{selectedCompany.name}</h2>
                        <p className="text-xs text-gray-400 mt-1">{selectedCompany.overview.headquarters} • {selectedCompany.overview.businessDomain}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedCompany.overview.technologies.slice(0, 4).map(tech => (
                          <span key={tech} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 leading-relaxed mt-4 pt-4 border-t border-slate-50">
                      {selectedCompany.overview.history}
                    </p>
                  </div>

                  {/* Overview statistics grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Founder</span>
                      <strong className="text-xs text-slate-800 mt-1 block truncate">{selectedCompany.overview.founder}</strong>
                    </div>
                    <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Employees</span>
                      <strong className="text-xs text-slate-800 mt-1 block">{selectedCompany.overview.employeeStrength}</strong>
                    </div>
                    <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Avg Package</span>
                      <strong className="text-xs text-indigo-600 mt-1 block font-bold">{selectedCompany.placementInsights.averageFresherSalary}</strong>
                    </div>
                    <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Hiring Demand</span>
                      <strong className="text-xs text-emerald-600 mt-1 block font-bold">{selectedCompany.placementInsights.currentHiringDemand}</strong>
                    </div>
                  </div>

                  {/* Details block: Hiring Rounds, Insights, Roadmap */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Hiring rounds timeline */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
                      <h4 className="font-extrabold text-gray-900 text-sm border-b border-slate-50 pb-2">Hiring Rounds</h4>
                      <div className="relative border-l border-indigo-100 pl-4 ml-2 space-y-4">
                        {selectedCompany.hiringProcess.rounds.map((round, idx) => (
                          <div key={idx} className="relative text-xs">
                            <span className="absolute -left-6 top-1 h-3.5 w-3.5 bg-indigo-600 border-2 border-white rounded-full flex items-center justify-center text-[7px] text-white font-bold">
                              {idx+1}
                            </span>
                            <strong className="text-gray-800 font-bold block">{round.name}</strong>
                            <p className="text-gray-400 mt-0.5 leading-normal">{round.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Insights & Criteria */}
                    <div className="space-y-4">
                      
                      {/* Placement Insights */}
                      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3">
                        <h4 className="font-extrabold text-gray-900 text-sm border-b border-slate-50 pb-1.5">Placement Insights</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Salary Range:</span>
                            <span className="font-bold text-gray-800">{selectedCompany.placementInsights.packageRange}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Highest Package:</span>
                            <span className="font-bold text-gray-800">{selectedCompany.placementInsights.highestSalaryRange}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Internships:</span>
                            <span className="font-bold text-gray-800">{selectedCompany.placementInsights.internshipOpportunities}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Most Hired Roles:</span>
                            <span className="font-bold text-indigo-600 truncate max-w-[200px] text-right block">{selectedCompany.placementInsights.mostHiredRoles.slice(0, 2).join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Eligibility Criteria */}
                      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3">
                        <h4 className="font-extrabold text-gray-900 text-sm border-b border-slate-50 pb-1.5">Eligibility Criteria</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Minimum CGPA:</span>
                            <span className="font-bold text-gray-800">{selectedCompany.hiringProcess.eligibility.cgpa}</span>
                          </div>
                          <div className="flex justify-between text-right">
                            <span className="text-gray-400 text-left mr-2">Branches:</span>
                            <span className="font-bold text-gray-800 max-w-[200px] block truncate">{selectedCompany.hiringProcess.eligibility.branches}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Backlogs Allowed:</span>
                            <span className="font-bold text-rose-500">{selectedCompany.hiringProcess.eligibility.backlogs}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preparation Roadmap & Strategy */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
                    <h4 className="font-extrabold text-gray-900 text-sm border-b border-slate-50 pb-2">Preparation Roadmap & Patterns</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                      <div>
                        <strong className="text-indigo-600 block mb-1">Recommended Timeline</strong>
                        <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded inline-block mb-1.5">
                          {selectedCompany.preparationRoadmap.timeline}
                        </span>
                        <p className="text-gray-400 leading-normal">{selectedCompany.preparationRoadmap.learningPath}</p>
                      </div>
                      
                      <div>
                        <strong className="text-indigo-600 block mb-1">Key Preparation Subjects</strong>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {selectedCompany.preparationRoadmap.importantTopics.map(topic => (
                            <span key={topic} className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              {topic}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4">
                          <strong className="text-[10px] text-gray-400 uppercase font-bold">Difficulty Level:</strong>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ml-1.5 ${getDifficultyBadge(selectedCompany.preparationRoadmap.difficultyLevel)}`}>
                            {selectedCompany.preparationRoadmap.difficultyLevel}
                          </span>
                        </div>
                      </div>

                      <div>
                        <strong className="text-indigo-600 block mb-1">Company Coding Pattern</strong>
                        <div className="space-y-1.5 mt-1 text-[11px]">
                          <div><span className="text-gray-400">Questions count:</span> <strong className="text-gray-800">{selectedCompany.patternAnalysis.coding.count}</strong></div>
                          <div><span className="text-gray-400">Coding Difficulty:</span> <strong className="text-gray-800">{selectedCompany.patternAnalysis.coding.difficulty}</strong></div>
                          <div><span className="text-gray-400">Primary concepts:</span> <span className="font-bold text-indigo-600 truncate max-w-[150px] block">{selectedCompany.patternAnalysis.coding.concepts}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Curated FAQs Accordion */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
                    <h4 className="font-extrabold text-gray-900 text-sm border-b border-slate-50 pb-2">Top Curated Interview Questions</h4>
                    
                    <div className="space-y-2">
                      {[
                        { id: 'apt', label: 'Top Aptitude Topics Asked', data: selectedCompany.faqs.aptitude.join(', ') },
                        { id: 'cod', label: 'Common Coding Topics', data: selectedCompany.faqs.coding.join(', ') },
                        { id: 'tech', label: 'Top Technical Interview Questions', list: selectedCompany.faqs.technical },
                        { id: 'hr', label: 'Sample HR & Behavioral Questions', list: selectedCompany.faqs.hr }
                      ].map((faq, idx) => {
                        const isExpanded = expandedFaq === idx
                        return (
                          <div key={faq.id} className="border border-slate-100 rounded-2xl p-3 bg-slate-50/50">
                            <button
                              type="button"
                              onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                              className="w-full flex justify-between items-center text-left font-bold text-gray-900 text-xs md:text-sm"
                            >
                              <span>{faq.label}</span>
                              <svg className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t border-slate-200/50 text-xs text-gray-600 leading-relaxed animate-fadeIn">
                                {faq.data ? (
                                  <p className="font-semibold text-indigo-950 bg-indigo-50/40 p-2.5 rounded-lg border border-indigo-100/30">{faq.data}</p>
                                ) : (
                                  <ul className="space-y-2 pl-4 list-decimal">
                                    {faq.list.map((item, i) => (
                                      <li key={i} className="font-medium">{item}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SIDE-BY-SIDE COMPARISON */}
        {activeHubTab === 'compare' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm max-w-4xl mx-auto">
              <h3 className="font-extrabold text-gray-900 text-base mb-4 flex items-center">
                <span className="p-1 bg-indigo-50 text-indigo-600 rounded mr-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                  </svg>
                </span>
                Compare Two Companies Side-by-Side
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Select Company A</label>
                  <select
                    value={compAId}
                    onChange={(e) => setCompAId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
                  >
                    {compareDropdownOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Select Company B</label>
                  <select
                    value={compBId}
                    onChange={(e) => setCompBId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
                  >
                    {compareDropdownOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {loadingComparison ? (
              <div className="flex items-center justify-center p-12 bg-white border border-gray-100 rounded-3xl animate-pulse max-w-4xl mx-auto min-h-[300px]">
                <svg className="w-5 h-5 animate-spin text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.75 8.25" />
                </svg>
                <span className="text-xs text-gray-500 font-semibold">Running side-by-side matrices comparison...</span>
              </div>
            ) : comparisonResult ? (
              <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden max-w-4xl mx-auto">
                <table className="w-full border-collapse text-left text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold text-xs uppercase tracking-wider">
                      <th className="p-4 border-b border-slate-800">Criteria / Metric</th>
                      <th className="p-4 border-b border-slate-800 bg-indigo-950/60 text-indigo-300">{comparisonResult.companyA.name}</th>
                      <th className="p-4 border-b border-slate-800 bg-purple-950/60 text-purple-300">{comparisonResult.companyB.name}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-gray-700 font-medium">
                    <tr>
                      <td className="p-4 bg-slate-50 font-bold text-gray-900">Category</td>
                      <td className="p-4">{comparisonResult.companyA.category}</td>
                      <td className="p-4">{comparisonResult.companyB.category}</td>
                    </tr>
                    <tr>
                      <td className="p-4 bg-slate-50 font-bold text-gray-900">Difficulty Level</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getDifficultyBadge(comparisonResult.companyA.difficulty)}`}>
                          {comparisonResult.companyA.difficulty}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getDifficultyBadge(comparisonResult.companyB.difficulty)}`}>
                          {comparisonResult.companyB.difficulty}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 bg-slate-50 font-bold text-gray-900">Average Salary Package</td>
                      <td className="p-4 text-indigo-600 font-bold">{comparisonResult.companyA.averagePackage}</td>
                      <td className="p-4 text-purple-600 font-bold">{comparisonResult.companyB.averagePackage}</td>
                    </tr>
                    <tr>
                      <td className="p-4 bg-slate-50 font-bold text-gray-900">Salary Range</td>
                      <td className="p-4">{comparisonResult.companyA.packageRange}</td>
                      <td className="p-4">{comparisonResult.companyB.packageRange}</td>
                    </tr>
                    <tr>
                      <td className="p-4 bg-slate-50 font-bold text-gray-900">Hiring Demand</td>
                      <td className="p-4 text-emerald-600 font-bold">{comparisonResult.companyA.hiringDemand}</td>
                      <td className="p-4 text-emerald-600 font-bold">{comparisonResult.companyB.hiringDemand}</td>
                    </tr>
                    <tr>
                      <td className="p-4 bg-slate-50 font-bold text-gray-900">Eligibility CGPA</td>
                      <td className="p-4">{comparisonResult.companyA.eligibilityCGPA}</td>
                      <td className="p-4">{comparisonResult.companyB.eligibilityCGPA}</td>
                    </tr>
                    <tr>
                      <td className="p-4 bg-slate-50 font-bold text-gray-900">Recruitment Rounds</td>
                      <td className="p-4">{comparisonResult.companyA.roundsCount} Rounds</td>
                      <td className="p-4">{comparisonResult.companyB.roundsCount} Rounds</td>
                    </tr>
                    <tr>
                      <td className="p-4 bg-slate-50 font-bold text-gray-900">Primary Stack</td>
                      <td className="p-4 font-semibold text-[10px]">
                        {comparisonResult.companyA.primaryTech.slice(0, 4).join(', ')}
                      </td>
                      <td className="p-4 font-semibold text-[10px]">
                        {comparisonResult.companyB.primaryTech.slice(0, 4).join(', ')}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 bg-slate-50 font-bold text-gray-900">Work-Life Balance</td>
                      <td className="p-4">{comparisonResult.companyA.workLifeBalance}</td>
                      <td className="p-4">{comparisonResult.companyB.workLifeBalance}</td>
                    </tr>
                    <tr>
                      <td className="p-4 bg-slate-50 font-bold text-gray-900">Career Growth</td>
                      <td className="p-4">{comparisonResult.companyA.careerGrowth}</td>
                      <td className="p-4">{comparisonResult.companyB.careerGrowth}</td>
                    </tr>
                    <tr>
                      <td className="p-4 bg-slate-50 font-bold text-gray-900">Learning Opportunities</td>
                      <td className="p-4">{comparisonResult.companyA.learningOpportunities}</td>
                      <td className="p-4">{comparisonResult.companyB.learningOpportunities}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        )}

        {/* TAB 3: STUDENT RECOMMENDATIONS */}
        {activeHubTab === 'recommend' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Input Selection Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm max-w-xl mx-auto">
              <h3 className="font-extrabold text-gray-900 text-base mb-4 flex items-center">
                <span className="p-1 bg-indigo-50 text-indigo-600 rounded mr-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </span>
                Target Role Recommendation Engine
              </h3>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Select Your Target Placement Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
                >
                  {rolesList.map(roleOpt => (
                    <option key={roleOpt} value={roleOpt}>{roleOpt}</option>
                  ))}
                </select>
              </div>
            </div>

            {loadingRecs ? (
              <div className="flex items-center justify-center p-12 bg-white border border-gray-100 rounded-3xl animate-pulse max-w-4xl mx-auto min-h-[300px]">
                <svg className="w-5 h-5 animate-spin text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.75 8.25" />
                </svg>
                <span className="text-xs text-gray-500 font-semibold">Running matching matrix algorithms...</span>
              </div>
            ) : recommendations ? (
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Required Skills & Priority Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Skill checklist card */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3">
                    <h4 className="font-extrabold text-gray-900 text-sm border-b border-slate-50 pb-2">Required Skills Checklist</h4>
                    <div className="flex flex-wrap gap-2 pt-1.5">
                      {recommendations.requiredSkills.map(skill => (
                        <span key={skill} className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100 flex items-center">
                          <svg className="w-3.5 h-3.5 text-indigo-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" />
                          </svg>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Priority action card */}
                  <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-3xl p-5 shadow-sm space-y-3">
                    <h4 className="font-extrabold text-indigo-300 text-sm border-b border-indigo-900 pb-2">Preparation Priority Action Plan</h4>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {recommendations.priority}
                    </p>
                  </div>
                </div>

                {/* Recommended Companies List */}
                <div className="space-y-4">
                  <h4 className="font-extrabold text-gray-900 text-sm border-b border-slate-100 pb-2">Recommended Matching Companies</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.companies.map(recComp => (
                      <div key={recComp.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded uppercase">
                                {recComp.category}
                              </span>
                              <h4 className="font-black text-gray-900 text-base mt-2">{recComp.name}</h4>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-indigo-50 text-indigo-600 border border-indigo-100">
                              Avg: {recComp.averagePackage}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed mt-3 pt-3 border-t border-slate-50">
                            {recComp.matchReason}
                          </p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-50 flex justify-between items-center text-[10px] text-gray-400">
                          <div>
                            <span>Difficulty: </span>
                            <span className={`font-bold px-2 py-0.5 rounded ${getDifficultyBadge(recComp.difficulty)}`}>
                              {recComp.difficulty}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedCompanyId(recComp.id)
                              setCategoryFilter(recComp.category === 'Product-Based' ? 'product' : 'service')
                              setActiveHubTab('insights')
                            }}
                            className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            View Details ➔
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
