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
    let message = error.message || 'Beklenmeyen bir hata oluştu';
    
    if (error.response?.data) {
      const respData = error.response.data;
      
      if (typeof respData.data === 'string') {
        // Detailed error message (e.g., Weak Password details)
        message = respData.data;
      } else if (respData.message) {
        // Fallback to the top-level message
        message = respData.message;
      }
    }

    if (error.response?.status === 401) {
      // Unauthorized: invalid or expired token -> Log out
      useAuthStore.getState().logout();
    }
    
    // For 403, we don't necessarily want to logout unless we want to force re-auth
    // but the original code did both. Let's make it clearer.
    if (error.response?.status === 403) {
      console.error('Forbidden access attempt - Check authorities mapping');
    }
    
    return Promise.reject(new Error(message));
  }
);
