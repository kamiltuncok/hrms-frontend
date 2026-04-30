import { Category } from '../types';
import { apiClient } from '@/lib/apiClient';

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<{ success: boolean; data: Category[] }>('/api/categories/getall');
    return response.data.data;
  },
  getCategoryById: async (id: number): Promise<Category> => {
    const response = await apiClient.get<{ success: boolean; data: Category }>(`/api/categories/getbyid?id=${id}`);
    return response.data.data;
  }
};
