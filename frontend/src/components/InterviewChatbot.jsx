import React, { useState, useEffect, useRef } from 'react'
import interviewService from '../services/interviewService'

export default function InterviewChatbot({ role, mode, setRole, setMode }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  // Reset chat history and add a welcome message when role or mode changes
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: `Hello! I am your AI Technical Interview Assistant. I can help you prepare for technical questions, HR behavioral scenarios, project pitches, or resume reviews for the **${role}** position. \n\nI am configured for **${mode}** mode. What would you like to practice today?`
      }
    ])
  }, [role, mode])

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const result = await interviewService.processRequest({
        type: 'chat',
        message: userMessage.text,
        history: messages,
        role,
        mode
      })

      if (result.success) {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: result.response
          }
        ])
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: "Sorry, I could not process that request. Please try again."
          }
        ])
      }
    } catch (err) {
      console.error(err)
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: "An error occurred connecting to the assistant. Please confirm the server is running."
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    'Software Engineer',
    'Java Developer',
    'Full Stack Developer',
    'MERN Developer',
    'Frontend Developer',
    'Backend Developer',
    'Data Analyst',
    'AI/ML Engineer'
  ]

  const modeOptions = [
    'Technical Interview',
    'HR Interview',
    'Project Discussion',
    'Resume-Based Questions',
    'Role-Specific Interview'
  ]

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm grid grid-cols-1 lg:grid-cols-4 overflow-hidden h-[600px] animate-fadeIn">
      {/* Sidebar Selectors */}
      <div className="lg:col-span-1 bg-slate-50 border-r border-gray-100 p-5 flex flex-col justify-between h-full">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Target Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
            >
              {roleOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Interview Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
            >
              {modeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white/80 border border-slate-100 rounded-xl p-3.5 text-[10px] text-gray-400 leading-relaxed">
          🔒 **Relevance Lock**: The chatbot is restricted to interview/career topics. Prompts outside this context will be filtered out.
        </div>
      </div>

      {/* Chat bubbles terminal */}
      <div className="lg:col-span-3 flex flex-col justify-between h-full bg-slate-50/20">
        {/* Messages List */}
        <div className="flex-grow p-5 overflow-y-auto space-y-4 max-h-[500px] custom-scrollbar">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot'
            return (
              <div 
                key={msg.id}
                className={`flex items-start space-x-3.5 max-w-[85%] ${isBot ? 'self-start' : 'self-end ml-auto flex-row-reverse space-x-reverse'}`}
              >
                {/* Profile Avatar */}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isBot ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-900 text-white'
                }`}>
                  {isBot ? 'AI' : 'ME'}
                </div>

                <div className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                  isBot 
                    ? 'bg-white border border-gray-100 text-gray-800 shadow-sm' 
                    : 'bg-indigo-600 text-white shadow-indigo-500/10 shadow-lg'
                }`}>
                  {msg.text}
                </div>
              </div>
            )
          })}

          {loading && (
            <div className="flex items-start space-x-3.5 max-w-[85%]">
              <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-xs font-bold flex-shrink-0 animate-pulse">
                AI
              </div>
              <div className="bg-white border border-gray-100 text-gray-500 p-4 rounded-2xl text-xs shadow-sm flex items-center space-x-2">
                <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Type your interview query here... (e.g. 'What is OOP encapsulation?')"
            className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold p-3 rounded-xl transition-all shadow-md active:scale-95 flex-shrink-0"
          >
            <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9-7-9-7v14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
