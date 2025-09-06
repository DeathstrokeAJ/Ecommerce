import { getToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'https://ecommercestoretest.vercel.app/api';

const makeRequest = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${url}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) =>
    makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string }) =>
    makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
};

export const itemsAPI = {
  getAll: (filters: { category?: string; minPrice?: number; maxPrice?: number; sortBy?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    return makeRequest(`/items${params.toString() ? `?${params}` : ''}`);
  },

  create: (itemData: any) =>
    makeRequest('/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    }),
};

export const cartAPI = {
  get: () => makeRequest('/cart'),

  add: (itemId: string, quantity: number = 1) =>
    makeRequest('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ itemId, quantity }),
    }),

  update: (id: string, quantity: number) =>
    makeRequest(`/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  remove: (id: string) =>
    makeRequest(`/cart/${id}`, {
      method: 'DELETE',
    }),
};