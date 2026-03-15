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
      // Normalize role name (ensure it starts with ROLE_)
      const roleName = authData.role.startsWith('ROLE_') ? authData.role : `ROLE_${authData.role.toUpperCase()}`;
      
      const user = {
        id: authData.id,
        email: authData.email,
        role: {
          id: roleName === 'ROLE_EMPLOYER' ? 2 : (roleName === 'ROLE_JOBSEEKER' ? 3 : 1),
          name: roleName
        }
      };

      login({ token: authData.token, user });
      navigate('/'); 
    },
  });
}
