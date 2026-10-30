import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Clock, Bookmark, ArrowRight, Zap, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/utils';
import { JobAdvertisementResponse } from '@/features/jobs/types';
import { SmartCompanyLogo } from './SmartCompanyLogo';
import { getCategoryStyle } from '@/shared/utils/categoryStyles';

// ─── Micro-badge helper ────────────────────────────────────────────────────────

function MicroBadge({ type }: { type: 'new' | 'top' }) {
  if (type === 'new') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
        <Zap className="w-2.5 h-2.5" />
        Yeni
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#eb5fa6] bg-[rgba(235,95,166,0.15)] border border-[rgba(235,95,166,0.3)] px-2.5 py-0.5 rounded-full uppercase tracking-wide">
      <Star className="w-2.5 h-2.5" />
      Öne Çıkan
    </span>
  );
}

// Determine micro-badge based on position in the list
function getMicroBadge(index: number): 'new' | 'top' | null {
  if (index < 2) return 'new';
  if (index === 2 || index === 4) return 'top';
  return null;
}

// ─── Save Button ───────────────────────────────────────────────────────────────

function SaveButton({ saved, onToggle }: { saved: boolean; onToggle: (e: React.MouseEvent) => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={onToggle}
      aria-label={saved ? 'Kaydı kaldır' : 'İlanı kaydet'}
      className={cn(
        'p-2 rounded-full transition-colors duration-150 cursor-pointer',
        saved ? 'text-[#eb5fa6] bg-[rgba(235,95,166,0.15)]' : 'text-[rgba(245,246,248,0.4)] hover:text-[#eb5fa6] hover:bg-white/5'
      )}
    >
      <Bookmark className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} strokeWidth={2} />
    </motion.button>
  );
}

// ─── List Card Variant ────────────────────────────────────────────────────────

interface JobCardListProps {
  job: JobAdvertisementResponse;
  onClick?: () => void;
  index?: number;
}

