import { apiClient } from '@/lib/apiClient';

export const fileService = {
  uploadProfileImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/api/files/upload-profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // The backend returns a DataResult containing the URL
    return response.data.data;
  },
};
