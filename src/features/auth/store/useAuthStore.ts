import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, AuthResponse } from '../types'

import { STORAGE_KEYS } from '@/shared/constants/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (response: AuthResponse) => void;
  logout: () => void;
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
      login: (response) => set({ 
        user: response.user, 
        token: response.token, 
        isAuthenticated: true 
      }),
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
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
