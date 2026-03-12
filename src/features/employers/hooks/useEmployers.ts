import { useQuery } from '@tanstack/react-query';
import { employerService } from '../services/employerService';

export function useEmployers() {
  return useQuery({
    queryKey: ['employers'],
    queryFn: () => employerService.getEmployers(),
  });
}

export function useEmployer(id: number) {
  return useQuery({
    queryKey: ['employers', id],
    queryFn: () => employerService.getEmployerById(id),
    enabled: !!id,
  });
}
