// API Client for InternHub
const defaultUrl = import.meta.env.DEV ? 'http://localhost:8080/api' : 'https://internhub-backend.onrender.com/api';
const rawBaseUrl = import.meta.env.VITE_API_URL || defaultUrl;
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

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

  const controller = new AbortController();
  const timeout = options.timeout || 15000;
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });
    clearTimeout(timer);

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || `Lỗi HTTP ${res.status}`);
    }
    return data;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error('Kết nối tới máy chủ quá thời gian chờ (Server Render đang khởi động, vui lòng thử lại sau vài giây).');
    }
    console.warn(`API call failed for ${endpoint}:`, err.message);
    throw err;
  }
}
