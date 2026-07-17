import React from 'react'
import { Link } from 'react-router-dom'

export default function PlacementGuide() {
  const guides = [
    {
      title: 'Technical Interview Assistant',
      description: 'Practice mock technical & HR interviews, generate professional project pitches, and extract custom interview questions based on your resume.',
      steps: [
        'Engage in AI-powered mock interviews',
        'Analyze your uploaded resume for specific Q&As',
        'Prepare recruiter-ready project explanation pitches',
        'Browse core DBMS, OOPs, and OS fundamental FAQs'
      ],
      path: '/placement-guide/interview',
      isHot: true
    },
    {
      title: 'Coding Round Preparation',
      description: 'Master data structures, algorithms, problem-solving paradigms, and time limits to clear online assessment tests.',
      steps: [
        'Practice core DSA and space/time complexities',
        'Compare C++, Java, and Python roadmaps',
        'Follow structured 1, 3, and 6-month timelines',
        'Download Top 30 coding solutions cheat sheet'
      ],
      path: '/placement-guide/coding',
      isHot: true
    },
    {
      title: 'Aptitude Preparation',
      description: 'Master quantitative aptitude, logical reasoning, and verbal tests to crack placement elimination rounds.',
      steps: [
        'Practice Quantitative and Logical shortcuts',
        'Take weekly full-length mock tests',
        'Build speed using the 1-minute rule',
        'Download curated 100 Q&A question banks'
      ],
      path: '/placement-guide/aptitude',
      isHot: true
    },
    {
      title: 'Resume Writing',
      description: 'Learn how to write a compelling resume that stands out',
      steps: [
        'Use action verbs to describe responsibilities',
        'Include quantifiable achievements',
        'Tailor resume for each position',
        'Keep it to one page if possible'
      ],
      path: '/resume-analyzer'
    },
    {
      title: 'Interview Preparation',
      description: 'Master interview techniques and common questions',
      steps: [
        'Research the company thoroughly',
        'Prepare for behavioral questions',
        'Practice technical problems',
        'Develop good communication skills'
      ],
      path: '/company-prep'
    },
    {
      title: 'LinkedIn Optimization',
      description: 'Create a professional LinkedIn profile',
      steps: [
        'Use a professional photo',
        'Write an engaging headline',
        'Detail your experience and skills',
        'Regularly update your profile'
      ],
      path: '/placement-guide/profile-optimizer'
    },
    {
      title: 'Networking',
      description: 'Build meaningful professional connections',
      steps: [
        'Attend industry events',
        'Connect with professionals online',
        'Reach out to alumni',
        'Follow up consistently'
      ],
      path: '/placement-guide/profile-optimizer'
    }

  ]

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-950 mb-2 tracking-tight">Placement Guide</h1>
        <p className="text-gray-500 mb-12">Complete guides and roadmap to ace your placement process</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <div key={index} className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative ${guide.isHot ? 'ring-2 ring-blue-500' : ''}`}>
              {guide.isHot && (
                <span className="absolute top-4 right-4 text-[10px] bg-blue-50 text-blue-600 border border-blue-100 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  New Module
                </span>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{guide.title}</h2>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">{guide.description}</p>
                
                <div className="border-t border-slate-50 pt-4">
                  <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-3">Key Focus:</h3>
                  <ul className="space-y-2.5">
                    {guide.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <span className="text-blue-500 mr-2.5 font-bold">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                {guide.path === '#' ? (
                  <button className="w-full bg-slate-100 text-slate-400 py-2.5 rounded-xl font-semibold cursor-not-allowed text-sm">
                    Coming Soon
                  </button>
                ) : (
                  <Link 
                    to={guide.path} 
                    className="block text-center w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 font-semibold text-sm transition-colors"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
