import os
from fpdf import FPDF

class CodingPDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return  # Skip header on cover page
        self.set_font('helvetica', 'B', 10)
        self.set_text_color(99, 102, 241)  # Indigo
        self.set_x(15)
        self.cell(0, 10, 'TOP 30 CODING QUESTIONS WITH OPTIMIZED SOLUTIONS', border='B', align='L', new_x="LMARGIN", new_y="NEXT")
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(156, 163, 175)
        self.set_x(15)
        self.cell(90, 10, 'Prep Resources - AI Resume Analyzer', align='L')
        self.set_x(15)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', align='R')

def build_problems():
    problems = [
        ("Two Sum", "Arrays & Hashing", "Find two numbers in an array that add up to a specific target.", "Time: O(N), Space: O(N)", "Use a Hash Map to store the difference (target - nums[i]) and check if it already exists as you iterate."),
        ("Best Time to Buy & Sell Stock", "Arrays", "Find the maximum profit you can achieve by buying and selling a stock.", "Time: O(N), Space: O(1)", "Maintain a minimum price seen so far and calculate profit at each step, updating the max profit."),
        ("Contains Duplicate", "Arrays", "Check if any value appears at least twice in a given array.", "Time: O(N), Space: O(N)", "Insert elements into a Hash Set. If an element already exists in the set, return true."),
        ("Product of Array Except Self", "Arrays", "Return an array where each element is the product of all elements except nums[i].", "Time: O(N), Space: O(1)", "Calculate prefix products in one pass, then multiply by suffix products in a backward pass."),
        ("Maximum Subarray", "Arrays", "Find the contiguous subarray with the largest sum (Kadane's Algorithm).", "Time: O(N), Space: O(1)", "Iterate and maintain current sum. Reset current sum to 0 if it drops below zero, updating global max."),
        ("Three Sum (3Sum)", "Two Pointers", "Find all unique triplets in an array that sum to zero.", "Time: O(N^2), Space: O(1)", "Sort the array, iterate with a fixed element, and use two pointers (left & right) to find pairs."),
        ("Container With Most Water", "Two Pointers", "Find two lines that together with the x-axis forms a container containing the most water.", "Time: O(N), Space: O(1)", "Place pointers at both ends. Move the pointer pointing to the shorter line inward while checking area."),
        ("Valid Anagram", "Strings", "Determine if two strings are anagrams of each other.", "Time: O(N), Space: O(1)", "Count character frequencies using an array of size 26. Compare frequencies for both strings."),
        ("Group Anagrams", "Strings & Hashing", "Group anagrams together from a list of strings.", "Time: O(N * K log K), Space: O(N)", "Use a Hash Map where the key is the sorted string and the value is a list of matching anagram strings."),
        ("Longest Substring Without Repeating Characters", "Sliding Window", "Find the length of the longest substring without repeating characters.", "Time: O(N), Space: O(N)", "Use a sliding window with a Hash Set. Move right pointer, if duplicate found, shrink window from left."),
        ("Valid Parentheses", "Stacks", "Check if brackets in a string are closed in the correct order.", "Time: O(N), Space: O(N)", "Push opening brackets to stack. For closing brackets, pop and verify if it matches correct opening type."),
        ("Reverse Linked List", "Linked Lists", "Reverse a singly linked list.", "Time: O(N), Space: O(1)", "Iterative approach: Maintain prev, curr, and next pointers. Change curr->next to prev and step forward."),
        ("Linked List Cycle", "Linked Lists", "Detect if a linked list contains a cycle.", "Time: O(N), Space: O(1)", "Floyd's Tortoise and Hare: Use fast and slow pointers. If they meet, a cycle exists."),
        ("Merge Two Sorted Lists", "Linked Lists", "Merge two sorted linked lists into one sorted list.", "Time: O(N), Space: O(1)", "Use a dummy head node. Compare heads of both lists, attach the smaller node, and advance."),
        ("Merge Intervals", "Sorting", "Merge all overlapping intervals.", "Time: O(N log N), Space: O(N)", "Sort intervals by start times. Iterate and merge overlapping intervals with the last merged interval."),
        ("Binary Search", "Binary Search", "Find an element index in a sorted array.", "Time: O(log N), Space: O(1)", "Use low and high pointers. Compare target with mid element, adjust pointers accordingly."),
        ("Search in Rotated Sorted Array", "Binary Search", "Search for a target value in a rotated sorted array.", "Time: O(log N), Space: O(1)", "Check which half is sorted (left or right). Perform range checks to narrow down search space."),
        ("Invert Binary Tree", "Trees", "Invert a binary tree (mirror image).", "Time: O(N), Space: O(H)", "Recursively swap the left and right children of every node in post-order traversal."),
        ("Maximum Depth of Binary Tree", "Trees", "Find the height of a binary tree.", "Time: O(N), Space: O(H)", "Return 1 + max(depth of left child, depth of right child) recursively."),
        ("Binary Tree Level Order Traversal", "Trees", "Return level-by-level node values.", "Time: O(N), Space: O(N)", "BFS approach: Use a Queue. Process nodes level by level, adding children to the queue."),
        ("Lowest Common Ancestor of BST", "Trees", "Find the LCA of two nodes in a BST.", "Time: O(H), Space: O(H)", "If both nodes are smaller than root, traverse left. If larger, traverse right. Else, root is the LCA."),
        ("Climbing Stairs", "Dynamic Programming", "Find ways to climb N stairs taking 1 or 2 steps.", "Time: O(N), Space: O(1)", "Fibonacci relation: ways(n) = ways(n-1) + ways(n-2). Optimize space using two variables."),
        ("Coin Change", "Dynamic Programming", "Find minimum coins needed to make a target amount.", "Time: O(N * M), Space: O(N)", "DP array of size amount+1. dp[i] = min(dp[i], dp[i - coin] + 1) for all coins."),
        ("Longest Common Subsequence", "Dynamic Programming", "Find longest common subsequence between two strings.", "Time: O(N * M), Space: O(N * M)", "2D DP matrix. If characters match, dp[i][j] = 1 + dp[i-1][j-1]. Else, max(dp[i-1][j], dp[i][j-1])."),
        ("House Robber", "Dynamic Programming", "Rob houses in a street without robbing adjacent ones.", "Time: O(N), Space: O(1)", "dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Maintain two variables for space optimization."),
        ("Number of Islands", "Graphs", "Count islands in a 2D binary grid.", "Time: O(R * C), Space: O(R * C)", "Iterate grid. When '1' is found, increment island count and run DFS/BFS to mark all connected land as '0'."),
        ("Clone Graph", "Graphs", "Create a deep copy of an undirected graph.", "Time: O(V + E), Space: O(V)", "Use DFS/BFS. Maintain a Hash Map mapping original nodes to their corresponding cloned nodes."),
        ("Course Schedule", "Graphs", "Detect if you can finish all courses given pre-requisites.", "Time: O(V + E), Space: O(V + E)", "Detect cycle in a directed graph using Topological Sort (Kahn's Algorithm) or DFS coloring."),
        ("Pacific Atlantic Water Flow", "Graphs", "Find cells that can flow to both Pacific and Atlantic oceans.", "Time: O(R * C), Space: O(R * C)", "Run DFS/BFS from ocean borders inward. Return cells reachable from both ocean boundaries."),
        ("Longest Consecutive Sequence", "Hashing", "Find longest consecutive elements sequence length.", "Time: O(N), Space: O(N)", "Insert all numbers into a Hash Set. For each number, if (num - 1) is not in set, count consecutive numbers upward.")
    ]
    return problems

