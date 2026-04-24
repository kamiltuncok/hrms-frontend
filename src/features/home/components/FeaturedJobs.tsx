import { motion } from 'framer-motion';
import { useActiveJobs } from '@/features/jobs/hooks/useJobs';
import { JobCardSkeleton } from '@/components/skeletons';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { JobCardFeatured } from '@/components/common/JobCard';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FeaturedJobs() {
  const { data: jobs, isLoading, isError, refetch } = useActiveJobs();

  if (isError) {
    return (
      <section className="py-16 container mx-auto px-4 max-w-7xl">
        <ErrorState message="Son ilanlar yüklenemedi." onRetry={refetch} />
      </section>
    );
  }

  const featured = jobs?.slice(0, 6) ?? [];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4" />
              En Güncel Fırsatlar
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Öne Çıkan İlanlar
            </h2>
            <p className="text-muted-foreground">
              Platformumuza eklenen son fırsatları keşfedin.
            </p>
          </div>
          <Button
            variant="outline"
            className="shrink-0 hidden sm:flex"
            asChild
          >
            <Link to="/jobs">Tüm İlanları Gör →</Link>
          </Button>
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <EmptyState
            title="Aktif ilan bulunamadı"
            description="Yeni fırsatlar için daha sonra tekrar kontrol edin!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((job, index) => (
              <JobCardFeatured key={job.id} job={job} index={index} />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/jobs">Tüm İlanları Gör</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
