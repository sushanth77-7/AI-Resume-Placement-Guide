import React from 'react'

export default function AptitudeTips() {
  const failures = [
    {
      id: 1,
      reason: 'Treating it like a Math exam',
      solution: 'Placements test speed, not derivation. Ditch lengthy step-by-step methods and master formula shortcuts and approximation.',
      icon: (
        <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    {
      id: 2,
      reason: 'Poor Time Management',
      solution: 'Spending too much time (2+ minutes) on a single difficult question. Implement the "1-minute rule": if you can\'t solve it in 60s, skip and move on.',
      icon: (
        <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 3,
      reason: 'Lack of Regular Mock Practice',
      solution: 'Practicing questions offline with no timer is very different from actual tests. Solve at least 2 online mock tests weekly under strict time bounds.',
      icon: (
        <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      id: 4,
      reason: 'Skipping English & Logic sections',
      solution: 'Students focus solely on Quant, but Logical Reasoning and Verbal sections are scoring boosters and often have individual section cutoffs.',
      icon: (
        <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      )
    }
  ]

  const shortcuts = [
    {
      title: 'Option Elimination',
      desc: 'Plug options back into the question instead of solving. Very effective in Equations, Ages, and Number System problems.',
      pillColor: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    },
    {
      title: 'Unit Digit & Digital Sum',
      desc: 'Find the final digit or digit sum of options. If they differ, calculate only unit digits to get answers instantly without full calculation.',
      pillColor: 'bg-blue-50 text-blue-700 border-blue-100'
    },
    {
      title: 'Approximation',
      desc: 'In complex arithmetic (Profit & Loss, Compound Interest), round off decimals or percentages to estimate the answer close to the choices.',
      pillColor: 'bg-amber-50 text-amber-700 border-amber-100'
    },
    {
      title: 'Rule of Alligation',
      desc: 'Use cross-subtraction ratio technique to solve mixtures, average speeds, average ages, and profit/loss distribution problems rapidly.',
      pillColor: 'bg-indigo-50 text-indigo-700 border-indigo-100'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Failures and Solutions Section */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500 px-3 py-1 bg-rose-50 rounded-full border border-rose-100">
            Pitfalls & Remedies
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-3">Why Students Fail Aptitude Tests</h2>
          <p className="text-gray-500 mt-2">Identify these common mistakes early to pivot your preparation strategy effectively.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {failures.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex space-x-4 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 bg-rose-50 p-3 rounded-xl h-12 w-12 flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1.5">{item.reason}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-semibold text-emerald-600 block mb-1">Solution:</span> 
                  {item.solution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy and Practice Plan Section */}
      <div className="border-t border-gray-100 pt-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
            Roadmap to Success
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-3">Best Preparation Strategy</h2>
          <p className="text-gray-500 mt-2">A structured approach to target speed, concept accuracy, and exam temperament.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Practice Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">1. Daily Practice Plan</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Consistency beats intense cramming. Follow a balanced daily routine:</p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2 font-bold">•</span>
                <span><strong>Morning (45 mins):</strong> Quantitative tricks, quick formulas review, mental math drills.</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2 font-bold">•</span>
                <span><strong>Afternoon (60 mins):</strong> Core topics practice (Solve 20 Quant questions, 15 Logical puzzles).</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2 font-bold">•</span>
                <span><strong>Evening (30 mins):</strong> Verbal ability drills (1 Reading Passage, 10 error correction).</span>
              </li>
            </ul>
          </div>

          {/* Time Management Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">2. Time Management & Mocks</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Your goal is to answer quickly. Keep these pointers in mind:</p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2 font-bold">•</span>
                <span><strong>The 1-Minute Rule:</strong> Never stick to a question. If you are stuck after 45 seconds, mark it for review and skip.</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2 font-bold">•</span>
                <span><strong>Sectional Mock Tests:</strong> Take 20-minute mini sectional mocks to gauge performance in specific areas.</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2 font-bold">•</span>
                <span><strong>Full Mocks (Weekly):</strong> Sit down for a full 1-hour aptitude test to build mental endurance.</span>
              </li>
            </ul>
          </div>

          {/* Revision Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.75 8.25" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">3. Revision Methods</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Retain shortcuts and pattern types with active recall methods:</p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2 font-bold">•</span>
                <span><strong>The Formula Notebook:</strong> Maintain a dedicated handbook with formulas, tables (up to 30), squares (up to 30), and cubes (up to 20).</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2 font-bold">•</span>
                <span><strong>Error Log:</strong> Keep a record of questions you got wrong during mock tests. Re-solve them every weekend.</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2 font-bold">•</span>
                <span><strong>Active Spaced Review:</strong> Revisit topics every 10 days rather than studying everything sequentially.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Shortcuts Grid Section */}
      <div className="bg-indigo-950 text-white rounded-3xl p-6 md:p-10 shadow-lg">
        <h3 className="text-2xl font-bold mb-2">Essential Shortcut Techniques</h3>
        <p className="text-indigo-200 text-sm mb-8">Reduce your solving time from minutes to seconds with these calculation secrets.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="bg-indigo-900/50 border border-indigo-800/40 p-5 rounded-2xl">
              <div className={`text-xs font-bold px-2 py-1 rounded inline-block mb-3 border ${shortcut.pillColor}`}>
                {shortcut.title}
              </div>
              <p className="text-xs text-indigo-100 leading-relaxed">
                {shortcut.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
