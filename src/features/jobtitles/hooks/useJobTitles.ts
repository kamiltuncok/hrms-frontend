import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { jobTitleService } from '../services/jobTitleService';

export function useJobTitles() {
  return useQuery({
    queryKey: queryKeys.referenceData.jobTitles,
    queryFn: () => jobTitleService.getAll(),
  });
}

export function useJobTitlesByCategory(categoryId?: number) {
  return useQuery({
    queryKey: [...queryKeys.referenceData.jobTitles, 'category', categoryId],
    queryFn: () => jobTitleService.getByCategory(categoryId!),
    enabled: !!categoryId,
  });
}
