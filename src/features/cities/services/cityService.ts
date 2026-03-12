import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/api';
import { City } from '../types';

export const cityService = {
  getAll: async (): Promise<City[]> => {
    const response = await apiClient.get<ApiResponse<City[]>>('/api/cities/getall');
    return response.data.data;
  }
};