def generate_pdf():
    pdf = CodingPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.alias_nb_pages()
    
    # Page 1: COVER PAGE
    pdf.add_page()
    pdf.set_fill_color(250, 252, 254)  # Light BG
    pdf.rect(0, 0, 210, 297, 'F')
    
    # Left accent bar
    pdf.set_fill_color(99, 102, 241)  # Indigo
    pdf.rect(0, 0, 15, 297, 'F')
    
    pdf.set_left_margin(25)
    pdf.ln(50)
    pdf.set_font('helvetica', 'B', 28)
    pdf.set_text_color(17, 24, 39)
    pdf.multi_cell(0, 12, 'Top 30 Most Asked\nCoding Questions\nwith Solutions')
    pdf.ln(10)
    
    pdf.set_font('helvetica', 'B', 14)
    pdf.set_text_color(99, 102, 241)
    pdf.cell(0, 10, 'Essential DSA Preparation for Campus Recruitment', new_x="LMARGIN", new_y="NEXT")
    pdf.ln(20)
    
    pdf.set_font('helvetica', '', 11)
    pdf.set_text_color(75, 85, 99)
    features = [
        "- Curated list of high-frequency interview questions",
        "- Optimized Time & Space Complexities for every problem",
        "- Concise algorithmic strategies for solving",
        "- Spans Arrays, Strings, Lists, Trees, Graphs, and DP",
        "- Perfect for quick reference before coding rounds"
    ]
    for feat in features:
        pdf.cell(0, 8, feat, new_x="LMARGIN", new_y="NEXT")
    
    pdf.ln(40)
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(156, 163, 175)
    pdf.cell(0, 6, 'Generated by AI Resume Analyzer - Coding Test Practice Module', new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, 'Date: June 2026', new_x="LMARGIN", new_y="NEXT")
    
    # Reset Margin
    pdf.set_left_margin(15)
    
    # Page 2: QUESTIONS LIST
    pdf.add_page()
    
    pdf.set_font('helvetica', 'B', 16)
    pdf.set_text_color(17, 24, 39)
    pdf.set_x(15)
    pdf.multi_cell(0, 10, 'Coding Interview Cheat Sheet', new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)
    
    problems = build_problems()
    
    for idx, (title, topic, desc, complexity, strategy) in enumerate(problems):
        pdf.set_x(15)
        pdf.set_font('helvetica', 'B', 11)
        pdf.set_text_color(17, 24, 39)
        pdf.multi_cell(0, 6, f"{idx+1}. {title} ({topic})", new_x="LMARGIN", new_y="NEXT")
        
        pdf.set_x(15)
        pdf.set_font('helvetica', 'I', 9)
        pdf.set_text_color(99, 102, 241)  # Indigo
        pdf.multi_cell(0, 5, f"Complexity: {complexity}", new_x="LMARGIN", new_y="NEXT")
        
        pdf.set_x(15)
        pdf.set_font('helvetica', '', 9.5)
        pdf.set_text_color(55, 65, 81)
        pdf.multi_cell(0, 5, f"Problem: {desc}", new_x="LMARGIN", new_y="NEXT")
        
        pdf.set_x(15)
        pdf.set_font('helvetica', '', 9)
        pdf.set_text_color(107, 114, 128)
        pdf.multi_cell(0, 5, f"Strategy: {strategy}", new_x="LMARGIN", new_y="NEXT")
        
        pdf.ln(4)
        
    # Output file
    dest_path1 = "c:/Users/sushanth/AI RESUME/frontend/public/Top 30 Most Asked Coding Questions with Optimized Solutions.pdf"
    dest_path2 = "c:/Users/sushanth/AI RESUME/resources/public/Top 30 Most Asked Coding Questions with Optimized Solutions.pdf"
    
    # Ensure directories exist
    os.makedirs(os.path.dirname(dest_path1), exist_ok=True)
    os.makedirs(os.path.dirname(dest_path2), exist_ok=True)
    
    pdf.output(dest_path1)
    pdf.output(dest_path2)
    print(f"Successfully generated PDF files:\n- {dest_path1}\n- {dest_path2}")

if __name__ == "__main__":
    generate_pdf()
