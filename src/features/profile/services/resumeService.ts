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
   * Downloads the CV PDF file as a Blob.
   */
  downloadCv: async (jobSeekerId: number): Promise<Blob> => {
    const response = await apiClient.get(`/api/resumes/downloadcv?jobSeekerId=${jobSeekerId}`, {
      responseType: 'blob'
    });
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
   * Adds or updates a resume.
   */
  saveResume: async (resumeData: any): Promise<ApiResponse<any>> => {
    const backendData = {
      id: resumeData.resumeId || null,
      summary: resumeData.description || resumeData.summary || "",
      githubUrl: resumeData.githubAccount || resumeData.githubUrl || "",
      linkedinUrl: resumeData.linkedinAccount || resumeData.linkedinUrl || "",
      phone: resumeData.phone || "",
      address: resumeData.address || "",
      birthDate: (resumeData.birthDate === "" || !resumeData.birthDate) ? null : resumeData.birthDate,
      portfolioUrl: resumeData.portfolioUrl || "",
      jobSeekerId: resumeData.jobSeekerId || resumeData.userId || null
    };

    const endpoint = backendData.id ? '/api/resumes/update' : '/api/resumes/add';
    const response = await apiClient.post<ApiResponse<any>>(endpoint, backendData);
    return response.data;
  },

  // Granular Experience Methods
  addExperience: async (data: any) => {
    const payload = { 
      companyName: data.workplaceName,
      startDate: data.startDate,
      endDate: data.leaveDate || null,
      jobTitleId: data.jobTitleId || null,
      positionName: data.positionName,
      resumeId: data.resumeId
    };
    return apiClient.post('/api/jobexperiences/add', payload);
  },
  deleteExperience: async (id: number) => apiClient.post(`/api/jobexperiences/delete?id=${id}`),

  // Granular Education Methods  
  addEducation: async (data: any) => {
    const payload = { 
      schoolName: data.schoolName,
      departmentName: data.departmentName,
      educationDegree: data.educationDegree,
      startDate: data.startDate,
      graduateDate: data.graduateDate || null,
      resumeId: data.resumeId 
    };
    return apiClient.post('/api/schools/add', payload);
  },
  deleteEducation: async (id: number) => apiClient.post(`/api/schools/delete?id=${id}`),

  // Granular Skill Methods
  addSkill: async (data: any) => {
    const payload = { 
      skillName: data.skillName, 
      resumeId: data.resumeId 
    };
    return apiClient.post('/api/skills/add', payload);
  },
  deleteSkill: async (id: number) => apiClient.post(`/api/skills/delete?id=${id}`),

  // Granular Language Methods
  addLanguage: async (data: any) => {
    const payload = { 
      languageName: data.languageName,
      level: data.level,
      resumeId: data.resumeId 
    };
    return apiClient.post('/api/languages/add', payload);
  },
  deleteLanguage: async (id: number) => apiClient.post(`/api/languages/delete?id=${id}`)
};
