const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load static FAQs data
let faqsData = null;
try {
  faqsData = require('../data/faqs.json');
} catch (err) {
  console.error("Error loading static faqs.json:", err.message);
}

// Retrieve static FAQs from the JSON data file
exports.getFaqs = async (req, res) => {
  try {
    if (!faqsData) {
      const filePath = path.join(__dirname, '../data/faqs.json');
      faqsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return res.status(200).json({
      success: true,
      data: faqsData
    });
  } catch (error) {
    console.error('Error fetching static FAQs:', error.message);
    return res.status(500).json({ error: 'Failed to fetch static FAQs' });
  }
};

// Helper to check if a query is placement/interview/career/technical/coding related
function isPlacementRelated(text) {
  if (!text) return true;
  const lowercase = text.toLowerCase();
  
  // A comprehensive, relaxed set of keywords to allow any placement/technical/career/guidance topics
  const interviewKeywords = [
    'interview', 'placement', 'hiring', 'recruitment', 'hr', 'resume', 'cv', 'job', 'career',
    'project', 'mern', 'react', 'node', 'java', 'python', 'c++', 'javascript', 'sql', 'dbms',
    'oops', 'operating system', 'network', 'dsa', 'algorithm', 'data structure', 'binary tree',
    'coding', 'programming', 'developer', 'engineer', 'salary', 'package', 'offer letter',
    'hire', 'behavioral', 'star method', 'weakness', 'strength', 'why should we hire',
    'explain', 'how to solve', 'code', 'database', 'backend', 'frontend', 'stack', 'normalization',
    'class', 'interface', 'abstract', 'security', 'array', 'string', 'list', 'tree', 'graph',
    'pointer', 'memory', 'compiler', 'cloud', 'aws', 'docker', 'kubernetes', 'system design',
    'github', 'linkedin', 'portfolio', 'tcsa', 'infosys', 'accenture', 'wipro', 'google', 'amazon',
    'html', 'css', 'ts', 'typescript', 'rust', 'golang', 'ruby', 'php', 'swift', 'kotlin', 'c#', '.net',
    'mongodb', 'mysql', 'postgres', 'postgresql', 'redis', 'graphql', 'rest', 'api', 'git', 'azure', 'devops',
    'testing', 'jest', 'mocha', 'deployment', 'vercel', 'heroku', 'netlify', 'hosting', 'server', 'microservices',
    'lambda', 'dom', 'styling', 'layout', 'responsive', 'fetch', 'ajax', 'state', 'props', 'hooks', 'redux',
    'express', 'spring', 'spring boot', 'django', 'flask', 'fastapi', 'oop', 'object-oriented', 'encapsulation',
    'inheritance', 'polymorphism', 'abstraction', 'primary key', 'foreign key', 'index', 'transaction', 'acid',
    'join', 'query', 'process', 'thread', 'cpu', 'schedule', 'paging', 'virtual', 'deadlock', 'semaphore', 'mutex',
    'tcp', 'udp', 'ip', 'http', 'https', 'dns', 'port', 'socket', 'osi', 'router', 'switch', 'aptitude', 'quantitative',
    'logical', 'reasoning', 'verbal', 'gd', 'group discussion', 'dress', 'cover letter', 'mock', 'recruiter',
    'hackathon', 'internship', 'certification', 'course', 'how to', 'implement', 'write', 'function', 'object',
    'method', 'variable', 'scope', 'closures', 'promise', 'async', 'await', 'guidance', 'learn', 'placement',
    'job search', 'salary expectation', 'round', 'technical round', 'coding round', 'hr round', 'behavioral round',
    'design pattern', 'architect', 'scalability', 'security', 'cache', 'rate limit',
    
    // Additional keywords for Data, AI, and generic tech questions
    'data', 'visualization', 'bi', 'ai', 'analytics', 'statistics', 'model', 'regression', 'classification',
    'tableau', 'excel', 'power', 'analysis', 'techniques', 'features', 'how', 'what', 'why', 'compare', 'describe',
    'math', 'probability', 'neural', 'deep learning', 'machine learning', 'nlp', 'predictive'
  ];

  return interviewKeywords.some(keyword => {
    // For very short alphanumeric words (like 'ip', 'ai', 'bi', 'os', 'ts', 'vs'), enforce word boundaries
    if (keyword.length <= 3 && /^[a-z0-9]+$/i.test(keyword)) {
      const regex = new RegExp('\\b' + keyword + '\\b', 'i');
      return regex.test(lowercase);
    }
    // Otherwise check substring
    return lowercase.includes(keyword);
  });
}

exports.processInterviewRequest = async (req, res) => {
  try {
    const { type, message, history = [], role = 'Software Engineer', mode = 'Technical Interview', projectDetails, resumeContent } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey.startsWith('your_')) {
      return res.status(200).json({
        success: true,
        response: "Groq API Key is not configured on the server. Please add a valid GROQ_API_KEY to the backend .env file to enable this AI assistant."
      });
    }

    let systemPrompt = "";
    let userPrompt = "";

    // 1. CHATBOT MODE
    if (type === 'chat') {
      // Check relevance
      if (!isPlacementRelated(message)) {
        return res.status(200).json({
          success: true,
          response: "I am designed specifically for interview and placement preparation, technical questions, project guidance, and resume coaching. Please ask a question related to these topics, and I will be happy to help!"
        });
      }

      systemPrompt = `You are a professional, expert AI Technical Interview Assistant helping a candidate prepare for placements as a "${role}".
The current interview session mode is: "${mode}".
- You must ONLY answer questions related to placement preparation, technical concepts, coding, resumes, project architecture, SQL, DBMS, OS, computer networks, and HR behavioral strategies.
- If the user asks something completely unrelated to technology, coding, interviews, or placements, you must politely inform them that you are restricted to placement and career preparation topics only.
- Provide detailed, high-quality, professional answers with code snippets (if applicable) or bullet points. Make it easy to read.`;
      
      userPrompt = `Candidate message: "${message}"`;
    }
    
    // 2. MOCK INTERVIEW INITIALIZATION
    else if (type === 'mock_init') {
      systemPrompt = `You are an expert interviewer conducting a mock "${mode}" for a candidate applying for the role of "${role}".
Generate a single, high-quality, highly role-specific interview question appropriate for this role and mode.
Ensure it is a relevant question for a candidate with this profile (choose from a pool of at least 15 core topics relevant to the role, such as coding, frameworks, databases, architecture, debugging, etc.).
- Do NOT output any greeting, conversational text, introduction, or explanations. Only output the question text itself.`;
      
      userPrompt = `Generate the first question.`;
    }

    // 3. MOCK INTERVIEW EVALUATION
    else if (type === 'mock_eval') {
      const { question, answer } = req.body;
      systemPrompt = `You are an expert interviewer evaluating a candidate's response in a mock "${mode}" for the role of "${role}".
You are given the question that was asked, and the candidate's response.
Analyze the response and output a strict JSON object with:
- "feedback": Constructive analysis of what they answered well and what was missing or incorrect (explain weaknesses).
- "basicAnswer": A simple, basic answer that just barely answers the question.
- "goodAnswer": A good, solid technical answer that covers the core concepts well.
- "recruiterAnswer": The best, recruiter-friendly, premium answer showing how the candidate should have answered the question to stand out, including structural communication (like STAR or thinking aloud) and business impact or best practices.
- "rating": Strength evaluation ("Weak" / "Average" / "Strong").
- "score": Numeric rating out of 10.
- "nextQuestion": Generate the next logical question to continue the interview. Make sure the questions cover a wide range of topics (minimum 10-15 different topics like coding, system design, databases, etc., throughout the session).

Your output MUST be a strict, valid JSON object matching the schema. Do not output any preamble or conversational text.`;

      userPrompt = `Question: "${question}"\nCandidate's Answer: "${answer}"`;
    }

    // 4. PROJECT EXPLANATION ASSISTANT
    else if (type === 'project') {
      const { title, description, technologies, challenges, database, apis, deployment, scalability, security } = projectDetails || {};
      systemPrompt = `You are a technical interview coach. You are helping a candidate prepare a professional project explanation for their "${role}" interviews.
Given the project details, generate a structured, highly professional, recruiter-ready project explanation.
Structure it into exactly the following sections with markdown headings:
1. **Problem Statement**: What problem does this project solve?
2. **Technologies Used**: Explain the choice of stack and databases.
3. **System Architecture**: High-level design (frontend, backend, database flow).
4. **Core Features**: List key functionalities using bullet points.
5. **Key Challenges & Solutions**: How to explain the challenges they faced and how they resolved them.
6. **Outcomes & Metrics**: Potential impact, optimization scores, or business values.

Additionally, generate **5 Likely Interviewer Questions with Ideal Answers** specifically based on this project's details, covering technical design, APIs, database, security, deployment, and scalability.
Make sure the output is clean, professional, and well-structured in markdown format with clear headings.`;

      userPrompt = `Project Title: "${title}"
Description: "${description}"
Technologies: "${technologies || 'Not specified'}"
Database: "${database || 'Not specified'}"
APIs: "${apis || 'Not specified'}"
Deployment: "${deployment || 'Not specified'}"
Scalability: "${scalability || 'Not specified'}"
Security: "${security || 'Not specified'}"
Challenges Faced: "${challenges || 'Not specified'}"`;
    }

    // 5. RESUME QUESTION ASSISTANT
    else if (type === 'resume') {
      systemPrompt = `You are an expert recruiter analyzing a candidate's resume content to generate customized interview questions for the role of "${role}".
Make the entire analysis strictly resume-driven. Extract skills, projects, internships, achievements, certifications, GitHub, LinkedIn, technologies, responsibilities, and project descriptions.
Generate highly relevant, tailored interview questions separately for:
- "skills" (Questions on specific technologies/skills listed)
- "projects" (Questions on projects and technical decisions)
- "internships" (Questions on work experience/internship responsibilities)
- "certifications" (Questions on certifications or credentials)
- "achievements" (Questions on achievements or awards)
- "github_linkedin" (Questions about open source contribution, portfolios, or professional presence)
- "technical_concepts" (Questions on core concepts related to their skills)
- "hr" (HR questions tailored to their background)
- "resume_based" (General resume-based review questions)

For every single question, you MUST provide:
1. "question": The exact question text.
2. "why": Why the interviewer asks it.
3. "expects": What the interviewer expects to hear.
4. "weak": A typical weak answer example.
5. "strong": A strong, impressive answer example.
6. "structure": The ideal answer structure or talking points.

If the resume does not contain details for a category (e.g., no internships or achievements), do NOT omit the category. Instead, generate typical, highly relevant questions for a candidate seeking a "${role}" role, indicating they are standard questions for the profile.

Your output MUST be a strict, valid JSON object matching this schema. Do not output any preamble or conversational text.`;

      userPrompt = `Resume Content:\n${(resumeContent || '').slice(0, 4000)}`;
    }

    // Prepare messages payload (including history for chatbot)
    const messages = [];
    messages.push({ role: 'system', content: systemPrompt });

    // Include chat history if in chat mode
    if (type === 'chat' && history.length > 0) {
      // Append last 6 messages to keep context without exceeding limits
      const contextHistory = history.slice(-6);
      contextHistory.forEach(msg => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      });
    }

    messages.push({ role: 'user', content: userPrompt });

    const requestData = {
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: (type === 'mock_eval' || type === 'resume') ? 0.2 : 0.7
    };

    if (type === 'mock_eval' || type === 'resume') {
      requestData.response_format = { type: 'json_object' };
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      requestData,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 25000
      }
    );

    const resultText = response?.data?.choices?.[0]?.message?.content || '';

    if (type === 'mock_eval' || type === 'resume') {
      const parsedJSON = JSON.parse(resultText);
      return res.status(200).json({
        success: true,
        data: parsedJSON
      });
    }

    return res.status(200).json({
      success: true,
      response: resultText
    });

  } catch (error) {
    console.error('Groq Interview Assistant API error:', error.message);
    if (error.response) {
      console.error('Response error details:', JSON.stringify(error.response.data));
    }
    
    // Provide clean fallback messages depending on type
    if (req.body?.type === 'mock_eval') {
      return res.status(200).json({
        success: true,
        data: {
          feedback: "We could not generate feedback at this moment due to a connection timeout. Please check your network and try again.",
          basicAnswer: "A basic answer covers only the definition.",
          goodAnswer: "A good answer explains the definition and key concepts.",
          recruiterAnswer: "A recruiter-friendly answer explains concepts with project context, STAR structure, and business impact.",
          rating: "Average",
          score: 6,
          nextQuestion: "Can you explain how you handle exception handling or error logging in your projects?"
        }
      });
    }

    if (req.body?.type === 'resume') {
      return res.status(200).json({
        success: true,
        data: {
          skills: [{
            question: "Can you explain how you have used your primary skills in your projects?",
            why: "To see if you have practical hands-on experience.",
            expects: "Detailed examples of applying your skills to solve real problems.",
            weak: "I know HTML, CSS, and JS and used them in my project.",
            strong: "I applied React and Node to construct a responsive analytics dashboard with optimized rendering cycles.",
            structure: "State technology -> Describe implementation context -> Detail results."
          }],
          projects: [],
          internships: [],
          certifications: [],
          achievements: [],
          github_linkedin: [],
          technical_concepts: [],
          hr: [],
          resume_based: []
        }
      });
    }

    res.status(200).json({
      success: true,
      response: "The server encountered an error processing the AI response. Please try again."
    });
  }
};
