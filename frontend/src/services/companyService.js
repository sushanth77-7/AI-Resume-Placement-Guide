const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class CompanyService {
  async getAllCompanies(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString()
      const response = await fetch(`${API_BASE_URL}/company?${queryParams}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching companies:', error)
      throw error
    }
  }

  async getCompanyById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/company/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching company details:', error)
      throw error
    }
  }

  async compareCompanies(companyA, companyB) {
    try {
      const response = await fetch(`${API_BASE_URL}/company/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ companyA, companyB })
      })
      return await response.json()
    } catch (error) {
      console.error('Error comparing companies:', error)
      throw error
    }
  }

  async recommendCompanies(targetRole) {
    try {
      const response = await fetch(`${API_BASE_URL}/company/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ targetRole })
      })
      return await response.json()
    } catch (error) {
      console.error('Error recommending companies:', error)
      throw error
    }
  }
}

export default new CompanyService()
