import React, { useState, useEffect, useRef } from 'react';

export default function LinkedInAnalyzer({
  linkedinData,
  formData,
  setFormData,
  loading,
  onAnalyze,
  selectedRole
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Local string states for array-based fields
  const [skillsText, setSkillsText] = useState(formData.linkedin.skills?.join(', ') || '');
  const [certsText, setCertsText] = useState(formData.linkedin.certifications?.join(', ') || '');
  const [expText, setExpText] = useState(formData.linkedin.experience?.join(', ') || '');
  const [projectsText, setProjectsText] = useState(formData.linkedin.projects?.map(p => p.title).join(', ') || '');

  // Synchronize local inputs when parent formData is changed externally (e.g. via Prefill Demo)
  useEffect(() => {
    setSkillsText(formData.linkedin.skills?.join(', ') || '');
    setCertsText(formData.linkedin.certifications?.join(', ') || '');
    setExpText(formData.linkedin.experience?.join(', ') || '');
    setProjectsText(formData.linkedin.projects?.map(p => p.title).join(', ') || '');
  }, [formData.linkedin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      linkedin: {
        ...prev.linkedin,
        [name]: value
      }
    }));
  };

  const syncFieldToParent = (name, rawText) => {
    let parsedValue = [];
    if (name === 'projects') {
      parsedValue = rawText.split(',').map(s => s.trim()).filter(Boolean).map(title => ({ title }));
    } else {
      parsedValue = rawText.split(',').map(s => s.trim()).filter(Boolean);
    }
    setFormData(prev => ({
      ...prev,
      linkedin: {
        ...prev.linkedin,
        [name]: parsedValue
      }
    }));
  };

  // Image Upload Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processSelectedFile(file);
  };

  const processSelectedFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }
    setScreenshot(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    processSelectedFile(file);
  };

  const clearScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyzeClick = () => {
    // Parse current input strings
    const parsedLinkedin = {
      ...formData.linkedin,
      skills: skillsText.split(',').map(s => s.trim()).filter(Boolean),
      certifications: certsText.split(',').map(s => s.trim()).filter(Boolean),
      experience: expText.split(',').map(s => s.trim()).filter(Boolean),
      projects: projectsText.split(',').map(s => s.trim()).filter(Boolean).map(title => ({ title }))
    };

    // Update parent state
    setFormData(prev => ({
      ...prev,
      linkedin: parsedLinkedin
    }));

    // Build FormData payload
    const data = new FormData();
    data.append('linkedinDetails', JSON.stringify(parsedLinkedin));
    data.append('targetRole', selectedRole);
    if (screenshot) {
      data.append('screenshot', screenshot);
    }

    // Trigger analysis with FormData
    onAnalyze(data);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const prefillDemoData = () => {
    const demoData = {
      'MERN Developer': {
        headline: 'Student at ABC Engineering College | Web Developer | HTML, CSS, React',
        about: 'I am a CS student learning web development. I love React and want to learn more about backend routing and database setups. I have built a personal portfolio site and a simple weather app.',
        skills: ['HTML5', 'CSS3', 'JavaScript', 'React'],
        experience: ['Summer Intern at Local Agency'],
        certifications: ['Responsive Web Design Certification'],
        projects: [{ title: 'Personal Website' }, { title: 'Weather Widget' }],
        achievements: ['Won College Hackathon Participation Award']
      },
      'Full Stack Developer': {
        headline: 'CS Grad | Software Developer | Java & Spring Boot | SQL',
        about: 'Fresh computer science graduate interested in full-stack engineering. Experienced in building server-side applications in Java and databases. Seeking entry-level roles.',
        skills: ['Java', 'SQL', 'JavaScript', 'HTML/CSS'],
        experience: ['Software Engineering Intern'],
        certifications: ['Core Java Fundamentals'],
        projects: [{ title: 'Task Manager App' }],
        achievements: []
      },
      'Java Developer': {
        headline: 'Aspiring Java Software Engineer | OOP | SQL',
        about: 'Student majoring in information technology. Experienced with Java classes, loops, and basic file operations. Looking to practice Spring framework.',
        skills: ['Java', 'SQL', 'C++'],
        experience: ['Junior Developer Intern'],
        certifications: [],
        projects: [],
        achievements: []
      },
      'Frontend Developer': {
        headline: 'Frontend Web Developer | React & Tailwind CSS',
        about: 'Passionate UI enthusiast. I craft static sites using React, HTML5, and CSS. Experienced in building user-friendly layouts.',
        skills: ['HTML5', 'CSS3', 'JavaScript', 'React'],
        experience: [],
        certifications: [],
        projects: [{ title: 'CSS Animations Sandbox' }],
        achievements: []
      },
      'Backend Developer': {
        headline: 'Backend Developer | Learning Node & Python',
        about: 'Back-end enthusiast. I write server scripts using JavaScript, Node.js, and Python. Seeking internship roles in backend services.',
        skills: ['Node.js', 'Python', 'SQL'],
        experience: ['Backend Volunteer'],
        certifications: [],
        projects: [],
        achievements: []
      },
      'Data Analyst': {
        headline: 'Aspiring Data Analyst | Python, Excel',
        about: 'Business student who loves data. Cleaned spreadsheets and created basic reports. Proficient in MS Excel and basic SQL.',
        skills: ['Excel', 'SQL', 'Python'],
        experience: ['Data Entry Clerk'],
        certifications: [],
        projects: [],
        achievements: []
      },
      'AI/ML Engineer': {
        headline: 'ML Enthusiast | Python Coder',
        about: 'Studying machine learning algorithms. Built linear regression models in python using numpy. Interested in AI fields.',
        skills: ['Python', 'Numpy'],
        experience: [],
        certifications: [],
        projects: [],
        achievements: []
      }
    };

    const demo = demoData[selectedRole] || demoData['Full Stack Developer'];
    setFormData(prev => ({
      ...prev,
      linkedin: {
        ...prev.linkedin,
        ...demo,
        profileUrl: 'https://linkedin.com/in/sushanth-coder',
        activityLevel: 'Medium'
      }
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-emerald-600';
    if (score >= 55) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getVisualScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 55) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Forms & Inputs */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
            <span className="text-3xl">🔗</span> LinkedIn Profile Reviewer
          </h2>
          <button
            onClick={prefillDemoData}
            className="px-4 py-2 border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-all"
          >
            Prefill {selectedRole} Demo
          </button>
        </div>

        <div className="space-y-6">
          {/* Drag & Drop Visual Screenshot Zone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">LinkedIn Profile Screenshot (For Visual Design & Photo Audit)</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
                isDragOver ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              {!screenshotPreview ? (
                <div className="space-y-2">
                  <span className="text-3xl block">🖼️</span>
                  <p className="text-xs font-bold text-slate-600">Drag & drop your LinkedIn profile screenshot here, or click to upload</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Supports PNG, JPG, JPEG, WEBP up to 5MB</p>
                </div>
              ) : (
                <div className="relative group max-w-xs" onClick={(e) => e.stopPropagation()}>
                  <img
                    src={screenshotPreview}
                    alt="LinkedIn Screenshot Preview"
                    className="max-h-[120px] rounded-xl object-contain border border-slate-200"
                  />
                  <button
                    onClick={clearScreenshot}
                    className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-colors"
                    title="Remove image"
                  >
                    ×
                  </button>
                  <p className="text-[10px] text-slate-500 font-bold text-center mt-1.5 truncate max-w-[180px]">
                    {screenshot.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">LinkedIn Profile URL (Optional)</label>
              <input
                type="text"
                name="profileUrl"
                value={formData.linkedin.profileUrl || ''}
                onChange={handleInputChange}
                placeholder="https://www.linkedin.com/in/username"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl font-semibold text-sm transition-all"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional Headline</label>
              <input
                type="text"
                name="headline"
                value={formData.linkedin.headline || ''}
                onChange={handleInputChange}
                placeholder="e.g. Computer Science Student at ABC University | Passionate Web Developer"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl font-semibold text-sm transition-all"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">About / Summary Section</label>
              <textarea
                name="about"
                rows="5"
                value={formData.linkedin.about || ''}
                onChange={handleInputChange}
                placeholder="Paste your profile Summary or About section here..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl font-semibold text-sm transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Skills (Comma-separated)</label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                onBlur={() => syncFieldToParent('skills', skillsText)}
                placeholder="React, Node.js, Express, MongoDB"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl font-semibold text-sm transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Activity Level</label>
              <select
                name="activityLevel"
                value={formData.linkedin.activityLevel || 'Low'}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl font-semibold text-sm transition-all bg-white"
              >
                <option value="Low">Low (Rarely post/comment)</option>
                <option value="Medium">Medium (Engage 1-2 times/week)</option>
                <option value="High">High (Post articles/updates regularly)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Certifications (Comma-separated)</label>
              <input
                type="text"
                value={certsText}
                onChange={(e) => setCertsText(e.target.value)}
                onBlur={() => syncFieldToParent('certifications', certsText)}
                placeholder="AWS Certified Practitioner, MongoDB Associate"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl font-semibold text-sm transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Experience (Comma-separated roles)</label>
              <input
                type="text"
                value={expText}
                onChange={(e) => setExpText(e.target.value)}
                onBlur={() => syncFieldToParent('experience', expText)}
                placeholder="Software Engineer Intern at Microsoft, Web Dev Volunteer"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl font-semibold text-sm transition-all"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Projects (Comma-separated titles)</label>
              <input
                type="text"
                value={projectsText}
                onChange={(e) => setProjectsText(e.target.value)}
                onBlur={() => syncFieldToParent('projects', projectsText)}
                placeholder="E-Commerce Store, Task Collaboration Tool"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl font-semibold text-sm transition-all"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleAnalyzeClick}
            disabled={loading}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/15 transition-all flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Evaluating LinkedIn Profile...
              </>
            ) : (
              <>🚀 Analyze LinkedIn Profile</>
            )}
          </button>
        </div>
      </div>

      {linkedinData && !loading && (
        <div className="space-y-8 animate-fadeIn">
          {/* Main LinkedIn Score Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'LinkedIn Score', val: linkedinData.linkedinScore },
              { label: 'Recruiter Visibility', val: linkedinData.recruiterVisibility },
              { label: 'Profile Completeness', val: linkedinData.profileCompleteness },
              { label: 'Keyword Optimization', val: linkedinData.keywordOptimizationScore }
            ].map((score, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">{score.label}</span>
                  <div className="text-3xl font-black text-slate-800">{score.val}%</div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                  <div className={`h-full rounded-full ${getScoreColor(score.val)}`} style={{ width: `${score.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Vision AI visual evaluation cards */}
          {linkedinData.visualEvaluation && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-50 pb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>👁️</span> Vision AI Audit (Profile Layout & Photo Review)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Profile Photo', key: 'profilePhoto' },
                  { label: 'Banner Design', key: 'bannerQuality' },
                  { label: 'Overall Layout Design', key: 'overallDesign' }
                ].map((item, idx) => {
                  const evalItem = linkedinData.visualEvaluation[item.key] || {};
                  return (
                    <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700">{item.label}</span>
                        <span className={`text-[10px] border px-2.5 py-0.5 rounded-lg font-bold ${getVisualScoreColor(evalItem.score)}`}>
                          Score: {evalItem.score || 0}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {evalItem.feedback || 'Evaluation not available.'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Headline analysis */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <h3 className="text-lg font-black text-slate-900">Headline Audit</h3>
                <span className="text-xs bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-slate-600 font-bold">
                  Score: {linkedinData.headline.score}/100
                </span>
              </div>

              {linkedinData.headline.suggestions.length > 0 ? (
                <div className="space-y-2.5">
                  <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest block">Headline Improvements:</span>
                  <ul className="space-y-2">
                    {linkedinData.headline.suggestions.map((sug, idx) => (
                      <li key={idx} className="flex gap-2 text-xs md:text-sm text-slate-600 font-semibold">
                        <span className="text-rose-500">❌</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex gap-2 text-xs md:text-sm text-emerald-600 font-bold">
                  <span>✅</span> Headline formatting and keyword density look excellent!
                </div>
              )}

              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">Recruiter-Ready Headlines (Copyable):</span>
                <div className="space-y-3">
                  {linkedinData.headline.improvedSuggestions.map((hl, idx) => (
                    <div
                      key={idx}
                      onClick={() => copyToClipboard(hl, `hl-${idx}`)}
                      className="bg-slate-50 border border-slate-100 hover:border-indigo-100 p-4 rounded-2xl font-mono text-[11px] text-slate-700 cursor-pointer relative group transition-all"
                    >
                      {hl}
                      <span className="absolute right-3.5 top-3.5 text-[9px] bg-slate-200 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white px-2 py-0.5 rounded font-bold transition-all">
                        {copiedId === `hl-${idx}` ? 'COPIED!' : 'COPY'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* About Section analysis */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <h3 className="text-lg font-black text-slate-900">About / Summary Audit</h3>
                <span className="text-xs bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-slate-600 font-bold">
                  Score: {linkedinData.about.score}/100
                </span>
              </div>

              {linkedinData.about.suggestions.length > 0 ? (
                <div className="space-y-2.5">
                  <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest block">About Section Issues:</span>
                  <ul className="space-y-2">
                    {linkedinData.about.suggestions.map((sug, idx) => (
                      <li key={idx} className="flex gap-2 text-xs md:text-sm text-slate-600 font-semibold">
                        <span className="text-rose-500">❌</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex gap-2 text-xs md:text-sm text-emerald-600 font-bold">
                  <span>✅</span> About summary contains all necessary call-to-actions and structural lists!
                </div>
              )}

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">Recommended Profile Template:</span>
                  <button
                    onClick={() => copyToClipboard(linkedinData.about.improvedVersion, 'about')}
                    className="text-[9px] bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 px-2 py-0.5 rounded font-extrabold transition-all"
                  >
                    {copiedId === 'about' ? 'COPIED!' : 'COPY TEMPLATE'}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows="8"
                  value={linkedinData.about.improvedVersion}
                  className="w-full p-4 rounded-2xl border border-slate-200 font-mono text-[11px] text-slate-600 bg-slate-50/50 resize-none focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Keywords Analysis */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">
                Keyword Matching Metrics
              </h3>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest block mb-3">Matching Keywords ({linkedinData.keywords.present.length}):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {linkedinData.keywords.present.length > 0 ? (
                      linkedinData.keywords.present.map((kw, idx) => (
                        <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold px-3 py-1.5 rounded-xl">
                          ✓ {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic font-semibold">No target keywords matching in headline/About/skills.</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest block mb-3">Missing Keywords ({linkedinData.keywords.missing.length}):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {linkedinData.keywords.missing.length > 0 ? (
                      linkedinData.keywords.missing.map((kw, idx) => (
                        <span key={idx} className="bg-rose-50 text-rose-600 border border-rose-100 text-xs font-bold px-3 py-1.5 rounded-xl">
                          + {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-600 font-bold">Awesome! All keywords are present.</span>
                    )}
                  </div>
                </div>

                {linkedinData.keywords.buzzwords.length > 0 && (
                  <div>
                    <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest block mb-3">Buzzwords to Avoid (Cliche):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {linkedinData.keywords.buzzwords.map((bw, idx) => (
                        <span key={idx} className="bg-amber-50 text-amber-700 border border-amber-100 text-xs font-semibold px-3 py-1.5 rounded-xl">
                          ⚠️ {bw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recruiter templates */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">
                Recruiter Outreach Templates
              </h3>

              <div className="space-y-4">
                <div className="bg-indigo-50/30 border border-indigo-100/50 p-4 rounded-2xl relative group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 font-extrabold px-2 py-0.5 rounded-md uppercase">Template 1: Referral Request</span>
                    <button
                      onClick={() => copyToClipboard(linkedinData.networkingSuggestions.referral, 'temp-ref')}
                      className="text-[9px] bg-white group-hover:bg-indigo-600 group-hover:text-white border border-slate-100 text-slate-600 px-2 py-0.5 rounded font-extrabold transition-all"
                    >
                      {copiedId === 'temp-ref' ? 'COPIED!' : 'COPY'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold italic">
                    "{linkedinData.networkingSuggestions.referral.slice(0, 160)}..."
                  </p>
                </div>

                <div className="bg-indigo-50/30 border border-indigo-100/50 p-4 rounded-2xl relative group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 font-extrabold px-2 py-0.5 rounded-md uppercase">Template 2: Recruiter Outreach</span>
                    <button
                      onClick={() => copyToClipboard(linkedinData.networkingSuggestions.recruiter, 'temp-rec')}
                      className="text-[9px] bg-white group-hover:bg-indigo-600 group-hover:text-white border border-slate-100 text-slate-600 px-2 py-0.5 rounded font-extrabold transition-all"
                    >
                      {copiedId === 'temp-rec' ? 'COPIED!' : 'COPY'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold italic">
                    "{linkedinData.networkingSuggestions.recruiter.slice(0, 160)}..."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
