import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '../types'

import { STORAGE_KEYS } from '@/shared/constants/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: { token: string; user: User }) => void;
  logout: () => void;
  updateUser: (userUpdate: Partial<User>) => void;
  isAdmin: () => boolean;
  isEmployer: () => boolean;
  isJobSeeker: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (data) => {
        const rawRole = data.user.role.name.toUpperCase();
        const baseRole = rawRole.replace(/^(ROLE_)+/, '');
        const canonicalRoleName = `ROLE_${baseRole}`;
        const roleId = baseRole === 'EMPLOYER' ? 2 : (baseRole === 'JOBSEEKER' ? 3 : 1);

        set({ 
          user: {
            ...data.user,
            role: {
              id: roleId,
              name: canonicalRoleName
            }
          }, 
          token: data.token, 
          isAuthenticated: true 
        });
      },
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
      updateUser: (userUpdate) => set((state) => ({
        user: state.user ? { ...state.user, ...userUpdate } : null
      })),
      isAdmin: () => get().user?.role?.id === 1,
      isEmployer: () => get().user?.role?.id === 2,
      isJobSeeker: () => get().user?.role?.id === 3,
    }),
    {
      name: STORAGE_KEYS.AUTH, 
      storage: createJSONStorage(() => localStorage), 
    }
  )
)
