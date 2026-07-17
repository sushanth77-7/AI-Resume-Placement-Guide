const serviceCompanies = [
  {
    id: 'tcs',
    name: 'TCS',
    category: 'Service-Based',
    overview: {
      founder: 'Tata Group (Faquir Chand Kohli)',
      history: 'Founded in 1968, growing to become the largest IT services exporter in India and the flagship company of the Tata Group.',
      headquarters: 'Mumbai, Maharashtra, India',
      employeeStrength: '600,000+',
      businessDomain: 'IT Services, Business Consulting, digital solutions',
      marketPosition: 'Largest IT services company in India, second largest globally by brand value.',
      presenceInIndia: 'Campuses in every major Indian city (Bangalore, Chennai, Hyderabad, Pune, Delhi/NCR, Kolkata).',
      growthTrends: 'Deep pivot into enterprise cloud migrations, cybersecurity, and generative AI services.',
      futureScope: 'Global enterprise digital transformations, hybrid clouds, and infrastructure modernization.',
      technologies: ['Java', 'SQL', 'Python', 'JavaScript', 'HTML/CSS', 'AWS/Azure', 'C#'],
      workCulture: 'Stable, supportive, structured, strong focus on Tata values and ethics, good work-life balance.',
      careerGrowth: 'Well-defined training models (TCS Elevate), high job security, structured promotion cycles.',
      freshersHiringTrends: 'Massive fresher intake annually through TCS NQT (National Qualifier Test) under categories: Ninja (3.3 LPA), Digital (7.0 LPA), and Prime (9.0 LPA).'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '6.0+ CGPA (or 60% in 10th, 12th, and Graduation)',
        branches: 'All engineering branches, MCA, M.Sc (IT/CS)',
        backlogs: 'Maximum 1 active backlog allowed at the time of test'
      },
      rounds: [
        { name: 'TCS NQT Online Exam', details: 'Part A: Foundation Section (Aptitude, Reasoning, Verbal). Part B: Advanced Section (Advanced Quant, Coding - 2 questions).' },
        { name: 'Technical Interview', details: 'Discuss basic programming concepts (Java/C++), database tables, SQL joins, final year project, and OOPS.' },
        { name: 'MR (Managerial) Round', details: 'Real-time project scenario discussions, puzzle solving, and tech adaptability check.' },
        { name: 'HR Interview', details: 'Check communication skills, document verification, shifting flexibility, and Tata values.' }
      ]
    },
    placementInsights: {
      packageRange: '₹3.3 LPA - ₹9.0 LPA',
      internshipOpportunities: 'Yes (Offered to select NQT toppers; Stipend: ₹12,000 - ₹20,000/month)',
      averageFresherSalary: '₹4.0 LPA',
      highestSalaryRange: '₹9.0 LPA - ₹12 LPA',
      currentHiringDemand: 'Very High',
      mostHiredRoles: ['System Engineer Trainee (Ninja)', 'Digital Developer', 'Prime Systems Engineer']
    },
    preparationRoadmap: {
      difficultyLevel: 'Easy-Medium',
      importantTopics: ['Quantitative Aptitude & Reasoning', 'Basics of Programming (Loops, Arrays)', 'SQL Queries', 'Final Year Project details'],
      timeline: '2 - 3 Months',
      learningPath: 'Practice quantitative aptitude (R.S. Aggarwal), learn basic coding patterns, and prepare SQL join queries.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Medium', topics: 'Quantitative math, logical sequences, verbal grammar', weightage: 'High' },
      coding: { count: 2, difficulty: 'Easy-Medium', concepts: 'Arrays, Strings, Series generation, Math formulations' },
      interview: { technical: 'Basic definition of OOPS, SQL joins, project description', hr: 'Relocation confirmation, shift flexibility, values check' }
    },
    faqs: {
      aptitude: ['Averages & Percentages', 'Time, Speed, and Distance', 'Syllogisms'],
      coding: ['Find prime numbers in a range', 'Check if a string is palindrome', 'Find the second largest element in an array'],
      technical: ['What are the four pillars of OOPS?', 'Difference between DBMS and File System.', 'Explain Inner Join vs Outer Join in SQL.'],
      hr: ['Why do you want to join TCS?', 'Are you comfortable with night shifts and relocation?', 'Tell me about a time you worked in a team.']
    }
  },
  {
    id: 'infosys',
    name: 'Infosys',
    category: 'Service-Based',
    overview: {
      founder: 'N. R. Narayana Murthy and six engineers',
      history: 'Founded in 1981 in Pune, moving to Bangalore in 1983. Pioneered the Global Delivery Model for IT outsourcing.',
      headquarters: 'Bangalore, Karnataka, India',
      employeeStrength: '320,000+',
      businessDomain: 'IT Services, Business Consulting, outsourcing',
      marketPosition: 'Second largest Indian IT services exporter.',
      presenceInIndia: 'Corporate campuses in Bangalore (largest IT park), Pune, Hyderabad, Chennai, Mysore (training base).',
      growthTrends: 'Deep focus on digital transformation consulting, cloud platforms (Infosys Cobalt), and AI.',
      futureScope: 'Digital workspace solutions, enterprise SaaS applications, and global outsourcing integrations.',
      technologies: ['Java', '.NET', 'SQL', 'Angular/React', 'Python', 'Salesforce', 'Cloud Services'],
      workCulture: 'Structured, highly professional, great focus on learning (Mysore training center is famous), corporate.',
      careerGrowth: 'Extensive training programs (Infosys Lex), certifications-driven promotions.',
      freshersHiringTrends: 'Hires through Infosys Certification (InfyTQ), HackWithInfy coding contest, and campus placements (System Engineer vs Specialist Programmer roles).'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '6.0+ CGPA (60% average throughout education)',
        branches: 'CSE, ECE, EEE, IT, Telecom, MCA',
        backlogs: 'No active backlogs allowed'
      },
      rounds: [
        { name: 'Online Assessment', details: 'Quantitative, logical reasoning, verbal, pseudocode analysis, and puzzle-solving.' },
        { name: 'Coding Round (HackWithInfy)', details: '3 Coding questions (Medium/Hard) on algorithms and data structures.' },
        { name: 'Technical Interview', details: 'Focuses on programming syntax, OOPS, database keys, web technologies, and project.' },
        { name: 'HR Interview', details: 'Check communication, shifts comfort, salary confirmation, and relocation details.' }
      ]
    },
    placementInsights: {
      packageRange: '₹3.6 LPA - ₹9.5 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹15,000 - ₹25,000/month)',
      averageFresherSalary: '₹4.2 LPA',
      highestSalaryRange: '₹8.0 LPA - ₹10 LPA',
      currentHiringDemand: 'High',
      mostHiredRoles: ['System Engineer (SE)', 'Specialist Programmer (SP)', 'Digital System Engineer (DSE)']
    },
    preparationRoadmap: {
      difficultyLevel: 'Easy-Medium',
      importantTopics: ['Pseudocode dry-running', 'Quantitative reasoning', 'Data Structures (Arrays, Lists)', 'SQL Joins'],
      timeline: '2 - 3 Months',
      learningPath: 'Practice solving pseudocode snippets, learn quantitative tricks, and master basic programming logic.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Medium-Hard', topics: 'Pseudocode analysis, quantitative logic', weightage: 'High' },
      coding: { count: 3, difficulty: 'Medium-Hard', concepts: 'Dynamic Programming, Graphs, Arrays, Math logic' },
      interview: { technical: 'Object-oriented programming, data structures, SQL queries, basic HTML/CSS', hr: 'Relocation, bonds, night shifts readiness' }
    },
    faqs: {
      aptitude: ['Cryptarithmetic puzzles', 'Predicting pseudocode outputs', 'Permutations & Combinations'],
      coding: ['Calculate sum of digits of a number until single digit', 'Longest palindromic substring', 'Find count of occurrences of a target in sorted array'],
      technical: ['Explain different states of a process in OS.', 'What is the difference between compiler and interpreter?', 'Explain primary key vs unique key in DBMS.'],
      hr: ['Why Infosys?', 'Tell me about your training experience at college.', 'Are you ready to sign the service agreement bond?']
    }
  },
  {
    id: 'wipro',
    name: 'Wipro',
    category: 'Service-Based',
    overview: {
      founder: 'M.H. Hasham Premji (Azim Premji)',
      history: 'Founded in 1945 as Western India Vegetable Products. Pivoted to IT services and software solutions in the late 1970s.',
      headquarters: 'Bangalore, Karnataka, India',
      employeeStrength: '240,005+',
      businessDomain: 'IT Consulting, System Integration, business process services',
      marketPosition: 'Leading Indian multinational provider of software outsourcing services.',
      presenceInIndia: 'Campuses in Bangalore, Pune, Chennai, Hyderabad, and Kolkata.',
      growthTrends: 'Leveraging cloud integrations, cybersecurity consultancies, and digital workspace setups.',
      futureScope: 'Enterprise cloud services, AI engineering, and green technology solutions.',
      technologies: ['Java', 'C++', '.NET', 'SQL Server', 'JavaScript', 'Cloud Solutions', 'Python'],
      workCulture: 'Ethical, simple, community-focused, values work-life balance and continuous upskilling.',
      careerGrowth: 'Upskilling programs (Wipro TalentNext), internal job opportunities, structured levels.',
      freshersHiringTrends: 'Hires freshers through Wipro Elite NTH (National Talent Hunt) and Wipro WILP (Work Integrated Learning Program) for BSC/BCA graduates.'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '6.0+ CGPA (60% in 10th and 12th)',
        branches: 'CSE, ECE, EEE, IT, Mech, Civil, MCA',
        backlogs: 'Maximum 1 active backlog'
      },
      rounds: [
        { name: 'Wipro Elite Online Exam', details: 'Aptitude (Quant/Logical/Verbal) + Essay Writing (Writex) + Coding (2 questions).' },
        { name: 'Technical Interview', details: 'Basic coding logic, OOPS, databases, networking definitions, and project.' },
        { name: 'HR Interview', details: 'Verify documents, check shifts flexibility, and communication check.' }
      ]
    },
    placementInsights: {
      packageRange: '₹3.5 LPA - ₹7.0 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹12,000 - ₹18,000/month)',
      averageFresherSalary: '₹3.8 LPA',
      highestSalaryRange: '₹6.5 LPA - ₹8.0 LPA',
      currentHiringDemand: 'High',
      mostHiredRoles: ['Project Engineer', 'Scholar Trainee (WILP)', 'Associate Developer']
    },
    preparationRoadmap: {
      difficultyLevel: 'Easy',
      importantTopics: ['Quantitative Aptitude', 'Essay Writing (Grammar)', 'Basic Coding (Arrays/Strings)', 'DBMS Basics'],
      timeline: '2 Months',
      learningPath: 'Prepare standard aptitude questions, practice writing structured essays, and solve basic string manipulation coding challenges.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Easy-Medium', topics: 'Basic math, English grammar essay, logic', weightage: 'High' },
      coding: { count: 2, difficulty: 'Easy', concepts: 'Arrays, Strings, Loops, Basic Sorting' },
      interview: { technical: 'Basics of C/Java, OOPS definitions, SQL joins, project summary', hr: 'Communication skills, shift rotation readiness' }
    },
    faqs: {
      aptitude: ['Aptitude (Ratios, Profit-Loss)', 'Essay Writing on Social/Tech topics', 'Logical Syllogisms'],
      coding: ['Check if an array is sorted', 'Count vowels and consonants in a string', 'Convert binary number to decimal'],
      technical: ['What is the difference between C and Java?', 'Explain local, static, and global variables.', 'What is normalization in database?'],
      hr: ['Why Wipro?', 'Tell me about your strengths and weaknesses.', 'Are you ready to relocate anywhere in India?']
    }
  },
  {
    id: 'accenture',
    name: 'Accenture',
    category: 'Service-Based',
    overview: {
      founder: 'Arthur Andersen (Originally Andersen Consulting)',
      history: 'Spun off from accounting firm Arthur Andersen in 1989. Rebranded as Accenture in 2001. Developed into the largest global IT consulting firm.',
      headquarters: 'Dublin, Ireland (Operations head in Bangalore/New York)',
      employeeStrength: '730,000+',
      businessDomain: 'Management Consulting, Technology Services, Cloud Systems, Outsourcing',
      marketPosition: 'Largest consulting and IT outsourcing firm globally by revenue and employee count.',
      presenceInIndia: 'Largest employee base in India (~300,000) with key hubs in Bangalore, Hyderabad, Pune, Mumbai, and Chennai.',
      growthTrends: 'Heavy investments in cloud modernization, enterprise security, and customized business AI models.',
      futureScope: 'Digital transformation consulting, AI-driven automation, and sustainable technologies.',
      technologies: ['Java', 'SAP', 'Salesforce', '.NET', 'React/Angular', 'AWS/Azure Cloud', 'Data Analytics'],
      workCulture: 'Professional, results-oriented, corporate, highly diverse, strong focus on training and meritocracy.',
      careerGrowth: 'Fast tracks for consultants, structured career paths from Analyst to Managing Director.',
      freshersHiringTrends: 'Hires massive numbers of freshers annually through national recruitment drives (Associate Software Engineer vs Advanced ASE roles).'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '6.5+ CGPA (65% throughout education)',
        branches: 'All engineering streams, MCA, M.Sc (CS/IT)',
        backlogs: 'No active backlogs allowed'
      },
      rounds: [
        { name: 'Cognitive & Technical Assessment', details: 'MCQs on Aptitude, Reasoning, MS Office, Networking, Security, and Pseudocode. (Elimination round).' },
        { name: 'Coding Assessment', details: '2 Coding questions (Easy/Medium) to solve in 45 minutes.' },
        { name: 'Communication Assessment', details: 'Non-elimination round evaluating speaking, reading, listening, and pronunciation.' },
        { name: 'Technical & HR Interview', details: 'Combined interview covering final year project, coding, OOPS, databases, and behavioral questions.' }
      ]
    },
    placementInsights: {
      packageRange: '₹4.5 LPA - ₹6.5 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹20,000 - ₹35,000/month)',
      averageFresherSalary: '₹4.6 LPA',
      highestSalaryRange: '₹6.5 LPA - ₹8.0 LPA',
      currentHiringDemand: 'Very High',
      mostHiredRoles: ['Associate Software Engineer (ASE)', 'Advanced Associate Software Engineer (AASE)']
    },
    preparationRoadmap: {
      difficultyLevel: 'Medium',
      importantTopics: ['MS Office & IT Basics', 'Pseudocode analysis', 'Basic Coding', 'Behavioral STAR stories'],
      timeline: '2 - 3 Months',
      learningPath: 'Review computer network basics, study MS Office shortcut keys, practice basic array/string coding, and prepare final project details.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Medium', topics: 'MS Office, networking, logic, pseudocode', weightage: 'High' },
      coding: { count: 2, difficulty: 'Easy-Medium', concepts: 'Arrays, Strings, HashMaps, Bitwise operations' },
      interview: { technical: 'Project explanation, OOPS concepts, basic SQL, web technologies', hr: 'Behavioral, teamwork, conflict management using STAR' }
    },
    faqs: {
      aptitude: ['MS Excel shortcut keys MCQs', 'Computer network OSI layer MCQs', 'Pseudocode loops dry run'],
      coding: ['Find the equilibrium index in an array', 'Check if a string is palindrome after ignoring spaces', 'Remove duplicate characters from a string'],
      technical: ['Explain your final year project architecture and your contribution.', 'What is the difference between call by value and call by reference?', 'What are the main commands in SQL (DDL vs DML)?'],
      hr: ['Why Accenture?', 'Tell me about a time you worked under a tight deadline.', 'How do you handle disagreement with a group member?']
    }
  },
  {
    id: 'cognizant',
    name: 'Cognizant',
    category: 'Service-Based',
    overview: {
      founder: 'Kumar Mahadeva and Francisco D\'Souza',
      history: 'Founded in 1994 as an in-house technology unit of Dun & Bradstreet. Spun off as an independent IT services company in 1996.',
      headquarters: 'Teaneck, New Jersey, USA (Major operations in India)',
      employeeStrength: '350,000+',
      businessDomain: 'IT Services, Digital Consulting, business operations, cloud systems',
      marketPosition: 'Leading global provider of IT consulting and outsourcing services, major player in US healthcare IT.',
      presenceInIndia: 'Massive presence in Chennai (largest hub), Bangalore, Hyderabad, Kolkata, and Pune.',
      growthTrends: 'Expanding health sciences tech, digital engineering pipelines, and cloud consultancies.',
      futureScope: 'SaaS platforms integrations, IoT, and AI automated services.',
      technologies: ['Java', 'Python', 'React', 'Angular', 'Oracle/SQL', 'Salesforce', 'DevOps'],
      workCulture: 'Dynamic, professional, corporate, fast-paced, high focus on execution and delivery.',
      careerGrowth: 'Upskilling programs, defined promotion cycles, opportunities in diverse business domains (healthcare, banking).',
      freshersHiringTrends: 'Hires freshers through Cognizant GenC program (GenC Ninja: 4.0 LPA, GenC Elevate: 4.25 LPA, GenC Pro: 5.4 LPA).'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '6.0+ CGPA (60% in 10th and 12th)',
        branches: 'CSE, IT, ECE, EEE, MCA, M.Sc',
        backlogs: 'No active backlogs allowed'
      },
      rounds: [
        { name: 'GenC Online Test', details: 'Aptitude, quantitative, logical reasoning, and basic coding (for Elevate/Pro categories).' },
        { name: 'Technical Interview', details: 'Core programming logic, OOPS, databases, SQL joins, and final year projects.' },
        { name: 'HR Interview', details: 'Document check, shift rotations comfort, and communication check.' }
      ]
    },
    placementInsights: {
      packageRange: '₹4.0 LPA - ₹6.5 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹12,000 - ₹20,000/month)',
      averageFresherSalary: '₹4.2 LPA',
      highestSalaryRange: '₹5.5 LPA - ₹7.0 LPA',
      currentHiringDemand: 'High',
      mostHiredRoles: ['Programmer Analyst Trainee (PAT)', 'GenC Developer', 'GenC Elevate Analyst']
    },
    preparationRoadmap: {
      difficultyLevel: 'Easy-Medium',
      importantTopics: ['Quantitative & Logical Aptitude', 'Basic SQL Joins', 'OOPs in Java/C++', 'Project explanation'],
      timeline: '2 Months',
      learningPath: 'Focus on aptitude formulas, basic programming concepts, relational database queries, and preparing a project walkthrough.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Medium', topics: 'Quantitative, logical math', weightage: 'High' },
      coding: { count: 2, difficulty: 'Easy', concepts: 'Arrays, Strings, Arithmetic formulations' },
      interview: { technical: 'Object-oriented programming, SQL queries, database indexing, project details', hr: 'Relocation agreement, shift rotation readiness' }
    },
    faqs: {
      aptitude: ['Profit and Loss', 'Averages & Ratio', 'Logical Sequences'],
      coding: ['Check if a number is Armstrong number', 'Reverse an array of integers', 'Count words in a string'],
      technical: ['What are abstract classes and interfaces in Java?', 'What is the purpose of foreign key in SQL?', 'Explain different types of databases.'],
      hr: ['Why Cognizant?', 'Are you open to relocate to our Chennai offices?', 'How do you prioritize multiple tasks?']
    }
  },
  {
    id: 'capgemini',
    name: 'Capgemini',
    category: 'Service-Based',
    overview: {
      founder: 'Serge Kampf',
      history: 'Founded in 1967 in France as Sogeti. Rebranded as Capgemini in 1975, expanding into a global leader in consulting and IT services.',
      headquarters: 'Paris, France (Major operations in India)',
      employeeStrength: '360,000+',
      businessDomain: 'IT Consulting, System Integration, Cloud Services, Business Process Outsourcing',
      marketPosition: 'Leading European IT consulting firm with massive global footprint.',
      presenceInIndia: 'Largest employee base in India (~180,000) with key centers in Mumbai, Bangalore, Pune, Hyderabad, and Chennai.',
      growthTrends: 'Pivoting heavily into sustainable IT, intelligent industries, and enterprise cloud migrations.',
      futureScope: 'Decarbonized systems consulting, connected automation, and business cloud solutions.',
      technologies: ['Java', 'React', 'Angular', 'Oracle', 'PL/SQL', 'Python', 'AWS/Azure'],
      workCulture: 'Collaborative, European structure, supportive, good work-life balance, strong focus on seven core values.',
      careerGrowth: 'Capgemini University training modules, structured professional certifications, global projects.',
      freshersHiringTrends: 'Hires freshers through national hiring test Capgemini Excelerator (Analyst: 4.0 LPA, Senior Analyst: 5.75 LPA).'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '6.0+ CGPA (60% in 10th and 12th)',
        branches: 'CSE, IT, ECE, EEE, MCA, MSc',
        backlogs: 'No active backlogs allowed'
      },
      rounds: [
        { name: 'Capgemini Assessment Test', details: 'Pseudocode round + English communication test + Game-based cognitive test.' },
        { name: 'Coding Assessment', details: '2 Coding questions (Easy/Medium) to solve in 45 minutes.' },
        { name: 'Technical Interview', details: 'Focuses on programming fundamentals (Java/C++), SQL queries, OOPS, and project.' },
        { name: 'HR Interview', details: 'Check communication, values alignment, relocation details.' }
      ]
    },
    placementInsights: {
      packageRange: '₹4.0 LPA - ₹6.0 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹15,000 - ₹25,000/month)',
      averageFresherSalary: '₹4.2 LPA',
      highestSalaryRange: '₹5.5 LPA - ₹6.5 LPA',
      currentHiringDemand: 'High',
      mostHiredRoles: ['Analyst', 'Senior Analyst', 'Developer Associate']
    },
    preparationRoadmap: {
      difficultyLevel: 'Medium',
      importantTopics: ['Pseudocode analysis', 'English Communication', 'Basics of OOPS', 'Database normalization'],
      timeline: '2 Months',
      learningPath: 'Practice game-based puzzles, review pseudocode tracing, study English grammar rules, and learn core Java/C++ syntax.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Medium', topics: 'Pseudocode, English, game puzzles', weightage: 'High' },
      coding: { count: 2, difficulty: 'Easy', concepts: 'Arrays, Strings, Arithmetic, Searching' },
      interview: { technical: 'Object-oriented programming, SQL joins, project explanation', hr: 'Relocation agreement, active listening, teamwork check' }
    },
    faqs: {
      aptitude: ['Pseudocode nested loop dry runs', 'Game-based grid puzzles', 'Sentence correction'],
      coding: ['Calculate factorial using recursion', 'Check if an array contains duplicate elements', 'Find the sum of all elements in an array'],
      technical: ['Explain the difference between local and global variables.', 'What is the difference between primary key and unique key?', 'Explain inheritance and its types.'],
      hr: ['Why Capgemini?', 'Tell me about a time you resolved a conflict with a teammate.', 'Are you ready to relocate anywhere in India?']
    }
  },
  {
    id: 'hcl',
    name: 'HCL',
    category: 'Service-Based',
    overview: {
      founder: 'Shiv Nadar',
      history: 'Founded in 1976 as one of the original IT startups in India. Pivoted to software services (HCL Technologies) and hardware divisions.',
      headquarters: 'Noida, Uttar Pradesh, India',
      employeeStrength: '220,000+',
      businessDomain: 'IT Services, Engineering and R&D services, custom hardware systems',
      marketPosition: 'Third largest IT services company in India.',
      presenceInIndia: 'Campuses in Noida (largest hub), Chennai, Bangalore, Hyderabad, and Pune.',
      growthTrends: 'Deep pivot into intellectual property products (HCL Software), cloud solutions, and R&D outsourcing.',
      futureScope: 'R&D consulting, engineering services, and business cloud systems.',
      technologies: ['C/C++', 'Java', 'Python', 'SQL Server', 'JavaScript', 'Embedded C', 'Cloud Infrastructure'],
      workCulture: 'Empowering, entrepreneurial, execution-focused, strong employee support programs.',
      careerGrowth: 'Defined promotion paths, technical certifications sponsorship, internal job posting (IJP).',
      freshersHiringTrends: 'Hires freshers through HCL First Careers program and college placement drives.'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '6.0+ CGPA (60% throughout education)',
        branches: 'CSE, ECE, EEE, IT, MCA',
        backlogs: 'Maximum 1 active backlog'
      },
      rounds: [
        { name: 'HCL Online Assessment', details: 'Aptitude, quantitative, logical reasoning, and basic coding (2 questions).' },
        { name: 'Technical Interview', details: 'Embedded systems basics (if applicable), OOPS, database, SQL, and project.' },
        { name: 'HR Interview', details: 'Verify documents, check shifts flexibility, and communication check.' }
      ]
    },
    placementInsights: {
      packageRange: '₹3.6 LPA - ₹6.5 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹12,000 - ₹20,000/month)',
      averageFresherSalary: '₹4.0 LPA',
      highestSalaryRange: '₹5.5 LPA - ₹6.5 LPA',
      currentHiringDemand: 'High',
      mostHiredRoles: ['Graduate Engineer Trainee (GET)', 'Software Engineer', 'Systems Analyst']
    },
    preparationRoadmap: {
      difficultyLevel: 'Easy',
      importantTopics: ['Basics of C/Java', 'Quantitative Aptitude', 'SQL queries', 'Operating System basics'],
      timeline: '2 Months',
      learningPath: 'Master basic programming syntax, learn standard quantitative formulas, and prepare SQL queries.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Easy-Medium', topics: 'Quantitative math, logic', weightage: 'High' },
      coding: { count: 2, difficulty: 'Easy', concepts: 'Arrays, Strings, Loops' },
      interview: { technical: 'Basics of programming, SQL syntax, final year project details', hr: 'Communication skills, shift rotation readiness' }
    },
    faqs: {
      aptitude: ['Time and Work', 'Percentages', 'Logical Sequences'],
      coding: ['Check if a number is palindrome', 'Convert decimal number to binary', 'Find minimum element in an array'],
      technical: ['Explain pointers in C.', 'What is the purpose of database normalization?', 'Explain differences between DDL and DML in SQL.'],
      hr: ['Why HCL?', 'Are you comfortable working in night shifts?', 'What are your career goals?']
    }
  },
  {
    id: 'tech-mahindra',
    name: 'Tech Mahindra',
    category: 'Service-Based',
    overview: {
      founder: 'Mahindra Group (Anand Mahindra)',
      history: 'Founded in 1986 as a joint venture with British Telecom (specializing in telecom software). Expanded to full IT services after acquiring Satyam Computer Services in 2009.',
      headquarters: 'Pune, Maharashtra, India',
      employeeStrength: '150,000+',
      businessDomain: 'IT Consulting, Telecom Software, Business Process Outsourcing',
      marketPosition: 'Leading IT services company with dominant market share in telecom software and networks.',
      presenceInIndia: 'campuses in Pune, Hyderabad, Bangalore, Chennai, and Noida.',
      growthTrends: 'Deep integration of 5G telecom systems, digital network engineering, and business clouds.',
      futureScope: '5G network optimization, AI automation, and green communications.',
      technologies: ['Java', 'Python', 'C++', 'SQL', 'Telecom Protocols', 'AWS/Azure', 'JavaScript'],
      workCulture: 'Supportive, work-life balance, collaborative, strong focus on Mahindra values.',
      careerGrowth: 'Upskilling certifications support, defined career levels, internal job transfers.',
      freshersHiringTrends: 'Hires freshers through university placement and open NQT drives.'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '6.0+ CGPA (60% throughout education)',
        branches: 'CSE, ECE, EEE, IT, Telecom, MCA',
        backlogs: 'Maximum 1 active backlog'
      },
      rounds: [
        { name: 'Online Assessment Test', details: 'Aptitude, quantitative, logical, verbal, and basic programming snippet MCQs.' },
        { name: 'Coding Assessment', details: '2 Coding questions (Easy) to solve in 45 minutes.' },
        { name: 'Technical Interview', details: 'Focuses on C/Java fundamentals, database tables, networking definitions, and project.' },
        { name: 'HR Interview', details: 'Verify documents, check shifts flexibility, and communication check.' }
      ]
    },
    placementInsights: {
      packageRange: '₹3.2 LPA - ₹5.5 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹10,000 - ₹18,000/month)',
      averageFresherSalary: '₹3.6 LPA',
      highestSalaryRange: '₹5.0 LPA - ₹6.0 LPA',
      currentHiringDemand: 'High',
      mostHiredRoles: ['Associate Software Engineer', 'Software Developer', 'Systems Analyst']
    },
    preparationRoadmap: {
      difficultyLevel: 'Easy',
      importantTopics: ['Basic Aptitude', 'C/Java Programming Basics', 'Computer Networks', 'Project Details'],
      timeline: '2 Months',
      learningPath: 'Master basic math formulas, learn standard networking layers, and prepare basic programming snippets.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Easy-Medium', topics: 'Aptitude math, logical reasoning', weightage: 'High' },
      coding: { count: 2, difficulty: 'Easy', concepts: 'Arrays, Strings, Loops' },
      interview: { technical: 'Basics of C/Java, SQL syntax, computer networks basics, project details', hr: 'Relocation, shift rotation, stability' }
    },
    faqs: {
      aptitude: ['Averages & Percentages', 'Permutations & Combinations', 'Data Interpretation'],
      coding: ['Check if two numbers are coprime', 'Find second smallest element in an array', 'Count vowels in a string'],
      technical: ['Explain OSI layers in detail.', 'What is the purpose of database indexes?', 'What is method overloading in Java?'],
      hr: ['Why Tech Mahindra?', 'Are you comfortable working in night shifts?', 'What are your strengths?']
    }
  },
  {
    id: 'ltimindtree',
    name: 'LTIMindtree',
    category: 'Service-Based',
    overview: {
      founder: 'Larsen & Toubro (L&T Infotech merged with Mindtree in 2022)',
      history: 'L&T Infotech was founded in 1997. Mindtree was founded in 1999. The two companies merged in 2022 to form a new global IT consulting leader.',
      headquarters: 'Mumbai, Maharashtra, India',
      employeeStrength: '90,000+',
      businessDomain: 'IT Consulting, Digital Transformation, Business Outsourcing, Cloud Systems',
      marketPosition: 'Leading Indian IT services and consulting provider, part of the Larsen & Toubro conglomerate.',
      presenceInIndia: 'campuses in Bangalore, Mumbai, Pune, Chennai, Hyderabad, and Kolkata.',
      growthTrends: 'Pivoting into custom cloud platforms, data engineering pipelines, and business clouds.',
      futureScope: 'Digital transformations consulting, enterprise cloud migrations, and sustainable architectures.',
      technologies: ['Java', 'SQL Server', 'React', 'Angular', 'Python', 'AWS/Azure', 'Data Engineering'],
      workCulture: 'Collaborative, professional, corporate, supportive, strong focus on growth and technology.',
      careerGrowth: 'Fast tracks, upskilling certifications, global projects mobility.',
      freshersHiringTrends: 'Hires freshers through university placement and open national qualifier tests.'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '6.0+ CGPA (60% throughout education)',
        branches: 'CSE, IT, ECE, MCA',
        backlogs: 'No active backlogs allowed'
      },
      rounds: [
        { name: 'Online Assessment Test', details: 'Aptitude, quantitative, logical, verbal, pseudocode, and coding (2 questions).' },
        { name: 'Technical Interview', details: 'Core programming logic, OOPS, databases, SQL joins, and final year projects.' },
        { name: 'HR Interview', details: 'Verify documents, check shifts flexibility, and communication check.' }
      ]
    },
    placementInsights: {
      packageRange: '₹4.0 LPA - ₹6.5 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹15,000 - ₹25,000/month)',
      averageFresherSalary: '₹4.5 LPA',
      highestSalaryRange: '₹6.0 LPA - ₹7.0 LPA',
      currentHiringDemand: 'High',
      mostHiredRoles: ['Graduate Engineer Trainee (GET)', 'Software Engineer', 'Systems Analyst']
    },
    preparationRoadmap: {
      difficultyLevel: 'Medium',
      importantTopics: ['OOPs in Java/C++', 'Relational Databases (SQL)', 'Quantitative Aptitude', 'Project walkthrough'],
      timeline: '2 Months',
      learningPath: 'Master basic programming syntax, learn relational database normalization, and prepare final year project walkthrough.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Medium', topics: 'Quantitative, logical math', weightage: 'High' },
      coding: { count: 2, difficulty: 'Easy-Medium', concepts: 'Arrays, Strings, Arithmetic, Searching' },
      interview: { technical: 'Object-oriented programming, SQL joins, project explanation, basic data structures', hr: 'Relocation, shift rotation, stability' }
    },
    faqs: {
      aptitude: ['Time and Work', 'Percentages', 'Data Interpretation'],
      coding: ['Check if an array contains duplicate elements', 'Find the sum of all elements in an array', 'Reverse a string'],
      technical: ['Explain ACID properties in database.', 'What is dynamic polymorphism in Java?', 'Explain differences between DDL and DML in SQL.'],
      hr: ['Why LTIMindtree?', 'Tell me about your strengths and weaknesses.', 'Are you ready to relocate anywhere in India?']
    }
  },
  {
    id: 'mphasis',
    name: 'Mphasis',
    category: 'Service-Based',
    overview: {
      founder: 'Jerry Rao and Jeroen Tas',
      history: 'Founded in 2000 in Bangalore. Spun off as an independent IT services company, specializing in cloud and cognitive solutions.',
      headquarters: 'Bangalore, Karnataka, India',
      employeeStrength: '35,000+',
      businessDomain: 'IT Consulting, digital transformations, custom software development',
      marketPosition: 'Leading provider of IT outsourcing services, major player in global banking IT.',
      presenceInIndia: 'Campuses in Bangalore, Pune, Chennai, and Mumbai.',
      growthTrends: 'Expanding cognitive tech, digital engineering pipelines, and cloud systems.',
      futureScope: 'Cognitive systems consulting, enterprise cloud migrations, and sustainable architectures.',
      technologies: ['Java', 'React', 'Angular', 'Oracle', 'PL/SQL', 'Python', 'AWS/Azure'],
      workCulture: 'Collaborative, professional, corporate, supportive, strong tech focus on database and cloud systems.',
      careerGrowth: 'Defined promotion paths, technical certifications sponsorship, internal job posting (IJP).',
      freshersHiringTrends: 'Hires freshers through university placement and open national qualifier tests.'
    },
    hiringProcess: {
      eligibility: {
        cgpa: '6.0+ CGPA (60% throughout education)',
        branches: 'CSE, IT, ECE, MCA',
        backlogs: 'No active backlogs allowed'
      },
      rounds: [
        { name: 'Online Assessment Test', details: 'Aptitude, quantitative, logical, verbal, and coding (2 questions).' },
        { name: 'Technical Interview', details: 'Core programming logic, OOPS, databases, SQL joins, and final year projects.' },
        { name: 'HR Interview', details: 'Verify documents, check shifts flexibility, and communication check.' }
      ]
    },
    placementInsights: {
      packageRange: '₹3.6 LPA - ₹5.5 LPA',
      internshipOpportunities: 'Yes (Stipend: ₹12,000 - ₹20,000/month)',
      averageFresherSalary: '₹4.0 LPA',
      highestSalaryRange: '₹5.0 LPA - ₹6.0 LPA',
      currentHiringDemand: 'High',
      mostHiredRoles: ['Graduate Engineer Trainee (GET)', 'Software Engineer', 'Systems Analyst']
    },
    preparationRoadmap: {
      difficultyLevel: 'Easy-Medium',
      importantTopics: ['Basics of C/Java', 'Quantitative Aptitude', 'SQL queries', 'Operating System basics'],
      timeline: '2 Months',
      learningPath: 'Master basic programming syntax, learn standard quantitative formulas, and prepare SQL queries.'
    },
    patternAnalysis: {
      aptitude: { difficulty: 'Easy-Medium', topics: 'Quantitative, logical math', weightage: 'High' },
      coding: { count: 2, difficulty: 'Easy', concepts: 'Arrays, Strings, Loops' },
      interview: { technical: 'Basics of programming, SQL syntax, final year project details', hr: 'Communication skills, shift rotation readiness' }
    },
    faqs: {
      aptitude: ['Time and Work', 'Percentages', 'Logical Sequences'],
      coding: ['Check if a number is palindrome', 'Convert decimal number to binary', 'Find minimum element in an array'],
      technical: ['Explain pointers in C.', 'What is the purpose of database normalization?', 'Explain differences between DDL and DML in SQL.'],
      hr: ['Why Mphasis?', 'Are you comfortable working in night shifts?', 'What are your career goals?']
    }
  }
];

module.exports = serviceCompanies;
