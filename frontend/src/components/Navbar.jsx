import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            AI Resume
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/resume-analyzer" className="text-gray-700 hover:text-blue-600">Analyzer</Link>
            <Link to="/placement-guide" className="text-gray-700 hover:text-blue-600">Guide</Link>
            <Link to="/practice-zone" className="text-gray-700 hover:text-blue-600">Practice Zone</Link>
            <Link to="/placement-guide/profile-optimizer" className="text-gray-700 hover:text-blue-600">Profile Optimizer</Link>
            <Link to="/company-prep" className="text-gray-700 hover:text-blue-600">Company Prep</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
          </div>

          <div className="hidden md:flex space-x-4">
            <Link to="/login" className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block text-gray-700 hover:text-blue-600 py-2">Home</Link>
            <Link to="/resume-analyzer" className="block text-gray-700 hover:text-blue-600 py-2">Analyzer</Link>
            <Link to="/placement-guide" className="block text-gray-700 hover:text-blue-600 py-2">Guide</Link>
            <Link to="/practice-zone" className="block text-gray-700 hover:text-blue-600 py-2">Practice Zone</Link>
            <Link to="/placement-guide/profile-optimizer" className="block text-gray-700 hover:text-blue-600 py-2">Profile Optimizer</Link>
            <Link to="/company-prep" className="block text-gray-700 hover:text-blue-600 py-2">Company Prep</Link>
            <Link to="/dashboard" className="block text-gray-700 hover:text-blue-600 py-2">Dashboard</Link>
            <Link to="/profile" className="block text-gray-700 hover:text-blue-600 py-2">Profile</Link>
            <Link to="/login" className="block text-blue-600 border border-blue-600 rounded py-2 px-4 hover:bg-blue-50">
              Login
            </Link>
            <Link to="/register" className="block bg-blue-600 text-white rounded py-2 px-4 hover:bg-blue-700">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
