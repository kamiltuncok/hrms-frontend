import { motion } from 'framer-motion';
import { useEmployers } from '@/features/employers/hooks/useEmployers';
import { CompanyCardSkeleton } from '@/components/skeletons';
import { ErrorState } from '@/components/common/ErrorState';
import { Link } from 'react-router-dom';
import { SmartCompanyLogo } from '@/components/common/SmartCompanyLogo';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TopCompaniesSection() {
  const { data: employers, isLoading, isError, refetch } = useEmployers();

  if (isError) {
    return (
      <section className="py-16 container mx-auto px-6 max-w-7xl">
        <ErrorState message="En iyi şirketler yüklenemedi." onRetry={refetch} />
      </section>
    );
  }

  const topEmployers = employers?.slice(0, 8) || [];

  return (
    <section className="py-28 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div className="space-y-3">
            <p className="text-xs font-extrabold text-primary uppercase tracking-widest">Şirketler</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Öne Çıkan İşverenler
            </h2>
            <p className="text-slate-500 font-medium text-lg">Geleceği inşa eden ekiplere katılın.</p>
          </div>
          <Button
            variant="outline"
            className="shrink-0 hidden sm:flex font-extrabold rounded-2xl px-7 h-12 border-2 border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary shadow-sm transition-all duration-200"
            asChild
          >
            <Link to="/employers" className="flex items-center gap-2">
              Tüm Şirketler <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

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
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.38, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -7, scale: 1.02 }}
                className="group"
              >
                <Link
                  to={`/employers/${company.id}`}
                  className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white shadow-md shadow-slate-900/7 hover:shadow-2xl hover:shadow-blue-900/12 transition-all duration-300"
                >
                  <SmartCompanyLogo
                    photoUrl={(company as any).profileImageUrl}
                    companyName={company.companyName}
                    size="lg"
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                  <h3 className="font-extrabold text-slate-800 text-center mt-5 group-hover:text-primary transition-colors line-clamp-1 text-sm">
                    {company.companyName}
                  </h3>
                  {company.webAddress && (
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-1 truncate w-full text-center font-medium">
                      {company.webAddress.replace(/^https?:\/\//, '')}
                    </p>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
