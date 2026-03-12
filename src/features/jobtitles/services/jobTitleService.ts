import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/api';
import { JobTitle } from '../types';

export const jobTitleService = {
  getAll: async (): Promise<JobTitle[]> => {
    const response = await apiClient.get<ApiResponse<JobTitle[]>>('/api/jobtitles/getall');
    return response.data.data;
  }
};
