import React from 'react'

export default function InterviewResources() {
  const websites = [
    {
      name: 'Pramp',
      url: 'https://www.pramp.com',
      desc: 'Free peer-to-peer mock interview platform. Practice live coding, system design, and behavioral interviews with fellow developers.'
    },
    {
      name: 'Interviewing.io',
      url: 'https://interviewing.io',
      desc: 'Practice anonymous mock interviews with senior engineers from Google, Amazon, and Meta. Good for getting direct feedback.'
    },
    {
      name: 'IndiaBIX (HR Interview)',
      url: 'https://www.indiabix.com/hr-interview/questions-and-answers/',
      desc: 'Great repository of classic HR interview questions (e.g. "Tell me about yourself", "Why this company") with sample candidate answers.'
    },
    {
      name: 'GeeksforGeeks Interview Corner',
      url: 'https://www.geeksforgeeks.org/placement-corner/',
      desc: 'Explore previous placement interview logs sorted by company names to find specific questions and processes.'
    }
  ]

  const channels = [
    {
      name: 'takeUforward (Striver)',
      url: 'https://www.youtube.com/@takeUforward',
      desc: 'Detailed SDE sheets, core CS fundamentals (OS, DBMS, CN) in short playlists, and coding interview dry runs.'
    },
    {
      name: 'Aditya Verma',
      url: 'https://www.youtube.com/@AdityaVerma',
      desc: 'The best channel for mastering Dynamic Programming, Binary Search, Heap, and Stack concepts step-by-step.'
    },
    {
      name: 'Exponent (Tech Interviews)',
      url: 'https://www.youtube.com/@ExponentTV',
      desc: 'Mock behavioral, system design, and PM interviews showing live video recordings and critiquing answers.'
    }
  ]

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Websites & Peer Platforms */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Preparation Platforms & Websites
          </h3>
          <div className="space-y-5">
            {websites.map((web, idx) => (
              <div key={idx} className="group border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                <a 
                  href={web.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center mb-1 text-sm"
                >
                  {web.name}
                  <svg className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p className="text-xs text-gray-500 leading-relaxed">{web.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* YouTube Channels */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Recommended YouTube Channels
          </h3>
          <div className="space-y-5">
            {channels.map((chan, idx) => (
              <div key={idx} className="group border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                <a 
                  href={chan.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-bold text-rose-600 hover:text-rose-800 transition-colors flex items-center mb-1 text-sm"
                >
                  {chan.name}
                  <svg className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p className="text-xs text-gray-500 leading-relaxed">{chan.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STAR Method Cheat sheet */}
      <div className="bg-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-lg">
        <h3 className="text-xl font-bold mb-2">The STAR Interview Method</h3>
        <p className="text-indigo-200 text-xs mb-6 leading-relaxed">
          When answering behavioral or project-based questions, structure your answers using the STAR format to stay concise and metrics-oriented.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-indigo-900/40 border border-indigo-800/40 p-5 rounded-2xl">
            <span className="text-lg font-black text-indigo-400 block mb-1">S</span>
            <h4 className="font-bold text-xs uppercase mb-2">Situation</h4>
            <p className="text-[11px] text-indigo-100 leading-relaxed">Describe the context of what you were doing. Set the scene and specify the scope of the problem.</p>
          </div>
          <div className="bg-indigo-900/40 border border-indigo-800/40 p-5 rounded-2xl">
            <span className="text-lg font-black text-indigo-400 block mb-1">T</span>
            <h4 className="font-bold text-xs uppercase mb-2">Task</h4>
            <p className="text-[11px] text-indigo-100 leading-relaxed">Explain what goal you had to achieve, the constraints faced, or what key milestones were set.</p>
          </div>
          <div className="bg-indigo-900/40 border border-indigo-800/40 p-5 rounded-2xl">
            <span className="text-lg font-black text-indigo-400 block mb-1">A</span>
            <h4 className="font-bold text-xs uppercase mb-2">Action</h4>
            <p className="text-[11px] text-indigo-100 leading-relaxed">Detail what steps *you* took to solve it. Focus on your actions, technologies, and system designs.</p>
          </div>
          <div className="bg-indigo-900/40 border border-indigo-800/40 p-5 rounded-2xl">
            <span className="text-lg font-black text-indigo-400 block mb-1">R</span>
            <h4 className="font-bold text-xs uppercase mb-2">Result</h4>
            <p className="text-[11px] text-indigo-100 leading-relaxed">Quantify the outcomes. Mention optimization percentages, bugs fixed, or features shipped.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
