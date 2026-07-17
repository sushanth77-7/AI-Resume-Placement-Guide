const { analyzeKeywords, roleKeywords } = require('./keywordAnalyzer');

// Data for role-specific suggestions
const roleMetadata = {
  'MERN Developer': {
    certifications: [
      'Meta Front-End Developer Professional Certificate (Coursera)',
      'MongoDB Associate Developer (MongoDB University)',
      'Node.js Developer Certification (OpenJS Foundation)'
    ],
    projects: [
      'Real-time Chat App with Socket.io & React',
      'E-commerce Platform with JWT auth & Admin Dashboard',
      'Task Board (Trello clone) with drag-and-drop'
    ],
    contentTopics: [
      'How to secure Express.js routes using JWT and HttpOnly cookies.',
      'A walkthrough of building a custom hook in React for state management.',
      'Explaining MongoDB indexing and performance benefits for large datasets.'
    ]
  },
  'Full Stack Developer': {
    certifications: [
      'AWS Certified Cloud Practitioner or Developer Associate',
      'Docker Certified Associate (DCA)',
      'IBM Full Stack Software Developer Certificate'
    ],
    projects: [
      'Microservices E-commerce System containerized with Docker',
      'Collaborative Document Editor using WebSockets & Redis',
      'Serverless REST API deployed on AWS Lambda'
    ],
    contentTopics: [
      'The benefits of using Docker Compose for local full-stack development.',
      'How to configure CI/CD pipelines using GitHub Actions for React + Node.',
      'Comparing relational PostgreSQL and non-relational MongoDB schemas.'
    ]
  },
  'Java Developer': {
    certifications: [
      'Oracle Certified Professional: Java SE Developer',
      'Spring Professional Certification by VMware',
      'AWS Certified Developer - Associate'
    ],
    projects: [
      'Secure Banking API Gateway using Spring Security & JWT',
      'Microservices-based Movie Booking App with Kafka & Eureka',
      'Inventory Management System with Hibernate JPA & PostgreSQL'
    ],
    contentTopics: [
      'Understanding ACID transactions and isolation levels in PostgreSQL.',
      'How Spring Boot handles dependency injection and beans lifecycle.',
      'Implementing secure OAuth2 login in enterprise Spring applications.'
    ]
  },
  'Frontend Developer': {
    certifications: [
      'Meta Front-End Developer Professional Certificate',
      'W3C Front-End Web Developer Certification',
      'Google UX Design Professional Certificate'
    ],
    projects: [
      'Custom Reusable UI Component Library published to NPM',
      'SaaS Dashboard featuring interactive Chart.js widgets',
      'Vite & TypeScript Portfolio Site with Framer Motion animations'
    ],
    contentTopics: [
      'How to optimize Web Vitals (LCP, CLS) of a React application.',
      'Why you should transition from pure JavaScript to TypeScript for team projects.',
      'Styling structures: Tailwind CSS vs CSS Modules in modern web architectures.'
    ]
  },
  'Backend Developer': {
    certifications: [
      'AWS Certified Developer - Associate',
      'Node.js Application Developer (LFW211)',
      'Redis Certified Developer'
    ],
    projects: [
      'High-throughput Chat Server using Redis Pub/Sub scaling',
      'File Storage API Service integrated with AWS S3 & Postgres',
      'API Gateway with Rate-Limiting & JWT verification middleware'
    ],
    contentTopics: [
      'Strategies for implementing Redis caching for API request optimization.',
      'Design patterns for error handling and logging in Express/FastAPI servers.',
      'How to optimize heavy database queries using indexes and execution plans.'
    ]
  },
  'Data Analyst': {
    certifications: [
      'Google Data Analytics Professional Certificate',
      'Microsoft Certified: Power BI Data Analyst Associate',
      'Tableau Desktop Specialist Certificate'
    ],
    projects: [
      'Interactive Sales Analytics Power BI/Tableau Dashboard',
      'ETL Pipeline script wrangling 50k+ rows using Pandas & SQL',
      'Exploratory Data Analysis (EDA) Jupyter Notebook on housing data'
    ],
    contentTopics: [
      'Step-by-step walkthrough of writing Window functions in SQL for data partitioning.',
      'A summary of data cleaning steps taken to resolve nulls/outliers in a public dataset.',
      'How to tell a story with data: choosing the right chart for business stakeholder reporting.'
    ]
  },
  'AI/ML Engineer': {
    certifications: [
      'DeepLearning.AI TensorFlow Developer Certificate',
      'AWS Certified Machine Learning - Specialty',
      'IBM AI Engineering Professional Certificate'
    ],
    projects: [
      'Medical Image Segmentation model built using PyTorch & OpenCV',
      'Customer Review Sentiment LSTM Classifier deployed on Flask',
      'Recommendation System using Collaborative Filtering & Scikit-learn'
    ],
    contentTopics: [
      'How to debug overfitting in Deep Neural Networks (dropout, data augmentation).',
      'A comparison of PyTorch and TensorFlow for model testing and production pipelines.',
      'Deploying lightweight ML models on Docker containers using FastAPI.'
    ]
  }
};