export function JobCardList({ job, onClick, index = 0 }: JobCardListProps) {
  const [saved, setSaved] = useState(false);

  const companyName = job.employer?.companyName ?? 'Şirket';
  const microBadge = getMicroBadge(index);

  const deadline = job.applicationDeadline
    ? new Date(job.applicationDeadline).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="group relative bg-[#181c25] rounded-2xl border border-[rgba(245,246,248,0.08)] hover:border-[rgba(245,246,248,0.22)] shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Left gradient accent stripe */}
      <div className="absolute left-0 inset-y-0 w-1 bg-gradient-to-b from-[#eb5fa6] to-[#7d92ff] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300 rounded-r-full" />

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4 sm:gap-5">
          {/* Company logo */}
          <SmartCompanyLogo
            photoUrl={job.employer?.profileImageUrl}
            companyName={companyName}
            size="lg"
            className="shrink-0 group-hover:scale-105 transition-transform duration-300 rounded-xl"
          />

          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-base sm:text-lg font-bold text-[#f5f6f8] group-hover:text-[#7d92ff] transition-colors duration-200 truncate">
                    {job.jobTitle?.title}
                  </h3>
                  {microBadge && <MicroBadge type={microBadge} />}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs sm:text-sm font-semibold text-[rgba(245,246,248,0.6)]">{companyName}</p>
                  {job.jobTitle?.categoryName && (() => {
                    const catStyle = getCategoryStyle(job.jobTitle.categoryName);
                    const CatIcon = catStyle.icon;
                    return (
                      <span
                        className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(125,146,255,0.12)] text-[#a6b4ff]"
                      >
                        <CatIcon className="w-3 h-3" />
                        {catStyle.label}
                      </span>
                    );
                  })()}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant="secondary"
                  className="hidden sm:inline-flex text-[11px] font-semibold bg-[rgba(125,146,255,0.12)] text-[#a6b4ff] border-0 px-3 py-1 rounded-full"
                >
                  {job.typeOfWork?.name ?? 'Tam Zamanlı'}
                </Badge>
                <SaveButton saved={saved} onToggle={(e) => { e.stopPropagation(); setSaved(p => !p); }} />
              </div>
            </div>

            {/* Description */}
            {job.description && (
              <p className="text-xs sm:text-sm text-[rgba(245,246,248,0.58)] line-clamp-2 mt-2 leading-relaxed">
                {job.description}
              </p>
            )}

            {/* Meta chips */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-3.5 border-t border-[rgba(245,246,248,0.06)]">
              {job.city?.name && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-[rgba(245,246,248,0.65)] bg-[rgba(245,246,248,0.05)] border border-[rgba(245,246,248,0.08)] px-3 py-1 rounded-full">
                  <MapPin className="h-3.5 w-3.5 text-[#7d92ff]" />
                  {job.city.name}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs font-medium text-[rgba(245,246,248,0.65)] bg-[rgba(245,246,248,0.05)] border border-[rgba(245,246,248,0.08)] px-3 py-1 rounded-full">
                <Briefcase className="h-3.5 w-3.5 text-[#7d92ff]" />
                {job.typeOfWork?.name ?? 'Tam Zamanlı'}
              </span>
              {deadline && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-[rgba(245,246,248,0.65)] bg-[rgba(245,246,248,0.05)] border border-[rgba(245,246,248,0.08)] px-3 py-1 rounded-full">
                  <Clock className="h-3.5 w-3.5 text-[#7d92ff]" />
                  Son: {deadline}
                </span>
              )}

              <span className="ml-auto hidden md:flex items-center gap-1 text-xs font-bold text-[#7d92ff] opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                Detayları Gör <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Featured / Grid Card Variant ─────────────────────────────────────────────

interface JobCardFeaturedProps {
  job: JobAdvertisementResponse;
  index?: number;
}

export function JobCardFeatured({ job, index = 0 }: JobCardFeaturedProps) {
  const [saved, setSaved] = useState(false);
  const companyName = job.employer?.companyName ?? 'Şirket';
  const microBadge = getMicroBadge(index);

  const deadline = job.applicationDeadline
    ? new Date(job.applicationDeadline).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
      })
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="group flex flex-col bg-[#181c25] rounded-2xl border border-[rgba(245,246,248,0.08)] hover:border-[rgba(245,246,248,0.2)] shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden relative"
    >
      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <SmartCompanyLogo
            photoUrl={job.employer?.profileImageUrl}
            companyName={companyName}
            size="md"
            className="group-hover:scale-105 transition-transform duration-200 rounded-xl"
          />
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-[11px] font-semibold bg-[rgba(125,146,255,0.12)] text-[#a6b4ff] border-0 px-3 py-1 rounded-full"
            >
              {job.typeOfWork?.name ?? 'Tam Zamanlı'}
            </Badge>
            <SaveButton saved={saved} onToggle={(e) => { e.stopPropagation(); setSaved(p => !p); }} />
          </div>
        </div>

        {/* Title & company */}
        <div className="flex items-start gap-2 flex-wrap mb-1">
          <h3 className="text-base font-bold text-[#f5f6f8] line-clamp-1 group-hover:text-[#7d92ff] transition-colors duration-200">
            {job.jobTitle?.title}
          </h3>
          {microBadge && <MicroBadge type={microBadge} />}
        </div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-xs font-semibold text-[rgba(245,246,248,0.55)]">{companyName}</p>
        </div>

        {/* Description */}
        {job.description && (
          <p className="text-xs sm:text-sm text-[rgba(245,246,248,0.58)] line-clamp-2 leading-relaxed mb-5 flex-1">
            {job.description}
          </p>
        )}

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mt-auto mb-5">
          {job.city?.name && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[rgba(245,246,248,0.6)] bg-[rgba(245,246,248,0.05)] border border-[rgba(245,246,248,0.08)] px-2.5 py-1 rounded-full">
              <MapPin className="w-3 h-3 text-[#7d92ff]" />
              {job.city.name}
            </span>
          )}
          {deadline && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[rgba(245,246,248,0.6)] bg-[rgba(245,246,248,0.05)] border border-[rgba(245,246,248,0.08)] px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3 text-[#7d92ff]" />
              Son: {deadline}
            </span>
          )}
        </div>

        {/* CTA */}
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs font-semibold rounded-full border-[rgba(245,246,248,0.18)] text-[#f5f6f8] hover:border-[rgba(245,246,248,0.35)] hover:bg-white/5 h-10"
          asChild
        >
          <Link to={`/jobs/${job.id}`} className="flex items-center justify-center gap-1.5">
            Detayları Gör
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </Button>
      </div>
    </motion.article>
  );
}
