import React, { useState } from 'react'
import ResumeUpload from '../components/ResumeUpload'
import ResumeScoreCard from '../components/ResumeScoreCard'
import resumeService from '../services/resumeService'

export default function ResumeAnalyzer() {
  const [resume, setResume] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleResumeUpload = async (file, role) => {
    setResume(file)
    setLoading(true)
    setError(null)

    try {
      const result = await resumeService.uploadResume(file, role)

      setAnalysis({
        score: result.atsScore || 0,
        feedback: result.feedback || 'Resume analyzed successfully.',
        detectedSkills: result.detectedSkills || [],
        missingSkills: result.missingSkills || [],
        aiSuggestions: result.aiSuggestions || [],
        sectionAnalysis: result.sectionAnalysis || {},
        strengths: result.strengthsWeaknesses?.strengths || [],
        weaknesses: result.strengthsWeaknesses?.weaknesses || [],
        aiAssistance: result.aiAssistance || {},
        qualityAnalysis: result.qualityAnalysis || {},
        profileCompleteness: result.profileCompleteness || {},
        roleMatch: result.roleMatch || {},
        roleReadiness: result.roleReadiness || {},
        interviewReadiness: result.interviewReadiness || {},
        recruiterPerspective: result.recruiterPerspective || {},
        careerRoadmap: result.careerRoadmap || {},
        achievementSuggestions: result.achievementSuggestions || [],
        rewriteSuggestions: result.rewriteSuggestions || [],
        atsBreakdown: result.atsBreakdown || [],
        formatAnalysis: result.formatAnalysis || {},
        grammarAnalysis: result.grammarAnalysis || {},
        projectAnalysis: result.projectAnalysis || {},
        internshipAnalysis: result.internshipAnalysis || {},
        certificationAnalysis: result.certificationAnalysis || {},
        hackathonAnalysis: result.hackathonAnalysis || {},
        githubAnalysis: result.githubAnalysis || {},
        linkedinAnalysis: result.linkedinAnalysis || {},
        resumeQualityScore: result.resumeQualityScore || 0,
        grade: result.grade || {},
        role: result.role || role || 'MERN Stack Developer'
      })
    } catch (err) {
      console.error('Resume analysis failed:', err)
      setError(err.message || 'Resume analysis failed. Please try again.')
      setAnalysis(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-sans tracking-tight">Resume Analyzer</h1>
        <p className="text-gray-600 mb-8">Get AI-powered insights to improve your resume</p>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-lg">⚠</span>
              <div>
                <strong className="font-bold block text-sm">Evaluation Failed</strong>
                <span className="text-xs">{error}</span>
              </div>
            </div>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600 font-bold text-sm px-2">✕</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Upload Resume</h2>
              <ResumeUpload onUpload={handleResumeUpload} />
              {resume && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold rounded-xl flex items-center gap-2">
                  <span>✓</span> File: {resume.name}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {loading && (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-slate-600 font-medium">Analyzing your resume...</p>
                <p className="text-xs text-slate-400 mt-1">Extracting layout quality, spelling, credentials, and skills.</p>
              </div>
            )}

            {!loading && analysis && (
              <ResumeScoreCard
                score={analysis.score}
                feedback={analysis.feedback}
                sectionAnalysis={analysis.sectionAnalysis}
                strengths={analysis.strengths}
                weaknesses={analysis.weaknesses}
                role={analysis.role}
                aiAssistance={analysis.aiAssistance}
                qualityAnalysis={analysis.qualityAnalysis}
                profileCompleteness={analysis.profileCompleteness}
                roleMatch={analysis.roleMatch}
                roleReadiness={analysis.roleReadiness}
                interviewReadiness={analysis.interviewReadiness}
                recruiterPerspective={analysis.recruiterPerspective}
                careerRoadmap={analysis.careerRoadmap}
                achievementSuggestions={analysis.achievementSuggestions}
                rewriteSuggestions={analysis.rewriteSuggestions}
                atsBreakdown={analysis.atsBreakdown}
                formatAnalysis={analysis.formatAnalysis}
                grammarAnalysis={analysis.grammarAnalysis}
                projectAnalysis={analysis.projectAnalysis}
                internshipAnalysis={analysis.internshipAnalysis}
                certificationAnalysis={analysis.certificationAnalysis}
                hackathonAnalysis={analysis.hackathonAnalysis}
                githubAnalysis={analysis.githubAnalysis}
                linkedinAnalysis={analysis.linkedinAnalysis}
                resumeQualityScore={analysis.resumeQualityScore}
                grade={analysis.grade}
                detectedSkills={analysis.detectedSkills}
                missingSkills={analysis.missingSkills}
                aiSuggestions={analysis.aiSuggestions}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
