import React, { useState, useEffect } from 'react'
import placementService from '../services/placementService'

const FALLBACK_QUESTIONS = [
  {
    id: 1,
    category: 'Quantitative Aptitude',
    topic: 'Percentages & Profit Loss',
    question: 'A shopkeeper sells an article at a loss of 12.5%. If he had sold it for $51.80 more, he would have gained 6%. What is the cost price of the article?',
    options: [
      { key: 'A', text: '$250.00' },
      { key: 'B', text: '$280.00' },
      { key: 'C', text: '$300.00' },
      { key: 'D', text: '$320.00' }
    ],
    answer: 'B',
    explanation: 'Let the Cost Price (CP) of the article be 100%.\n\n1. Initial Selling Price (SP1) = 12.5% loss = 100% - 12.5% = 87.5%.\n2. New Selling Price (SP2) = 6% gain = 100% + 6% = 106%.\n3. The difference between the two selling prices corresponds to $51.80:\n   SP2 - SP1 = 106% - 87.5% = 18.5%.\n4. So, 18.5% of CP = $51.80.\n5. Therefore, CP (100%) = ($51.80 / 18.5) * 100 = 2.8 * 100 = $280.00.\n\nShortcut Technique: Gain% + Loss% = Price Difference. \n(6% + 12.5%) = 18.5% -> $51.80. Thus, 100% = $280.'
  },
  {
    id: 2,
    category: 'Quantitative Aptitude',
    topic: 'Time & Work',
    question: 'A can do a piece of work in 12 days, and B can do the same work in 18 days. They work together for 4 days, and then A leaves. In how many days will B complete the remaining work?',
    options: [
      { key: 'A', text: '6 days' },
      { key: 'B', text: '8 days' },
      { key: 'C', text: '5 days' },
      { key: 'D', text: '7 days' }
    ],
    answer: 'B',
    explanation: 'Let\'s use the LCM Method for work efficiency:\n\n1. Total Work = LCM of A\'s days (12) and B\'s days (18) = 36 units.\n2. Efficiency of A = 36 / 12 = 3 units/day.\n3. Efficiency of B = 36 / 18 = 2 units/day.\n4. Combined Efficiency (A + B) = 3 + 2 = 5 units/day.\n5. Work done in 4 days = 5 * 4 = 20 units.\n6. Remaining Work = 36 - 20 = 16 units.\n7. Time taken by B to complete remaining work = Remaining Work / B\'s Efficiency = 16 / 2 = 8 days.'
  },
  {
    id: 3,
    category: 'Quantitative Aptitude',
    topic: 'Time Speed Distance',
    question: 'Walking at 3/4 of his usual speed, a man is 15 minutes late to his office. What is his usual time to reach the office?',
    options: [
      { key: 'A', text: '30 minutes' },
      { key: 'B', text: '45 minutes' },
      { key: 'C', text: '50 minutes' },
      { key: 'D', text: '60 minutes' }
    ],
    answer: 'B',
    explanation: 'Speed and Time are inversely proportional for a constant distance (S ∝ 1/T):\n\n1. Let usual speed be S and usual time be T.\n2. New speed = (3/4)S.\n3. Since speed becomes 3/4, time taken will become the inverse, i.e., 4/3 of the usual time.\n4. New Time = (4/3)T.\n5. Given, New Time - Usual Time = 15 minutes:\n   (4/3)T - T = 15\n   T/3 = 15 => T = 45 minutes.\n\nShortcut Technique: Usual Time = (Late Time * Numerator) / (Denominator - Numerator) = (15 * 3) / (4 - 3) = 45 minutes.'
  },
  {
    id: 4,
    category: 'Logical Reasoning',
    topic: 'Coding-Decoding',
    question: 'If "TABLE" is coded as "UBCMF" in a certain language, how will "CHAIR" be coded?',
    options: [
      { key: 'A', text: 'DIBJS' },
      { key: 'B', text: 'DKCJS' },
      { key: 'C', text: 'DKBKT' },
      { key: 'D', text: 'DJCKT' }
    ],
    answer: 'A',
    explanation: 'Let\'s analyze the coding pattern of TABLE -> UBCMF:\n\nT (+1) -> U\nA (+1) -> B\nB (+1) -> C\nL (+1) -> M\nE (+1) -> F\n\nEach letter is shifted by +1 in alphabetical order. Applying the same logic to CHAIR:\nC (+1) -> D\nH (+1) -> I\nA (+1) -> B\nI (+1) -> J\nR (+1) -> S\n\nSo, CHAIR is coded as DIBJS.'
  },
  {
    id: 5,
    category: 'Logical Reasoning',
    topic: 'Blood Relations',
    question: 'Pointing to a photograph of a boy, Suresh said, "He is the son of the only son of my mother." How is Suresh related to that boy?',
    options: [
      { key: 'A', text: 'Brother' },
      { key: 'B', text: 'Uncle' },
      { key: 'C', text: 'Father' },
      { key: 'D', text: 'Cousin' }
    ],
    answer: 'C',
    explanation: 'Break down the statement backwards from Suresh\'s perspective:\n\n1. "My mother" refers to Suresh\'s mother.\n2. "The only son of my mother" refers to Suresh himself (since Suresh is a male and the only son).\n3. "The son of [the only son of my mother]" becomes "The son of Suresh".\n4. Therefore, Suresh is the father of the boy in the photograph.'
  },
  {
    id: 6,
    category: 'Verbal Ability',
    topic: 'Grammar & Subject-Verb Agreement',
    question: 'Choose the grammatically correct word to fill in the blank: "Neither the teacher nor the students _____ present in the staff room yesterday."',
    options: [
      { key: 'A', text: 'was' },
      { key: 'B', text: 'were' },
      { key: 'C', text: 'is' },
      { key: 'D', text: 'has been' }
    ],
    answer: 'B',
    explanation: 'Rule of Proximity for Correlative Conjunctions:\n\n1. In sentence structures using "neither... nor" or "either... or", the verb must agree in number (singular or plural) with the subject closest to it.\n2. Here, the subjects are "the teacher" (singular) and "the students" (plural).\n3. The blank is closer to "the students", which is plural.\n4. Hence, we need a plural verb.\n5. Since the sentence refers to "yesterday" (past tense), the correct past plural verb is "were".'
  },
  {
    id: 7,
    category: 'Quantitative Aptitude',
    topic: 'Ratio & Proportion',
    question: 'The ratio of the ages of A and B is 3:4. The sum of their ages is 28 years. What will be the ratio of their ages after 4 years?',
    options: [
      { key: 'A', text: '4:5' },
      { key: 'B', text: '5:6' },
      { key: 'C', text: '7:8' },
      { key: 'D', text: '8:9' }
    ],
    answer: 'A',
    explanation: '1. Let the ages of A and B be 3x and 4x respectively.\n2. Given: 3x + 4x = 28 => 7x = 28 => x = 4.\n3. Present age of A = 3 * 4 = 12 years.\n4. Present age of B = 4 * 4 = 16 years.\n5. Ages after 4 years:\n   A\'s age = 12 + 4 = 16 years.\n   B\'s age = 16 + 4 = 20 years.\n6. Ratio after 4 years = 16:20 = 4:5.'
  },
  {
    id: 8,
    category: 'Quantitative Aptitude',
    topic: 'Probability',
    question: 'Two dice are tossed together. What is the probability that the total score is a prime number?',
    options: [
      { key: 'A', text: '5/12' },
      { key: 'B', text: '1/2' },
      { key: 'C', text: '7/18' },
      { key: 'D', text: '11/36' }
    ],
    answer: 'A',
    explanation: '1. Total number of outcomes when two dice are thrown = 6 * 6 = 36.\n2. Possible prime sums are 2, 3, 5, 7, and 11.\n3. Favorable outcomes for each sum:\n   - Sum is 2: (1,1) [1 outcome]\n   - Sum is 3: (1,2), (2,1) [2 outcomes]\n   - Sum is 5: (1,4), (2,3), (3,2), (4,1) [4 outcomes]\n   - Sum is 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) [6 outcomes]\n   - Sum is 11: (5,6), (6,5) [2 outcomes]\n4. Total favorable outcomes = 1 + 2 + 4 + 6 + 2 = 15.\n5. Probability = Favorable Outcomes / Total Outcomes = 15/36 = 5/12.'
  },
  {
    id: 9,
    category: 'Logical Reasoning',
    topic: 'Number Series',
    question: 'Find the missing number in the series: 3, 5, 9, 17, 33, ?',
    options: [
      { key: 'A', text: '48' },
      { key: 'B', text: '56' },
      { key: 'C', text: '65' },
      { key: 'D', text: '60' }
    ],
    answer: 'C',
    explanation: 'Let\'s analyze the difference between consecutive terms:\n5 - 3 = 2\n9 - 5 = 4\n17 - 9 = 8\n33 - 17 = 16\n\nThe difference doubles at each step (+2, +4, +8, +16). \nSo, the next difference must be 16 * 2 = 32.\nNext number = 33 + 32 = 65.\n\nAlternative Method: Each term is generated by multiplying the previous term by 2 and subtracting 1: \n(3*2 - 1 = 5), (5*2 - 1 = 9), (9*2 - 1 = 17)... \n(33*2 - 1 = 65).'
  },
  {
    id: 10,
    category: 'Logical Reasoning',
    topic: 'Seating Arrangement',
    question: 'Five students (P, Q, R, S, T) are sitting in a circle facing the center. R is to the immediate left of T. P is between S and T. Who is sitting to the immediate left of R?',
    options: [
      { key: 'A', text: 'Q' },
      { key: 'B', text: 'S' },
      { key: 'C', text: 'T' },
      { key: 'D', text: 'P' }
    ],
    answer: 'A',
    explanation: '1. R is sitting to the immediate left of T. (If T is at position 1, R is at position 2, reading counter-clockwise).\n2. P is between S and T. This means S, P, T sit in order. Since R is on T\'s left, P must be on T\'s right. So the arrangement clockwise is: T -> R -> Q -> S -> P -> T.\n3. The position remaining for Q is between R and S.\n4. Moving counter-clockwise (facing inside, left is clockwise): to the immediate left of R is Q.'
  },
  {
    id: 11,
    category: 'Verbal Ability',
    topic: 'Reading Comprehension',
    question: 'Choose the word that is most nearly opposite in meaning (antonym) to "FRUGAL":',
    options: [
      { key: 'A', text: 'Thrifty' },
      { key: 'B', text: 'Extravagant' },
      { key: 'C', text: 'Miserly' },
      { key: 'D', text: 'Prudent' }
    ],
    answer: 'B',
    explanation: '1. "Frugal" means economical, sparing, or thrifty in regard to food or money.\n2. "Thrifty", "Miserly", and "Prudent" are either synonyms or related in meaning.\n3. "Extravagant" means lacking restraint in spending money or using resources. This is the exact antonym of frugal.'
  },
  {
    id: 12,
    category: 'Verbal Ability',
    topic: 'Vocabulary & Analogy',
    question: 'Complete the analogy: "Conductor is to Orchestra" as "Director is to _______".',
    options: [
      { key: 'A', text: 'Movie' },
      { key: 'B', text: 'Cast' },
      { key: 'C', text: 'Audience' },
      { key: 'D', text: 'Stage' }
    ],
    answer: 'B',
    explanation: '1. A conductor leads, directs, and coordinates the members of an orchestra.\n2. Similarly, a director leads, instructs, and coordinates the members of a cast (actors in a play, movie, etc.).\n3. While a director directs a movie (the product), the direct analogy of leading individuals matches "Conductor : Orchestra :: Director : Cast".'
  },
  {
    id: 13,
    category: 'Quantitative Aptitude',
    topic: 'Time Speed Distance',
    question: 'A train 150m long passes a telegraph post in 12 seconds. How long will it take to pass a bridge of length 250m?',
    options: [
      { key: 'A', text: '20 seconds' },
      { key: 'B', text: '24 seconds' },
      { key: 'C', text: '32 seconds' },
      { key: 'D', text: '30 seconds' }
    ],
    answer: 'C',
    explanation: '1. Speed of the train = Length of train / time = 150m / 12s = 12.5 m/s.\n2. To cross a bridge of 250m, total distance to cover = Train length + Bridge length = 150m + 250m = 400m.\n3. Time taken = Total Distance / Speed = 400m / 12.5 m/s = 32 seconds.'
  },
  {
    id: 14,
    category: 'Quantitative Aptitude',
    topic: 'Permutations & Combinations',
    question: 'In how many different ways can the letters of the word "LEADING" be arranged in such a way that the vowels always come together?',
    options: [
      { key: 'A', text: '360' },
      { key: 'B', text: '480' },
      { key: 'C', text: '720' },
      { key: 'D', text: '5040' }
    ],
    answer: 'C',
    explanation: '1. The word "LEADING" has 7 letters: 3 vowels (E, A, I) and 4 consonants (L, D, N, G).\n2. Since vowels must be together, treat (E, A, I) as 1 single block.\n3. Now we have 5 blocks to arrange: (EAI), L, D, N, G. These can be arranged in 5! = 120 ways.\n4. Within the block, the 3 vowels (E, A, I) can be arranged in 3! = 6 ways.\n5. Total ways = 120 * 6 = 720 ways.'
  },
  {
    id: 15,
    category: 'Logical Reasoning',
    topic: 'Number Series',
    question: 'Find the missing term in the sequence: 4, 9, 20, 43, 90, ?',
    options: [
      { key: 'A', text: '180' },
      { key: 'B', text: '185' },
      { key: 'C', text: '190' },
      { key: 'D', text: '187' }
    ],
    answer: 'B',
    explanation: 'The pattern is: (Previous term * 2) + 1, then + 2, then + 3...\n- 4 * 2 + 1 = 9\n- 9 * 2 + 2 = 20\n- 20 * 2 + 3 = 43\n- 43 * 2 + 4 = 90\n- Next term = 90 * 2 + 5 = 185.'
  },
  {
    id: 16,
    category: 'Logical Reasoning',
    topic: 'Coding-Decoding',
    question: 'If "CAT" is coded as 24 and "DOG" is coded as 26, then how will "TIGER" be coded?',
    options: [
      { key: 'A', text: '50' },
      { key: 'B', text: '55' },
      { key: 'C', text: '59' },
      { key: 'D', text: '62' }
    ],
    answer: 'C',
    explanation: 'The code represents the sum of the alphabetical positions of each letter in the word.\n- CAT: C(3) + A(1) + T(20) = 24.\n- DOG: D(4) + O(15) + G(7) = 26.\n- TIGER: T(20) + I(9) + G(7) + E(5) + R(18) = 59.'
  },
  {
    id: 17,
    category: 'Logical Reasoning',
    topic: 'Blood Relations',
    question: 'If A + B means A is the brother of B; A - B means A is the sister of B; and A * B means A is the father of B. Which of the following means that C is the son of M?',
    options: [
      { key: 'A', text: 'M * C - D' },
      { key: 'B', text: 'M * C + D' },
      { key: 'C', text: 'C + D * M' },
      { key: 'D', text: 'M - C * D' }
    ],
    answer: 'B',
    explanation: '1. In M * C + D: M * C means M is the father of C.\n2. C + D means C is the brother of D (establishing that C is male).\n3. Since M is the father and C is male, C is the son of M.\n4. Therefore, M * C + D is the correct relation.'
  },
  {
    id: 18,
    category: 'Verbal Ability',
    topic: 'Grammar & Tenses',
    question: 'Fill in the blank with the correct form of the verb: "By the time the police arrived, the thief ______."',
    options: [
      { key: 'A', text: 'escaped' },
      { key: 'B', text: 'has escaped' },
      { key: 'C', text: 'had escaped' },
      { key: 'D', text: 'was escaping' }
    ],
    answer: 'C',
    explanation: 'In a sentence containing two past actions, the action that happened first is expressed in the Past Perfect tense (had + past participle), and the later action is expressed in the Simple Past tense.\n\nSince the thief\'s escape happened before the police arrived, "had escaped" is the correct form.'
  },
  {
    id: 19,
    category: 'Verbal Ability',
    topic: 'Prepositions',
    question: 'Choose the correct preposition to fill the blank: "The committee agreed ______ the proposal after a lengthy discussion."',
    options: [
      { key: 'A', text: 'to' },
      { key: 'B', text: 'with' },
      { key: 'C', text: 'on' },
      { key: 'D', text: 'at' }
    ],
    answer: 'A',
    explanation: '1. We use "agree to" when agreeing to a proposal, plan, or suggestion.\n2. We use "agree with" when agreeing with a person.\n3. Since "the proposal" is a plan, "agreed to" is grammatically correct.'
  },
  {
    id: 20,
    category: 'Quantitative Aptitude',
    topic: 'Mixtures & Alligations',
    question: 'In what ratio must a grocer mix tea costing $60/kg with tea costing $65/kg so that the mixture is worth $62/kg?',
    options: [
      { key: 'A', text: '3:2' },
      { key: 'B', text: '2:3' },
      { key: 'C', text: '3:1' },
      { key: 'D', text: '1:2' }
    ],
    answer: 'A',
    explanation: 'Using the Rule of Alligation:\n\n(Quantity of Cheaper) / (Quantity of Dearer) = (Dearer Price - Mean Price) / (Mean Price - Cheaper Price) = (65 - 62) / (62 - 60) = 3/2.\n\nSo the grocer must mix them in the ratio 3:2.'
  }
]

