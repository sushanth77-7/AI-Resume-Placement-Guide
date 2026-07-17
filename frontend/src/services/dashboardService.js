// Dashboard API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class DashboardService {
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };
  }

  async getDashboardSummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch dashboard data');
      return data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }
}

export default new DashboardService();
