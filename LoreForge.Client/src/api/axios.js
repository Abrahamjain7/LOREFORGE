import axios from 'axios';

// Create Axios instance with API base URL
const API = axios.create({
  baseURL: 'http://localhost:5280/api',
});

// Interceptor to attach JWT Bearer token to all outgoing requests
API.interceptors.request.use(
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

export default API;