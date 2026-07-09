import axios from 'axios';

// Centralized Axios instance with base URL and timeout configurations
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 35000 // Allows backend AI timeout of 30 seconds to trigger first
});

// Request Interceptor: Automatically attach Authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle status codes (401, 403, 500)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    
    if (status === 401) {
      // Clear local session storage on unauthorized responses and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