const sampleHeadlines = {
  'MERN Developer': [
    'MERN Stack Developer | React, Node.js, MongoDB, Express | Building Scalable Web Applications',
    'Software Engineering Student | MERN Developer | Frontend & Backend | Open Source Enthusiast'
  ],
  'Full Stack Developer': [
    'Full Stack Developer | Java & React | AWS Certified | Transforming Ideas into Clean Code',
    'Full Stack Engineer | React | Node.js | SQL & NoSQL | System Architecture Enthusiast'
  ],
  'Java Developer': [
    'Java Software Engineer | Spring Boot | Hibernate | Microservices | REST API & Database Design',
    'Java Developer | OOPs & Multithreading | PostgreSQL | Spring Security | Solutions-Oriented'
  ],
  'Frontend Developer': [
    'Frontend Engineer | React, TypeScript, TailwindCSS | Pixel Perfect & Responsive Web Designs',
    'Frontend Developer | JavaScript, Redux | Web Performance & Accessibility (a11y) Enthusiast'
  ],
  'Backend Developer': [
    'Backend Developer | Node.js, Express, PostgreSQL | Scalable Microservices & AWS Cloud Systems',
    'Backend Software Engineer | Python, Django, Redis, Docker | API Architecture & Database Optimization'
  ],
  'Data Analyst': [
    'Data Analyst | SQL, Python, Excel | Power BI & Tableau Dashboards | Deriving Business Insights',
    'Data Analyst | Pandas, NumPy, ETL Pipelines | Data Modeling & Statistical Analysis'
  ],
  'AI/ML Engineer': [
    'AI/ML Engineer | Python, TensorFlow, PyTorch | NLP & Deep Learning | Computer Vision Enthusiast',
    'Machine Learning Engineer | Model Training & Deployment | Scikit-Learn | Predictive Analytics'
  ]
};

