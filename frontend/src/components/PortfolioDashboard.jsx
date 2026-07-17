import React from 'react';

export default function PortfolioDashboard({ analysisResult }) {
  if (!analysisResult) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm text-center">
        <span className="text-5xl block mb-4">📊</span>
        <h3 className="text-lg font-black text-slate-800">No Assessment Data Yet</h3>
        <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed font-semibold">
          Please run either the LinkedIn profile reviewer or the GitHub portfolio scan. The unified dashboard will compile both analyses and display combined recruiter readiness indexes.
        </p>
      </div>
    );
  }

  // Handle data structure if wrapped inside MongoDB result payload
  const result = analysisResult.data ? analysisResult.data : analysisResult;
  const { scores = {}, dashboard = {} } = result;

  const getReadinessBadge = (status) => {
    switch (status) {
      case 'Ready to Apply':
        return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'Needs Tweaks':
        return 'text-amber-700 bg-amber-50 border-amber-100';
      default:
        return 'text-rose-700 bg-rose-50 border-rose-100';
    }
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 55) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const handleDownloadPdf = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('Popup blocked. Please allow popups to download reports.');
      return;
    }

    const html = `
      <html>
        <head>
          <title>Portfolio Optimizer Report - ${dashboard.roleReadiness}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @media print {
              body { color: #000; background: #fff; padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body class="p-8 bg-white font-sans text-slate-800">
          <div class="max-w-3xl mx-auto space-y-8">
            <div class="border-b-2 border-indigo-600 pb-4">
              <h1 class="text-3xl font-black text-indigo-950">Portfolio Optimizer Report</h1>
              <p class="text-sm font-semibold text-slate-500 mt-1">Readiness Index & Profile Analysis</p>
            </div>
            
            <div class="grid grid-cols-3 gap-6 text-center border-b pb-6">
              <div class="p-4 border rounded-2xl bg-slate-50">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Overall Score</span>
                <span class="text-3xl font-black text-indigo-600">${scores.overallPresenceScore}%</span>
              </div>
              <div class="p-4 border rounded-2xl bg-slate-50">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">LinkedIn Score</span>
                <span class="text-3xl font-black text-slate-800">${scores.linkedinScore}%</span>
              </div>
              <div class="p-4 border rounded-2xl bg-slate-50">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">GitHub Score</span>
                <span class="text-3xl font-black text-slate-800">${scores.githubScore > 0 ? scores.githubScore + '%' : '—'}</span>
              </div>
            </div>

            <div class="space-y-4">
              <h2 class="text-lg font-bold text-slate-900 border-b pb-2">Hiring Team Insights</h2>
              <p class="text-xs text-slate-600 leading-relaxed italic">"${dashboard.recruiterImpression}"</p>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-3">
                <h3 class="text-sm font-bold text-emerald-700">🏆 Strengths</h3>
                <ul class="space-y-2 text-xs">
                  ${dashboard.strengths?.map(s => `<li class="flex gap-2"><span>✓</span><span>${s}</span></li>`).join('') || '<li>None</li>'}
                </ul>
              </div>
              <div class="space-y-3">
                <h3 class="text-sm font-bold text-rose-700">⚠️ Areas of Improvement</h3>
                <ul class="space-y-2 text-xs">
                  ${dashboard.weaknesses?.map(w => `<li class="flex gap-2"><span>•</span><span>${w}</span></li>`).join('') || '<li>None</li>'}
                </ul>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-sm font-bold text-slate-800">📋 Missing Checklist</h3>
              <ul class="space-y-1.5 text-xs grid grid-cols-2">
                ${dashboard.missingItems?.map(m => `<li class="flex gap-2"><span>✗</span><span>${m}</span></li>`).join('') || '<li>No missing items</li>'}
              </ul>
            </div>
            
            <div class="pt-6 border-t text-center text-[10px] text-slate-400 font-semibold">
              AI Resume & Placement Guide System - Report Generated on ${new Date().toLocaleDateString()}
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Comparative Presence Score Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4 mb-6">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
            <span className="text-2xl">⚡</span> Professional Presence Dashboard
          </h2>
          <button
            onClick={handleDownloadPdf}
            className="px-4.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>📥</span> Download PDF Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Master Presence Gauge */}
          <div className="text-center md:border-r border-slate-100 py-6 pr-6 flex flex-col items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Overall Presence Score</span>
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Circular Gauge */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100 stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-indigo-600 stroke-indigo-600 stroke-current" strokeDasharray={`${scores.overallPresenceScore || 0}, 100`} strokeWidth="3.2" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="text-4xl font-black text-slate-800">{scores.overallPresenceScore || 0}%</div>
            </div>
            <span className={`text-[10px] border px-3 py-1 rounded-full font-bold uppercase tracking-wider mt-4 inline-block ${getReadinessBadge(dashboard.roleReadiness)}`}>
              {dashboard.roleReadiness}
            </span>
          </div>

          {/* Sub-scores */}
          <div className="space-y-4 md:col-span-2">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                <span>GitHub Repositories Score</span>
                <span className="text-slate-700">{scores.githubScore || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${getProgressColor(scores.githubScore)}`} style={{ width: `${scores.githubScore || 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                <span>LinkedIn Profile Audit</span>
                <span className="text-slate-700">{scores.linkedinScore || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${getProgressColor(scores.linkedinScore)}`} style={{ width: `${scores.linkedinScore || 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                <span>Recruiter Search Indexing</span>
                <span className="text-slate-700">{scores.recruiterReadiness || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${getProgressColor(scores.recruiterReadiness)}`} style={{ width: `${scores.recruiterReadiness || 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recruiter Impression summary */}
      <div className="bg-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] bg-indigo-500/25 border border-indigo-400/30 text-indigo-200 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Recruiter Perspective
          </span>
          <h3 className="text-lg md:text-xl font-black text-white pt-2">How Hiring Teams View Your Profile</h3>
          <p className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed">
            {dashboard.recruiterImpression}
          </p>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-2">
            <span className="text-emerald-500 text-xl">🏆</span> Strengths
          </h3>
          <ul className="space-y-3.5">
            {dashboard.strengths?.map((str, idx) => (
              <li key={idx} className="flex gap-3 text-xs md:text-sm text-slate-600 font-semibold">
                <span className="text-emerald-500">✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-2">
            <span className="text-rose-500 text-xl">⚠️</span> Weaknesses & Gaps
          </h3>
          <ul className="space-y-3.5">
            {dashboard.weaknesses?.map((weak, idx) => (
              <li key={idx} className="flex gap-3 text-xs md:text-sm text-slate-600 font-semibold">
                <span className="text-rose-500 font-black">•</span>
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Missing items check grids */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">
          Profile Completeness Checklist (Missing Items)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {dashboard.missingItems?.length > 0 ? (
            dashboard.missingItems.map((item, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-3">
                <span className="text-rose-400 font-bold">✗</span>
                <span className="text-xs text-slate-600 font-bold">{item}</span>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-6 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl text-xs font-bold">
              ✓ Excellent work! Your professional presence checklist is completely clean!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
