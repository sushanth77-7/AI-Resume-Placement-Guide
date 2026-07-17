import React, { useState } from 'react'

export default function CompanyWiseTopics() {
  const [activeCategory, setActiveCategory] = useState('product')

  const comparison = [
    { metric: 'Avg. Problem Difficulty', product: 'Medium to Hard (LeetCode)', service: 'Easy to Medium (Basic coding)' },
    { metric: 'Core Expectations', product: 'Optimized time/space complexities, deep DSA', service: 'Logical correctness, clean syntax, basic loops' },
    { metric: 'Rounds Format', product: '3-4 technical rounds focusing solely on code, systems', service: '1 online assessment, 1 technical interview, 1 HR' },
    { metric: 'Weightage Areas', product: 'Graphs, DP, Trees, Recursion, System Design', service: 'Arrays, Strings, basic Sorting, OOP concepts' },
    { metric: 'Average Package', product: '12 - 40+ LPA', service: '3.6 - 7 LPA' }
  ]

  const productCompanies = [
    { name: 'Google', topics: 'Graphs (DFS/BFS, Dijkstra), Advanced DP, Trie, Segment Trees, Priority Queue.' },
    { name: 'Amazon', topics: 'Priority Queue (Heaps), Trees, Strings, Hashing, Linked Lists, Dynamic Programming.' },
    { name: 'Microsoft', topics: 'Arrays, Strings, Linked Lists, Tree Traversals, Backtracking, System Design.' },
    { name: 'Adobe', topics: 'Arrays, Searching, Sorting, Bit Manipulation, Stacks & Queues, Matrix problems.' },
    { name: 'Atlassian', topics: 'System Design, Hashing, Design Patterns (e.g. LRU Cache), Strings, Queues.' },
    { name: 'Flipkart', topics: 'Advanced DP, Graph Theory, Sliding Window, Greedy Algorithms, Deque.' },
    { name: 'Walmart', topics: 'Arrays, Dynamic Programming, Strings, Trees, Hashing.' },
    { name: 'Goldman Sachs', topics: 'Mathematics (Probability, P&C), Number Theory, Dynamic Programming, Hashing.' }
  ]

  const serviceCompanies = [
    { name: 'TCS (Ninja/Digital)', topics: 'Arrays, String Manipulation, Number Series (GCD, Primes), Command-line arguments, basic sorting.' },
    { name: 'Infosys (SP/DSE)', topics: 'Recursion, Basic Data Structures (Stacks, Queue), Dynamic Programming (for SP level), OOP concepts.' },
    { name: 'Wipro', topics: 'String reversals, palindrome check, sorting arrays, basic searching (linear/binary).' },
    { name: 'Accenture', topics: 'Bitwise operations, String manipulation, basic looping, Array operations.' },
    { name: 'Cognizant', topics: 'OOP concepts (Inheritance, Polymorphism), basic SQL, Strings, Array sorting.' },
    { name: 'Capgemini', topics: 'Pseudo-code logic questions, OOPs, basic array insertions/deletions, Strings.' },
    { name: 'HCL / Tech Mahindra', topics: 'Basic control flows, basic loops, prime numbers, fibonacci, array reversals.' }
  ]

  const coreTopics = [
    { name: 'Arrays & Strings', priority: 'High', desc: 'Two Pointers, Sliding Window, Prefix Sum, Subarray Problems, String Matching.' },
    { name: 'Searching & Sorting', priority: 'High', desc: 'Binary Search (on sorted bounds/answers), Merge Sort, Quick Sort.' },
    { name: 'Hashing', priority: 'High', desc: 'Frequency Maps, HashSet for duplicates, Prefix Sum with Map (O(N) solutions).' },
    { name: 'Linked Lists', priority: 'Medium', desc: 'Pointer manipulation, Floyd Cycle Detection, reversing lists, node deletion.' },
    { name: 'Stacks & Queues', priority: 'Medium', desc: 'Monotonic Stack (Next Greater Element), Parentheses Validation, Queue BFS.' },
    { name: 'Trees & Graphs', priority: 'High (Product)', desc: 'DFS, BFS traversals, BST validation, LCA, Dijkstra, Shortest Path.' },
    { name: 'Dynamic Programming', priority: 'High (Product)', desc: 'Knapsack, Coin Change, LIS, LCS, Grid Path optimization.' },
    { name: 'Greedy & Backtracking', priority: 'Medium', desc: 'Interval merging, subset generation, N-Queens, Sudoku Solver.' }
  ]

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Comparison Grid */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg mr-2.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </span>
          Company Type Comparison
        </h3>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-100 p-4 font-bold text-xs uppercase tracking-wider text-gray-500">
            <span>Evaluation Criteria</span>
            <span>Product-Based Companies</span>
            <span>Service-Based Companies</span>
          </div>
          <div className="divide-y divide-slate-50">
            {comparison.map((item, idx) => (
              <div key={idx} className="grid grid-cols-3 p-4 text-xs md:text-sm text-gray-700 hover:bg-slate-50/50 transition-colors">
                <span className="font-semibold text-gray-900">{item.metric}</span>
                <span className="pr-4">{item.product}</span>
                <span>{item.service}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Wise Syllabus Tabs */}
      <div className="border-t border-gray-100 pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg mr-2.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              Target Company Syllabus
            </h3>
            <p className="text-gray-500 text-xs mt-1">Frequently asked coding topics categorized by target company profiles.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveCategory('product')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeCategory === 'product' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Product-Based
            </button>
            <button
              onClick={() => setActiveCategory('service')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeCategory === 'service' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Service-Based
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeCategory === 'product' ? (
            productCompanies.map((comp, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all">
                <h4 className="font-extrabold text-gray-900 text-base mb-2">{comp.name}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{comp.topics}</p>
              </div>
            ))
          ) : (
            serviceCompanies.map((comp, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all">
                <h4 className="font-extrabold text-gray-900 text-base mb-2">{comp.name}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{comp.topics}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Most Asked DSA Topics */}
      <div className="border-t border-gray-100 pt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg mr-2.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </span>
          Core Placement Coding Topics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreTopics.map((topic, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start space-x-4">
              <div className="flex-shrink-0 mt-0.5">
                {topic.priority.includes('High') ? (
                  <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded border border-rose-100 uppercase tracking-wider">
                    High Priority
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded border border-amber-100 uppercase tracking-wider">
                    Standard Priority
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{topic.name}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{topic.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
