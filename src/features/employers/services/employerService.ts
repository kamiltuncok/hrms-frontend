import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/api';
import { EmployerResponse } from '../types';

export const employerService = {
  /**
   * Fetches all registered employers.
   */
  getEmployers: async (): Promise<EmployerResponse[]> => {
    const response = await apiClient.get<ApiResponse<EmployerResponse[]>>('/api/employers/getall');
    return response.data.data;
  },

  /**
   * Fetches a single employer detail.
   */
  /**
   * Updates employer profile information.
   */
  updateEmployer: async (data: Partial<EmployerResponse>): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/api/employers/update', data);
    return response.data;
  }
};
