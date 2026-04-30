import { useQuery } from '@tanstack/react-query';
import { applicationService } from '../services/applicationService';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { JobApplicationResponse } from '../types';

export const useMyApplications = () => {
  const user = useAuthStore((state) => state.user);
  
  return useQuery<JobApplicationResponse[]>({
    queryKey: ['applications', 'jobSeeker', user?.id],
    queryFn: () => applicationService.getJobSeekerApplications(user!.id),
    enabled: !!user?.id && user.role.name === 'ROLE_JOBSEEKER',
  });
};
