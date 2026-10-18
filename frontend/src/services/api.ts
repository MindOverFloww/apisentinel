const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('sentinel_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('sentinel_token', token);
  } else {
    localStorage.removeItem('sentinel_token');
  }
}

export function getCurrentUser(): { username: string; role: string } | null {
  const raw = localStorage.getItem('sentinel_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: { username: string; role: string } | null) {
  if (user) {
    localStorage.setItem('sentinel_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('sentinel_user');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && endpoint !== '/auth/login') {
      setAuthToken(null);
      setCurrentUser(null);
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    let errorDetail = response.statusText;
    try {
      const errJson = await response.json();
      errorDetail = errJson.message || errJson.error || JSON.stringify(errJson);
    } catch {
      // ignore
    }
    if (response.status === 403) {
      throw new Error(errorDetail && errorDetail !== 'Forbidden' ? errorDetail : 'Access denied: Admin permission required');
    }
    throw new Error(`API Error ${response.status}: ${errorDetail}`);
  }

  return response.json();
}

export const apiService = {
  // Auth
  async login(credentials: { username: string; password: string }) {
    const data = await request<{
      token?: string;
      accessToken?: string;
      tokenType: string;
      expiresIn: number;
      user: { id: number; username: string; role: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const jwt = data.token || data.accessToken || '';
    setAuthToken(jwt);
    setCurrentUser({ username: data.user.username, role: data.user.role });
    return data;
  },

  logout() {
    setAuthToken(null);
    setCurrentUser(null);
  },

  // Dashboard summary
  async getDashboardSummary() {
    return request<any>('/dashboard/summary');
  },

  // Incidents
  async getIncidents() {
    return request<any[]>('/incidents');
  },

  async getIncidentById(id: string | number) {
    return request<any>(`/incidents/${id}`);
  },

  async updateIncidentStatus(id: string | number, status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED') {
    return request<any>(`/incidents/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Traffic Events
  async getTrafficEvents(limit: number = 50) {
    return request<any[]>(`/events?limit=${limit}`);
  },

  // Detection Rules
  async getRules() {
    return request<any[]>('/rules');
  },

  async toggleRuleEnabled(id: string | number, enabled: boolean) {
    return request<any>(`/rules/${id}/enabled`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    });
  },

  async updateRule(id: string | number, rule: any) {
    return request<any>(`/rules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(rule),
    });
  },

  // Users (ADMIN only)
  async getUsers() {
    return request<any[]>('/users');
  },

  async createUser(userData: { username: string; email: string; password: string; role: string }) {
    return request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Demo attack simulation triggers
  async simulateProductsRequest(search?: string) {
    const url = search ? `/demo/products?search=${encodeURIComponent(search)}` : '/demo/products';
    return request<any>(url);
  },

  async simulateDemoLogin(credentials: { username: string; password: string }) {
    return request<any>('/demo/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async simulateOrdersRequest() {
    return request<any>('/demo/orders');
  },
};
