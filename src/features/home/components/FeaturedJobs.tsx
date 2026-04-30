import { motion } from 'framer-motion';
import { useActiveJobs } from '@/features/jobs/hooks/useJobs';
import { JobCardSkeleton } from '@/components/skeletons';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { JobCardFeatured } from '@/components/common/JobCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FeaturedJobs() {
  const { data: jobs, isLoading, isError, refetch } = useActiveJobs();

  if (isError) {
    return (
      <section className="py-16 container mx-auto px-6 max-w-7xl">
        <ErrorState message="Son ilanlar yüklenemedi." onRetry={refetch} />
      </section>
    );
  }

  const featured = jobs?.slice(0, 6) ?? [];

  return (
    <section className="py-28 bg-[#F0F6FF]">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary text-xs font-extrabold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              En Güncel Fırsatlar
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Öne Çıkan İlanlar
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              Platformumuza eklenen son fırsatları keşfedin.
            </p>
          </div>
          <Button
            className="shrink-0 hidden sm:flex font-extrabold rounded-2xl px-7 h-12 border-2 border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary shadow-sm transition-all duration-200"
            variant="outline"
            asChild
          >
            <Link to="/jobs" className="flex items-center gap-2">
              Tüm İlanları Gör <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {featured.map((job, index) => (
              <JobCardFeatured key={job.id} job={job} index={index} />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-12 flex justify-center sm:hidden">
          <Button variant="outline" className="w-full font-extrabold rounded-2xl h-12" asChild>
            <Link to="/jobs">Tüm İlanları Gör</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
