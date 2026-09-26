// API Client for InternHub
const PROD_API_URL = 'https://internhub-backend.onrender.com/api';
const LOCAL_API_URL = 'http://localhost:8080/api';

const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? LOCAL_API_URL : PROD_API_URL);
export const API_BASE_URL = BASE_URL.replace(/\/+$/, '');

export const getAuthToken = () => localStorage.getItem('internhub_token');
export const setAuthToken = (token) => {
  if (token) localStorage.setItem('internhub_token', token);
  else localStorage.removeItem('internhub_token');
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('internhub_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (user) localStorage.setItem('internhub_user', JSON.stringify(user));
  else localStorage.removeItem('internhub_user');
};

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.message || data.error || `Lỗi HTTP ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`API call failed for ${endpoint}:`, err.message);
    throw err;
  }
}
