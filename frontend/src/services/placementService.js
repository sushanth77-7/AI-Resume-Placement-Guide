// Placement Service
// Handles placement guide data, company information, and interview tips

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class PlacementService {
  // Placement Progress APIs
  async getUserProgress() {
    try {
      const response = await fetch(`${API_BASE_URL}/placement/progress`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching user progress:', error)
      throw error
    }
  }

  async updateProgress(targetRole, targetCompanies, placementStatus) {
    try {
      const response = await fetch(`${API_BASE_URL}/placement/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ targetRole, targetCompanies, placementStatus })
      })
      return await response.json()
    } catch (error) {
      console.error('Error updating progress:', error)
      throw error
    }
  }

  async addMilestone(title, description) {
    try {
      const response = await fetch(`${API_BASE_URL}/placement/progress/milestone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, description })
      })
      return await response.json()
    } catch (error) {
      console.error('Error adding milestone:', error)
      throw error
    }
  }

  async completeMilestone(milestoneId) {
    try {
      const response = await fetch(`${API_BASE_URL}/placement/progress/milestone/${milestoneId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return await response.json()
    } catch (error) {
      console.error('Error completing milestone:', error)
      throw error
    }
  }

  async getProgressSummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/placement/summary`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching progress summary:', error)
      throw error
    }
  }

  // Company APIs
  async getAllCompanies(page = 1, limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/company?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching companies:', error)
      throw error
    }
  }

  async getTopCompanies(limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/company/top?limit=${limit}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching top companies:', error)
      throw error
    }
  }

  async searchCompanies(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/company/search?query=${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return await response.json()
    } catch (error) {
      console.error('Error searching companies:', error)
      throw error
    }
  }

  async getCompanyById(companyId) {
    try {
      const response = await fetch(`${API_BASE_URL}/company/${companyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching company details:', error)
      throw error
    }
  }

  async getCompaniesBySkills(skills) {
    try {
      const response = await fetch(`${API_BASE_URL}/company/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ skills })
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching companies by skills:', error)
      throw error
    }
  }

  async getCompanyResources(companyId) {
    try {
      const response = await fetch(`${API_BASE_URL}/company/${companyId}/resources`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching company resources:', error)
      throw error
    }
  }

  async getAptitudeQuestions() {
    try {
      const response = await fetch(`${API_BASE_URL}/aptitude/questions`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching aptitude questions:', error)
      throw error
    }
  }
}

export default new PlacementService()
