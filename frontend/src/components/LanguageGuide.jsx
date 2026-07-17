import React from 'react'

export default function LanguageGuide() {
  const languages = [
    {
      name: 'C++',
      suitability: 'Highly Recommended (Best for DSA)',
      pros: 'Super fast execution, standard Template Library (STL) provides rich data structures (vectors, maps, heaps), widely supported in all OAs.',
      cons: 'Manual memory management, complex pointers syntax, steeper learning curve.',
      roadmap: ['Syntax & Basics', 'Pointers & Memory Allocation', 'STL Libraries (vector, stack, queue, set, unordered_map)', 'DSA problem practice on LeetCode']
    },
    {
      name: 'Java',
      suitability: 'Highly Recommended',
      pros: 'Excellent Collection Framework (ArrayList, HashMap, PriorityQueue), safe memory management, highly used in enterprise placements.',
      cons: 'Verbose syntax, slow startup time compared to C++, OOP is mandatory.',
      roadmap: ['Java Basics & OOP Concepts', 'Java Collections Framework', 'Exception Handling & Generics', 'DSA problem solving in Java']
    },
    {
      name: 'Python',
      suitability: 'Recommended (With Cautions)',
      pros: 'Clean, extremely short syntax, no boilerplate code, rapid to write during time-bound tests, native support for large integers.',
      cons: 'Slower execution speed (can cause Time Limit Exceeded (TLE) on strict online test cases), dynamic typing hides bugs.',
      roadmap: ['Python Basics & List Comprehensions', 'Built-in structures (lists, dicts, sets, heapq)', 'Functional programming items', 'OA simulation testing (optimizing loops)']
    },
    {
      name: 'JavaScript / C',
      suitability: 'Not Ideal for general DSA',
      pros: 'C is good for hardware/firmware companies. JS is great if you are applying specifically for Web Development roles.',
      cons: 'C lacks standard libraries (no built-in Hash Map/Queue). JS support is inconsistent on older online assessment (OA) portals.',
      roadmap: ['C: basic arrays and structs, pointers', 'JS: Arrays, ES6 Map/Set, async/await', 'Transition to C++ or Java for general OAs']
    }
  ]

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Recommender Section */}
      <div className="bg-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="text-[10px] bg-indigo-500 text-indigo-100 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Recommendation
          </span>
          <h2 className="text-2xl font-black mt-4 mb-2">What language should I choose for Coding Rounds?</h2>
          <p className="text-xs md:text-sm text-indigo-200 leading-relaxed">
            For general campus placements, **C++** or **Java** are the gold standards. Online Assessment portals (TCS iON, HackerEarth, Mercer Mettl) have strict time bounds (e.g. 1 second execution limit). C++ and Java compile directly to optimized bytecode or machine code, passing time bounds easily. 
            **Python** is great for speed of writing, but make sure you know how to write optimized loops to prevent TLE.
          </p>
        </div>
      </div>

      {/* Language Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {languages.map((lang, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">{lang.name}</h3>
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                  lang.suitability.includes('Highly') 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                    : lang.suitability.includes('Cautions')
                      ? 'bg-amber-50 text-amber-700 border-amber-100'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {lang.suitability}
                </span>
              </div>

              <div className="space-y-3.5 mb-6">
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong className="text-gray-900 block mb-0.5">Advantages:</strong> {lang.pros}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  <strong className="text-gray-800 block mb-0.5">Disadvantages:</strong> {lang.cons}
                </p>
              </div>
            </div>

            {/* Language Roadmap */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3">Learning Roadmap</h4>
              <div className="space-y-2">
                {lang.roadmap.map((step, stepIdx) => (
                  <div key={stepIdx} className="flex items-center space-x-2 text-xs text-gray-600">
                    <span className="h-5 w-5 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-indigo-600 text-[10px] flex-shrink-0">
                      {stepIdx + 1}
                    </span>
                    <span className="truncate">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
