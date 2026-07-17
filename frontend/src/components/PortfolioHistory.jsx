import React from 'react';

export default function PortfolioHistory({
  historyList,
  onLoadScan,
  onDeleteScan,
  loading
}) {
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate coordinates for historical SVG line chart
  const getChartCoordinates = (data) => {
    if (!data || data.length < 2) return '';
    
    // Sort chronologically for chart plotting
    const chronologicalData = [...data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    const width = 500;
    const height = 150;
    const padding = 20;
    
    const xStep = (width - padding * 2) / (chronologicalData.length - 1);
    
    return chronologicalData.map((item, idx) => {
      const x = padding + idx * xStep;
      const score = item.scores?.overallPresenceScore || 0;
      // Invert Y because SVG coordinates start from top-left (0,0)
      const y = height - padding - ((score / 100) * (height - padding * 2));
      return { x, y, score, date: new Date(item.createdAt).toLocaleDateString(), role: item.targetRole };
    });
  };

  const chartPoints = getChartCoordinates(historyList);
  const pathData = chartPoints ? chartPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') : '';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chart Card */}
      {historyList && historyList.length >= 2 && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="space-y-1 mb-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <span>📈</span> Presence Score Progression
            </h3>
            <p className="text-xs text-slate-400 font-semibold">
              Track how your overall professional online presence score has improved across your evaluations.
            </p>
          </div>

          <div className="relative w-full overflow-x-auto pt-2 pb-4">
            <div className="min-w-[500px] h-[160px] flex justify-center">
              <svg viewBox="0 0 500 160" className="w-full max-w-2xl h-full overflow-visible">
                {/* Grid Lines */}
                <line x1="20" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="20" y1="75" x2="480" y2="75" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="20" y1="130" x2="480" y2="130" stroke="#f8fafc" strokeWidth="1.5" />

                {/* Score Labels on Y Axis */}
                <text x="5" y="24" className="text-[9px] fill-slate-400 font-extrabold">100%</text>
                <text x="5" y="79" className="text-[9px] fill-slate-400 font-extrabold">50%</text>
                <text x="5" y="134" className="text-[9px] fill-slate-400 font-extrabold">0%</text>

                {/* Trend Path */}
                {pathData && (
                  <>
                    <path
                      d={pathData}
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#4f46e5" />
                      </linearGradient>
                    </defs>
                  </>
                )}

                {/* Interactive Points */}
                {chartPoints && chartPoints.map((pt, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5.5"
                      className="fill-indigo-600 stroke-white stroke-2 hover:r-7 transition-all duration-150"
                    />
                    {/* Tooltip on hover */}
                    <rect
                      x={pt.x - 45}
                      y={pt.y - 32}
                      width="90"
                      height="22"
                      rx="6"
                      className="fill-slate-900 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 18}
                      textAnchor="middle"
                      className="text-[8px] fill-white font-extrabold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    >
                      {pt.score}% ({pt.date})
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <span>📋</span> Evaluation History
            </h3>
            <p className="text-xs text-slate-400 font-semibold">
              Browse your previously completed assessments and reload dashboard recommendations.
            </p>
          </div>
          <span className="text-xs bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-slate-600 font-bold">
            Total Saved: {historyList?.length || 0}
          </span>
        </div>

        {historyList && historyList.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                  <th className="py-4.5 px-4">Date / Time</th>
                  <th className="py-4.5 px-4">Target Career Role</th>
                  <th className="py-4.5 px-4 text-center">LinkedIn Score</th>
                  <th className="py-4.5 px-4 text-center">GitHub Score</th>
                  <th className="py-4.5 px-4 text-center">Overall Score</th>
                  <th className="py-4.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs text-slate-600 font-semibold">
                {historyList.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4.5 px-4 font-bold text-slate-700 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-4.5 px-4 whitespace-nowrap">
                      <span className="bg-indigo-50/70 border border-indigo-100/30 text-indigo-700 text-[10px] font-extrabold px-2.5 py-1 rounded-xl">
                        {item.targetRole}
                      </span>
                    </td>
                    <td className="py-4.5 px-4 text-center font-extrabold text-slate-800">
                      {item.scores?.linkedinScore}%
                    </td>
                    <td className="py-4.5 px-4 text-center font-extrabold text-slate-800">
                      {item.scores?.githubScore > 0 ? `${item.scores.githubScore}%` : '—'}
                    </td>
                    <td className="py-4.5 px-4 text-center font-black text-indigo-600">
                      {item.scores?.overallPresenceScore}%
                    </td>
                    <td className="py-4.5 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => onLoadScan(item._id)}
                        disabled={loading}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow"
                      >
                        Load Report
                      </button>
                      <button
                        onClick={() => onDeleteScan(item._id)}
                        disabled={loading}
                        className="px-3.5 py-1.5 border border-rose-100 hover:border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-4xl block mb-3">🗄️</span>
            <span className="text-sm text-slate-400 font-black block">No past evaluations saved yet.</span>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              Launch a fresh LinkedIn profile review or run a GitHub portfolio scanner to store evaluations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
