import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';

export const useRegistration = () => {
  const registerJobSeeker = useMutation({
    mutationFn: (values: any) => authService.registerJobSeeker(values),
  });

  const registerEmployer = useMutation({
    mutationFn: (values: any) => authService.registerEmployer(values),
  });

  return {
    registerJobSeeker,
    registerEmployer,
  };
};
