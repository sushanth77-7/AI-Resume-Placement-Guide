import React, { useState } from 'react'

export default function CodingStrategies() {
  const [activeExample, setActiveExample] = useState('brute')

  const complexities = [
    { class: 'O(1)', name: 'Constant Time', desc: 'Execution time remains same regardless of input size.', ex: 'Array lookup, Hash Map get/put.' },
    { class: 'O(log N)', name: 'Logarithmic Time', desc: 'Problem size is halved at each step.', ex: 'Binary Search, BST search.' },
    { class: 'O(N)', name: 'Linear Time', desc: 'Processing every element exactly once.', ex: 'Linear Search, traversing a list.' },
    { class: 'O(N log N)', name: 'Linearithmic Time', desc: 'Divide and conquer algorithms with merge steps.', ex: 'Merge Sort, Quick Sort, Heap Sort.' },
    { class: 'O(N^2)', name: 'Quadratic Time', desc: 'Nested loops traversing the input data.', ex: 'Bubble Sort, checking all pairs.' },
    { class: 'O(2^N)', name: 'Exponential Time', desc: 'Recursive growth doubling at each step.', ex: 'Brute-force Fibonacci, subset generation.' }
  ]

  const debuggingTips = [
    { title: 'Dry Run with Trace Table', desc: 'Trace the variables on paper with a small sample input (e.g., array of size 3). Draw a grid tracking loop variables, pointers, and expected state changes.' },
    { title: 'Divide & Conquer Print Statements', desc: 'If code fails, insert log statements at boundary lines. Narrow down where the state starts to deviate from expectations. Remove logs before submission.' },
    { title: 'Check Array Boundaries First', desc: 'Most segmentation faults or IndexOutOfBounds errors are caused by accessing `i-1` or `i+1` without checking if it falls in `[0, size-1]`.' },
    { title: 'Optimize for Base Cases', desc: 'Check recursion depth. Ensure recursive functions have solid base cases to prevent Stack Overflow errors.' }
  ]

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Intro section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Problem Solving & Optimization</h2>
        <p className="text-gray-600 text-sm">
          Placements are not just about passing test cases; they test how well you analyze constraints and optimize computation limits.
        </p>
      </div>

      {/* Brute Force vs Optimized Section */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg mr-2.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
          Brute Force vs Optimized Approaches
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider text-slate-400">Comparison Matrix</h4>
            <div className="space-y-3">
              <div className="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-gray-500">Feature</span>
                <span className="text-xs font-bold text-gray-900">Brute Force</span>
                <span className="text-xs font-bold text-indigo-600">Optimized</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg border border-gray-50">
                <span className="text-xs text-gray-500 font-semibold">Approach</span>
                <span className="text-xs text-gray-700">Straightforward / Naive</span>
                <span className="text-xs text-indigo-600 font-bold">Mathematical / DSA-based</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg border border-gray-50">
                <span className="text-xs text-gray-500 font-semibold">Complexity</span>
                <span className="text-xs text-gray-700">High (O(N^2) or O(2^N))</span>
                <span className="text-xs text-indigo-600 font-bold">Low (O(N) or O(N log N))</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg border border-gray-50">
                <span className="text-xs text-gray-500 font-semibold">Coding Effort</span>
                <span className="text-xs text-gray-700">Quick to write</span>
                <span className="text-xs text-indigo-600 font-bold">Requires logical depth</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg border border-gray-50">
                <span className="text-xs text-gray-500 font-semibold">Test Cases Passed</span>
                <span className="text-xs text-rose-500 font-bold">Basic (TLE on large inputs)</span>
                <span className="text-xs text-emerald-600 font-bold">All (including hidden bounds)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-slate-300">Example Problem: Two Sum</span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveExample('brute')}
                  className={`px-3 py-1 rounded text-xs font-bold ${activeExample === 'brute' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  Brute Force
                </button>
                <button 
                  onClick={() => setActiveExample('opt')}
                  className={`px-3 py-1 rounded text-xs font-bold ${activeExample === 'opt' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  Optimized
                </button>
              </div>
            </div>

            {activeExample === 'brute' ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Compare all possible pairs in the array using two nested loops to check if their sum matches the target.
                </p>
                <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono overflow-x-auto text-rose-300">
{`// C++ Brute Force Two Sum
vector<int> twoSum(vector<int>& nums, int target) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                return {i, j};
            }
        }
    }
    return {};
}`}
                </pre>
                <div className="text-xs flex justify-between bg-rose-950/20 border border-rose-900/30 p-2.5 rounded-lg text-rose-400 font-medium">
                  <span>Time Complexity: O(N^2)</span>
                  <span>Space Complexity: O(1)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Use a Hash Map to store numbers and their indices. Find the complement (`target - nums[i]`) in a single pass.
                </p>
                <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono overflow-x-auto text-emerald-300">
{`// C++ Optimized Two Sum (Hash Map)
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> mp;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (mp.count(complement)) {
            return {mp[complement], i};
        }
        mp[nums[i]] = i;
    }
    return {};
}`}
                </pre>
                <div className="text-xs flex justify-between bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg text-emerald-400 font-medium">
                  <span>Time Complexity: O(N)</span>
                  <span>Space Complexity: O(N)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complexity Cards */}
      <div className="border-t border-gray-100 pt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg mr-2.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </span>
          Complexity Analysis Cheat Sheet
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complexities.map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-lg font-bold text-indigo-600 font-mono">{item.class}</span>
                <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">{item.name}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">{item.desc}</p>
              <div className="text-[10px] bg-slate-50 border border-slate-100 rounded-lg p-2 font-mono text-slate-600">
                <strong className="text-slate-800">Example:</strong> {item.ex}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden Test Cases and Debugging Tips */}
      <div className="border-t border-gray-100 pt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Debugging & Dry Running */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
            <svg className="w-5 h-5 mr-2 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Debugging & Troubleshooting
          </h3>
          <div className="space-y-4">
            {debuggingTips.map((tip, idx) => (
              <div key={idx} className="border-b border-slate-50 last:border-0 pb-4 last:pb-0">
                <h4 className="font-bold text-gray-950 text-sm mb-1">{tip.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hidden Test Cases & Contest Strategy */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Handling Hidden Test Cases
            </h3>
            <ul className="space-y-3.5 text-xs text-gray-600">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2.5 font-bold">•</span>
                <span><strong>Integer Overflow:</strong> In C++ and Java, if inputs can be up to 10^9, products like `a * b` will overflow standard 32-bit integers. Use `long long` (C++) or `long` (Java).</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2.5 font-bold">•</span>
                <span><strong>Empty / Small Inputs:</strong> Always check values at constraints boundaries, such as an empty array `[]`, array of size 1 `[a]`, or a tree with `N = 0` nodes.</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2.5 font-bold">•</span>
                <span><strong>Duplicate Elements:</strong> Test how your code behaves when all elements in an array are identical (e.g. `[2, 2, 2, 2]`), which can trigger infinite loops or bad pivot splits.</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2.5 font-bold">•</span>
                <span><strong>Time Limit Exceeded (TLE):</strong> Usually means your time complexity is too high for the constraints. As a rule of thumb, `N = 10^5` requires an `O(N)` or `O(N log N)` solution. `N = 10^3` allows `O(N^2)`.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-950 text-indigo-200 rounded-2xl p-6 shadow-sm border border-slate-900">
            <h3 className="text-white font-bold text-sm mb-3">Online Assessment Contest Strategies</h3>
            <p className="text-xs text-indigo-300 leading-relaxed">
              Coding assessments typically last 60 to 90 minutes for 3-4 problems. Do not waste time on a single problem. Read all statements first, solve the easiest problem to secure partial points, then move to optimized solutions for advanced items. Write helper structures modularly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
