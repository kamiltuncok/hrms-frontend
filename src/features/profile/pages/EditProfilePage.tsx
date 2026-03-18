import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { EditProfileEmployer } from './EditProfileEmployer';
import { EditProfileJobseeker } from './EditProfileJobseeker';

export function EditProfilePage() {
  const user = useAuthStore(state => state.user);
  const isEmployer = user?.role?.name === 'ROLE_EMPLOYER';

  if (isEmployer) {
    return <EditProfileEmployer />;
  }

  return <EditProfileJobseeker />;
}
