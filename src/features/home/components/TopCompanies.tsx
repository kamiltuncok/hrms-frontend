import { motion } from 'framer-motion';
import { useEmployers } from '@/features/employers/hooks/useEmployers';
import { CompanyCardSkeleton } from '@/components/skeletons';
import { ErrorState } from '@/components/common/ErrorState';
import { Building2 } from 'lucide-react';

export function TopCompaniesSection() {
  const { data: employers, isLoading, isError, refetch } = useEmployers();

  if (isError) {
    return (
      <section className="py-16 container mx-auto px-4 max-w-7xl">
        <ErrorState message="En iyi şirketler yüklenemedi." onRetry={refetch} />
      </section>
    );
  }

  // Display subset of top employers
  const topEmployers = employers?.slice(0, 8) || [];

  return (
    <section className="py-20 bg-background border-y border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Öne Çıkan Şirketler</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Geleceği inşa eden ekiplere katılın.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CompanyCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {topEmployers.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col items-center justify-center p-8 rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-center group-hover:text-primary transition-colors line-clamp-1">{company.companyName}</h3>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-1 truncate w-full text-center">
                   {company.webAddress}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
