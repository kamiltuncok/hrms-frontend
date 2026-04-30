import { apiClient } from '@/lib/apiClient';
import { JobApplicationResponse } from '../types';

export const applicationService = {
  getJobSeekerApplications: async (jobSeekerId: number): Promise<JobApplicationResponse[]> => {
    const response = await apiClient.get<{ success: boolean; message: string; data: JobApplicationResponse[] }>(
      '/api/jobapplications/getbyjobseekerid',
      { params: { jobSeekerId } }
    );
    return response.data.data;
  },
};
