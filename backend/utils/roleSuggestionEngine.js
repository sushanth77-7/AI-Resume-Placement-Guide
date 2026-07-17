const suggestionsDb = {
  'MERN Developer': {
    linkedinRecommendations: {
      headlineTemplate: 'MERN Stack Developer | React, Node.js, Express, MongoDB | REST APIs & JWT Authentication',
      suggestedCerts: [
        'Meta Front-End Developer Professional Certificate (Coursera)',
        'MongoDB Associate Developer (MongoDB University)',
        'Node.js Developer Certification (OpenJS Foundation)'
      ],
      profileAdditions: [
        'Add "React.js", "Node.js", "Express.js", and "MongoDB" to your top 5 featured skills.',
        'Upload your MERN E-Commerce deployment link as a Featured Link at the top of your profile.',
        'Post short write-ups explaining how you handled state management using Redux Toolkit in your latest project.'
      ]
    },
    githubRecommendations: {
      advancedProject: {
        title: 'Real-time Project Management Tool',
        techStack: 'MongoDB, Express.js, React, Node.js, Socket.io, JWT',
        architecture: 'Client-Server Architecture with State Management & WebSocket connection',
        features: [
          'JWT authentication with httpOnly cookie storage.',
          'Real-time task movement boards (drag-and-drop) synced via WebSockets.',
          'Team workspace creation with role-based member permissions.',
          'MongoDB aggregation pipeline for generating task analytics dashboards.'
        ]
      },
      intermediateProject: {
        title: 'Personal Finance Tracker',
        techStack: 'React, Node.js, Express, MongoDB, Tailwind CSS, Chart.js',
        features: [
          'Income & expense categorization.',
          'Interactive charts showing monthly spending breakdowns.',
          'Secure password hashing with bcrypt.'
        ]
      }
    },
    missingSkills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Redux Toolkit', 'JWT Auth', 'REST APIs', 'Mongoose'],
    missingProjects: ['Authentication Project', 'CRUD Application', 'Full Stack Project', 'Deployment Project'],
    portfolioSuggestions: [
      'Ensure all projects have a live deployment link (Vercel/Netlify for frontend, Render/Railway for backend).',
      'Add database schemas (.png or ASCII art) directly inside the README.md to demonstrate database design skills.'
    ]
  },
  'Full Stack Developer': {
    linkedinRecommendations: {
      headlineTemplate: 'Full Stack Engineer | React, Node.js, Spring Boot | SQL & NoSQL Databases | AWS Certified',
      suggestedCerts: [
        'AWS Certified Cloud Practitioner',
        'IBM Full Stack Software Developer Professional Certificate',
        'Docker Certified Associate (DCA)'
      ],
      profileAdditions: [
        'List both frontend libraries (React/Angular) and backend systems (Node/Java/Python) in your summary.',
        'Feature a post summarizing your experience deploying microservices using Docker on AWS.',
        'Add "System Design" and "RESTful Web Services" to your Skills list.'
      ]
    },
    githubRecommendations: {
      advancedProject: {
        title: 'Microservices E-Commerce System',
        techStack: 'Spring Boot, Node.js, React, PostgreSQL, MongoDB, Docker, Kafka, AWS',
        architecture: 'Microservices with API Gateway, Message Queues (Kafka) and Service Registry',
        features: [
          'Containerized microservices communicating asynchronously via Apache Kafka.',
          'Centralized API Gateway handles route redirection and rate limiting.',
          'PostgreSQL for relational orders data, MongoDB for product catalog search.',
          'Container orchestrations with Docker Compose and local Kubernetes setups.'
        ]
      },
      intermediateProject: {
        title: 'Blogging Engine with ElasticSearch',
        techStack: 'Node.js, Express, React, PostgreSQL, ElasticSearch, Docker',
        features: [
          'Full-text search querying blog contents powered by ElasticSearch.',
          'Relational database design mapping users, posts, and comments.',
          'JWT-based secure user profiles.'
        ]
      }
    },
    missingSkills: ['System Design', 'Docker', 'AWS Services', 'SQL & NoSQL', 'CI/CD Pipelines', 'REST APIs', 'React/Angular'],
    missingProjects: ['Containerized Application', 'Microservices Project', 'Relational Database Design', 'Cloud Deployment'],
    portfolioSuggestions: [
      'Include a system architecture diagram in your advanced repository README to show planning and design patterns.',
      'Show Dockerfiles and Docker Compose files to prove devops skills.'
    ]
  },
  'Java Developer': {
    linkedinRecommendations: {
      headlineTemplate: 'Java Software Engineer | Spring Boot | Hibernate JPA | Microservices | SQL Database Designer',
      suggestedCerts: [
        'Oracle Certified Professional: Java SE Developer',
        'Spring Professional Certification (VMware)',
        'CompTIA Security+'
      ],
      profileAdditions: [
        'Ensure "Object-Oriented Programming (OOP)", "Spring Boot", and "PostgreSQL" are highly visible.',
        'Publish a short guide explaining the differences between SQL Joins and Hibernate mappings.',
        'Feature a project showcasing secure Spring Security filters.'
      ]
    },
    githubRecommendations: {
      advancedProject: {
        title: 'Secure Banking API Gateway',
        techStack: 'Java, Spring Boot, Spring Security, JWT, PostgreSQL, Redis, Maven, Docker',
        architecture: 'RESTful API layered architecture with Caching and Token Auth',
        features: [
          'Role-based access control (RBAC) with JWT auth.',
          'Transactional database operations (ACID compliance checks).',
          'Redis integration caching heavy account statement queries.',
          'Unit and integration testing using JUnit 5, Mockito, and SuperTest.'
        ]
      },
      intermediateProject: {
        title: 'Student Course Registration System',
        techStack: 'Java, Spring Boot, Hibernate, MySQL, Thymeleaf',
        features: [
          'Many-to-many database mapping (Students to Courses).',
          'Search filters for course availability.',
          'Form validation and transactional database updates.'
        ]
      }
    },
    missingSkills: ['Java SE/EE', 'Spring Boot', 'Hibernate JPA', 'Spring Security', 'SQL (PostgreSQL/MySQL)', 'Maven/Gradle', 'OOPs Design'],
    missingProjects: ['Spring Boot REST API', 'Many-to-Many Mapping Project', 'JWT Security Project', 'Unit Testing Suite'],
    portfolioSuggestions: [
      'Document your database schema with tables and fields inside the repo README.',
      'Show unit test coverage percentages using tools like Jacoco directly in the project build configurations.'
    ]
  },
  'Frontend Developer': {
    linkedinRecommendations: {
      headlineTemplate: 'Frontend Engineer | React.js, TypeScript | Responsive UI/UX | Web Performance Specialist',
      suggestedCerts: [
        'Meta Front-End Developer Professional Certificate',
        'UX Design Certificate (Google Career Certificates)',
        'W3C Front-End Web Developer Certification'
      ],
      profileAdditions: [
        'Add "TypeScript", "Tailwind CSS", and "Vite" to your featured skill endorsements.',
        'Showcase interactive prototypes or UI component libraries as featured links.',
        'Share posts summarizing how you improved Core Web Vitals (LCP, FID) of a web page.'
      ]
    },
    githubRecommendations: {
      advancedProject: {
        title: 'Component Library & Design System',
        techStack: 'React, TypeScript, Tailwind CSS, Storybook, Rollup, ESLint',
        architecture: 'Reusable Component Package with NPM publishing preparation',
        features: [
          'Strictly typed components supporting custom themes and states.',
          'Storybook playground showcasing components (buttons, grids, modals) with usage docs.',
          'Full accessibility guidelines implemented (WCAG 2.1 compliant keyboard navigation).',
          'Webpack/Rollup bundle optimization config reducing bundle footprint.'
        ]
      },
      intermediateProject: {
        title: 'SaaS Landing Page with Rich Animations',
        techStack: 'React, Framer Motion, Tailwind CSS, Vite',
        features: [
          'Smooth scroll and complex entry animations.',
          'Interactive calculators and pricing plans.',
          'Highly responsive layouts tested across 5 device sizes.'
        ]
      }
    },
    missingSkills: ['JavaScript (ES6+)', 'TypeScript', 'React.js', 'Tailwind CSS', 'Redux / Context API', 'Responsive Web Design', 'Web Performance'],
    missingProjects: ['Interactive Dashboard UI', 'Custom Component Library', 'Responsive Landing Page', 'API Integration Project'],
    portfolioSuggestions: [
      'Provide clear, clickable live deployment links (Vercel/Netlify) at the top of the repository details.',
      'Embed screenshots or interactive GIFs of your responsive UI in the README.'
    ]
  },
  'Backend Developer': {
    linkedinRecommendations: {
      headlineTemplate: 'Backend Engineer | Node.js, Python | SQL & NoSQL Designer | Redis Caching & Docker Microservices',
      suggestedCerts: [
        'AWS Certified Developer - Associate',
        'Node.js Application Developer (LFW211)',
        'Redis Certified Developer'
      ],
      profileAdditions: [
        'Emphasize your skills in API design, microservices, databases, and message brokers.',
        'Post technical write-ups explaining how database indexing optimizes search speeds.',
        'Add "Data Structures" and "Algorithms" to your profile sections.'
      ]
    },
    githubRecommendations: {
      advancedProject: {
        title: 'High-Throughput Chat & Analytics Server',
        techStack: 'Node.js, Express, Socket.io, Redis, MongoDB, Docker, Nginx',
        architecture: 'Event-driven Backend Architecture with Redis Pub/Sub scaling',
        features: [
          'WebSockets connection handling persistent client sessions.',
          'Redis Pub/Sub message propagation scaling WebSocket server across multiple nodes.',
          'Nginx configured as a load balancer and reverse proxy.',
          'Winston logger logging request errors and database exceptions to secure files.'
        ]
      },
      intermediateProject: {
        title: 'RESTful File Management API',
        techStack: 'Python, FastAPI, PostgreSQL, AWS S3, Pytest',
        features: [
          'Secure file upload endpoints uploading files to AWS S3 buckets.',
          'Auto-generated API documentation using OpenAPI (Swagger).',
          'Database migrations configured using Alembic.'
        ]
      }
    },
    missingSkills: ['Node.js / Express', 'Python (Django/FastAPI)', 'PostgreSQL / MySQL', 'MongoDB', 'Redis Caching', 'Docker', 'REST APIs'],
    missingProjects: ['RESTful API Service', 'WebSocket Real-time App', 'AWS S3 Integration', 'Nginx Load Balancer config'],
    portfolioSuggestions: [
      'Document your API endpoints using clean markdown tables showing request methods, URLs, bodies, and responses.',
      'Show performance benchmark logs (e.g. requests per second, database query timings) inside your readme.'
    ]
  },
  'Data Analyst': {
    linkedinRecommendations: {
      headlineTemplate: 'Data Analyst | SQL Database Developer | Python Data Wrangler | BI Dashboards | Power BI & Tableau',
      suggestedCerts: [
        'Google Data Analytics Professional Certificate',
        'Microsoft Certified: Power BI Data Analyst Associate',
        'SQL for Data Science (Coursera)'
      ],
      profileAdditions: [
        'Showcase interactive Power BI or Tableau public dashboards in your featured section.',
        'Post reports summarizing your findings on publicly available datasets (e.g., COVID stats, retail sales).',
        'List "SQL", "Data Visualization", "Pandas", and "Business Intelligence".'
      ]
    },
    githubRecommendations: {
      advancedProject: {
        title: 'Interactive Business Performance Analysis',
        techStack: 'Python, SQL (PostgreSQL), Power BI, Pandas, NumPy, Jupyter Notebooks',
        architecture: 'Data Analysis Pipeline: ETL -> SQL Queries -> Python Stats -> BI Visualization',
        features: [
          'Python scripts pulling, cleaning, and formatting raw CSV logs.',
          'PostgreSQL schema storing relational dimensions (Customers, Sales, Locations).',
          'Complex SQL queries utilizing Common Table Expressions (CTEs) and Window Functions.',
          'Embedded PDF/images of Power BI dashboard showing customer churn and profit trends.'
        ]
      },
      intermediateProject: {
        title: 'Exploratory Data Analysis (EDA) on Housing Market',
        techStack: 'Python, Pandas, Seaborn, Jupyter, Statsmodels',
        features: [
          'Data cleaning handling missing values and outliers.',
          'Correlation heatmaps showing pricing drivers.',
          'Linear regression models predicting housing costs.'
        ]
      }
    },
    missingSkills: ['SQL (PostgreSQL/MySQL)', 'Python (Pandas/NumPy)', 'Power BI', 'Tableau', 'Microsoft Excel', 'Data Cleaning / ETL', 'Data Visualization'],
    missingProjects: ['SQL Query Collection', 'Python EDA Jupyter Notebook', 'BI Dashboard Presentation', 'ETL Data Pipeline Project'],
    portfolioSuggestions: [
      'Write clear "Executive Summaries" in the README stating the Business Problem, Data Sources, Methodology, and Key Insights.',
      'Embed high-resolution screenshots of your dashboards directly in the GitHub repo README.'
    ]
  },
  'AI/ML Engineer': {
    linkedinRecommendations: {
      headlineTemplate: 'Machine Learning Engineer | Deep Learning & NLP | Computer Vision | Python, TensorFlow, PyTorch',
      suggestedCerts: [
        'DeepLearning.AI TensorFlow Developer Professional Certificate',
        'AWS Certified Machine Learning - Specialty',
        'IBM AI Engineering Professional Certificate'
      ],
      profileAdditions: [
        'Link to your papers, articles, or Kaggle profile in the Featured section.',
        'Share posts detailing how you resolved overfitting in neural networks using dropout/augmentation.',
        'List "Machine Learning", "Deep Learning", "Python", "TensorFlow", and "PyTorch".'
      ]
    },
    githubRecommendations: {
      advancedProject: {
        title: 'Automated Medical Image Segmentation',
        techStack: 'Python, PyTorch, OpenCV, Flask, Docker, NumPy, Jupyter',
        architecture: 'U-Net Deep Learning Model Pipeline with Web API deployment',
        features: [
          'Custom U-Net convolutional neural network built in PyTorch.',
          'Data preprocessing and augmentation using OpenCV and Albumentations.',
          'Model evaluation using Dice Coefficient and Intersection over Union (IoU) metrics.',
          'Flask web app packaging the model in a Docker container for real-time segmentation APIs.'
        ]
      },
      intermediateProject: {
        title: 'SaaS Review Sentiment Classifier',
        techStack: 'Python, TensorFlow, NLTK, Scikit-learn, Jupyter',
        features: [
          'Text preprocessing removing stopwords and tokenizing sentences.',
          'LSTM Neural Network trained to classify sentiments (Positive/Negative).',
          'Comparison of model metrics (Accuracy, F1-Score, ROC Curves).'
        ]
      }
    },
    missingSkills: ['Python', 'TensorFlow / PyTorch', 'Scikit-learn', 'Machine Learning', 'Deep Learning / Neural Networks', 'NLP / Computer Vision', 'SQL'],
    missingProjects: ['Supervised Learning Model', 'Deep Learning Model', 'NLP Text Processing App', 'Model Web API Deployment'],
    portfolioSuggestions: [
      'Show model training curves (loss and accuracy over epochs) using Matplotlib graphs in the README.',
      'Explain hyperparameter selections and dataset details clearly.'
    ]
  }
};

function getSuggestionsForRole(role = 'Full Stack Developer') {
  return suggestionsDb[role] || suggestionsDb['Full Stack Developer'];
}

module.exports = {
  getSuggestionsForRole
};
