import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { resumeService } from '../services/resumeService';
import { jobSeekerService } from '../services/jobSeekerService';
import { employerService } from '../../employers/services/employerService';
import { ResumeResponse } from '../types';

export function useProfile(profileId?: number, forceEmployer?: boolean) {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore(state => state.user);
  
  // Determine if we are fetching for an employer
  // Use forced flag (from URL context) or fallback to current user's role
  const isEmployer = forceEmployer ?? (currentUser?.role?.name === 'ROLE_EMPLOYER');

  const profileQuery = useQuery<any>({
    queryKey: ['profile', profileId, isEmployer],
    queryFn: async () => {
      if (isEmployer) {
        return resumeService.getEmployerById(profileId!);
      } else {
        const [resume, jobSeeker] = await Promise.all([
          resumeService.getByJobSeekerId(profileId!),
          jobSeekerService.getJobSeekerById(profileId!)
        ]);
        // JobSeeker has the master ID (profileId). Resume has its own resume_id.
        return { 
          ...resume, 
          ...jobSeeker, 
          jobSeekerId: jobSeeker.id, // Explicitly keep jobSeekerId
          resumeId: resume?.id,       // Explicitly keep resumeId
          id: jobSeeker.id            // Always use jobSeeker ID for tokens/updates
        };
      }
    },
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
    mutationFn: (data: Partial<ResumeResponse>) => resumeService.saveResume({ ...data, jobSeekerId: profileId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', profileId] });
    },
  });

  const updateJobSeekerMutation = useMutation({
    mutationFn: (data: any) => jobSeekerService.updateJobSeeker(profileId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', profileId] });
    },
  });

  const updateEmployerMutation = useMutation({
    mutationFn: (data: any) => employerService.updateEmployer(profileId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', profileId] });
    },
  });

  const addExperienceMutation = useMutation({
    mutationFn: (data: any) => resumeService.addExperience({ ...data, resumeId: profileQuery.data?.resumeId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', profileId] }),
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: (id: number) => resumeService.deleteExperience(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', profileId] }),
  });

  const addEducationMutation = useMutation({
    mutationFn: (data: any) => resumeService.addEducation({ ...data, resumeId: profileQuery.data?.resumeId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', profileId] }),
  });

  const deleteEducationMutation = useMutation({
    mutationFn: (id: number) => resumeService.deleteEducation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', profileId] }),
  });

  const addSkillMutation = useMutation({
    mutationFn: (data: any) => resumeService.addSkill({ ...data, resumeId: profileQuery.data?.resumeId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', profileId] }),
  });

  const deleteSkillMutation = useMutation({
    mutationFn: (id: number) => resumeService.deleteSkill(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', profileId] }),
  });

  const addLanguageMutation = useMutation({
    mutationFn: (data: any) => resumeService.addLanguage({ ...data, resumeId: profileQuery.data?.resumeId }),
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
    updateJobSeeker: updateJobSeekerMutation,
    updateEmployer: updateEmployerMutation,
  };
}
