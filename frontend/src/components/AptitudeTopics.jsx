import React from 'react'

export const TOPIC_CATEGORIES = [
  {
    id: 'quantitative',
    title: 'Quantitative Aptitude',
    description: 'Mathematical and numerical ability testing speed, accuracy, and problem-solving skills.',
    topics: [
      { id: 'percentages', name: 'Percentages', isHigh: true, desc: 'Concepts of fraction to percentage, increase/decrease, successive change.' },
      { id: 'profit_loss', name: 'Profit & Loss', isHigh: true, desc: 'Cost price, selling price, profit/loss percentage, discount, and dishonest dealers.' },
      { id: 'ratio_proportion', name: 'Ratio & Proportion', isHigh: true, desc: 'Ratios, proportions, variations, partnership, and age problems.' },
      { id: 'time_work', name: 'Time & Work', isHigh: true, desc: 'Efficiency, work equivalence, pipes & cisterns, wages, and group work.' },
      { id: 'time_speed_distance', name: 'Time Speed Distance', isHigh: true, desc: 'Average speed, relative speed, trains, boats & streams, and races.' },
      { id: 'probability', name: 'Probability', isHigh: true, desc: 'Basic probability, dice, cards, balls in bag, and conditional probability.' },
      { id: 'permutations_combinations', name: 'Permutations & Combinations', isHigh: true, desc: 'Fundamental counting principle, linear/circular arrangements, and selections.' },
      { id: 'interest', name: 'Simple & Compound Interest', isHigh: false, desc: 'Simple interest, compounding annually/half-yearly, installments.' },
      { id: 'mixtures', name: 'Mixtures & Alligations', isHigh: false, desc: 'Rule of alligation, replacement of liquids, and multi-mix ratio problems.' },
      { id: 'clocks_calendars', name: 'Clocks & Calendars', isHigh: false, desc: 'Angles between hands, gain/loss of time, leap years, and odd days.' }
    ]
  },
  {
    id: 'logical',
    title: 'Logical Reasoning',
    description: 'Non-verbal and verbal reasoning testing analytical, logical and deductive thinking capabilities.',
    topics: [
      { id: 'number_series', name: 'Number Series', isHigh: true, desc: 'Missing numbers, wrong numbers in a pattern, arithmetic/geometric series.' },
      { id: 'coding_decoding', name: 'Coding-Decoding', isHigh: true, desc: 'Letter coding, number coding, conditional and substitution-based codes.' },
      { id: 'blood_relations', name: 'Blood Relations', isHigh: true, desc: 'Family trees, coded relations, point-to-point pointing statements.' },
      { id: 'seating_arrangement', name: 'Seating Arrangement', isHigh: true, desc: 'Linear, circular, square/rectangular, and multi-variable arrangements.' },
      { id: 'syllogisms', name: 'Syllogisms', isHigh: false, desc: 'Venn diagrams, logic statements, "some", "all", "none" conclusions.' },
      { id: 'data_sufficiency', name: 'Data Sufficiency', isHigh: false, desc: 'Deciding if given statements are sufficient to answer a question.' },
      { id: 'analogy', name: 'Analogy & Classification', isHigh: false, desc: 'Identifying relationships between word/number pairs, odd-one-out.' }
    ]
  },
  {
    id: 'verbal',
    title: 'Verbal Ability',
    description: 'English language proficiency testing reading comprehension, grammar, and vocabulary.',
    topics: [
      { id: 'reading_comprehension', name: 'Reading Comprehension', isHigh: true, desc: 'Understanding passages, extracting main ideas, tone, and logical inferences.' },
      { id: 'grammar', name: 'Grammar', isHigh: true, desc: 'Subject-verb agreement, tenses, prepositions, active/passive voice, error spotting.' },
      { id: 'vocabulary', name: 'Vocabulary', isHigh: false, desc: 'Synonyms, antonyms, contextual word usage, and spelling corrections.' },
      { id: 'para_jumbles', name: 'Para Jumbles', isHigh: false, desc: 'Re-ordering scrambled sentences into a coherent paragraph.' },
      { id: 'fill_blanks', name: 'Sentence Completion & Fillers', isHigh: false, desc: 'Single/double blanks, choosing the correct vocabulary or grammatical word.' }
    ]
  }
]

export default function AptitudeTopics({ completedTopics = {}, toggleTopic }) {
  return (
    <div className="space-y-12">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Syllabus & Core Topics</h2>
        <p className="text-gray-600 mb-6">
          Aptitude rounds generally consist of three major pillars. Focus your efforts on high-priority topics as they make up over 80% of the questions in placements.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-red-100 shadow-sm">
            <span className="h-3.5 w-3.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-rose-700">High Priority (Focus First)</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
            <span className="h-3.5 w-3.5 rounded-full bg-slate-400"></span>
            <span className="text-sm font-semibold text-slate-600">Standard Priority</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {TOPIC_CATEGORIES.map((category) => {
          const highPriorityCount = category.topics.filter(t => t.isHigh).length;
          return (
            <div key={category.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full border border-indigo-100">
                    {category.topics.length} Topics
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-6">{category.description}</p>
                
                <div className="space-y-4">
                  {category.topics.map((topic) => {
                    const isCompleted = !!completedTopics[topic.id];
                    return (
                      <div 
                        key={topic.id} 
                        className={`group p-3.5 rounded-xl border transition-all duration-200 ${
                          isCompleted 
                            ? 'bg-emerald-50/40 border-emerald-100' 
                            : 'bg-slate-50/50 hover:bg-white border-transparent hover:border-slate-200 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <label className="flex items-start space-x-3 cursor-pointer flex-grow select-none">
                            <input 
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => toggleTopic(topic.id)}
                              className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                            />
                            <div className="flex flex-col">
                              <span className={`text-sm font-semibold ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                {topic.name}
                              </span>
                              <span className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                                {topic.desc}
                              </span>
                            </div>
                          </label>
                          <div className="pl-2 flex-shrink-0">
                            {topic.isHigh ? (
                              <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded border border-rose-100 uppercase tracking-wider">
                                High
                              </span>
                            ) : (
                              <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-2 py-0.5 rounded uppercase tracking-wider">
                                Std
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
