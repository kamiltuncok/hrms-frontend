import { Link } from 'react-router-dom';
import { useEmployers } from '@/features/employers/hooks/useEmployers';
import { SectionHeader } from '@/components/common/SectionHeader';
import { CompanyCardSkeleton } from '@/components/skeletons';
import { ErrorState } from '@/components/common/ErrorState';

export function TopCompaniesSection() {
  const { data: employers, isLoading, isError, refetch } = useEmployers();

  if (isError) {
    return (
      <section className="py-12 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
        <ErrorState message="İşverenler yüklenemedi." onRetry={refetch} />
      </section>
    );
  }

  const topEmployers = employers?.slice(0, 8) || [];

  return (
    <section id="isverenler" className="py-12 sm:py-16 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
      <SectionHeader
        kicker="Şirketler"
        kickerColor="#eb5fa6"
        title="Öne Çıkan İşverenler"
        actionText="Tüm Şirketler →"
        actionHref="/employers"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topEmployers.map((company, index) => {
            const initial = company.companyName?.charAt(0).toUpperCase() || 'Ş';
            const isEven = index % 2 === 0;
            const avatarBg = isEven ? 'rgba(125,146,255,0.15)' : 'rgba(235,95,166,0.15)';
            const avatarFg = isEven ? '#a6b4ff' : '#eb5fa6';

            return (
              <Link
                key={company.id}
                to={`/employers/${company.id}`}
                className="group flex items-center gap-3.5 p-4 rounded-xl bg-[#181c25] border border-[rgba(245,246,248,0.08)] hover:border-[rgba(245,246,248,0.2)] hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Logo / Initials */}
                <div
                  className="w-10 h-10 rounded-[11px] shrink-0 flex items-center justify-center font-bold text-[15px]"
                  style={{ backgroundColor: avatarBg, color: avatarFg }}
                >
                  {company.profileImageUrl ? (
                    <img
                      src={company.profileImageUrl}
                      alt={company.companyName}
                      className="w-full h-full object-cover rounded-[11px]"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    initial
                  )}
                </div>

                {/* Company text */}
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-[#f5f6f8] truncate group-hover:text-[#7d92ff] transition-colors">
                    {company.companyName}
                  </div>
                  {company.webAddress && (
                    <div className="text-[12px] text-[rgba(245,246,248,0.5)] truncate">
                      {company.webAddress.replace(/^https?:\/\//, '')}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
