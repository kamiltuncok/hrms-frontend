import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/api';
import { JobAdvertisementResponse, JobAdvertisementAddDto } from '../types';

export const jobService = {
  /**
   * Fetches all active jobs.
   * Note: Backend GET /api/jobadvertisements/getactive returns the full list.
   */
  getActiveJobs: async (): Promise<JobAdvertisementResponse[]> => {
    const response = await apiClient.get<ApiResponse<JobAdvertisementResponse[]>>('/api/jobadvertisements/getactive');
    return response.data.data;
  },

  /**
   * Fetches a single job detail.
   */
  getJobById: async (id: number): Promise<JobAdvertisementResponse> => {
    const response = await apiClient.get<ApiResponse<JobAdvertisementResponse>>(`/api/jobadvertisements/getbyid?id=${id}`);
    return response.data.data;
  },

  /**
   * Adds a new job advertisement.
   */
  addJobAdvertisement: async (jobData: JobAdvertisementAddDto): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/api/jobadvertisements/add', jobData);
    return response.data;
  }
};
