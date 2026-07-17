const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class InterviewService {
  // Centralized service call to process AI responses for chatbot, mock evaluation, and resume/project assistants
  async processRequest(payload) {
    try {
      const response = await fetch(`${API_BASE_URL}/interview/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      })
      return await response.json()
    } catch (error) {
      console.error('Error calling interview API service:', error)
      throw error
    }
  }

  async getFaqs() {
    try {
      const response = await fetch(`${API_BASE_URL}/interview/faqs`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      throw error
    }
  }
}

export default new InterviewService()
