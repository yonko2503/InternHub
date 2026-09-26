// API Client for InternHub
const PROD_API_URL = 'https://internhub-backend-w8ag.onrender.com/api';
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

// Default timeout: 15 seconds (enough for Render cold start wake-up)
const DEFAULT_TIMEOUT_MS = 15000;

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = `${API_BASE_URL}${endpoint}`;
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.message || data.error || `Lỗi HTTP ${res.status}`);
    }
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.warn(`API call timeout for ${endpoint} after ${timeoutMs}ms`);
      throw new Error(`Máy chủ không phản hồi (timeout ${Math.round(timeoutMs/1000)}s). Backend có thể đang khởi động, vui lòng thử lại sau 30 giây.`);
    }
    console.warn(`API call failed for ${endpoint}:`, err.message);
    throw err;
  }
}

// Quick health check - uses a short timeout to detect if backend is alive
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}
