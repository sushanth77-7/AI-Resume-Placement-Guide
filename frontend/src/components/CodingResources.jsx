import React from 'react'

export default function CodingResources() {
  const platforms = [
    {
      name: 'LeetCode',
      url: 'https://leetcode.com',
      desc: 'The best platform for technical interview practice. Focus on LeetCode Easy & Medium levels. Solve the "Top Interview 150" list.',
      tag: 'Interview DSA'
    },
    {
      name: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org',
      desc: 'Excellent for theoretical explanations of algorithms, coding worksheets, previous placement interview experiences, and sectional quizzes.',
      tag: 'DSA Theory & Practice'
    },
    {
      name: 'HackerRank',
      url: 'https://www.hackerrank.com',
      desc: 'Used by 80% of companies to host actual online coding rounds. Good for getting comfortable with custom inputs and basic standard streams.',
      tag: 'OA Platform Comfort'
    },
    {
      name: 'CodeChef & Codeforces',
      url: 'https://www.codechef.com',
      desc: 'Best for competitive programming to improve execution speed and logical deduction. Target 2-star/3-star levels for placements.',
      tag: 'Competitive Coding'
    }
  ]

  const codingSheets = [
    {
      name: 'Striver A2Z DSA Sheet',
      url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
      desc: 'A complete step-by-step roadmap sheet spanning from absolute basics of coding to advanced tree/graph/DP problems.'
    },
    {
      name: 'NeetCode 150',
      url: 'https://neetcode.io/practice',
      desc: 'A curated list of 150 LeetCode questions categorized logically. Accompanied by excellent visual video solutions on YouTube.'
    },
    {
      name: 'Love Babbar 450 Sheet',
      url: 'https://www.geeksforgeeks.org/love-babbar-dsa-sheet-solutions/',
      desc: 'A classic placement coding worksheet containing 450 highly repeated placement questions across arrays, strings, and trees.'
    }
  ]

  const youtubeChannels = [
    {
      name: 'takeUforward (Striver)',
      url: 'https://www.youtube.com/@takeUforward',
      desc: 'The gold standard for DP, Graph Theory, and Tree coding explanations in Hindi/English, explaining recursive trees visually.'
    },
    {
      name: 'NeetCode',
      url: 'https://www.youtube.com/@NeetCode',
      desc: 'Best English channel for LeetCode solutions. Explains complex graph and recursive algorithms with highly detailed drawings.'
    },
    {
      name: 'CodeHelp (Love Babbar)',
      url: 'https://www.youtube.com/@CodeHelp',
      desc: 'Excellent course playlists covering C++, DSA foundations, and placement interview tips.'
    }
  ]

  const books = [
    {
      title: 'Cracking the Coding Interview',
      author: 'Gayle Laakmann McDowell',
      desc: 'The absolute classic. Contains 189 programming questions and solutions, along with behavioral interview preparation tips.'
    },
    {
      title: 'Introduction to Algorithms (CLRS)',
      author: 'Cormen, Leiserson, Rivest, Stein',
      desc: 'The academic bible of algorithms. Recommended if you want to understand mathematical derivations of sorting, shortest-paths, and flows.'
    }
  ]

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* PDF Download Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 md:p-10 text-white shadow-xl">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-20 -mt-20"></div>
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-xl -mb-10"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-xs bg-white/20 text-white font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
              DSA Guide
            </span>
            <h2 className="text-3xl font-extrabold mt-4 mb-2">Top 30 Coding Questions & Solutions</h2>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Ace your upcoming technical interviews with our hand-curated PDF guide. Contains 30 of the most frequently asked array, string, dynamic programming, and graph problems, complete with step-by-step algorithms, complexities, and code strategies.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <a 
              href="/Top 30 Most Asked Coding Questions with Optimized Solutions.pdf" 
              download="Top 30 Most Asked Coding Questions with Optimized Solutions.pdf"
              className="flex items-center space-x-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl hover:bg-indigo-50 active:scale-95 transition-all shadow-lg hover:shadow-indigo-500/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download PDF Solutions</span>
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommended Coding Platforms */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Coding Practice Platforms
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

        {/* Coding Roadmaps Sheets */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Curated DSA Sheets
          </h3>
          <div className="space-y-5">
            {codingSheets.map((sheet, idx) => (
              <div key={idx} className="group border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                <a 
                  href={sheet.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-bold text-purple-600 hover:text-purple-800 transition-colors flex items-center mb-1"
                >
                  {sheet.name}
                  <svg className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p className="text-xs text-gray-500 leading-relaxed">{sheet.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* YouTube & Books */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Recommended YouTube Channels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {youtubeChannels.map((channel, idx) => (
              <div key={idx} className="group bg-slate-50/50 border border-slate-100 p-4 rounded-xl hover:bg-white hover:border-slate-200 transition-all">
                <a 
                  href={channel.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-bold text-rose-600 hover:text-rose-800 transition-colors flex items-center mb-2 text-sm"
                >
                  {channel.name}
                </a>
                <p className="text-[11px] text-gray-500 leading-relaxed">{channel.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Recommended Books
          </h3>
          <div className="space-y-4">
            {books.map((book, idx) => (
              <div key={idx} className="border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                <h4 className="font-bold text-gray-900 text-xs">{book.title}</h4>
                <span className="text-[10px] text-gray-400 block mb-1">By {book.author}</span>
                <p className="text-[11px] text-gray-500 leading-relaxed">{book.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
