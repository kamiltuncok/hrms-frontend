import { useParams, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useProfile } from '../hooks/useProfile';
import { ProfileEmployer } from './ProfileEmployer';
import { ProfileJobseeker } from './ProfileJobseeker';
import { Loader2 } from 'lucide-react';
import { Award } from 'lucide-react';

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user: currentUser, isEmployer: checkIsEmployer } = useAuthStore();
  
  // If no ID in URL, show current user's profile
  const location = useLocation();
  const profileId = id ? parseInt(id) : currentUser?.id;
  const isEmployerPath = location.pathname.startsWith('/employers');
  // Force employer fetch if: visiting /employers/:id OR current user is employer viewing own profile
  const isOwnProfile = !id || parseInt(id) === currentUser?.id;
  const forceEmployer = isEmployerPath || (isOwnProfile && checkIsEmployer());
  const { profile, isLoading } = useProfile(profileId, forceEmployer);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 text-center">
        <div className="space-y-4">
          <Award className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <h2 className="text-2xl font-bold">Profil bulunamadı</h2>
          <p className="text-muted-foreground">Aradığınız profil mevcut değil veya kaldırılmış.</p>
        </div>
      </div>
    );
  }

  // Determine which component to show based on profile data
  // Check if it's an employer (has companyName) or job seeker
  const isEmployer = !!profile.companyName;

  if (isEmployer) {
    return <ProfileEmployer />;
  }

  return <ProfileJobseeker />;
}
