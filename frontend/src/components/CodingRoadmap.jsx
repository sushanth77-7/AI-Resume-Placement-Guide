import React, { useState } from 'react'

export default function CodingRoadmap() {
  const [activePlan, setActivePlan] = useState('3m')

  const roadmaps = {
    '1m': {
      title: '1-Month Express Roadmap (Last Minute Prep)',
      desc: 'Target high-yield topics, basic DSA, and interview cheatsheets to clear coding rounds in a time crunch.',
      milestones: [
        { week: 'Week 1', title: 'Language Basics & OOP', desc: 'Revise STL/Collection frameworks, time complexity rules, pointers, and memory layout. Master core OOP concepts (inheritance, polymorphism, abstraction) as they are frequently tested in MCQs.' },
        { week: 'Week 2', title: 'Linear DSA & Hashing', desc: 'Focus heavily on Arrays, Strings, Two Pointers, Sliding Window, and Hash Maps. Solve Striver\'s Top 50 Sheet for Arrays and Strings.' },
        { week: 'Week 3', title: 'Searching, Sorting & Trees', desc: 'Understand Binary Search on answers, sorting algorithms, and Binary Tree traversals (DFS/BFS). Solve basic tree height and recursion questions.' },
        { week: 'Week 4', title: 'Mock Assessments & Cheat Sheet', desc: 'Solve previous coding papers on HackerRank/Mettl. Review the Top 30 Coding PDF guide. Focus on speed: write correct code within 30 minutes.' }
      ]
    },
    '3m': {
      title: '3-Month Standard Roadmap (Placement Ready)',
      desc: 'Recommended plan. Covers core DSA, intermediate problem solving, and weekly contest simulations.',
      milestones: [
        { week: 'Month 1', title: 'Programming Fundamentals & Linear DSA', desc: 'Deep dive into C++ or Java syntax and Collections. Master basic array manipulations, prefix sums, sliding windows, string reversals, stacks, queues, and singly linked lists. Solve 50+ medium problems.' },
        { week: 'Month 2', title: 'Recursion, Trees & Graph Theory', desc: 'Transition from linear structures to hierarchical ones. Solve binary tree properties (LCA, traversals, path sums), binary search trees, and basic Graph BFS/DFS. Learn recursion backtracking (generating subsets).' },
        { week: 'Month 3', title: 'Optimization & Mock Tests', desc: 'Master Greedy algorithms (interval scheduling) and basic Dynamic Programming (Knapsack, Coin Change). Participate in weekly mock contests on LeetCode/CodeChef. Solve previous placement questions.' }
      ]
    },
    '6m': {
      title: '6-Month Comprehensive Roadmap (Dream Placements)',
      desc: 'Complete plan targeting high-package product-based companies (Google, Amazon, Adobe) requiring deep DSA.',
      milestones: [
        { week: 'Months 1-2', title: 'Data Structures Foundations', desc: 'Master all linear data structures, pointers, memory architectures, custom sorting, binary searches, and OOP design patterns. Build 100+ easy/medium problem bank.' },
        { week: 'Months 3-4', title: 'Trees, Graphs & Advanced Recursion', desc: 'Study advanced trees (Trie, Segment Trees, AVL), graphs (Dijkstra, MST, topological sort), and complex backtracking (N-Queens, Sudoku). Build deep logical skills.' },
        { week: 'Month 5', title: 'Advanced Dynamic Programming & Greedy', desc: 'Master DP on grids, state machines, bits masking, and partition DP. Focus on space optimization tricks. Complete Striver\'s SDE sheet.' },
        { week: 'Month 6', title: 'System Design & Contest Grinding', desc: 'Learn basic low-level and high-level system designs. Participate in Codeforces/LeetCode contests twice weekly. Practice white-boarding questions and resume projects.' }
      ]
    }
  }

  const selectedPlan = roadmaps[activePlan]

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Plan selector buttons */}
      <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl gap-2 self-start">
        <button
          onClick={() => setActivePlan('1m')}
          className={`px-6 py-3 text-xs font-bold rounded-xl transition-all ${activePlan === '1m' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
        >
          1 Month Plan
        </button>
        <button
          onClick={() => setActivePlan('3m')}
          className={`px-6 py-3 text-xs font-bold rounded-xl transition-all ${activePlan === '3m' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
        >
          3 Months Plan (Recommended)
        </button>
        <button
          onClick={() => setActivePlan('6m')}
          className={`px-6 py-3 text-xs font-bold rounded-xl transition-all ${activePlan === '6m' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
        >
          6 Months Plan
        </button>
      </div>

      {/* Plan Description Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedPlan.title}</h3>
        <p className="text-gray-500 text-sm max-w-3xl leading-relaxed">{selectedPlan.desc}</p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative border-l-2 border-indigo-100 ml-4 md:ml-8 pl-6 md:pl-10 space-y-12">
        {selectedPlan.milestones.map((milestone, idx) => (
          <div key={idx} className="relative">
            {/* Timeline bullet indicator */}
            <span className="absolute -left-[35px] md:-left-[51px] top-1 bg-white border-4 border-indigo-600 h-6 w-6 rounded-full flex items-center justify-center shadow-sm z-10">
              <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full"></span>
            </span>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
              <span className="text-xs bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider mb-3.5 inline-block border border-indigo-100">
                {milestone.week}
              </span>
              <h4 className="text-lg font-bold text-gray-950 mb-2">{milestone.title}</h4>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-normal">{milestone.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
