/**
 * API Client for White Elephant Party Backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  constructor() {
    this.baseURL = API_URL;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  async fetch(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    return this.fetch('/api/health');
  }

  /**
   * Check if codename is available
   */
  async checkCodename(codename) {
    return this.fetch(`/api/codename/check/${encodeURIComponent(codename)}`);
  }

  /**
   * Register a codename
   */
  async registerCodename(codename) {
    return this.fetch('/api/codename/register', {
      method: 'POST',
      body: JSON.stringify({ codename }),
    });
  }

  /**
   * Submit RSVP
   */
  async submitRSVP(rsvpData) {
    return this.fetch('/api/rsvp', {
      method: 'POST',
      body: JSON.stringify(rsvpData),
    });
  }

  /**
   * Get public roster (no auth required)
   */
  async getPublicRoster() {
    return this.fetch('/api/public-roster');
  }

  /**
   * Get guest list (admin only)
   */
  async getGuestList(adminPassword) {
    return this.fetch('/api/guest-list', {
      headers: {
        'Authorization': `Bearer ${adminPassword}`,
      },
    });
  }

  /**
   * Get all codenames (admin only)
   */
  async getCodenames(adminPassword) {
    return this.fetch('/api/codenames', {
      headers: {
        'Authorization': `Bearer ${adminPassword}`,
      },
    });
  }
}

export default new ApiClient();
