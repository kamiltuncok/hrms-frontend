import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/api';
import { JobSeekerResponse } from '../types';

export interface JobSeekerRequest {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phoneNumber?: string;
}

export const jobSeekerService = {
  /**
   * Fetches a single job seeker by ID.
   */
  getJobSeekerById: async (id: number): Promise<JobSeekerResponse> => {
    const response = await apiClient.get<ApiResponse<JobSeekerResponse>>(`/api/jobseekers/getbyid?id=${id}`);
    return response.data.data;
  },

  /**
   * Updates job seeker basic information.
   */
  updateJobSeeker: async (id: number, data: JobSeekerRequest): Promise<ApiResponse<any>> => {
    const response = await apiClient.put<ApiResponse<any>>(`/api/jobseekers/update?id=${id}`, data);
    return response.data;
  }
};
