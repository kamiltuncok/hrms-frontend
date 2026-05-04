import { apiClient } from '@/lib/apiClient';
import type { ApiResponse } from '@/types/api';
import type { AuthResponse } from '../types';

export const authService = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', credentials);
    return response.data.data;
  },

  registerJobSeeker: async (values: any): Promise<ApiResponse<any>> => {
    // Transform birthYear to birthDate for backend compatibility
    const jobSeekerData = {
      ...values,
      birthDate: `${values.birthYear}-01-01`
    };
    delete (jobSeekerData as any).birthYear;
    delete (jobSeekerData as any).confirmPassword;

    const response = await apiClient.post<ApiResponse<any>>('/api/auth/registerforjobseeker', jobSeekerData);
    return response.data;
  },

  registerEmployer: async (values: any): Promise<ApiResponse<any>> => {
    const employerData = { ...values };
    delete (employerData as any).confirmPassword;
    const response = await apiClient.post<ApiResponse<any>>('/api/auth/registerforemployer', employerData);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/api/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/api/auth/reset-password', { token, newPassword });
  },

  validateResetToken: async (token: string): Promise<{ valid: boolean }> => {
    const response = await apiClient.get<ApiResponse<{ valid: boolean }>>('/api/auth/validate-reset-token', {
      params: { token }
    });
    return response.data.data;
  }
};
