// API Client Utility
// Centralized API request handler with error handling

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    }

    const token = localStorage.getItem('token')
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers = this.getHeaders()

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.error || 'An error occurred',
          data
        }
      }

      return data
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      throw error
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    })
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    })
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  async postFormData(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`
    const token = localStorage.getItem('token')

    const headers = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.error || 'An error occurred',
          data
        }
      }

      return data
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      throw error
    }
  }
}

export default new APIClient()
