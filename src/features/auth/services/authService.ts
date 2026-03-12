import { apiClient } from '@/lib/apiClient';
import type { ApiResponse } from '@/types/api';
import type { AuthResponse } from '../types';

export const authService = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', credentials);
    return response.data.data;
  },

  registerJobSeeker: async (jobSeeker: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/api/auth/registerforjobseeker', jobSeeker);
    return response.data;
  },

  registerEmployer: async (employer: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/api/auth/registerforemployer', employer);
    return response.data;
  }
};
