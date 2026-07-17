// Resume Service
// Handles resume upload, analysis, and retrieval

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class ResumeService {
  async uploadResume(file, role = 'MERN Stack Developer') {
    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('role', role)

      const response = await fetch(`${API_BASE_URL}/resume/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Server error during resume analysis')
      }
      return data
    } catch (error) {
      console.error('Resume upload error:', error)
      throw error
    }
  }

  async generateRecommendations(resumeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/${resumeId}/recommendations`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return await response.json()
    } catch (error) {
      console.error('Resume analysis error:', error)
      throw error
    }
  }

  async getResumeById(resumeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/${resumeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching resume:', error)
      throw error
    }
  }

  async getUserResumes() {
    try {
      const response = await fetch(`${API_BASE_URL}/resume`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching resumes:', error)
      throw error
    }
  }

  async deleteResume(resumeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/${resumeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return await response.json()
    } catch (error) {
      console.error('Error deleting resume:', error)
      throw error
    }
  }

  async updateFeedback(resumeId, feedback) {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/${resumeId}/feedback`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ feedback })
      })
      return await response.json()
    } catch (error) {
      console.error('Error updating feedback:', error)
      throw error
    }
  }
}

export default new ResumeService()
