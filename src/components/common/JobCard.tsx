import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Clock, Bookmark, ArrowRight, Zap, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/utils';
import { JobAdvertisementResponse } from '@/features/jobs/types';
import { SmartCompanyLogo } from './SmartCompanyLogo';

// ─── Micro-badge helper ────────────────────────────────────────────────────────

function MicroBadge({ type }: { type: 'new' | 'top' }) {
  if (type === 'new') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wide">
        <Zap className="w-2.5 h-2.5" />
        Yeni
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wide">
      <Star className="w-2.5 h-2.5" />
      Öne Çıkan
    </span>
  );
}

// Determine micro-badge based on job data
function getMicroBadge(job: JobAdvertisementResponse, index: number): 'new' | 'top' | null {
  if (index < 2) return 'new';
  if (index === 2 || index === 4) return 'top';
  return null;
}

// ─── Save Button ───────────────────────────────────────────────────────────────

function SaveButton({ saved, onToggle }: { saved: boolean; onToggle: (e: React.MouseEvent) => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.78 }}
      onClick={onToggle}
      aria-label={saved ? 'Kaydı kaldır' : 'İlanı kaydet'}
      className={cn(
        'p-2 rounded-xl transition-colors duration-150',
        saved ? 'text-primary bg-primary/10 hover:bg-primary/20' : 'text-slate-300 hover:text-primary hover:bg-blue-50'
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
  const microBadge = getMicroBadge(job, index);

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
      whileHover={{ y: -4, scale: 1.008 }}
      transition={{ duration: 0.22 }}
      onClick={onClick}
      className="group relative bg-white rounded-3xl shadow-md shadow-slate-900/6 hover:shadow-2xl hover:shadow-blue-900/12 border-0 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Left blue accent stripe */}
      <div className="absolute left-0 inset-y-0 w-1 bg-gradient-to-b from-primary to-blue-400 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-350 rounded-r-full" />

      <div className="p-6 md:p-7">
        <div className="flex items-start gap-5">
          {/* Smart logo */}
          <SmartCompanyLogo
            photoUrl={job.employer?.profileImageUrl}
            companyName={companyName}
            size="lg"
            className="shrink-0 group-hover:scale-105 transition-transform duration-300"
          />

          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-primary transition-colors duration-200 truncate">
                    {job.jobTitle?.title}
                  </h3>
                  {microBadge && <MicroBadge type={microBadge} />}
                </div>
                <p className="text-sm font-bold text-slate-400">{companyName}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant="secondary"
                  className="hidden sm:inline-flex text-[11px] font-extrabold bg-blue-50 text-primary border-0 px-3 py-1 rounded-full"
                >
                  {job.typeOfWork?.name ?? 'Tam Zamanlı'}
                </Badge>
                <SaveButton saved={saved} onToggle={(e) => { e.stopPropagation(); setSaved(p => !p); }} />
              </div>
            </div>

            {/* Description */}
            {job.description && (
              <p className="text-sm text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                {job.description}
              </p>
            )}

            {/* Meta chips */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-4 border-t border-slate-100">
              {job.city?.name && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
                  <MapPin className="h-3.5 w-3.5 text-primary/70" />
                  {job.city.name}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
                <Briefcase className="h-3.5 w-3.5 text-primary/70" />
                {job.typeOfWork?.name ?? 'Tam Zamanlı'}
              </span>
              {deadline && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
                  <Clock className="h-3.5 w-3.5 text-primary/70" />
                  Son: {deadline}
                </span>
              )}
              {job.minSalary != null && (
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                  ₺{job.minSalary.toLocaleString('tr-TR')}
                  {job.maxSalary != null ? `–${job.maxSalary.toLocaleString('tr-TR')}` : '+'}
                </span>
              )}

              <span className="ml-auto hidden md:flex items-center gap-1 text-xs font-extrabold text-primary opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-250">
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
  const microBadge = getMicroBadge(job, index);

  const deadline = job.applicationDeadline
    ? new Date(job.applicationDeadline).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
      })
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.44, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.015 }}
      className="group flex flex-col bg-white rounded-3xl shadow-lg shadow-slate-900/6 hover:shadow-2xl hover:shadow-blue-900/14 border-0 transition-all duration-350 overflow-hidden relative"
    >
      {/* Top blue accent strip — slides in on hover */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-primary via-blue-400 to-blue-300 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400" />

      <div className="p-7 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <SmartCompanyLogo
            photoUrl={job.employer?.profileImageUrl}
            companyName={companyName}
            size="md"
            className="group-hover:scale-110 transition-transform duration-300"
          />
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-[11px] font-extrabold bg-blue-50 text-primary border-0 px-3 py-1 rounded-full"
            >
              {job.typeOfWork?.name ?? 'Tam Zamanlı'}
            </Badge>
            <SaveButton saved={saved} onToggle={(e) => { e.stopPropagation(); setSaved(p => !p); }} />
          </div>
        </div>

        {/* Title & company */}
        <div className="flex items-start gap-2 flex-wrap mb-1">
          <h3 className="text-base font-extrabold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {job.jobTitle?.title}
          </h3>
          {microBadge && <MicroBadge type={microBadge} />}
        </div>
        <p className="text-sm font-bold text-slate-400 mb-4">{companyName}</p>

        {/* Description */}
        {job.description && (
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6 flex-1">
            {job.description}
          </p>
        )}

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mt-auto mb-6">
          {job.city?.name && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
              <MapPin className="w-3 h-3 text-primary/70" />
              {job.city.name}
            </span>
          )}
          {deadline && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
              <Clock className="w-3 h-3 text-primary/70" />
              Son: {deadline}
            </span>
          )}
          {job.minSalary != null && (
            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
              ₺{job.minSalary.toLocaleString('tr-TR')}
              {job.maxSalary != null ? `–${job.maxSalary.toLocaleString('tr-TR')}` : '+'}
            </span>
          )}
        </div>

        {/* CTA */}
        <Button
          variant="outline"
          size="sm"
          className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-250 font-extrabold rounded-2xl border-slate-200 text-slate-700 h-11"
          asChild
        >
          <Link to={`/jobs/${job.id}`} className="flex items-center justify-center gap-2">
            Detayları Gör
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </Button>
      </div>
    </motion.article>
  );
}
