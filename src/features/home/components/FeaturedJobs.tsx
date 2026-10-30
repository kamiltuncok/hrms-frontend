import { Link } from 'react-router-dom';
import { useActiveJobs } from '@/features/jobs/hooks/useJobs';
import { SectionHeader } from '@/components/common/SectionHeader';
import { JobCardSkeleton } from '@/components/skeletons';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';

export function FeaturedJobs() {
  const { data: jobs, isLoading, isError, refetch } = useActiveJobs();

  if (isError) {
    return (
      <section className="py-16 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
        <ErrorState message="Son ilanlar yüklenemedi." onRetry={refetch} />
      </section>
    );
  }

  const featured = jobs?.slice(0, 6) ?? [];

  return (
    <section id="ilanlar" className="py-12 sm:py-16 lg:py-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
      <SectionHeader
        kicker="En güncel fırsatlar"
        kickerColor="#7d92ff"
        title="Öne Çıkan İlanlar"
        actionText="Tüm İlanları Gör →"
        actionHref="/jobs"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((job) => {
            const companyName = job.employer?.companyName || 'Şirket';
            const initial = companyName.charAt(0).toUpperCase();
            const tag = job.typeOfWork?.name || (job.isActive ? 'Aktif' : null);

            return (
              <div
                key={job.id}
                className="group flex flex-col gap-3 p-6 rounded-2xl bg-[#181c25] border border-[rgba(245,246,248,0.08)] hover:border-[rgba(245,246,248,0.18)] hover:-translate-y-1 transition-all duration-200 shadow-sm"
              >
                {/* Header: Company & Tag */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm bg-[rgba(125,146,255,0.15)] text-[#a6b4ff]">
                    {initial}
                  </div>
                  <div className="text-[13px] font-semibold text-[rgba(245,246,248,0.85)] truncate">
                    {companyName}
                  </div>
                  {tag && (
                    <span className="ml-auto text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[rgba(125,146,255,0.12)] text-[#a6b4ff] whitespace-nowrap">
                      {tag}
                    </span>
                  )}
                </div>

                {/* Job Title */}
                <h3 className="text-[16.5px] font-bold leading-snug text-[#f5f6f8] m-0 line-clamp-1 group-hover:text-[#7d92ff] transition-colors">
                  {job.jobTitle?.title}
                </h3>

                {/* Description */}
                <p className="text-[13.5px] leading-relaxed text-[rgba(245,246,248,0.58)] m-0 flex-1 line-clamp-2">
                  {job.description || 'Bu pozisyon için detaylı açıklamaları ilan sayfasında inceleyebilirsiniz.'}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-[12.5px] text-[rgba(245,246,248,0.5)] pt-2 flex-wrap">
                  <span>{job.city?.name || 'Türkiye'}</span>
                  {job.typeOfWork?.name && <span>• {job.typeOfWork.name}</span>}
                </div>

                {/* CTA Button */}
                <Link
                  to={`/jobs/${job.id}`}
                  className="text-center mt-3 text-[13.5px] font-semibold py-2.5 rounded-full border border-[rgba(245,246,248,0.16)] text-[#f5f6f8] hover:border-[rgba(245,246,248,0.35)] hover:bg-white/5 transition-all"
                >
                  Detayları Gör
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
