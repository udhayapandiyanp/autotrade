const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export const apiFetch = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Inject JWT from localStorage if available
  const token = localStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Session is invalid/expired. Clear it.
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    // Dispatch global event so UI can redirect
    window.dispatchEvent(new Event('auth-unauthorized'));
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    let errMsg = `Request failed: ${response.status} ${response.statusText}`;
    try {
      const errBody = await response.json();
      if (errBody && errBody.message) {
        errMsg = errBody.message;
      } else if (errBody && typeof errBody === 'object') {
        // Collect field validation errors if present
        errMsg = Object.entries(errBody)
          .map(([key, val]) => `${key}: ${val}`)
          .join(', ');
      }
    } catch (ignored) {}
    throw new Error(errMsg);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};
