import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { cityService } from '../services/cityService';

export function useCities() {
  return useQuery({
    queryKey: queryKeys.referenceData.cities,
    queryFn: () => cityService.getAll(),
  });
}
