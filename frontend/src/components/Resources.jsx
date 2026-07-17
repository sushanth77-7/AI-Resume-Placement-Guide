import React from 'react'

export default function Resources() {
  const platforms = [
    {
      name: 'IndiaBIX',
      url: 'https://www.indiabix.com',
      desc: 'The most popular website for topic-wise aptitude questions, logical reasoning puzzles, and verbal tests with community-driven solutions.',
      tag: 'Practice'
    },
    {
      name: 'PrepInsta',
      url: 'https://prepinsta.com',
      desc: 'Excellent for company-specific aptitude patterns (TCS, Infosys, Wipro, Cognizant) and previous placement question banks.',
      tag: 'Company-specific'
    },
    {
      name: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/aptitude-questions-and-answers/',
      desc: 'Great repository of aptitude articles, logic puzzles, and gate-level quantitative notes tailored for tech students.',
      tag: 'Theory & Quizzes'
    },
    {
      name: 'HackerRank',
      url: 'https://www.hackerrank.com',
      desc: 'Excellent for building logical building skills and practicing problem-solving sections which mimic modern online coding assessment rounds.',
      tag: 'Logical Coding'
    }
  ]

  const youtubeChannels = [
    {
      name: 'CareerRide',
      url: 'https://www.youtube.com/@CareerRide',
      desc: 'Detailed, topic-wise video series on Quantitative Aptitude, Logical Reasoning, and Verbal Ability, specifically designed for campus placements.'
    },
    {
      name: 'Feel Free to Learn',
      url: 'https://www.youtube.com/@FeelFreetoLearn',
      desc: 'Best for visual learners. Explains shortcut methods, tricks, and formulas for time-saving calculations in competitive exams.'
    },
    {
      name: 'Talent Battle',
      url: 'https://www.youtube.com/@TalentBattle',
      desc: 'Focuses heavily on placement prep, company syllabus updates, live solving of previous year questions, and off-campus drive guidance.'
    }
  ]

  const books = [
    {
      title: 'Quantitative Aptitude for Competitive Examinations',
      author: 'Dr. R.S. Aggarwal',
      desc: 'Commonly known as the "Bible of Aptitude". Covers every possible type of math question with solved examples and exercises.'
    },
    {
      title: 'How to Prepare for Quantitative Aptitude for CAT',
      author: 'Arun Sharma',
      desc: 'Highly recommended if you are targeting top-tier product-based companies (Amazon, Uber, etc.) that test high-level logical capability.'
    },
    {
      title: 'A Modern Approach to Logical Reasoning',
      author: 'Dr. R.S. Aggarwal',
      desc: 'Extensive workbook for verbal and non-verbal reasoning, coding-decoding, blood relations, and seating arrangements.'
    }
  ]

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* PDF Download Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-6 md:p-10 text-white shadow-xl">
        {/* Background decorative elements */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-20 -mt-20"></div>
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-xl -mb-10"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-xs bg-white/20 text-white font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
              E-Book Download
            </span>
            <h2 className="text-3xl font-extrabold mt-4 mb-2">100 Aptitude Questions & Answers</h2>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Accelerate your preparation with our hand-curated PDF. Contains 40 Quantitative, 30 Logical, and 30 Verbal questions complete with step-by-step answers and shortcut tips. Save it offline for revision.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <a 
              href="/100 Aptitude Questions & Answers.pdf" 
              download="100 Aptitude Questions & Answers.pdf"
              className="flex items-center space-x-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl hover:bg-indigo-50 active:scale-95 transition-all shadow-lg hover:shadow-indigo-500/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download PDF Guide</span>
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommended Websites */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Websites & Practice Platforms
          </h3>
          <div className="space-y-5">
            {platforms.map((platform, idx) => (
              <div key={idx} className="group border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <a 
                    href={platform.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
                  >
                    {platform.name}
                    <svg className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
                    {platform.tag}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{platform.desc}</p>
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
            {youtubeChannels.map((channel, idx) => (
              <div key={idx} className="group border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                <a 
                  href={channel.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-bold text-rose-600 hover:text-rose-800 transition-colors flex items-center mb-1"
                >
                  {channel.name}
                  <svg className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p className="text-xs text-gray-500 leading-relaxed">{channel.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Book Recommendations */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Recommended Books
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book, idx) => (
            <div key={idx} className="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl hover:bg-white hover:border-slate-200 transition-all hover:shadow-sm">
              <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{book.title}</h4>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mb-3">
                By {book.author}
              </span>
              <p className="text-xs text-gray-500 leading-relaxed">{book.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
