import React, { useState } from 'react'

const STAGES = [
  {
    id: 'basics',
    title: '1. Programming Basics',
    target: 'Solve 15 basic math/array questions',
    tasks: [
      { id: 'b_syntax', text: 'Master syntax, conditional statements, and loops' },
      { id: 'b_functions', text: 'Understand function scopes, call-by-value/reference' },
      { id: 'b_complexity', text: 'Learn to compute Time & Space complexity (Big-O)' },
      { id: 'b_recursion', text: 'Solve basic recursion problems (Factorial, Fibonacci)' }
    ]
  },
  {
    id: 'oop',
    title: '2. OOP Concepts',
    target: 'Solve 10 MCQ/coding scenarios',
    tasks: [
      { id: 'o_classes', text: 'Classes, Objects, and Constructors implementation' },
      { id: 'o_inheritance', text: 'Inheritance types and Polymorphism (Overloading/Overriding)' },
      { id: 'o_encap', text: 'Encapsulation & Abstraction (Access Modifiers, Interfaces)' }
    ]
  },
  {
    id: 'arrays',
    title: '3. Array Algorithms',
    target: 'Solve 25 LeetCode Easy/Medium problems',
    tasks: [
      { id: 'a_twopointer', text: 'Master Two-Pointer approach (e.g. Pair Sum, Container Water)' },
      { id: 'a_sliding', text: 'Implement Sliding Window (e.g. Subarrays, Longest Substring)' },
      { id: 'a_prefix', text: 'Understand Prefix Sum and Kadane\'s Algorithm (Max Subarray)' }
    ]
  },
  {
    id: 'strings',
    title: '4. String Manipulation',
    target: 'Solve 15 LeetCode Easy/Medium problems',
    tasks: [
      { id: 's_basics', text: 'Reverse, Anagram, Palindrome verification' },
      { id: 's_substring', text: 'Substrings, Subsequences, and String Matching algorithms' }
    ]
  },
  {
    id: 'search_sort',
    title: '5. Searching & Sorting',
    target: 'Solve 15 core questions',
    tasks: [
      { id: 'ss_binary', text: 'Master Binary Search (Basic and Search on Answer Space)' },
      { id: 'ss_sorting', text: 'Understand Merge Sort, Quick Sort, and Built-in sorting libraries' }
    ]
  },
  {
    id: 'dsa_core',
    title: '6. Core Data Structures',
    target: 'Solve 30 DSA questions',
    tasks: [
      { id: 'd_linkedlist', text: 'Linked List traversal, cycle detection, and reversals' },
      { id: 'd_stackqueue', text: 'Stacks (Monotonic Stack) and Queues (BFS traversal base)' },
      { id: 'd_hashing', text: 'HashMap & HashSet for frequency counting and O(1) checks' }
    ]
  },
  {
    id: 'dsa_adv',
    title: '7. Advanced DSA',
    target: 'Solve 25 Trees & Graphs questions',
    tasks: [
      { id: 'da_trees', text: 'Binary Trees, BSTs, Depth-First Search (Pre/In/Post order)' },
      { id: 'da_graphs', text: 'Graph representation, BFS, DFS, Dijkstra\'s Shortest Path' },
      { id: 'da_heap', text: 'Heaps / Priority Queues (K-Way Merge, Top K elements)' }
    ]
  },
  {
    id: 'prob_solving',
    title: '8. Core Paradigms',
    target: 'Solve 20 DP & Greedy questions',
    tasks: [
      { id: 'p_greedy', text: 'Greedy algorithms (Activity selection, Interval merging)' },
      { id: 'p_dp', text: 'Dynamic Programming (Knapsack, LCS, Coin Change, Grid Paths)' },
      { id: 'p_backtracking', text: 'Backtracking (Subsets generation, Permutations)' }
    ]
  },
  {
    id: 'mock_tests',
    title: '9. Mock Contests',
    target: 'Complete 5 full-length mock OAs',
    tasks: [
      { id: 'm_timebound', text: 'Simulate 60-minute coding contests under pressure' },
      { id: 'm_hidden', text: 'Fix hidden boundary test cases and resolve TLE bounds' }
    ]
  },
  {
    id: 'revision',
    title: '10. Revision & Cheat Sheet',
    target: 'Daily formulas & syntax review',
    tasks: [
      { id: 'r_cheatsheet', text: 'Review standard Template library (STL/Collection) commands' },
      { id: 'r_errorlog', text: 'Re-solve questions in your Error Log booklet' }
    ]
  }
]

