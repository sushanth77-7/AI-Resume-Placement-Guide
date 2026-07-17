// Authentication Service
// Handles user authentication, registration, and token management

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class AuthService {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async register(name, email, password, confirmPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword })
      })
      const data = await response.json()
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      return data
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  async logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  getToken() {
    return localStorage.getItem('token')
  }

  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  isLoggedIn() {
    return !!this.getToken()
  }

  async resetPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      return await response.json()
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }
}

export default new AuthService()
