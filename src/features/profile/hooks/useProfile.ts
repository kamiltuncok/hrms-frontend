import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { resumeService } from '../services/resumeService';
import { ResumeResponse, EmployerProfileResponse } from '../types';

export function useProfile(profileId?: number) {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore(state => state.user);
  
  // Determine if we are fetching for an employer
  const isEmployer = currentUser?.role?.name === 'ROLE_EMPLOYER';

  const profileQuery = useQuery<any>({
    queryKey: ['profile', profileId, isEmployer],
    queryFn: () => isEmployer 
      ? resumeService.getEmployerById(profileId!)
      : resumeService.getByJobSeekerId(profileId!),
    enabled: !!profileId,
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: ({ file }: { file: File }) => resumeService.uploadPhoto(profileId!, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', profileId] });
    },
  });

  const uploadCvMutation = useMutation({
    mutationFn: ({ file }: { file: File }) => resumeService.uploadCv(profileId!, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', profileId] });
    },
  });

  const updateResumeMutation = useMutation({
    mutationFn: (data: Partial<ResumeResponse>) => resumeService.updateResume({ ...data, jobSeekerId: profileId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', profileId] });
    },
  });

  const addExperienceMutation = useMutation({
    mutationFn: (data: any) => resumeService.addExperience({ ...data, jobSeekerId: profileId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', profileId] }),
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: (id: number) => resumeService.deleteExperience(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', profileId] }),
  });

  const addEducationMutation = useMutation({
    mutationFn: (data: any) => resumeService.addEducation({ ...data, jobSeekerId: profileId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', profileId] }),
  });

  const deleteEducationMutation = useMutation({
    mutationFn: (id: number) => resumeService.deleteEducation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', profileId] }),
  });

  const addSkillMutation = useMutation({
    mutationFn: (data: any) => resumeService.addSkill({ ...data, jobSeekerId: profileId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', profileId] }),
  });

  const deleteSkillMutation = useMutation({
    mutationFn: (id: number) => resumeService.deleteSkill(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', profileId] }),
  });

  const addLanguageMutation = useMutation({
    mutationFn: (data: any) => resumeService.addLanguage({ ...data, jobSeekerId: profileId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', profileId] }),
  });

  const deleteLanguageMutation = useMutation({
    mutationFn: (id: number) => resumeService.deleteLanguage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', profileId] }),
  });

  return {
    profile: profileQuery.data as any,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    uploadPhoto: uploadPhotoMutation,
    uploadCv: uploadCvMutation,
    updateResume: updateResumeMutation,
    addExperience: addExperienceMutation,
    deleteExperience: deleteExperienceMutation,
    addEducation: addEducationMutation,
    deleteEducation: deleteEducationMutation,
    addSkill: addSkillMutation,
    deleteSkill: deleteSkillMutation,
    addLanguage: addLanguageMutation,
    deleteLanguage: deleteLanguageMutation,
  };
}
