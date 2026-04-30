import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useMyApplications } from '../hooks/useMyApplications';
import { AppliedJobCard } from '../components/AppliedJobCard';
import { EmptyState } from '@/components/common/EmptyState';
import { JobCardSkeleton } from '@/components/skeletons';
import { ErrorState } from '@/components/common/ErrorState';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase } from 'lucide-react';

export function AppliedJobsPage() {
  const { user, isAuthenticated, isJobSeeker } = useAuthStore();
  const { data: applications = [], isLoading, isError, refetch } = useMyApplications();

  // ─── Authentication & Role Gating ─────────────────────────────────────────
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isJobSeeker()) {
    // Show Unauthorized UI or redirect. Redirecting to home is standard.
    return <Navigate to="/" replace />;
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Başvurduğum İlanlar
            </h1>
          </div>
          <p className="text-lg text-slate-500 font-medium ml-1">
            Kariyer yolculuğunuzda attığınız adımları buradan takip edin.
          </p>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <ErrorState message="Başvurularınız yüklenirken bir hata oluştu." onRetry={refetch} />
          ) : applications.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <EmptyState
                title="Henüz başvurduğun bir ilan yok"
                description="Hemen açık ilanlara göz atın ve hayalinizdeki işe ilk adımı atın!"
                actionLabel="İlanları Gör"
                actionLink="/jobs"
              />
            </motion.div>
          ) : (
            <div className="space-y-4">
              {applications.map((app, i) => (
                <AppliedJobCard key={app.id} application={app} index={i} />
              ))}
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
