import apiClient from '../utils/apiClient';

class ProfileOptimizerService {
  async analyzeProfiles(data) {
    if (data instanceof FormData) {
      return apiClient.postFormData('/portfolio/analyze', data);
    }
    return apiClient.post('/portfolio/analyze', data);
  }

  async getRoleSuggestions(role) {
    return apiClient.get(`/portfolio/role-suggestions/${encodeURIComponent(role)}`);
  }

  async getHistory() {
    return apiClient.get('/portfolio/history');
  }

  async getHistoryDetail(id) {
    return apiClient.get(`/portfolio/history/${id}`);
  }

  async deleteHistory(id) {
    return apiClient.delete(`/portfolio/history/${id}`);
  }
}

export default new ProfileOptimizerService();
