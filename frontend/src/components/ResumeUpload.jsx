import React, { useState } from 'react'

export default function ResumeUpload({ onUpload }) {
  const [file, setFile] = useState(null)
  const [role, setRole] = useState('MERN Stack Developer')
  const [dragging, setDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleFileSelect = (selectedFile) => {
    if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
      setFile(selectedFile)
      if (onUpload) {
        onUpload(selectedFile, role)
      }
    } else {
      alert('Please upload a PDF file')
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
        dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
        <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      
      <p className="mt-4 text-lg font-medium text-gray-900">
        {file ? file.name : 'Drag and drop your resume here'}
      </p>
      <p className="text-gray-500 mt-2">or</p>
      
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        id="resume-input"
      />
      <label
        htmlFor="resume-input"
        className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
      >
        Choose File
      </label>
      
      <div className="mt-4 text-left">
        <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Frontend Developer</option>
          <option>Backend Developer</option>
          <option>Java Developer</option>
          <option>Full Stack Developer</option>
          <option>MERN Stack Developer</option>
          <option>Data Analyst</option>
          <option>AI/ML Engineer</option>
        </select>
      </div>

      <p className="text-sm text-gray-400 mt-4">Supported format: PDF</p>
    </div>
  )
}
