import { JobTitle } from '@/features/jobs/types';
import { apiClient } from '@/lib/apiClient';

export const jobTitleService = {
  getAll: async (): Promise<JobTitle[]> => {
    const response = await apiClient.get<{ success: boolean; data: JobTitle[] }>('/api/jobtitles/getall');
    return response.data.data;
  },
  getByCategory: async (categoryId: number): Promise<JobTitle[]> => {
    const response = await apiClient.get<{ success: boolean; data: JobTitle[] }>(`/api/jobtitles/getbycategory?categoryId=${categoryId}`);
    return response.data.data;
  }
};
