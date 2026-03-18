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
   * Fetches a single employer by ID.
   */
  getEmployerById: async (id: number): Promise<EmployerResponse> => {
    const response = await apiClient.get<ApiResponse<EmployerResponse>>(`/api/employers/getbyid?id=${id}`);
    return response.data.data;
  },

  /**
   * Updates employer profile information.
   */
  updateEmployer: async (id: number, data: Partial<EmployerResponse>): Promise<ApiResponse<any>> => {
    const response = await apiClient.put<ApiResponse<any>>(`/api/employers/update?id=${id}`, data);
    return response.data;
  }
};
