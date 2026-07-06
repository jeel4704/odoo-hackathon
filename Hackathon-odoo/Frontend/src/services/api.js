import axios from 'axios'
// Trigger comment to force Vercel rebuild and load latest environment variables


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to dynamically inject the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vendorbridge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to catch 401 errors and force logout
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('vendorbridge_user');
      localStorage.removeItem('vendorbridge_token');
      // Only redirect if not already on the auth pages (login/register/forgot-password)
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api

