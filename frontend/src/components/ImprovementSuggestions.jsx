import React, { useState } from 'react';

export default function ImprovementSuggestions({ analysisResult }) {
  const [copiedId, setCopiedId] = useState(null);

  if (!analysisResult) return null;

  const { dashboard = {} } = analysisResult;

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top 5 improvements */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">
          Top 5 Presence Improvements
        </h3>
        
        <div className="space-y-3">
          {dashboard.topImprovements?.map((imp, idx) => (
            <div key={idx} className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex items-center gap-3">
              <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="text-xs md:text-sm text-slate-700 font-semibold">{imp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Projects & Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommended Projects */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">
            Recommended Projects to Build
          </h3>

          <div className="space-y-4">
            {dashboard.recommendedProjects?.map((proj, idx) => (
              <div key={idx} className="bg-slate-50/80 border border-slate-100 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-extrabold uppercase">
                  {idx === 0 ? 'Advanced Project' : 'Intermediate Project'}
                </span>
                <h4 className="font-bold text-slate-800 text-sm">{proj.title}</h4>
                <p className="text-xs text-slate-500 font-medium">
                  <span className="font-bold text-slate-600 block mb-1">Stack: {proj.techStack}</span>
                  {proj.features}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Certifications */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">
            Recommended Certifications
          </h3>

          <div className="space-y-3.5">
            {dashboard.recommendedCertifications?.map((cert, idx) => (
              <div key={idx} className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl flex items-center gap-3">
                <span className="text-emerald-500 text-lg">🎖️</span>
                <span className="text-xs md:text-sm text-slate-700 font-semibold">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Suggestions rewrites */}
      {dashboard.aiHeadline && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI optimized headline */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900">AI-Optimized Headline</h3>
              <button
                onClick={() => copyToClipboard(dashboard.aiHeadline, 'ai-hl')}
                className="text-[9px] bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-100 transition-all font-bold"
              >
                {copiedId === 'ai-hl' ? 'COPIED!' : 'COPY'}
              </button>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono text-xs text-slate-700 select-all leading-relaxed">
              {dashboard.aiHeadline}
            </div>
            <span className="text-[10px] text-slate-400 block font-semibold">
              * Tailored explicitly to your actual skills and repository projects to maximize recruiter search matches.
            </span>
          </div>

          {/* AI optimized about summary */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900">AI-Optimized About Section</h3>
              <button
                onClick={() => copyToClipboard(dashboard.aiAbout, 'ai-about')}
                className="text-[9px] bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-100 transition-all font-bold"
              >
                {copiedId === 'ai-about' ? 'COPIED!' : 'COPY'}
              </button>
            </div>
            <textarea
              readOnly
              rows="6"
              value={dashboard.aiAbout}
              className="w-full p-4 rounded-2xl border border-slate-200 font-mono text-xs text-slate-600 bg-slate-50/50 resize-none focus:outline-none leading-relaxed"
            />
            <span className="text-[10px] text-slate-400 block font-semibold">
              * Incorporates your specific code architectures and contact placeholders.
            </span>
          </div>
        </div>
      )}

      {/* Week-by-week Enhancement plan */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">
          Portfolio Enhancement Plan (4-Week Roadmap)
        </h3>

        <div className="relative border-l border-indigo-100 ml-4 space-y-8">
          {dashboard.portfolioEnhancementPlan?.map((plan, idx) => (
            <div key={idx} className="relative pl-6">
              <span className="absolute -left-3 top-0 bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-black">
                {idx + 1}
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 mb-1">{plan.week}</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {plan.action}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
