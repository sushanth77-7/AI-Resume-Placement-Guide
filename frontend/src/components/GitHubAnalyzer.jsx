import React from 'react';

export default function GitHubAnalyzer({
  githubData,
  githubUrl,
  setGithubUrl,
  loading,
  onAnalyze,
  selectedRole
}) {
  const handleUrlChange = (e) => {
    setGithubUrl(e.target.value);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500 stroke-emerald-500';
    if (score >= 55) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (score >= 55) return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-rose-50 text-rose-700 border-rose-100';
  };

  return (
    <div className="space-y-8">
      {/* Search/Scanner Box */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm transition-all hover:shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="text-3xl">🐙</span> GitHub Profile Scanner
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
              Enter your public GitHub profile URL or username. We will run an automated audit of your repositories, README documentation, code structure, and activity via the GitHub REST API.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-md">
            <div className="relative flex-grow">
              <input
                type="text"
                value={githubUrl}
                onChange={handleUrlChange}
                placeholder="github.com/username or username"
                className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-sm transition-all"
                disabled={loading}
              />
              <span className="absolute right-3.5 top-3.5 text-slate-400 font-bold text-sm">/</span>
            </div>
            <button
              onClick={onAnalyze}
              disabled={loading || !githubUrl.trim()}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/15 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Auditing Profile...
                </>
              ) : (
                <>🔍 Run Scan</>
              )}
            </button>
          </div>
        </div>

        {githubData?.rateLimitedWarning && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-100 text-amber-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>GitHub API Rate Limit exceeded for anonymous calls. Displaying high-fidelity simulation analysis for demonstration.</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-black text-slate-800">Scrutinizing GitHub Footprint</h3>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-semibold">
            Querying public endpoints, inspecting readme components, auditing repository structures, and compiling language metrics...
          </p>
        </div>
      )}

      {githubData && !loading && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Score Matrix */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { label: 'GitHub Score', val: githubData.githubScore },
              { label: 'Repo Quality', val: githubData.repoQualityScore },
              { label: 'Documentation', val: githubData.documentationScore },
              { label: 'Portfolio Strength', val: githubData.portfolioStrength },
              { label: 'Recruiter Ready', val: githubData.recruiterReadiness },
              { label: 'Role Alignment', val: githubData.roleAlignmentScore }
            ].map((score, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm text-center flex flex-col justify-between items-center transition-all hover:border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 block">
                  {score.label}
                </span>
                
                {/* Micro circular progress */}
                <div className="relative w-16 h-16 mb-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100 stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className={`${getScoreColor(score.val)} stroke-current`} strokeDasharray={`${score.val}, 100`} strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-slate-800">
                    {score.val}%
                  </div>
                </div>

                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${getScoreBgColor(score.val)}`}>
                  {score.val >= 85 ? 'Excellent' : score.val >= 60 ? 'Good' : 'Deficient'}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 lg:col-span-1">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">
                Profile Overview
              </h3>

              <div className="flex flex-col items-center text-center space-y-3">
                <img
                  src={githubData.avatarUrl || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'}
                  alt={githubData.name}
                  className="w-20 h-20 rounded-full ring-4 ring-slate-100 object-cover bg-slate-50"
                />
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{githubData.name}</h4>
                  <span className="text-xs text-indigo-600 font-semibold">@{githubData.username}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium italic max-w-xs">
                  {githubData.bio || 'No public biography provided.'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-4 rounded-2xl text-center">
                <div>
                  <span className="text-xs text-slate-400 font-bold block">Repos</span>
                  <span className="text-sm font-extrabold text-slate-800">{githubData.publicRepos}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold block">Followers</span>
                  <span className="text-sm font-extrabold text-slate-800">{githubData.followers}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold block">Following</span>
                  <span className="text-sm font-extrabold text-slate-800">{githubData.following}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">Primary Languages</span>
                  <div className="flex flex-wrap gap-1.5">
                    {githubData.languagesUsed.length > 0 ? (
                      githubData.languagesUsed.map((lang, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                          {lang}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No language data found.</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold pt-3 border-t border-slate-100">
                  <span className="text-slate-400">Activity Level:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold ${githubData.commitActivity === 'High' ? 'bg-emerald-50 text-emerald-700' : githubData.commitActivity === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                    {githubData.commitActivity}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold pt-2">
                  <span className="text-slate-400">Stars Count:</span>
                  <span className="text-slate-800 font-extrabold">⭐ {githubData.stars}</span>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold pt-2">
                  <span className="text-slate-400">Forks Count:</span>
                  <span className="text-slate-800 font-extrabold">🍴 {githubData.forks}</span>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold pt-2">
                  <span className="text-slate-400">Open-source Contributor:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold ${githubData.openSourceContributor ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                    {githubData.openSourceContributor ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Repositories showcase lists */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 lg:col-span-2">
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <h3 className="text-lg font-black text-slate-900">
                  Scanned Repositories ({githubData.scannedReposList?.length || 0})
                </h3>
                <span className="text-xs bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-slate-600 font-bold">
                  Top Showcased
                </span>
              </div>

              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                {githubData.scannedReposList?.length > 0 ? (
                  githubData.scannedReposList.map((repo, idx) => (
                    <div key={idx} className="bg-slate-50/50 border border-slate-100 hover:border-slate-200 p-4 rounded-2xl transition-all space-y-3 relative group">
                      <div className="flex justify-between items-start">
                        <div>
                          <a
                            href={repo.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-slate-800 text-sm hover:text-indigo-600 hover:underline transition-all block max-w-[200px] md:max-w-none truncate"
                          >
                            {repo.name}
                          </a>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
                            {repo.description || <span className="text-rose-400 italic">No description provided</span>}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[10px] bg-white border border-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                            ⭐ {repo.stars}
                          </span>
                          <span className="text-[10px] bg-white border border-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                            🍴 {repo.forks}
                          </span>
                        </div>
                      </div>

                      {/* Folder / Tech indicators */}
                      <div className="flex flex-wrap gap-1">
                        {repo.languages?.slice(0, 3).map((l, i) => (
                          <span key={i} className="text-[9px] bg-indigo-50/50 text-indigo-700 font-bold px-2 py-0.5 rounded-md border border-indigo-100/30">
                            {l}
                          </span>
                        ))}
                        {repo.folders?.slice(0, 3).map((f, i) => (
                          <span key={i} className="text-[9px] bg-slate-200/50 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                            /{f}
                          </span>
                        ))}
                      </div>

                      {/* Checks checklist */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100/50 text-[10px] font-bold">
                        <div className={`flex items-center gap-1 ${repo.hasReadme ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <span>{repo.hasReadme ? '✓' : '✗'}</span> README.md
                        </div>
                        <div className={`flex items-center gap-1 ${repo.hasDeployment ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <span>{repo.hasDeployment ? '✓' : '✗'}</span> Live Demo
                        </div>
                        <div className={`flex items-center gap-1 ${repo.folders && repo.folders.length >= 2 ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <span>{repo.folders && repo.folders.length >= 2 ? '✓' : '✗'}</span> Folder Structure
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <span className="text-3xl block">📁</span>
                    <span className="text-xs text-slate-400 font-bold block mt-2">No public repositories found.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* What recruiters notice */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">
                What Recruiters Notice & Good Points
              </h3>

              <ul className="space-y-3.5">
                {githubData.goodPoints.map((pt, idx) => (
                  <li key={idx} className="flex gap-3 text-xs md:text-sm text-slate-600 font-medium">
                    <span className="text-emerald-500 text-sm">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Optimization Suggestions */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">
                Gaps & Recommendations
              </h3>

              <div className="space-y-4">
                {githubData.gaps.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest block">Critical Gaps:</span>
                    {githubData.gaps.map((gap, idx) => (
                      <div key={idx} className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold p-3.5 rounded-2xl flex gap-2.5 items-start">
                        <span>⚠️</span>
                        <span>{gap}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">Action Plan:</span>
                  <ul className="space-y-3">
                    {githubData.suggestions.map((sug, idx) => (
                      <li key={idx} className="flex gap-3 text-xs md:text-sm text-slate-600 font-semibold">
                        <span className="text-indigo-500">🚀</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
