// Practice Zone Service
// Handles fetching aptitude and coding questions, submissions, and dashboard analytics

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class PracticeService {
  // Get headers with Auth token
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };
  }

  // ==================== APTITUDE APIS ====================
  
  async getAptitudeQuestions(difficulty) {
    try {
      const response = await fetch(`${API_BASE_URL}/practice/aptitude/questions?difficulty=${difficulty}`, {
        headers: this.getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch aptitude questions');
      return data;
    } catch (error) {
      console.error('Error fetching aptitude questions:', error);
      throw error;
    }
  }

  async submitAptitudeTest(difficulty, answers, timeTaken, questionIds) {
    try {
      const response = await fetch(`${API_BASE_URL}/practice/aptitude/submit`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ difficulty, answers, timeTaken, questionIds })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit aptitude test');
      return data;
    } catch (error) {
      console.error('Error submitting aptitude test:', error);
      throw error;
    }
  }

  async getAptitudeHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/practice/aptitude/attempts`, {
        headers: this.getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch aptitude history');
      return data;
    } catch (error) {
      console.error('Error fetching aptitude history:', error);
      throw error;
    }
  }

  async getAptitudeAttemptDetail(attemptId) {
    try {
      const response = await fetch(`${API_BASE_URL}/practice/aptitude/attempts/${attemptId}`, {
        headers: this.getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch attempt details');
      return data;
    } catch (error) {
      console.error('Error fetching attempt details:', error);
      throw error;
    }
  }

  // ==================== CODING APIS ====================

  async getCodingProblemsSession(difficulty) {
    try {
      const response = await fetch(`${API_BASE_URL}/practice/coding/session?difficulty=${difficulty}`, {
        headers: this.getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch coding session');
      return data;
    } catch (error) {
      console.error('Error fetching coding session:', error);
      throw error;
    }
  }

  async runCodingCode(problemId, language, code) {
    try {
      const response = await fetch(`${API_BASE_URL}/practice/coding/run`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ problemId, language, code })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to run code');
      return data;
    } catch (error) {
      console.error('Error running code:', error);
      throw error;
    }
  }

  async submitCodingCode(problemId, language, code) {
    try {
      const response = await fetch(`${API_BASE_URL}/practice/coding/submit`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ problemId, language, code })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit code');
      return data;
    } catch (error) {
      console.error('Error submitting code:', error);
      throw error;
    }
  }

  async getCodingHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/practice/coding/attempts`, {
        headers: this.getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch coding history');
      return data;
    } catch (error) {
      console.error('Error fetching coding history:', error);
      throw error;
    }
  }

  // ==================== ANALYTICS APIS ====================

  async getPerformanceAnalytics() {
    try {
      const response = await fetch(`${API_BASE_URL}/practice/analytics`, {
        headers: this.getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch performance analytics');
      return data;
    } catch (error) {
      console.error('Error fetching performance analytics:', error);
      throw error;
    }
  }
}

export default new PracticeService();
