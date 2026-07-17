const productCompanies = [
  {
    id: 'amazon',
    name: 'Amazon',
    category: 'Product-Based',
    overview: {
      founder: 'Jeff Bezos',
      history: 'Founded in 1994 in Bellevue, Washington as an online marketplace for books, growing into the global leader in e-commerce and cloud computing.',
      headquarters: 'Seattle, Washington, USA',
      employeeStrength: '1.5M+',
      businessDomain: 'E-commerce, Cloud Computing (AWS), Digital Streaming, Artificial Intelligence',
      marketPosition: 'One of the Big Five tech companies, leading retail and cloud services globally.',
      presenceInIndia: 'Massive presence with major development centers in Seattle-like campuses in Hyderabad, Bangalore, Chennai, and Pune.',
      growthTrends: 'Aggressive expansion in generative AI (Bedrock, Q) and advanced robotics for fulfillment centers.',
      futureScope: 'Dominant position in cloud infrastructure and satellite broadband (Project Kuiper).',
      technologies: ['Java', 'C++', 'Python', 'AWS Services', 'DynamoDB', 'React', 'Linux'],
      workCulture: 'High ownership, fast-paced, customer-obsessed, relies heavily on 16 Leadership Principles.',
      careerGrowth: 'Rapid progression paths for high performers; encourages internal team transfers.',
      freshersHiringTrends: 'Hires heavily through university outreach, summer internships, and off-campus hackathons (like Amazon WOW).'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '6.5+ CGPA',
        branches: 'CSE, ECE, EEE, IT and circuit branches',
        backlogs: 'No active backlogs allowed'
      },
      rounds: [
        { name: 'Online Assessment (OA)', details: '1-2 Coding questions (Medium/Hard) + Work style assessment (Leadership Principles).' },
        { name: 'Technical Interview 1', details: 'Focuses on Data Structures, Algorithms, time/space complexity optimization, and OOPS.' },
        { name: 'Technical Interview 2', details: 'Project discussion, system design basics, database queries (SQL/NoSQL), and problem-solving.' },
        { name: 'Bar Raiser / HR', details: 'Conducted by an independent interviewer. Deep probe into Amazon Leadership Principles using the STAR method.' }
      ]
    },
    placementInsights: {
      packageRange: '₹18 LPA - ₹45 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹50,000 - ₹1,10,000/month)',
      averageFresherSalary: '₹22 LPA',
      highestSalaryRange: '₹45 LPA - ₹50 LPA',
      currentHiringDemand: 'High',
      mostHiredRoles: ['Software Development Engineer I (SDE-1)', 'Cloud Support Associate', 'Systems Engineer']
    },
    preparationRoadmap: {
      difficultyLevel: 'Hard',
      importantTopics: ['Data Structures (Trees, Graphs, DP, HashMaps)', 'Object-Oriented Programming (OOPS)', 'System Design', 'DBMS & SQL'],
      timeline: '6 - 8 Months',
      learningPath: 'Practice SDE sheets, LeetCode Top 100 Liked, and read the 16 Leadership Principles carefully.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Medium', topics: 'Logical reasoning, quantitative analysis', weightage: 'Low' },
      coding: { count: 2, difficulty: 'Medium-Hard', concepts: 'Dynamic Programming, Trees, Graphs, Strings' },
      interview: { technical: 'Deep data structure questions, coding optimization', hr: 'Leadership Principles using STAR format' }
    },
    faqs: {
      aptitude: ['Work and Time', 'Speed and Distance', 'Probability'],
      coding: ['Merge Intervals', 'Binary Tree Zigzag Traversal', 'LRU Cache implementation'],
      technical: ['Explain Virtual Memory and Thrashing.', 'What is the difference between TCP and UDP?', 'How does index work in database?'],
      hr: ['Why Amazon?', 'Tell me about a time you handled a conflict in a team.', 'Describe a scenario where you took the lead on a project.']
    }
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    category: 'Product-Based',
    overview: {
      founder: 'Bill Gates and Paul Allen',
      history: 'Founded in 1975 to develop and sell BASIC interpreters for the Altair 8800. Grew to dominate the personal computer operating system market with MS-DOS and Windows.',
      headquarters: 'Redmond, Washington, USA',
      employeeStrength: '220,000+',
      businessDomain: 'Software Development, Consumer Electronics, Personal Computers, Cloud Services (Azure)',
      marketPosition: 'Leading global provider of enterprise systems, software products, and Azure cloud infrastructure.',
      presenceInIndia: 'Major campuses in Hyderabad (largest outside Redmond), Bangalore, and Noida.',
      growthTrends: 'Heavy investments in OpenAI alliance, Microsoft Copilot, and Azure AI infrastructure.',
      futureScope: 'Leadership in AI productivity suites and global cloud computing.',
      technologies: ['C#', 'C++', 'TypeScript', 'Java', 'Azure Services', 'SQL Server', 'Python'],
      workCulture: 'Collaborative, growth mindset, focus on diversity and inclusion, strong work-life balance.',
      careerGrowth: 'Structured performance reviews, extensive mentoring programs, and massive training libraries.',
      freshersHiringTrends: 'Hires through Microsoft Engage program, campus placement, and national hackathons.'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '7.0+ CGPA',
        branches: 'CSE, ECE, IT, Software Engineering',
        backlogs: 'No active backlogs'
      },
      rounds: [
        { name: 'Online Assessment', details: '2 Coding questions (Medium/Hard) on platform like Codility.' },
        { name: 'Technical Interview 1', details: 'Coding on data structures (linked list, trees), code efficiency, and dry runs.' },
        { name: 'Technical Interview 2', details: 'System Design questions, multi-threading, OOPS, and memory allocation.' },
        { name: 'AA (Asappropriate) Round / HR', details: 'Culture fit check, analytical reasoning, and behavioral questions.' }
      ]
    },
    placementInsights: {
      packageRange: '₹20 LPA - ₹48 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹80,000 - ₹1,25,000/month)',
      averageFresherSalary: '₹26 LPA',
      highestSalaryRange: '₹48 LPA - ₹52 LPA',
      currentHiringDemand: 'Medium-High',
      mostHiredRoles: ['Software Engineer (SWE)', 'Program Manager', 'Support Engineer']
    },
    preparationRoadmap: {
      difficultyLevel: 'Hard',
      importantTopics: ['Algorithms (DFS, BFS, Sorting, Binary Search)', 'Low-Level Design', 'Operating Systems (OS)', 'C#/.NET Core'],
      timeline: '6 - 9 Months',
      learningPath: 'Focus on recursion, tree traversals, array manipulation, and low-level architectural design.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Medium', topics: 'Numerical reasoning, abstract reasoning', weightage: 'Medium' },
      coding: { count: 2, difficulty: 'Hard', concepts: 'Graphs, Linked Lists, Trees, Arrays' },
      interview: { technical: 'Clean coding standards, concurrency, system design', hr: 'Behavioral, conflict resolution, growth mindset' }
    },
    faqs: {
      aptitude: ['Data Interpretation', 'Logical Puzzles', 'Syllogisms'],
      coding: ['Reverse a Linked List in Groups', 'Lowest Common Ancestor in BST', 'Word Ladder'],
      technical: ['Explain process synchronization and semaphores.', 'What is the difference between interface and abstract class in C#?', 'How does garbage collection work in .NET?'],
      hr: ['Why Microsoft?', 'Describe a time you failed and what you learned.', 'How do you handle working with a difficult teammate?']
    }
  },
  {
    id: 'google',
    name: 'Google',
    category: 'Product-Based',
    overview: {
      founder: 'Larry Page and Sergey Brin',
      history: 'Incorporated in 1998 as a search engine project at Stanford. Reorganized under Alphabet Inc. in 2015 as a conglomerate.',
      headquarters: 'Mountain View, California, USA',
      employeeStrength: '180,000+',
      businessDomain: 'Search Engine, Cloud Computing, Online Advertising, AI (Gemini), Hardware (Pixel)',
      marketPosition: 'Unchallenged global leader in search, web advertising, and mobile OS (Android).',
      presenceInIndia: 'Offices in Bangalore, Hyderabad, Gurgaon, and Mumbai.',
      growthTrends: 'Deep integration of Gemini models across Google Search, Android, and Google Cloud.',
      futureScope: 'Pioneering work in quantum computing, self-driving cars (Waymo), and transformer architectures.',
      technologies: ['C++', 'Python', 'Java', 'Go', 'Bigtable', 'Spanner', 'TensorFlow', 'Angular'],
      workCulture: 'Open, creative, high autonomy, flat organization structure, data-driven decisions.',
      careerGrowth: 'Independent project ownership, technical track promotion opportunities, and massive R&D support.',
      freshersHiringTrends: 'Recruits via Google Kick Start, Google Summer of Code (GSoC), and off-campus challenges.'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '7.5+ CGPA',
        branches: 'Open to all branches with strong coding profile',
        backlogs: 'No active backlogs'
      },
      rounds: [
        { name: 'Online Coding Test', details: '2 Algorithmic coding questions (Hard) on Google Recruiter platform.' },
        { name: 'Technical Phone Screen', details: '45-minute live coding round focusing on array manipulation and graphs.' },
        { name: 'Onsite Interview 1-3', details: 'Three separate rounds covering DS, Algorithms, graph traversals, and dynamic programming.' },
        { name: 'Googleyness & Leadership', details: 'HR round evaluating culture fit, values, active collaboration, and ethics.' }
      ]
    },
    placementInsights: {
      packageRange: '₹25 LPA - ₹60 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹1,00,000 - ₹1,50,000/month)',
      averageFresherSalary: '₹32 LPA',
      highestSalaryRange: '₹50 LPA - ₹65 LPA',
      currentHiringDemand: 'Medium',
      mostHiredRoles: ['Software Engineer (SWE)', 'Site Reliability Engineer (SRE)', 'Associate Product Manager']
    },
    preparationRoadmap: {
      difficultyLevel: 'Very Hard',
      importantTopics: ['Advanced Algorithms (Graphs, DP, Segment Trees)', 'System Design', 'Mathematics & Combinatorics', 'Concurrency'],
      timeline: '8 - 12 Months',
      learningPath: 'Master advanced graph algorithms (Dijkstra, Tarjan), dynamic programming memoization, and write production-grade code.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Hard', topics: 'Mathematical puzzles, patterns', weightage: 'Low' },
      coding: { count: 2, difficulty: 'Very Hard', concepts: 'Graphs, Dynamic Programming, Segment Trees, Backtracking' },
      interview: { technical: 'Extreme focus on code optimization, edge cases, scalability', hr: 'Googleyness, values alignment, bias check' }
    },
    faqs: {
      aptitude: ['Combinatorics Puzzles', 'Probability Puzzles', 'Analytical Sequences'],
      coding: ['Find Median from Data Stream', 'Longest Path in Directed Acyclic Graph', 'Edit Distance'],
      technical: ['How does Google Search indexing work at scale?', 'Explain the differences between SQL Spanner and standard MySQL.', 'How does a compiler compile code?'],
      hr: ['What does Googleyness mean to you?', 'Tell me about a project you are proud of.', 'Why do you want to work at Google?']
    }
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    category: 'Product-Based',
    overview: {
      founder: 'Sachin Bansal and Binny Bansal',
      history: 'Founded in 2007 as an online book sales site. Acquired by Walmart in 2018. Developed into India\'s leading e-commerce store.',
      headquarters: 'Bangalore, Karnataka, India',
      employeeStrength: '35,000+',
      businessDomain: 'E-commerce, Digital Payments (PhonePe), Supply Chain Logistics',
      marketPosition: 'Top e-commerce marketplace in India, competing directly with Amazon.',
      presenceInIndia: 'Corporate office in Bangalore, warehouse networks across all major Indian states.',
      growthTrends: 'Expanding fintech offerings, rapid delivery platforms (Flipkart Minutes), and AI recommendations.',
      futureScope: 'Hyper-local commerce and integration of digital supply chains.',
      technologies: ['Java', 'Go', 'React Native', 'Node.js', 'MySQL', 'Kafka', 'Docker'],
      workCulture: 'Empowering, growth-oriented, work-hard-play-hard, strong focus on customer-centric design.',
      careerGrowth: 'Fast tracks for high performers, opportunities in both logistics and tech engineering sides.',
      freshersHiringTrends: 'Hires through Flipkart GRiD National Hackathon and premium campus recruitment.'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '7.0+ CGPA',
        branches: 'CSE, IT, ECE and related fields',
        backlogs: 'No active backlogs'
      },
      rounds: [
        { name: 'Online Coding Test', details: '3 Coding questions (Medium/Hard) on HackerEarth.' },
        { name: 'Machine Coding Round', details: 'Solve a system problem and implement working, clean, object-oriented code in 2 hours.' },
        { name: 'Technical Interview', details: 'Discussion on code choices, database structures, scaling issues, and OOPS.' },
        { name: 'HR / Hiring Manager', details: 'Culture fit check, project discussions, and salary negotiations.' }
      ]
    },
    placementInsights: {
      packageRange: '₹14 LPA - ₹32 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹40,000 - ₹80,000/month)',
      averageFresherSalary: '₹18 LPA',
      highestSalaryRange: '₹32 LPA - ₹35 LPA',
      currentHiringDemand: 'High',
      mostHiredRoles: ['Software Development Engineer I (SDE-1)', 'UI Engineer', 'Data Analyst']
    },
    preparationRoadmap: {
      difficultyLevel: 'Hard',
      importantTopics: ['Object Oriented Design (LLD)', 'Data Structures (Arrays, HashMaps, Heap)', 'Multithreading', 'SQL Queries'],
      timeline: '6 Months',
      learningPath: 'Master Machine Coding patterns (LLD models like Parking Lot, Snake & Ladder) and practice standard DSA questions.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Medium', topics: 'Aptitude, logical sequences', weightage: 'Low' },
      coding: { count: 3, difficulty: 'Medium-Hard', concepts: 'LLD, System Design, Arrays, Trees' },
      interview: { technical: 'Object-oriented programming, design principles (SOLID), database indexing', hr: 'Behavioral, project discussions, ambition' }
    },
    faqs: {
      aptitude: ['Ratio & Proportions', 'Time and Work', 'Coding-Decoding'],
      coding: ['Design a Parking Lot System', 'Snake and Ladder Board Game implementation', 'Implement an URL Shortener'],
      technical: ['Explain SOLID design principles.', 'What is database normalization and when do we use it?', 'Explain index structure in database.'],
      hr: ['Why Flipkart?', 'Describe a time you solved a technical conflict in your team.', 'Where do you see yourself in 3 years?']
    }
  },
  {
    id: 'zoho',
    name: 'Zoho',
    category: 'Product-Based',
    overview: {
      founder: 'Sridhar Vembu and Tony Thomas',
      history: 'Founded in 1996 in Chennai as AdventNet Inc., focusing on network management. Rebranded in 2009 as Zoho Corporation, pivoting to cloud business applications.',
      headquarters: 'Chennai, Tamil Nadu, India',
      employeeStrength: '15,000+',
      businessDomain: 'Cloud Software, Enterprise SaaS Products (Zoho CRM, Zoho Mail, Creator)',
      marketPosition: 'Global leader in boot-strapped SaaS, catering to over 100M+ users worldwide.',
      presenceInIndia: 'Main campuses in Chennai, Tenkasi (rural hub), Coimbatore, and Renigunta.',
      growthTrends: 'Expanding rural offices (Zoho Schools of Technology) and advanced low-code platforms.',
      futureScope: 'Custom enterprise applications, digital workspace integration, and global market growth.',
      technologies: ['Java', 'JavaScript', 'C', 'HTML5/CSS3', 'PostgreSQL', 'Redis', 'Linux'],
      workCulture: 'Humble, rural empowerment, zero-funding pride, high focus on coding capability over degree.',
      careerGrowth: 'Flat hierarchy, project-based growth, highly supportive of self-taught programmers.',
      freshersHiringTrends: 'Hires massive numbers of freshers annually through open off-campus drives and Zoho Schools.'
    },
    hiringProcess: {
      eligibility: {
        cgpa: 'No CGPA Criteria',
        branches: 'Open to all branches and degrees (including arts/science)',
        backlogs: 'Backlogs allowed if candidate can code'
      },
      rounds: [
        { name: 'Written Round / MCQs', details: 'Aptitude questions + Basic C/Java programming snippets.' },
        { name: 'Programming Round (Office)', details: 'Write code for 5-6 coding questions on paper or laptop in Chennai campus.' },
        { name: 'Design / Advanced Coding', details: 'Implement a complex application (e.g. Ticketing System, Banking app) with OOPS concepts.' },
        { name: 'Technical & HR Interviews', details: 'Core Java/JS questions, resume evaluation, and value alignment check.' }
      ]
    },
    placementInsights: {
      packageRange: '₹5 LPA - ₹12 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹15,000 - ₹30,000/month)',
      averageFresherSalary: '₹7 LPA',
      highestSalaryRange: '₹12 LPA - ₹15 LPA',
      currentHiringDemand: 'Very High',
      mostHiredRoles: ['Member Technical Staff (MTS)', 'Software Developer', 'UI/UX Developer']
    },
    preparationRoadmap: {
      difficultyLevel: 'Medium',
      importantTopics: ['C/Java Programming Basics', 'Recursion & Backtracking', 'Object-Oriented Design', 'Pointers & Memory'],
      timeline: '3 - 5 Months',
      learningPath: 'Master basic programming syntax, learn pointers/references, practice building desktop terminal applications.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Medium', topics: 'Logical reasoning, arithmetic math', weightage: 'Medium' },
      coding: { count: 5, difficulty: 'Medium', concepts: 'Arrays, Strings, Recursion, Pointers, Low-Level Design' },
      interview: { technical: 'Object-oriented programming, C/Java concepts, SQL queries', hr: 'Humility check, dedication, stability' }
    },
    faqs: {
      aptitude: ['Averages & Percentages', 'Number Series', 'Logical Puzzles'],
      coding: ['Print pattern in cross fashion (X pattern)', 'Sort array by frequency of elements', 'Implement a console-based Railway Reservation System'],
      technical: ['What is the difference between compiler and interpreter?', 'Explain pointers in C and references in Java.', 'What is method overloading vs overriding?'],
      hr: ['Why Zoho?', 'Are you willing to work in our rural offices like Tenkasi?', 'How do you handle learning new technologies?']
    }
  },
  {
    id: 'oracle',
    name: 'Oracle',
    category: 'Product-Based',
    overview: {
      founder: 'Larry Ellison, Bob Miner, and Ed Oates',
      history: 'Founded in 1977 as Software Development Laboratories. Renamed Oracle, specializing in relational database software and enterprise systems.',
      headquarters: 'Austin, Texas, USA',
      employeeStrength: '140,000+',
      businessDomain: 'Database Software, Cloud Infrastructure (OCI), Enterprise Software (ERP)',
      marketPosition: 'Leading relational database vendor, major enterprise cloud player.',
      presenceInIndia: 'Offices in Bangalore, Hyderabad, Pune, Noida, and Mumbai.',
      growthTrends: 'Expanding Oracle Cloud Infrastructure (OCI) globally to capture enterprise market.',
      futureScope: 'Leadership in cloud databases, Autonomous Database offerings, and healthcare IT.',
      technologies: ['Java', 'PL/SQL', 'C++', 'Python', 'OCI Services', 'Oracle Database', 'Docker'],
      workCulture: 'Structured, professional, corporate, strong tech focus on database and infrastructure systems.',
      careerGrowth: 'Defined career levels, global mobility options, enterprise technology experience.',
      freshersHiringTrends: 'Hires freshers through Oracle Academy and college placement drives.'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '7.0+ CGPA',
        branches: 'CSE, ECE, IT, MCA',
        backlogs: 'No active backlogs'
      },
      rounds: [
        { name: 'Online Test (Oracle Student)', details: 'Aptitude, coding (2 questions), and database query section.' },
        { name: 'Technical Interview 1', details: 'Focuses on database design, normalization, complex SQL joins, and OOPS.' },
        { name: 'Technical Interview 2', details: 'Java programming, operating system processes, virtual memory, and projects.' },
        { name: 'HR Interview', details: 'Salary discussions, relocation confirmation, and behavioral check.' }
      ]
    },
    placementInsights: {
      packageRange: '₹12 LPA - ₹24 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹30,000 - ₹50,000/month)',
      averageFresherSalary: '₹15 LPA',
      highestSalaryRange: '₹22 LPA - ₹26 LPA',
      currentHiringDemand: 'Medium-High',
      mostHiredRoles: ['Associate Software Engineer', 'Database Analyst', 'Cloud Engineer']
    },
    preparationRoadmap: {
      difficultyLevel: 'Medium-Hard',
      importantTopics: ['SQL Queries & PL/SQL', 'Database Management System (DBMS)', 'Java Programming', 'Operating Systems'],
      timeline: '5 - 6 Months',
      learningPath: 'Focus on database architecture, indexing, normalization, transaction isolation levels, and SQL query tuning.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Medium', topics: 'Quantitative, DBMS queries, Java snippets', weightage: 'High' },
      coding: { count: 2, difficulty: 'Medium', concepts: 'Arrays, Strings, LinkedList, Trees' },
      interview: { technical: 'Relational databases, indexing, normal forms, transaction ACID properties', hr: 'Relocation flexibility, stability, growth goals' }
    },
    faqs: {
      aptitude: ['DBMS Schema MCQs', 'SQL query output prediction', 'Quantitative Aptitude'],
      coding: ['Check if a binary tree is balanced', 'Implement a Stack using Queues', 'Reverse words in a given string'],
      technical: ['Explain ACID properties in detail.', 'What is the difference between primary key, unique key, and foreign key?', 'Explain database indexes and how they work.'],
      hr: ['Why Oracle?', 'Tell me about your final year project and your role in it.', 'How do you handle tight project deadlines?']
    }
  },
  {
    id: 'adobe',
    name: 'Adobe',
    category: 'Product-Based',
    overview: {
      founder: 'John Warnock and Charles Geschke',
      history: 'Founded in 1982 in Mountain View. Specialized in desktop publishing software, creating PostScript, PDF formats, Photoshop, and Illustrator.',
      headquarters: 'San Jose, California, USA',
      employeeStrength: '29,000+',
      businessDomain: 'Creative Software, Document Cloud, Digital Marketing Solutions (SaaS)',
      marketPosition: 'Monopoly in creative software, major provider of document management platforms.',
      presenceInIndia: 'Campuses in Noida and Bangalore (largest outside US).',
      growthTrends: 'Integration of generative AI (Adobe Firefly) into Creative Cloud products.',
      futureScope: 'AI-driven content creation and marketing automation.',
      technologies: ['C++', 'Java', 'Python', 'AWS/Azure', 'React', 'C#', 'SQL'],
      workCulture: 'Innovative, employee-friendly, high trust, emphasizes work-life balance and sustainability.',
      careerGrowth: 'Excellent workspace for R&D engineers, structured performance tracks, strong IP/patent support.',
      freshersHiringTrends: 'Hires freshers through premium campus recruitments and national hiring drives.'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '7.5+ CGPA',
        branches: 'CSE, IT, ECE only',
        backlogs: 'No backlogs allowed'
      },
      rounds: [
        { name: 'Online Cognitive Test', details: 'Aptitude, quantitative, logical, and coding (2 questions).' },
        { name: 'Technical Round 1', details: 'Algorithmic problem-solving on trees, graphs, dynamic programming, and OOPS.' },
        { name: 'Technical Round 2', details: 'System Design (e.g. designing collaborative documents, storage caching) and project detail.' },
        { name: 'Hiring Manager / HR', details: 'Behavioral, values assessment, and communication evaluation.' }
      ]
    },
    placementInsights: {
      packageRange: '₹18 LPA - ₹40 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹60,000 - ₹1,00,000/month)',
      averageFresherSalary: '₹22 LPA',
      highestSalaryRange: '₹38 LPA - ₹42 LPA',
      currentHiringDemand: 'High',
      mostHiredRoles: ['Member Technical Staff (MTS)', 'Quality Engineer', 'UI/UX Developer']
    },
    preparationRoadmap: {
      difficultyLevel: 'Hard',
      importantTopics: ['Advanced Data Structures (Segment Trees, Tries)', 'System Design', 'C++ Mastery', 'DBMS & OS'],
      timeline: '6 - 8 Months',
      learningPath: 'Master C++ internals, advanced tree and graph algorithms, and low-level system memory design.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Hard', topics: 'Logical reasoning, math puzzles', weightage: 'Medium' },
      coding: { count: 2, difficulty: 'Hard', concepts: 'Segment Trees, Graphs, Strings, Arrays' },
      interview: { technical: 'Memory management, graphic calculations, low-level design', hr: 'Creative thinking, problem ownership, adaptability' }
    },
    faqs: {
      aptitude: ['Probability Puzzles', 'Venn Diagrams', 'Logical Deduction'],
      coding: ['Implement a Trie (Prefix Tree)', 'Find Median in a Row-wise Sorted Matrix', 'Longest Common Substring'],
      technical: ['Explain how PDF rendering works under the hood.', 'What is the difference between process and thread?', 'How is memory managed in C++ vs Java?'],
      hr: ['Why Adobe?', 'Describe a situation where you had to be creative to solve a problem.', 'What are your career goals?']
    }
  },
  {
    id: 'sap',
    name: 'SAP',
    category: 'Product-Based',
    overview: {
      founder: 'Dietmar Hopp and four former IBM engineers',
      history: 'Founded in 1972 in Germany as Systemanalyse und Programmentwicklung. Grew to become the global leader in enterprise resource planning (ERP) software.',
      headquarters: 'Walldorf, Germany',
      employeeStrength: '110,050+',
      businessDomain: 'Enterprise ERP Software, Cloud Analytics, Database Systems (HANA)',
      marketPosition: 'Leading provider of business software worldwide, managing supply chains and finances for 99% of global business transactions.',
      presenceInIndia: 'Largest campus outside Germany in Bangalore (SAP Labs India).',
      growthTrends: 'Transitioning enterprise services to cloud models (SAP S/4HANA Cloud).',
      futureScope: 'Business AI integrations, sustainability management metrics, and custom business clouds.',
      technologies: ['Java', 'C++', 'ABAP (proprietary)', 'Python', 'SAP HANA', 'JavaScript', 'Docker'],
      workCulture: 'German-engineered precision, highly structured, employee-friendly, supports research and development.',
      careerGrowth: 'Global mobility programs, structured enterprise training, long-term careers.',
      freshersHiringTrends: 'Hires freshers through SAP Labs Scholar program and national placement drives.'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '7.0+ CGPA',
        branches: 'CSE, IT, ECE, EEE',
        backlogs: 'No active backlogs'
      },
      rounds: [
        { name: 'Online Aptitude & Code', details: 'MCQs on CS fundamentals, logical puzzles, and 2 coding questions.' },
        { name: 'Technical Interview 1', details: 'Deep dive into OOPS, DBMS, database design (SQL), and coding.' },
        { name: 'Technical Interview 2', details: 'Project architecture review, cloud basics, and problem-solving scenarios.' },
        { name: 'HR Interview', details: 'Core values, team collaboration scenarios, and salary discussions.' }
      ]
    },
    placementInsights: {
      packageRange: '₹10 LPA - ₹22 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹25,000 - ₹45,000/month)',
      averageFresherSalary: '₹12 LPA',
      highestSalaryRange: '₹20 LPA - ₹24 LPA',
      currentHiringDemand: 'Medium-High',
      mostHiredRoles: ['Developer Associate', 'QA Associate', 'Support Engineer']
    },
    preparationRoadmap: {
      difficultyLevel: 'Medium-Hard',
      importantTopics: ['Object-Oriented Programming (Java/C++)', 'Relational Databases (SQL)', 'Web Development Basics', 'Cloud Computing'],
      timeline: '5 - 6 Months',
      learningPath: 'Master Java or C++ OOPS concepts, learn relational database normalization, and review basic cloud patterns.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Medium', topics: 'Mathematical logic, CS questions', weightage: 'High' },
      coding: { count: 2, difficulty: 'Medium', concepts: 'Arrays, Strings, Maps, Searching' },
      interview: { technical: 'Object-oriented structure, database normalization, system architecture', hr: 'Germany culture integration, teamwork, stability' }
    },
    faqs: {
      aptitude: ['Clocks and Calendars', 'Percentage & Interest', 'Java code snippets'],
      coding: ['Check if two strings are Anagrams', 'Find first non-repeating character in a string', 'Level Order Traversal of a Binary Tree'],
      technical: ['Explain database transactions and ACID properties.', 'What is the difference between dynamic polymorphism and static polymorphism?', 'Explain MVC architecture.'],
      hr: ['Why SAP Labs?', 'Tell me about a time you worked in a group and had different opinions.', 'How do you handle feedback?']
    }
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'Product-Based',
    overview: {
      founder: 'Marc Benioff and Parker Harris',
      history: 'Founded in 1999 in San Francisco. Pioneered SaaS cloud CRM solutions, rendering traditional desktop installation models obsolete.',
      headquarters: 'San Francisco, California, USA',
      employeeStrength: '79,000+',
      businessDomain: 'Cloud CRM, Enterprise SaaS, Marketing Automation, MuleSoft & Tableau integrations',
      marketPosition: 'Undisputed global leader in CRM solutions, pioneer of cloud SaaS models.',
      presenceInIndia: 'Major operations in Hyderabad, Bangalore, and Pune.',
      growthTrends: 'Integrating Einstein AI across the CRM system to automate customer interactions.',
      futureScope: 'AI-first CRM clouds, cloud data warehouses, and low-code integrations.',
      technologies: ['Java', 'Apex (proprietary)', 'Lightning Web Components', 'JavaScript', 'Python', 'AWS', 'SQL'],
      workCulture: 'Ohana culture (meaning family in Hawaiian), high empathy, focus on philanthropy, supportive.',
      careerGrowth: 'Fast tracks for cloud developers, structured certifications, and vast career routes.',
      freshersHiringTrends: 'Hires freshers through university placement and MuleSoft/Salesforce developer programs.'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '7.5+ CGPA',
        branches: 'CSE, IT, ECE and related branches',
        backlogs: 'No active backlogs allowed'
      },
      rounds: [
        { name: 'Online Coding Test', details: '3 Coding questions (Medium/Hard) on platform like HackerRank.' },
        { name: 'Technical Interview 1', details: 'Focused on core DSA (Trees, Graphs, DP) and Java/Javascript concepts.' },
        { name: 'Technical Interview 2', details: 'System design, APIs, integration flows, and OOPS models.' },
        { name: 'Managerial & HR Round', details: 'Culture fit check, Ohana values assessment, and communication.' }
      ]
    },
    placementInsights: {
      packageRange: '₹16 LPA - ₹38 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹50,000 - ₹90,000/month)',
      averageFresherSalary: '₹20 LPA',
      highestSalaryRange: '₹35 LPA - ₹40 LPA',
      currentHiringDemand: 'High',
      mostHiredRoles: ['Associate Member Technical Staff (AMTS)', 'Salesforce Developer', 'Technical Consultant']
    },
    preparationRoadmap: {
      difficultyLevel: 'Hard',
      importantTopics: ['Web Services & REST APIs', 'Object-Oriented Design', 'JavaScript Frameworks', 'Data Structures'],
      timeline: '6 Months',
      learningPath: 'Master JavaScript (LWC uses JS), learn REST API design, OOPS design principles, and practice standard SDE sheets.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Medium', topics: 'Analytical reasoning', weightage: 'Low' },
      coding: { count: 3, difficulty: 'Hard', concepts: 'Dynamic Programming, Graph traversals, Trees, Maps' },
      interview: { technical: 'API design, asynchronous JS, object relationships, database normalization', hr: 'Ohana cultural alignment, collaboration values, customer focus' }
    },
    faqs: {
      aptitude: ['Data Interpretation', 'Syllogisms', 'Probability'],
      coding: ['Implement a Rate Limiter', 'Word Search in Grid (Backtracking)', 'Merge K Sorted Lists'],
      technical: ['Explain the difference between SOAP and REST APIs.', 'What are closures in JavaScript?', 'How do you handle security in Web APIs?'],
      hr: ['What do you know about our Ohana culture?', 'Why do you want to join Salesforce?', 'Describe a time you went out of your way to help someone.']
    }
  },
  {
    id: 'cisco',
    name: 'Cisco',
    category: 'Product-Based',
    overview: {
      founder: 'Leonard Bosack and Sandy Lerner',
      history: 'Founded in 1984 by Stanford computer scientists. Pioneered the multi-protocol router system connecting different computer networks.',
      headquarters: 'San Jose, California, USA',
      employeeStrength: '83,000+',
      businessDomain: 'Networking Hardware, Telecom Equipment, Cybersecurity, IoT, Webex collaboration',
      marketPosition: 'Leading networking and routers hardware company in the world.',
      presenceInIndia: 'Major development campuses in Bangalore (largest R&D outside US).',
      growthTrends: 'Deep pivot into cybersecurity services (Splunk acquisition) and cloud network automation.',
      futureScope: 'Software-Defined Networking (SDN), 5G networks, and AI-driven network security.',
      technologies: ['C', 'C++', 'Python', 'Networking Protocols', 'Linux Internals', 'Golang', 'Java'],
      workCulture: 'Collaborative, engineering-centric, supportive, strong work-life balance, focus on community service.',
      careerGrowth: 'Technical engineering paths (CCNA/CCNP tracks), global networking systems exposure.',
      freshersHiringTrends: 'Hires freshers through Cisco Ideathon and college placement drives.'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '7.0+ CGPA',
        branches: 'CSE, ECE, IT, Telecom, EEE',
        backlogs: 'No active backlogs'
      },
      rounds: [
        { name: 'Online Test (Cisco Ideathon)', details: 'Aptitude, networking MCQs, and 2 coding questions.' },
        { name: 'Technical Interview 1', details: 'Deep dive into computer networks (OSI, TCP/IP, routing protocols) and C/C++.' },
        { name: 'Technical Interview 2', details: 'Linux, system calls, multi-threading, OOPS, and coding.' },
        { name: 'Managerial & HR', details: 'Values assessment, communication check, and relocation details.' }
      ]
    },
    placementInsights: {
      packageRange: '₹12 LPA - ₹28 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹40,000 - ₹70,000/month)',
      averageFresherSalary: '₹16 LPA',
      highestSalaryRange: '₹26 LPA - ₹30 LPA',
      currentHiringDemand: 'High',
      mostHiredRoles: ['Software Engineer (Networking)', 'Technical Consulting Engineer', 'Embedded Developer']
    },
    preparationRoadmap: {
      difficultyLevel: 'Medium-Hard',
      importantTopics: ['Computer Networks (TCP/IP, OSI, Routing)', 'C/C++ Programming', 'Operating Systems (OS)', 'Linux & Bash'],
      timeline: '5 - 6 Months',
      learningPath: 'Master computer networking concepts (routing protocols, sub-netting, OSI layers), study Linux system programming, and learn C/C++.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Medium', topics: 'Networking MCQs, logical reasoning', weightage: 'High' },
      coding: { count: 2, difficulty: 'Medium', concepts: 'Arrays, Strings, Bit Manipulation, Recursion' },
      interview: { technical: 'Networking layers, sub-netting, routing tables, sockets, Linux processes', hr: 'Teamwork orientation, active listening, stability' }
    },
    faqs: {
      aptitude: ['OSI Layers MCQs', 'Sub-netting calculation puzzles', 'Quantitative reasoning'],
      coding: ['Check if a number is Power of 2 (Bit manipulation)', 'Find the loop in a Linked List', 'Merge two sorted arrays'],
      technical: ['Explain what happens when you enter a URL in a browser.', 'What is sub-netting? Why do we use it?', 'Explain TCP 3-way handshake in detail.'],
      hr: ['Why Cisco?', 'Tell me about a technical project where you faced a significant bottleneck.', 'How do you keep yourself updated with new tech trends?']
    }
  }
];

module.exports = productCompanies;
