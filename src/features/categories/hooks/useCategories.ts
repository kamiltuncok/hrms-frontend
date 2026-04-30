import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { categoryService } from '../services/categoryService';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.referenceData.categories,
    queryFn: () => categoryService.getCategories(),
  });
}
