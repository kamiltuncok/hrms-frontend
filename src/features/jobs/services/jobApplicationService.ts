import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/api';

export interface JobApplicationResponse {
  id: number;
  jobAdvertisementId: number;
  jobSeekerId: number;
  applicationDate: string;
  isAccepted: boolean;
}

export const jobApplicationService = {
  /**
   * Applies for a job advertisement.
   * Note: The backend likely expects a seeker ID and job ID.
   */
  applyToJob: async (jobId: number, seekerId: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/api/jobapplications/add', {
      jobAdvertisementId: jobId,
      jobSeekerId: seekerId,
    });
    return response.data;
  },

  /**
   * Fetches applications for a specific job (for employers).
   */
  getApplicationsByJobId: async (jobId: number): Promise<JobApplicationResponse[]> => {
    const response = await apiClient.get<ApiResponse<JobApplicationResponse[]>>(`/api/jobapplications/getbyjobid?id=${jobId}`);
    return response.data.data;
  },

  /**
   * Fetches applications for a specific job seeker.
   */
  getApplicationsBySeekerId: async (seekerId: number): Promise<JobApplicationResponse[]> => {
    const response = await apiClient.get<ApiResponse<JobApplicationResponse[]>>(`/api/jobapplications/getbyseekerid?id=${seekerId}`);
    return response.data.data;
  }
};
