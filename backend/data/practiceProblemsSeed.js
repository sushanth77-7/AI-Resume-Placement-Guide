// Coding Problems Seed Data (6 Problems: 2 Easy, 2 Medium, 2 Hard)
// Covering arrays, strings, sliding window, binary search, two pointers, stacks, queues, and DP

const codingProblems = [
  // ==================== EASY PROBLEMS ====================
  {
    title: 'Two Sum',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    difficulty: 'Easy',
    topic: 'Arrays & Hashing',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.',
    inputFormat: 'The first line contains an integer N (size of the array).\nThe second line contains N space-separated integers representing the array.\nThe third line contains the target integer.',
    outputFormat: 'Print two space-separated integers representing the indices of the two numbers.',
    sampleInput: '4\n2 7 11 15\n9',
    sampleOutput: '0 1',
    sampleExplanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return 0 1.',
    visibleTestCases: [
      { input: '4\n2 7 11 15\n9', output: '0 1' },
      { input: '3\n3 2 4\n6', output: '1 2' }
    ],
    hiddenTestCases: [
      { input: '2\n3 3\n6', output: '0 1' },
      { input: '5\n1 5 8 12 3\n11', output: '2 4' },
      { input: '6\n-3 4 3 90 2 8\n0', output: '0 2' },
      { input: '4\n11 15 2 7\n9', output: '2 3' }
    ],
    initialTemplates: {
      javascript: `function twoSum(nums, target) {
    // Write your code here
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

// Handler for parsing raw input (mandatory for our runner)
function solve(input) {
    const lines = input.trim().split('\\n');
    const n = parseInt(lines[0]);
    const nums = lines[1].split(' ').map(Number);
    const target = parseInt(lines[2]);
    const result = twoSum(nums, target);
    return result.join(' ');
}`,
      python: `def twoSum(nums, target):
    # Write your code here
    pass

# Helper to read inputs
import sys
def solve(input_str):
    lines = input_str.strip().split('\\n')
    n = int(lines[0])
    nums = list(map(int, lines[1].split()))
    target = int(lines[2])
    # Call your function
    # return string output
    pass`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

// Write your function here
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> mp;
    for(int i=0; i<nums.size(); ++i) {
        int comp = target - nums[i];
        if(mp.count(comp)) return {mp[comp], i};
        mp[nums[i]] = i;
    }
    return {};
}`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write code here
        return new int[0];
    }
}`,
      c: `// C language templates
#include <stdio.h>
#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Write code here
    return NULL;
}`,
      csharp: `using System;
using System.Collections.Generic;

public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        // Write code here
        return new int[0];
    }
}`
    }
  },
  {
    title: 'Valid Anagram',
    description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    difficulty: 'Easy',
    topic: 'Strings & Hashing',
    constraints: '1 <= s.length, t.length <= 5 * 10^4\ns and t consist of lowercase English letters.',
    inputFormat: 'The first line contains string s.\nThe second line contains string t.',
    outputFormat: 'Print "true" if t is an anagram of s, otherwise print "false".',
    sampleInput: 'anagram\nnagaram',
    sampleOutput: 'true',
    sampleExplanation: 'Both strings contain the exact same characters with the same frequencies: a:3, n:1, g:1, r:1, m:1.',
    visibleTestCases: [
      { input: 'anagram\nnagaram', output: 'true' },
      { input: 'rat\ncar', output: 'false' }
    ],
    hiddenTestCases: [
      { input: 'a\na', output: 'true' },
      { input: 'ab\na', output: 'false' },
      { input: 'awesome\nsomeawe', output: 'true' },
      { input: 'placement\ncelatement', output: 'false' }
    ],
    initialTemplates: {
      javascript: `function isAnagram(s, t) {
    // Write your code here
    if (s.length !== t.length) return false;
    const count = {};
    for (let char of s) {
        count[char] = (count[char] || 0) + 1;
    }
    for (let char of t) {
        if (!count[char]) return false;
        count[char]--;
    }
    return true;
}

function solve(input) {
    const lines = input.trim().split('\\n');
    const s = lines[0].trim();
    const t = lines[1].trim();
    return isAnagram(s, t) ? 'true' : 'false';
}`,
      python: `def isAnagram(s, t):
    # Write your code here
    pass

def solve(input_str):
    lines = input_str.strip().split('\\n')
    s = lines[0].strip()
    t = lines[1].strip()
    # return 'true' or 'false'
    pass`,
      cpp: `#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

bool isAnagram(string s, string t) {
    // Write code here
    return false;
}`,
      java: `import java.util.*;

class Solution {
    public boolean isAnagram(String s, String t) {
        // Write code here
        return false;
    }
}`,
      c: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

bool isAnagram(char* s, char* t) {
    // Write code here
    return false;
}`,
      csharp: `using System;

public class Solution {
    public bool IsAnagram(string s, string t) {
        // Write code here
        return false;
    }
}`
    }
  },

  // ==================== MEDIUM PROBLEMS ====================
  {
    title: 'Container With Most Water',
    description: 'You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.',
    difficulty: 'Medium',
    topic: 'Two Pointers',
    constraints: 'n == height.length\n2 <= n <= 10^5\n0 <= height[i] <= 10^4',
    inputFormat: 'The first line contains an integer N (size of the array).\nThe second line contains N space-separated integers representing heights.',
    outputFormat: 'Print a single integer representing the maximum water container capacity.',
    sampleInput: '9\n1 8 6 2 5 4 8 3 7',
    sampleOutput: '49',
    sampleExplanation: 'The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is between index 1 (value 8) and index 8 (value 7), which is width 7 * min(8, 7) = 49.',
    visibleTestCases: [
      { input: '9\n1 8 6 2 5 4 8 3 7', output: '49' },
      { input: '2\n1 1', output: '1' }
    ],
    hiddenTestCases: [
      { input: '5\n3 1 2 4 5', output: '12' },
      { input: '6\n2 3 4 5 18 17', output: '17' },
      { input: '4\n4 3 2 1', output: '4' },
      { input: '10\n1 2 3 4 5 25 24 6 7 8', output: '24' }
    ],
    initialTemplates: {
      javascript: `function maxArea(height) {
    // Write your code here
    let left = 0;
    let right = height.length - 1;
    let maxVal = 0;
    while (left < right) {
        const h = Math.min(height[left], height[right]);
        maxVal = Math.max(maxVal, h * (right - left));
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxVal;
}

function solve(input) {
    const lines = input.trim().split('\\n');
    const n = parseInt(lines[0]);
    const height = lines[1].split(' ').map(Number);
    return maxArea(height).toString();
}`,
      python: `def maxArea(height):
    # Write your code here
    pass

def solve(input_str):
    lines = input_str.strip().split('\\n')
    n = int(lines[0])
    height = list(map(int, lines[1].split()))
    return str(maxArea(height))`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

int maxArea(vector<int>& height) {
    // Write code here
    return 0;
}`,
      java: `import java.util.*;

class Solution {
    public int maxArea(int[] height) {
        // Write code here
        return 0;
    }
}`,
      c: `#include <stdio.h>
#define MIN(a,b) (((a)<(b))?(a):(b))
#define MAX(a,b) (((a)>(b))?(a):(b))

int maxArea(int* height, int heightSize) {
    // Write code here
    return 0;
}`,
      csharp: `using System;

public class Solution {
    public int MaxArea(int[] height) {
        // Write code here
        return 0;
    }
}`
    }
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    difficulty: 'Medium',
    topic: 'Sliding Window',
    constraints: '0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.',
    inputFormat: 'A single line containing the string s (could be empty).',
    outputFormat: 'Print the length of the longest substring with unique characters.',
    sampleInput: 'abcabcbb',
    sampleOutput: '3',
    sampleExplanation: 'The answer is "abc", with the length of 3.',
    visibleTestCases: [
      { input: 'abcabcbb', output: '3' },
      { input: 'bbbbb', output: '1' }
    ],
    hiddenTestCases: [
      { input: 'pwwkew', output: '3' },
      { input: '', output: '0' },
      { input: 'au', output: '2' },
      { input: 'dvdf', output: '3' },
      { input: 'placementprep', output: '7' }
    ],
    initialTemplates: {
      javascript: `function lengthOfLongestSubstring(s) {
    // Write your code here
    let n = s.length;
    let ans = 0;
    let map = new Map();
    for (let j = 0, i = 0; j < n; j++) {
        if (map.has(s[j])) {
            i = Math.max(map.get(s[j]) + 1, i);
        }
        ans = Math.max(ans, j - i + 1);
        map.set(s[j], j);
    }
    return ans;
}

function solve(input) {
    const s = input.replace(/\\r|\\n/g, ''); // Read string raw
    return lengthOfLongestSubstring(s).toString();
}`,
      python: `def lengthOfLongestSubstring(s):
    # Write your code here
    pass

def solve(input_str):
    s = input_str.replace('\\n', '').replace('\\r', '')
    return str(lengthOfLongestSubstring(s))`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

int lengthOfLongestSubstring(string s) {
    // Write code here
    return 0;
}`,
      java: `import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write code here
        return 0;
    }
}`,
      c: `#include <stdio.h>
#include <string.h>

int lengthOfLongestSubstring(char* s) {
    // Write code here
    return 0;
}`,
      csharp: `using System;
using System.Collections.Generic;

public class Solution {
    public int LengthOfLongestSubstring(string s) {
        // Write code here
        return 0;
    }
}`
    }
  },

  // ==================== HARD PROBLEMS ====================
  {
    title: 'Trapping Rain Water',
    description: 'Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    difficulty: 'Hard',
    topic: 'Two Pointers & Arrays',
    constraints: 'n == height.length\n1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5',
    inputFormat: 'The first line contains N (number of bars).\nThe second line contains N space-separated heights.',
    outputFormat: 'Print the total volume of trapped water as an integer.',
    sampleInput: '12\n0 1 0 2 1 0 1 3 2 1 2 1',
    sampleOutput: '6',
    sampleExplanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.',
    visibleTestCases: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', output: '6' },
      { input: '6\n4 2 0 3 2 5', output: '9' }
    ],
    hiddenTestCases: [
      { input: '3\n3 0 3', output: '3' },
      { input: '1\n0', output: '0' },
      { input: '5\n5 4 3 2 1', output: '0' },
      { input: '11\n0 3 0 1 0 4 0 2 0 1 3', output: '14' }
    ],
    initialTemplates: {
      javascript: `function trap(height) {
    // Write your code here
    let left = 0, right = height.length - 1;
    let ans = 0;
    let leftMax = 0, rightMax = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            height[left] >= leftMax ? (leftMax = height[left]) : ans += (leftMax - height[left]);
            ++left;
        } else {
            height[right] >= rightMax ? (rightMax = height[right]) : ans += (rightMax - height[right]);
            --right;
        }
    }
    return ans;
}

