// API Service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Production APIs
  async getProductionKPIs() {
    return this.request('/production/kpis');
  }

  async getProductionHistory(limit = 24) {
    return this.request(`/production/history?limit=${limit}`);
  }

  async createProduction(data: Record<string, unknown>) {
    return this.request('/production', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Farmer APIs
  async getFarmers(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/farmers${query}`);
  }

  async getFarmerById(id: string) {
    return this.request(`/farmers/${id}`);
  }

  async createFarmer(data: Record<string, unknown>) {
    return this.request('/farmers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFarmerPayment(id: string, status: string) {
    return this.request(`/farmers/${id}/payment`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getPaymentSummary() {
    return this.request('/farmers/summary/payments');
  }

  // Logistics APIs
  async getLogistics(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/logistics${query}`);
  }

  async getVehicleById(id: string) {
    return this.request(`/logistics/${id}`);
  }

  async createVehicle(data: Record<string, unknown>) {
    return this.request('/logistics', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateVehicleStatus(id: string, status: string, gpsCoordinates?: { latitude: number; longitude: number }) {
    return this.request(`/logistics/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, gpsCoordinates }),
    });
  }

  async getLogisticsSummary() {
    return this.request('/logistics/summary/stats');
  }

  // Distillery APIs
  async getCurrentDistillery() {
    return this.request('/distillery/current');
  }

  async getDistilleryHistory(limit = 30) {
    return this.request(`/distillery/history?limit=${limit}`);
  }

  async createDistillery(data: Record<string, unknown>) {
    return this.request('/distillery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Power Plant APIs
  async getCurrentPowerPlant() {
    return this.request('/power/current');
  }

  async getPowerHistory(limit = 24) {
    return this.request(`/power/history?limit=${limit}`);
  }

  async createPowerPlant(data: Record<string, unknown>) {
    return this.request('/power', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Sustainability APIs
  async getCurrentSustainability() {
    return this.request('/sustainability/current');
  }

  async getSustainabilityHistory(days = 30) {
    return this.request(`/sustainability/history?days=${days}`);
  }

  async createSustainability(data: Record<string, unknown>) {
    return this.request('/sustainability', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Analytics APIs
  async getAnalyticsDashboard() {
    return this.request('/analytics/dashboard');
  }

  async getDepartmentPerformance() {
    return this.request('/analytics/departments');
  }

  // Health Check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService(API_BASE_URL);
export default apiService;
