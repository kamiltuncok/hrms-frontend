import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/api';

export interface JobApplicationResponse {
  id: number;
  jobAdvertisementId: number;
  jobSeekerId: number;
  jobSeekerFirstName: string;
  jobSeekerLastName: string;
  jobSeekerEmail: string;
  jobTitle: string;
  jobDescription: string;
  companyName: string;
  applicationDate: string;
  status: string;
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
    const response = await apiClient.get<ApiResponse<JobApplicationResponse[]>>(`/api/jobapplications/getbyjobseekerid?jobSeekerId=${seekerId}`);
    return response.data.data;
  },

  /**
   * Fetches applications received by a specific employer.
   */
  getApplicationsByEmployerId: async (employerId: number): Promise<JobApplicationResponse[]> => {
    const response = await apiClient.get<ApiResponse<JobApplicationResponse[]>>(`/api/jobapplications/getbyemployerid?employerId=${employerId}`);
    return response.data.data;
  },

  /**
   * Updates the status of an application.
   */
  updateStatus: async (id: number, status: 'ACCEPTED' | 'REJECTED' | 'PENDING'): Promise<ApiResponse<JobApplicationResponse>> => {
    const response = await apiClient.put<ApiResponse<JobApplicationResponse>>(`/api/jobapplications/updatestatus?id=${id}&status=${status}`);
    return response.data;
  }
};
