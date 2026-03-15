import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/api';
import { ResumeResponse, EmployerProfileResponse } from '../types';

export const resumeService = {
  /**
   * Fetches the complete resume for a job seeker.
   */
  getByJobSeekerId: async (id: number): Promise<ResumeResponse> => {
    const response = await apiClient.get<ApiResponse<ResumeResponse>>(`/api/resumes/getbyjobseekerid?jobSeekerId=${id}`);
    return response.data.data;
  },

  /**
   * Fetches employer profile by ID.
   */
  getEmployerById: async (id: number): Promise<EmployerProfileResponse> => {
    const response = await apiClient.get<ApiResponse<EmployerProfileResponse>>(`/api/employers/getbyid?id=${id}`);
    return response.data.data;
  },

  /**
   * Uploads a CV file.
   */
  uploadCv: async (jobSeekerId: number, file: File): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<ApiResponse<string>>(
      `/api/resumes/uploadcv?jobSeekerId=${jobSeekerId}`, 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  /**
   * Uploads a profile photo.
   */
  uploadPhoto: async (jobSeekerId: number, file: File): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<ApiResponse<string>>(
      `/api/resumes/uploadphoto?jobSeekerId=${jobSeekerId}`, 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  /**
   * Updates social accounts and description.
   */
  updateResume: async (resumeData: Partial<ResumeResponse>): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/api/resumes/add', resumeData);
    return response.data;
  },

  // Granular Experience Methods
  addExperience: async (data: any) => apiClient.post('/api/jobexperiences/add', data),
  deleteExperience: async (id: number) => apiClient.post(`/api/jobexperiences/delete?id=${id}`),

  // Granular Education Methods  
  addEducation: async (data: any) => apiClient.post('/api/educationalbackgrounds/add', data),
  deleteEducation: async (id: number) => apiClient.post(`/api/educationalbackgrounds/delete?id=${id}`),

  // Granular Skill Methods
  addSkill: async (data: any) => apiClient.post('/api/skills/add', data),
  deleteSkill: async (id: number) => apiClient.post(`/api/skills/delete?id=${id}`),

  // Granular Language Methods
  addLanguage: async (data: any) => apiClient.post('/api/languages/add', data),
  deleteLanguage: async (id: number) => apiClient.post(`/api/languages/delete?id=${id}`)
};
