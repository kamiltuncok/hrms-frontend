import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeService } from '../services/resumeService';
import { ResumeResponse } from '../types';

export function useProfile(jobSeekerId?: number) {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile', jobSeekerId],
    queryFn: () => resumeService.getByJobSeekerId(jobSeekerId!),
    enabled: !!jobSeekerId,
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: ({ file }: { file: File }) => resumeService.uploadPhoto(jobSeekerId!, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', jobSeekerId] });
    }
  });

  const uploadCvMutation = useMutation({
    mutationFn: ({ file }: { file: File }) => resumeService.uploadCv(jobSeekerId!, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', jobSeekerId] });
    }
  });

  const updateResumeMutation = useMutation({
    mutationFn: (data: Partial<ResumeResponse>) => resumeService.updateResume({ ...data, jobSeekerId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', jobSeekerId] });
    }
  });

  const addExperience = useMutation({
    mutationFn: (data: any) => resumeService.addExperience({ ...data, jobSeekerId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', jobSeekerId] }),
  });

  const deleteExperience = useMutation({
    mutationFn: (id: number) => resumeService.deleteExperience(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', jobSeekerId] }),
  });

  const addEducation = useMutation({
    mutationFn: (data: any) => resumeService.addEducation({ ...data, jobSeekerId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', jobSeekerId] }),
  });

  const deleteEducation = useMutation({
    mutationFn: (id: number) => resumeService.deleteEducation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', jobSeekerId] }),
  });

  const addSkill = useMutation({
    mutationFn: (data: any) => resumeService.addSkill({ ...data, jobSeekerId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', jobSeekerId] }),
  });

  const deleteSkill = useMutation({
    mutationFn: (id: number) => resumeService.deleteSkill(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', jobSeekerId] }),
  });

  const addLanguage = useMutation({
    mutationFn: (data: any) => resumeService.addLanguage({ ...data, jobSeekerId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', jobSeekerId] }),
  });

  const deleteLanguage = useMutation({
    mutationFn: (id: number) => resumeService.deleteLanguage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', jobSeekerId] }),
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    uploadPhoto: uploadPhotoMutation,
    uploadCv: uploadCvMutation,
    updateResume: updateResumeMutation,
    addExperience,
    deleteExperience,
    addEducation,
    deleteEducation,
    addSkill,
    deleteSkill,
    addLanguage,
    deleteLanguage,
  };
}
