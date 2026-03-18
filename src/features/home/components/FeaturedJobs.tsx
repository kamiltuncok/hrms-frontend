import { motion } from 'framer-motion';
import { useActiveJobs } from '@/features/jobs/hooks/useJobs';
import { JobCardSkeleton } from '@/components/skeletons';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Briefcase, Clock } from 'lucide-react';

export function FeaturedJobs() {
  const { data: jobs, isLoading, isError, refetch } = useActiveJobs();

  if (isError) {
    return (
      <section className="py-16 container mx-auto px-4 max-w-7xl">
        <ErrorState message="Son ilanlar yüklenemedi." onRetry={refetch} />
      </section>
    );
  }

  // Display top 6 active jobs on the homepage as "Featured"
  const featured = jobs?.slice(0, 6) || [];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Öne Çıkan İlanlar</h2>
            <p className="text-muted-foreground">Platformumuza eklenen son fırsatları keşfedin.</p>
          </div>
          <Button variant="outline" className="mt-6 md:mt-0 hidden sm:flex">
            Tüm İlanları Gör
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <EmptyState title="Aktif ilan bulunamadı" description="Yeni fırsatlar için daha sonra tekrar kontrol edin!" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group flex flex-col p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="bg-secondary/50">
                    {job.openPositions} Pozisyon
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                  {job.jobTitle?.title}
                </h3>
                <p className="text-sm font-medium text-muted-foreground mb-4">{job.employer?.companyName}</p>
                
                <div className="flex flex-col gap-2 mt-auto mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 opacity-70" />
                    {job.city?.name}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4 mr-2 opacity-70" />
                    {job.typeOfWork?.name || 'Belirtilmedi'}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 opacity-70" />
                    Son Başvuru: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Belirtilmedi'}
                  </div>
                </div>

                <Button className="w-full mt-auto" variant="outline">
                  Detayları Gör
                </Button>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="mt-10 flex justify-center sm:hidden">
           <Button variant="outline" className="w-full">
            Tüm İlanları Gör
          </Button>
        </div>
      </div>
    </section>
  );
}
