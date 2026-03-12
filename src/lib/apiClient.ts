import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

// Retrieve backend URL from env
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    // We read directly from the store's state as this is outside a React Context
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Normalize errors and unwrap DataResult payload
apiClient.interceptors.response.use(
  (response) => {
    // The backend uses a custom DataResult wrapper where business errors
    // are sometimes returned with 200 OK but success === false
    const data = response.data;
    if (data && typeof data === 'object' && 'success' in data) {
      if (!data.success) {
        return Promise.reject(new Error(data.message || 'API request failed'));
      }
    }
    return response;
  },
  (error) => {
    // Handle standard HTTP error codes
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Automatically log the user out
      useAuthStore.getState().logout();
    }
    
    return Promise.reject(new Error(message));
  }
);
