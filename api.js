import axios from 'axios';

// Base URL for your backend
const BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data;
      const errorMessage = errorData.message || 'Something went wrong';
      
      switch (error.response.status) {
        case 401:
          // Unauthorized - Clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Access forbidden:', errorMessage);
          break;
        case 404:
          console.error('Resource not found:', errorMessage);
          break;
        case 422:
          console.error('Validation error:', errorMessage);
          break;
        case 500:
          console.error('Server error:', errorMessage);
          break;
        default:
          console.error('Error:', errorMessage);
      }
      
      return Promise.reject({
        message: errorMessage,
        status: error.response.status,
        data: errorData
      });
    } else if (error.request) {
      // No response received
      console.error('Network error - No response from server');
      return Promise.reject({
        message: 'Cannot connect to server. Please check your network.',
        status: 0
      });
    } else {
      // Other errors
      console.error('Request setup error:', error.message);
      return Promise.reject({
        message: error.message,
        status: null
      });
    }
  }
);

// Export API methods
export default api;