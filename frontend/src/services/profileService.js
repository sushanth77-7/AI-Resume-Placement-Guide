// Profile API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ProfileService {
  getHeaders(isMultipart = false) {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  async getProfileDetails() {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/details`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to retrieve profile details');
      return data;
    } catch (error) {
      console.error('Error fetching profile details:', error);
      throw error;
    }
  }

  async updatePersonalInfo(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/personal`, {
        method: 'PUT',
        headers: this.getHeaders(true), // multipart/form-data
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update personal info');
      return data;
    } catch (error) {
      console.error('Error updating personal details:', error);
      throw error;
    }
  }

  async updateCareerInfo(careerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/career`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(careerData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update career goals');
      return data;
    } catch (error) {
      console.error('Error updating career details:', error);
      throw error;
    }
  }

  async addSkill(skillData) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/skills`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(skillData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add skill');
      return data;
    } catch (error) {
      console.error('Error adding skill:', error);
      throw error;
    }
  }

  async deleteSkill(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/skills/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete skill');
      return data;
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  }

  async addEducation(eduData) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/education`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(eduData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add education record');
      return data;
    } catch (error) {
      console.error('Error adding education:', error);
      throw error;
    }
  }

  async deleteEducation(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/education/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete education record');
      return data;
    } catch (error) {
      console.error('Error deleting education:', error);
      throw error;
    }
  }

  async uploadCertificate(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/certificates`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to upload certificate');
      return data;
    } catch (error) {
      console.error('Error uploading certificate:', error);
      throw error;
    }
  }

  async deleteCertificate(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/certificates/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete certificate');
      return data;
    } catch (error) {
      console.error('Error deleting certificate:', error);
      throw error;
    }
  }

  async updatePortfolioLinks(links) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/portfolio-links`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(links)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update portfolio links');
      return data;
    } catch (error) {
      console.error('Error updating links:', error);
      throw error;
    }
  }

  async updateSettings(settingsData) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/settings`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(settingsData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update user settings');
      return data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  async changePassword(passwordData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(passwordData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to change password');
      return data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  async exportProfileData() {
    try {
      const token = localStorage.getItem('token');
      // Directly trigger browser download via endpoint redirection or fetch blob
      const response = await fetch(`${API_BASE_URL}/profile/export`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Data export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `placement-prep-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error exporting profile data:', error);
      throw error;
    }
  }

  async deleteAccount() {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/account`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete account');
      return data;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }
}

export default new ProfileService();
