import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/api';

export interface City {
  id: number;
  name: string;
}

export interface JobTitle {
  id: number;
  title: string;
}

export interface WorkModel {
  id: number;
  name: string;
}

export interface TypeOfWork {
  id: number;
  name: string;
}

export const useCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<City[]>>('/api/cities/getall');
      return response.data.data;
    },
    staleTime: Infinity, // Cities rarely change
  });
};

export const useJobTitles = () => {
  return useQuery({
    queryKey: ['jobTitles'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<JobTitle[]>>('/api/jobtitles/getall');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useWorkModels = () => {
  return useQuery({
    queryKey: ['workModels'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<WorkModel[]>>('/api/typeofwork/getall');
      return response.data.data;
    },
    staleTime: Infinity,
  });
};
