import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Decode JWT fields into generic user struct and save to localStorage via Zustand
      login({ email: data.email, role: data.role }, data.token);
      navigate('/'); // Redirect to homepage on successful auth
    },
  });
}