const shuffleArray = (array) => {
  return [...array].sort(() => 0.5 - Math.random())
}

export default function SampleQuestions() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [revealedExplanations, setRevealedExplanations] = useState({})
  const [isReloading, setIsReloading] = useState(false)

  const fetchQuestions = async (isReload = false) => {
    if (isReload) {
      setIsReloading(true)
    } else {
      setLoading(true)
    }
    
    try {
      const data = await placementService.getAptitudeQuestions()
      if (Array.isArray(data) && data.length > 0) {
        setQuestions(data)
      } else {
        // Fallback to shuffled static list if API returns empty or invalid data
        setQuestions(shuffleArray(FALLBACK_QUESTIONS).slice(0, 5))
      }
    } catch (error) {
      
      // Shuffled fallback to static questions
      setQuestions(shuffleArray(FALLBACK_QUESTIONS).slice(0, 5))
    } finally {
      setLoading(false)
      setIsReloading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const handleReload = () => {
    setSelectedAnswers({})
    setRevealedExplanations({})
    fetchQuestions(true)
  }

  const handleSelectAnswer = (qId, optionKey) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: optionKey
    }))
  }

  const toggleExplanation = (qId) => {
    setRevealedExplanations(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }))
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-slate-200 h-24 rounded-2xl w-full"></div>
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between w-full">
              <div className="bg-slate-200 h-5 rounded w-1/4"></div>
              <div className="bg-slate-200 h-5 rounded w-1/6"></div>
            </div>
            <div className="bg-slate-200 h-6 rounded w-3/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-100 h-14 rounded-xl"></div>
              <div className="bg-slate-100 h-14 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Solved Sample Questions</h2>
          <p className="text-gray-600 max-w-2xl text-sm">
            Try solving these questions yourself, pick your answer, and then reveal the explanation. Click reload to fetch a new set of random questions from the server database!
          </p>
        </div>
        <button
          onClick={handleReload}
          disabled={isReloading}
          className={`flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-indigo-500/20 active:scale-95 flex-shrink-0`}
        >
          <svg 
            className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.75 8.25" />
          </svg>
          <span>{isReloading ? 'Reloading...' : 'Reload Questions'}</span>
        </button>
      </div>

      <div className="space-y-6 relative">
        {isReloading && (
          <div className="absolute inset-0 bg-slate-50/40 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
            <div className="bg-white px-5 py-3 rounded-full shadow-lg border border-slate-100 flex items-center space-x-3 font-semibold text-sm text-indigo-600">
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.75 8.25" />
              </svg>
              <span>Fetching new questions...</span>
            </div>
          </div>
        )}

        {questions.map((q, index) => {
          const selectedOption = selectedAnswers[q.id]
          const isRevealed = revealedExplanations[q.id]
          const isCorrect = selectedOption === q.answer

          return (
            <div key={q.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-indigo-100 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-full">
                  Question {index + 1} • {q.category}
                </span>
                <span className="text-xs bg-indigo-50 text-indigo-700 font-medium px-2.5 py-1 rounded-full">
                  {q.topic}
                </span>
              </div>

              <h3 className="text-gray-950 font-semibold text-lg mb-6 leading-relaxed">
                {q.question}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {q.options.map((option) => {
                  let buttonStyle = 'bg-slate-50 border-slate-100 text-gray-700 hover:bg-slate-100 hover:border-slate-300'
                  
                  if (selectedOption === option.key) {
                    if (option.key === q.answer) {
                      buttonStyle = 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    } else {
                      buttonStyle = 'bg-rose-50 border-rose-300 text-rose-800'
                    }
                  } else if (selectedOption && option.key === q.answer) {
                    // Show correct answer if wrong answer was selected
                    buttonStyle = 'bg-emerald-50/50 border-emerald-200 text-emerald-800'
                  }

                  return (
                    <button
                      key={option.key}
                      onClick={() => handleSelectAnswer(q.id, option.key)}
                      className={`flex items-center space-x-3 p-4 rounded-xl border text-left font-medium transition-all ${buttonStyle}`}
                    >
                      <span className="h-6 w-6 rounded-lg bg-white shadow-sm border border-inherit flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {option.key}
                      </span>
                      <span className="text-sm">{option.text}</span>
                    </button>
                  )
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-4 border-t border-slate-50 pt-4 mt-6">
                <div className="text-sm">
                  {selectedOption ? (
                    isCorrect ? (
                      <span className="text-emerald-600 font-semibold flex items-center">
                        <svg className="w-5 h-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Correct Answer!
                      </span>
                    ) : (
                      <span className="text-rose-600 font-semibold flex items-center">
                        <svg className="w-5 h-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Incorrect. Correct answer is {q.answer}.
                      </span>
                    )
                  ) : (
                    <span className="text-slate-400 font-medium">Select an option to test yourself</span>
                  )}
                </div>

                <button
                  onClick={() => toggleExplanation(q.id)}
                  className="flex items-center justify-center space-x-1.5 px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-100 rounded-lg bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                >
                  <span>{isRevealed ? 'Hide Explanation' : 'Reveal Explanation'}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isRevealed ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {isRevealed && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mt-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line animate-fadeIn">
                  <h4 className="font-bold text-gray-900 mb-2 border-b border-slate-200 pb-1 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Step-by-Step Explanation
                  </h4>
                  {q.explanation}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