const sampleAbouts = {
  'MERN Developer': `I am a passionate MERN Stack Developer with a strong foundation in building responsive and scalable full-stack web applications. I specialize in React.js for crafting modern user interfaces, Node.js and Express.js for designing robust backend REST APIs, and MongoDB for database management.

💻 Technical Stack:
- Frontend: HTML5, CSS3, JavaScript (ES6+), React.js, Redux, Tailwind CSS
- Backend: Node.js, Express.js, JWT Authentication, RESTful APIs
- Databases & Tools: MongoDB, Mongoose, Git, GitHub, Postman

🚀 Key Project:
- E-Commerce Dashboard: Built a full-stack platform supporting user auth, product CRUD, and payment gateways. Optimized database queries which reduced load time by 30%.

I am currently seeking opportunities for Software Engineering Internships and Entry-level MERN Developer roles. Feel free to connect or email me at [Your Email]!`,

  'Full Stack Developer': `I am a Full Stack Developer with expertise in building end-to-end web applications. I enjoy solving complex algorithmic problems, designing efficient database schemas, and creating smooth user experiences.

💻 Core Technical Skills:
- Languages: JavaScript (ES6+), Java, Python, SQL
- Frontend: React.js, Redux, HTML5, CSS3, Tailwind CSS
- Backend & Databases: Node.js, Express, Spring Boot, PostgreSQL, MongoDB
- Cloud & DevOps: Docker, Git, GitHub, AWS (S3, EC2)

🚀 Highlighted Project:
- Task Collaboration App: Developed a real-time collaborative workspace utilizing Socket.io, Node, and React, deployed securely on AWS EC2.

I am actively looking for Full-Stack Developer roles and internships where I can contribute to shipping clean code. Let's connect!`,

  'Java Developer': `I am a Java Software Developer with a solid background in Object-Oriented Programming (OOP), database structures, and backend systems. I specialize in developing enterprise-grade backend services using Java, Spring Boot, and Hibernate.

💻 Tech Stack:
- Languages: Java, SQL, C++
- Frameworks: Spring Boot, Spring MVC, Spring Security, Hibernate JPA
- Tools & Databases: PostgreSQL, MySQL, Maven, Git, Docker, RESTful APIs

🚀 Featured Project:
- Library Management System: Created a secure backend service with Spring Boot and PostgreSQL, securing endpoints with JWT authentication and implementing transactional operations.

Seeking opportunities in Backend Java Development. Let's build something together!`,

  'Frontend Developer': `I am a Frontend Developer dedicated to creating visual harmony, responsive layouts, and outstanding user experiences. I work extensively with modern JavaScript frameworks, CSS frameworks, and state management systems.

💻 Skills:
- Core: JavaScript (ES6+), TypeScript, HTML5, CSS3
- Libraries: React.js, Redux Toolkit, Next.js, Vite
- Styling: Tailwind CSS, SASS, Bootstrap, CSS Modules
- Tools: Git, Figma, Webpack, Chrome DevTools

🚀 Project Impact:
- Portfolio Builder Dashboard: Crafted a responsive builder application with complex layout editors, improving core web vitals and mobile responsiveness.

Looking for Frontend Engineering internships and full-time opportunities. Reach out to collaborate!`,

  'Backend Developer': `I am a Backend Engineer focused on building high-performance server architectures, API services, and clean database structures. I design scalable, secure, and easily maintainable backend services.

💻 Technologies & Tools:
- Languages: Node.js (JavaScript/TypeScript), Python, SQL
- Frameworks: Express.js, Django, FastAPI
- Databases: PostgreSQL, MongoDB, Redis (Caching)
- Architecture & DevOps: Docker, REST APIs, Microservices, Git, AWS

🚀 Highlighted Project:
- Real-time Analytics System: Engineered a data ingestion backend using FastAPI, Redis, and WebSockets, handling up to 1,000 concurrent events/sec.

Looking for Backend Developer positions and internships. Connect with me here!`,

  'Data Analyst': `I am an analytical and detail-oriented Data Analyst passionate about turning raw datasets into actionable business insights. I leverage SQL, Python, and BI dashboards to solve complex data problems.

📊 Data Toolkit:
- Programming: Python (Pandas, NumPy, Matplotlib, Seaborn), SQL
- Tools: Microsoft Excel (VBA, Pivot Tables), Power BI, Tableau, Jupyter
- Core Competencies: Data Cleaning, ETL Processes, Statistical Modeling, Dashboard Design

🚀 Key Project:
- Sales Performance Analysis: Cleansed and modeled 50,000+ sales records using SQL, constructing an interactive Power BI dashboard that identified a 12% revenue leakage in regional channels.

Actively seeking Data Analyst positions where I can bring data-driven value. Let's connect!`,

  'AI/ML Engineer': `I am an AI/ML Engineer focused on designing, training, and deploying machine learning models to solve complex real-world challenges. I specialize in deep learning, NLP, and computer vision.

🤖 ML Toolkit:
- Languages & Core: Python, R, Linear Algebra, Statistics
- Frameworks: TensorFlow, PyTorch, Scikit-learn, Keras, Pandas, NumPy
- Specializations: Natural Language Processing (NLP), Neural Networks, Model Tuning
- Deployment: Docker, Flask, AWS, MLflow

🚀 Core Project:
- Text Sentiment Classifier: Trained a custom transformer model for customer review analysis, achieving 92% accuracy. Deployed as a web API using Flask & Docker.

Seeking Machine Learning Engineer or AI Researcher roles. Open to collaborate on ML projects!`
};

