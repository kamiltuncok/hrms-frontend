import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data: any) => {
      // Backend returns flattened AuthResponse: { token, id, email, role }
      const authData = data;
      const user = {
        id: authData.id,
        email: authData.email,
        role: {
          id: 0, // Will be normalized in store
          name: authData.role // Raw role string
        }
      };

      login({ token: authData.token, user });
      navigate('/'); 
    },
  });
}