function solve(input) {
    const lines = input.trim().split('\\n');
    const n = parseInt(lines[0]);
    const height = lines[1].split(' ').map(Number);
    return trap(height).toString();
}`,
      python: `def trap(height):
    # Write your code here
    pass

def solve(input_str):
    lines = input_str.strip().split('\\n')
    n = int(lines[0])
    height = list(map(int, lines[1].split()))
    return str(trap(height))`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

int trap(vector<int>& height) {
    // Write code here
    return 0;
}`,
      java: `import java.util.*;

class Solution {
    public int trap(int[] height) {
        // Write code here
        return 0;
    }
}`,
      c: `#include <stdio.h>

int trap(int* height, int heightSize) {
    // Write code here
    return 0;
}`,
      csharp: `using System;

public class Solution {
    public int Trap(int[] height) {
        // Write code here
        return 0;
    }
}`
    }
  },
  {
    title: 'Sliding Window Maximum',
    description: 'You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window values.',
    difficulty: 'Hard',
    topic: 'Monotonic Queue & Sliding Window',
    constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4\n1 <= k <= nums.length',
    inputFormat: 'The first line contains N (array size) and K (window size) separated by space.\nThe second line contains N space-separated integers.',
    outputFormat: 'Print space-separated maximums for each sliding window position.',
    sampleInput: '8 3\n1 3 -1 -3 5 3 6 7',
    sampleOutput: '3 3 5 5 6 7',
    sampleExplanation: 'Window position                Max\n---------------               -----\n[1  3  -1] -3  5  3  6  7       3\n 1 [3  -1  -3] 5  3  6  7       3\n 1  3 [-1  -3  5] 3  6  7       5\n 1  3  -1 [-3  5  3] 6  7       5\n 1  3  -1  -3 [5  3  6] 7       6\n 1  3  -1  -3  5 [3  6  7]      7',
    visibleTestCases: [
      { input: '8 3\n1 3 -1 -3 5 3 6 7', output: '3 3 5 5 6 7' },
      { input: '1 1\n1', output: '1' }
    ],
    hiddenTestCases: [
      { input: '2 2\n1 -1', output: '1' },
      { input: '4 2\n9 11 89 2', output: '11 89 89' },
      { input: '7 4\n1 2 3 4 5 6 7', output: '4 5 6 7' },
      { input: '5 3\n5 4 3 2 1', output: '5 4 3' }
    ],
    initialTemplates: {
      javascript: `function maxSlidingWindow(nums, k) {
    // Write your code here
    let q = []; // store indices
    let res = [];
    for (let i = 0; i < nums.length; i++) {
        while (q.length && q[0] < i - k + 1) {
            q.shift();
        }
        while (q.length && nums[q[q.length - 1]] < nums[i]) {
            q.pop();
        }
        q.push(i);
        if (i >= k - 1) {
            res.push(nums[q[0]]);
        }
    }
    return res;
}

function solve(input) {
    const lines = input.trim().split('\\n');
    const [n, k] = lines[0].split(' ').map(Number);
    const nums = lines[1].split(' ').map(Number);
    return maxSlidingWindow(nums, k).join(' ');
}`,
      python: `def maxSlidingWindow(nums, k):
    # Write your code here
    pass

def solve(input_str):
    lines = input_str.strip().split('\\n')
    n, k = map(int, lines[0].split())
    nums = list(map(int, lines[1].split()))
    return ' '.join(map(str, maxSlidingWindow(nums, k)))`,
      cpp: `#include <vector>
#include <deque>
using namespace std;

vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    // Write code here
    return {};
}`,
      java: `import java.util.*;

class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        // Write code here
        return new int[0];
    }
}`,
      c: `#include <stdio.h>
#include <stdlib.h>

int* maxSlidingWindow(int* nums, int numsSize, int k, int* returnSize) {
    // Write code here
    return NULL;
}`,
      csharp: `using System;
using System.Collections.Generic;

public class Solution {
    public int[] MaxSlidingWindow(int[] nums, int k) {
        // Write code here
        return new int[0];
    }
}`
    }
  }
];

module.exports = codingProblems;