/**
 * Main analyzer function
 */
function analyzeLinkedInProfile(details = {}, role = 'Full Stack Developer') {
  const headline = details.headline || '';
  const about = details.about || '';
  const skills = details.skills || [];
  const experience = details.experience || [];
  const certifications = details.certifications || [];
  const projects = details.projects || [];
  const achievements = details.achievements || [];
  const activityLevel = details.activityLevel || 'Low';

  const suggestions = [];
  const gaps = [];

  // Get metadata for the specific role
  const meta = roleMetadata[role] || roleMetadata['Full Stack Developer'];

  // 1. Professional Headline Quality
  let headlineScore = 0;
  if (!headline.trim()) {
    headlineScore = 10;
    suggestions.push('Headline is empty. A professional headline should capture your core skills and target role.');
    gaps.push('LinkedIn Profile Headline is empty.');
  } else {
    // Length check
    if (headline.length >= 40 && headline.length <= 150) {
      headlineScore += 40;
    } else if (headline.length > 150) {
      headlineScore += 30; // slightly wordy
      suggestions.push('Keep your headline concise. Ensure it is under 150 characters.');
    } else {
      headlineScore += 20;
      suggestions.push('Expand your headline to list key technologies instead of just a generic student status.');
    }

    // Formatting check
    if (headline.includes('|') || headline.includes('/') || headline.includes('•')) {
      headlineScore += 30;
    } else {
      suggestions.push('Format your headline using separators like "|" or "/" (e.g. "React Developer | Node.js | Open Source").');
    }

    // Role keywords check in headline
    const headlineKw = analyzeKeywords(headline, role);
    if (headlineKw.presentKeywords.length >= 2) {
      headlineScore += 30;
    } else {
      headlineScore += 10;
      suggestions.push(`Include at least 2 role keywords in your headline, such as: ${headlineKw.recommendedKeywords.slice(0, 2).join(', ')}.`);
    }
  }
  headlineScore = Math.min(100, headlineScore);

  // Better Headline Alternatives
  const headlineAlternatives = sampleHeadlines[role] || sampleHeadlines['Full Stack Developer'];

  // 2. About Section Quality
  let aboutScore = 0;
  if (!about.trim()) {
    aboutScore = 10;
    suggestions.push('About section is empty. Create a professional summary showcasing your stack and key accomplishments.');
    gaps.push('LinkedIn About Summary is empty.');
  } else {
    // Length checks
    if (about.length < 100) {
      aboutScore += 25;
      suggestions.push('Your About summary is very short. Expand it to 2-3 paragraphs describing your technical passion and major projects.');
    } else if (about.length >= 150 && about.length <= 1000) {
      aboutScore += 50; // ideal range
    } else {
      aboutScore += 35; // a bit too long
      suggestions.push('Format your About summary with bullet points to make it easier for recruiters to scan.');
    }

    const normAbout = about.toLowerCase();
    const hasStack = normAbout.includes('skills') || normAbout.includes('technologies') || normAbout.includes('stack') || normAbout.includes('tools');
    const hasAchievements = normAbout.includes('built') || normAbout.includes('developed') || normAbout.includes('project') || normAbout.includes('designed');
    const hasCTA = normAbout.includes('look') || normAbout.includes('connect') || normAbout.includes('intern') || normAbout.includes('role') || normAbout.includes('email');

    if (hasStack) aboutScore += 20; else suggestions.push('List your core stack/skills clearly in a designated list in your About section.');
    if (hasAchievements) aboutScore += 15; else suggestions.push('State specific projects or real-world problems you solved in your summary.');
    if (hasCTA) aboutScore += 15; else suggestions.push('Include a clear call to action (e.g. stating you are looking for job opportunities and listing your email).');
  }
  aboutScore = Math.min(100, aboutScore);

  // Copyable About template
  const aboutTemplate = sampleAbouts[role] || sampleAbouts['Full Stack Developer'];

  // 3. Keyword Optimization Score
  const allProfileText = `${headline} ${about} ${skills.join(' ')}`;
  const keywordAnalysis = analyzeKeywords(allProfileText, role);
  
  // Calculate percentage of role keywords present
  const totalKeywords = roleKeywords[role] ? roleKeywords[role].length : 10;
  const kwScore = Math.min(100, Math.round((keywordAnalysis.presentKeywords.length / Math.min(10, totalKeywords)) * 100));

  if (keywordAnalysis.missingKeywords.length > 3) {
    gaps.push(`Missing role-specific keywords: ${keywordAnalysis.missingKeywords.slice(0, 4).join(', ')}.`);
    suggestions.push(`Optimize profile keywords by adding key terms like ${keywordAnalysis.missingKeywords.slice(0, 3).join(', ')} to your Headline, About, or Skills sections.`);
  }

  // 4. Skills Relevance
  let skillsScore = Math.min(100, skills.length * 8); // 13+ skills = 100
  if (skills.length < 10) {
    suggestions.push(`Add more skills. List at least 10-15 professional skills on your profile (currently: ${skills.length}).`);
  }

  // 5. Experience Presentation
  let experienceScore = 0;
  if (experience.length === 0) {
    experienceScore = 20; // baseline
    gaps.push('No professional experience or internships listed.');
    suggestions.push('Add project roles, internships, freelance gigs, or student club leadership as experiences.');
  } else {
    experienceScore = 60;
    // Look for bullet counts or descriptive text length
    const expText = experience.join(' ');
    if (expText.length > 150) {
      experienceScore += 20;
    }
    // Check for metrics/outcomes or action verbs
    const actionVerbs = ['developed', 'engineered', 'led', 'designed', 'optimized', 'built', 'created', 'implemented', 'managed'];
    const hasActionVerbs = actionVerbs.some(verb => expText.toLowerCase().includes(verb));
    if (hasActionVerbs) experienceScore += 20; else suggestions.push('Start your experience descriptions with strong action verbs (e.g. Engineered, Orchestrated).');
  }

  // 6. Certifications
  let certsScore = 30; // baseline
  if (certifications.length > 0) {
    certsScore = 100;
  } else {
    suggestions.push(`Acquire and display relevant certifications. For a ${role}, try: ${meta.certifications[0]}.`);
  }

  // 7. Profile Completeness Score
  let completenessScore = 0;
  const missingSections = [];

  if (headline.trim()) completenessScore += 20; else missingSections.push('Headline');
  if (about.trim()) completenessScore += 20; else missingSections.push('About Summary');
  if (skills.length > 0) completenessScore += 20; else missingSections.push('Skills');
  if (experience.length > 0) completenessScore += 15; else missingSections.push('Experience');
  if (certifications.length > 0) completenessScore += 10; else missingSections.push('Certifications');
  if (projects.length > 0) completenessScore += 10; else missingSections.push('Projects');
  if (achievements.length > 0) completenessScore += 5; else missingSections.push('Achievements');

  completenessScore = Math.min(100, completenessScore);

  // 8. Recruiter Visibility Score
  let recruiterVisibility = 20;
  if (headlineScore >= 70) recruiterVisibility += 25;
  if (aboutScore >= 70) recruiterVisibility += 20;
  if (kwScore >= 60) recruiterVisibility += 20;
  if (activityLevel.toLowerCase() === 'high') recruiterVisibility += 15;
  else if (activityLevel.toLowerCase() === 'medium') recruiterVisibility += 10;
  recruiterVisibility = Math.min(100, recruiterVisibility);

  const goodPoints = [];
  if (headlineScore >= 70) goodPoints.push('Optimized and formatted professional headline');
  if (aboutScore >= 70) goodPoints.push('Compelling and well-structured About section');
  if (kwScore >= 60) goodPoints.push('Strong keyword optimization for the target role');
  if (skills.length >= 8) goodPoints.push('Good breadth of technical skills listed');
  if (experience.length > 0) goodPoints.push('Relevant work or internship experience');
  if (certifications.length > 0) goodPoints.push('Professional certifications showcase');

  // Overall LinkedIn Score
  const linkedinScore = Math.round(
    (headlineScore * 0.20) +
    (aboutScore * 0.25) +
    (completenessScore * 0.30) +
    (kwScore * 0.25)
  );

  // Networking templates
  const networkingTemplates = {
    referral: `Hi [Employee Name], I hope you are doing well! I'm a CS graduate specializing in ${role} technologies. I noticed your team at [Company] works on building [Team area]. I've recently built a project solving [Problem] using ${skills.slice(0, 3).join(', ') || 'modern stacks'} and would love to ask for a referral or your advice for the junior engineer role (Job ID: XXX). Would you be open to connecting?`,
    recruiter: `Hi [Recruiter Name], I saw you are recruiting for the ${role} position at [Company]. I have strong experience in ${skills.slice(0, 3).join(', ') || 'related web stacks'} and recently built a [Project Name] solving [Problem]. I'd love to connect and share my resume to see if my profile aligns with the role requirements. Thank you!`
  };

  return {
    headline: {
      score: headlineScore,
      suggestions: suggestions.filter(s => s.toLowerCase().includes('headline')),
      improvedSuggestions: headlineAlternatives
    },
    about: {
      score: aboutScore,
      suggestions: suggestions.filter(s => s.toLowerCase().includes('about') || s.toLowerCase().includes('summary') || s.toLowerCase().includes('cta')),
      improvedVersion: aboutTemplate
    },
    completeness: {
      score: completenessScore,
      missingSections
    },
    keywords: {
      score: kwScore,
      present: keywordAnalysis.presentKeywords,
      missing: keywordAnalysis.missingKeywords,
      buzzwords: keywordAnalysis.buzzwordsDetected
    },
    skillsAnalysis: {
      score: skillsScore,
      totalCount: skills.length
    },
    experienceAnalysis: {
      score: experienceScore,
      count: experience.length
    },
    certificationsAnalysis: {
      score: certsScore,
      count: certifications.length,
      recommended: meta.certifications
    },
    projectsAnalysis: {
      count: projects.length,
      recommended: meta.projects
    },

    // Global Scores
    linkedinScore,
    recruiterVisibility,
    profileCompleteness: completenessScore,
    keywordOptimizationScore: kwScore,
    goodPoints,

    // Outreach & Templates
    networkingSuggestions: networkingTemplates,
    contentSuggestions: meta.contentTopics,
    suggestions: suggestions.length > 0 ? suggestions : ['Your LinkedIn profile is highly optimized! Start engaging with industry posts daily.'],
    gaps,
    profileOptimizationTips: [
      'Customize your LinkedIn public profile URL to something clean (e.g. linkedin.com/in/first-last).',
      'Create a professional background banner matching your developer role (use colors from your stack, React/Java logo).',
      'Request recommendation endorsements from teachers, internship mentors, or peers to boost authenticity.',
      'Turn on "Open to Work" status targeting Recruiters Only to show you are actively searching without alerting your current network.'
    ]
  };
}

module.exports = {
  analyzeLinkedInProfile
};
