import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { jobService } from '../services/jobService';
import { jobApplicationService } from '../services/jobApplicationService';
import { useMemo } from 'react';
import { toast } from 'sonner';

/**
 * Hook to retrieve all currently active jobs from the backend.
 */
export function useActiveJobs() {
  return useQuery({
    queryKey: queryKeys.jobs.active(),
    queryFn: () => jobService.getActiveJobs(),
  });
}

/**
 * Derived hook bridging the gap until the backend supports /search.
 * It fetches the active jobs list and filters it locally.
 */
export function useJobSearch(keyword: string, city: string) {
  const queryInfo = useActiveJobs();

  // Derived filtered data
  const filteredData = useMemo(() => {
    if (!queryInfo.data) return [];
    
    let result = queryInfo.data;
    
    if (keyword.trim()) {
      const lowerKeyword = keyword.toLowerCase();
      result = result.filter(job => 
        job.jobTitle.title.toLowerCase().includes(lowerKeyword) ||
        job.employer.companyName.toLowerCase().includes(lowerKeyword)
      );
    }
    
    if (city.trim()) {
      result = result.filter(job => job.city.name.toLowerCase() === city.toLowerCase());
    }
    
    return result;
  }, [queryInfo.data, keyword, city]);

  return {
    ...queryInfo,
    data: filteredData,
    isEmpty: queryInfo.isSuccess && filteredData.length === 0,
  };
}

/**
 * Hook to retrieve a single job advertisement by its unique ID.
 */
export function useJobDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(id),
    queryFn: () => jobService.getJobById(id),
    enabled: !!id,
  });
}

/**
 * Hook to handle job applications with optimistic updates and notifications.
 */
export function useApplyToJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, seekerId }: { jobId: number; seekerId: number }) => 
      jobApplicationService.applyToJob(jobId, seekerId),
    onSuccess: (_, { jobId }) => {
      toast.success('Successfully applied for the position!');
      // Invalidate related job detail or application lists
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(jobId) });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit job application');
    }
  });
}
