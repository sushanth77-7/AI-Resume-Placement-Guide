import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">AI-Powered Resume Analyzer</h1>
          <p className="text-xl mb-8">Analyze your resume and get placement-ready guidance from AI</p>
          <Link
            to="/resume-analyzer"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded font-semibold hover:bg-gray-100"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-bold mb-2">Resume Analysis</h3>
              <p className="text-gray-600">Get instant AI-powered feedback on your resume with actionable recommendations.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Placement Guide</h3>
              <p className="text-gray-600">Learn placement preparation strategies and best practices from industry experts.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold mb-2">Company Prep</h3>
              <p className="text-gray-600">Get company-specific interview preparation and requirements guide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to boost your placement prospects?</h2>
          <p className="text-gray-600 mb-8">Join thousands of students who have improved their resumes with our AI analyzer</p>
          <Link
            to="/register"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded font-semibold hover:bg-blue-700"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  )
}