export default function PracticeDashboard() {
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('coding_completed_tasks')
    return saved ? JSON.parse(saved) : {}
  })
  const [expandedStage, setExpandedStage] = useState('basics')

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => {
      const updated = { ...prev, [taskId]: !prev[taskId] }
      localStorage.setItem('coding_completed_tasks', JSON.stringify(updated))
      return updated
    })
  }

  // Compute stats
  const totalTasksCount = STAGES.reduce((acc, stage) => acc + stage.tasks.length, 0)
  const completedTasksCount = Object.values(completedTasks).filter(Boolean).length
  const progressPercentage = Math.round((completedTasksCount / totalTasksCount) * 100)

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Overview stats header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="lg:col-span-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Coding Round Readiness Dashboard</h2>
          <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
            Follow this structured 10-stage preparation plan. Mark tasks completed as you cover them. Your readiness score is calculated below.
          </p>
        </div>

        <div className="lg:col-span-4 bg-slate-900 text-white rounded-2xl p-5 border border-slate-800">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm font-bold text-slate-300">Readiness Score</span>
            <span className="text-xs text-slate-400 font-medium">{completedTasksCount} of {totalTasksCount} tasks</span>
          </div>
          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-3xl font-extrabold">{progressPercentage}%</span>
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Placement Ready</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-indigo-500 h-3 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stages layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar list of stages */}
        <div className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-2 max-h-[600px] overflow-y-auto no-scrollbar">
          <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider px-3 mb-4">Stages Syllabus</h3>
          {STAGES.map((stage) => {
            const isSelected = expandedStage === stage.id
            const stageTasksCount = stage.tasks.length
            const stageCompletedTasksCount = stage.tasks.filter(t => completedTasks[t.id]).length
            const isStageCompleted = stageTasksCount === stageCompletedTasksCount

            return (
              <button
                key={stage.id}
                onClick={() => setExpandedStage(stage.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left border transition-all ${
                  isSelected 
                    ? 'bg-indigo-50/50 border-indigo-100 text-indigo-700 font-semibold' 
                    : isStageCompleted
                      ? 'bg-emerald-50/20 border-emerald-50 text-gray-700'
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-xs truncate">{stage.title}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5 truncate">{stage.target}</span>
                </div>
                <div className="flex-shrink-0 flex items-center space-x-1.5 pl-2">
                  <span className="text-[10px] text-slate-400 font-semibold bg-slate-100/60 px-1.5 py-0.5 rounded">
                    {stageCompletedTasksCount}/{stageTasksCount}
                  </span>
                  {isStageCompleted && (
                    <svg className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected stage details & tasks checklist */}
        <div className="lg:col-span-2">
          {STAGES.map((stage) => {
            if (stage.id !== expandedStage) return null
            const completedCount = stage.tasks.filter(t => completedTasks[t.id]).length
            const isCompleted = completedCount === stage.tasks.length

            return (
              <div key={stage.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[400px]">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-50">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{stage.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Recommended Target: <span className="font-semibold text-slate-700">{stage.target}</span></p>
                    </div>
                    {isCompleted && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded border border-emerald-100 uppercase tracking-wider">
                        Completed
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    {stage.tasks.map((task) => {
                      const isChecked = !!completedTasks[task.id]
                      return (
                        <div 
                          key={task.id} 
                          className={`group flex items-start space-x-3 p-4 rounded-xl border transition-all duration-200 ${
                            isChecked 
                              ? 'bg-emerald-50/30 border-emerald-100 text-slate-500' 
                              : 'bg-slate-50/50 hover:bg-white border-transparent hover:border-slate-200 hover:shadow-sm'
                          }`}
                        >
                          <label className="flex items-start space-x-3.5 cursor-pointer select-none w-full">
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleTask(task.id)}
                              className="mt-0.5 h-4.5 w-4.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer accent-indigo-600 flex-shrink-0"
                            />
                            <span className={`text-sm font-medium leading-relaxed ${isChecked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                              {task.text}
                            </span>
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-gray-400">
                  <span>Progress in this stage: {completedCount} of {stage.tasks.length} tasks</span>
                  <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(completedCount / stage.tasks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
