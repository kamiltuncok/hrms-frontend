import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin, Briefcase, Clock, Bookmark, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/utils';
import { JobAdvertisementResponse } from '@/features/jobs/types';

// ─── Shared helpers ──────────────────────────────────────────────────────────

function CompanyLogo({
  photoUrl,
  companyName,
  className,
}: {
  photoUrl?: string;
  companyName: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0 overflow-hidden',
        className,
      )}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={companyName}
          className="w-full h-full object-cover"
        />
      ) : (
        <Building2 className="h-1/2 w-1/2" />
      )}
    </div>
  );
}

function SaveButton({
  saved,
  onToggle,
  className,
}: {
  saved: boolean;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onToggle}
      aria-label={saved ? 'Kaydı kaldır' : 'İlanı kaydet'}
      className={cn(
        'p-2 rounded-lg transition-colors',
        saved
          ? 'text-primary bg-primary/10 hover:bg-primary/20'
          : 'text-muted-foreground hover:text-primary hover:bg-muted',
        className,
      )}
    >
      <Bookmark
        className="h-4 w-4"
        fill={saved ? 'currentColor' : 'none'}
        strokeWidth={2}
      />
    </motion.button>
  );
}

// ─── List Variant ─────────────────────────────────────────────────────────────

interface JobCardListProps {
  job: JobAdvertisementResponse;
  onClick?: () => void;
}

export function JobCardList({ job, onClick }: JobCardListProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved((prev) => !prev);
  };

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="group relative bg-card border border-border/60 rounded-2xl shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Left accent bar */}
      <div className="absolute left-0 inset-y-0 w-0.5 bg-primary scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-300 rounded-full" />

      <div className="p-5 md:p-6">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <CompanyLogo
            photoUrl={job.employer.photoUrl}
            companyName={job.employer.companyName}
            className="h-14 w-14 shrink-0 group-hover:border-primary/30 transition-colors duration-300"
          />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                  {job.jobTitle.title}
                </h3>
                <p className="text-sm font-medium text-muted-foreground mt-0.5">
                  {job.employer.companyName}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Badge
                  variant="secondary"
                  className="hidden sm:inline-flex text-xs font-semibold bg-primary/8 text-primary border-0"
                >
                  {job.typeOfWork?.name ?? 'Tam Zamanlı'}
                </Badge>
                <SaveButton saved={saved} onToggle={handleSave} />
              </div>
            </div>

            {/* Description */}
            {job.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                {job.description}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-4 pt-4 border-t border-border/40">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <MapPin className="h-3.5 w-3.5 text-primary/60" />
                {job.city.name}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Briefcase className="h-3.5 w-3.5 text-primary/60" />
                {job.typeOfWork?.name ?? 'Belirtilmedi'}
              </span>
              {deadline && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Clock className="h-3.5 w-3.5 text-primary/60" />
                  Son: {deadline}
                </span>
              )}

              <span className="ml-auto hidden md:flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform duration-200">
                Detayları Gör
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Featured / Grid Variant ─────────────────────────────────────────────────

interface JobCardFeaturedProps {
  job: JobAdvertisementResponse;
  index?: number;
}

export function JobCardFeatured({ job, index = 0 }: JobCardFeaturedProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved((prev) => !prev);
  };

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
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group flex flex-col p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300"
    >
      {/* Card header */}
      <div className="flex items-start justify-between mb-4">
        <CompanyLogo
          photoUrl={job.employer.photoUrl}
          companyName={job.employer.companyName}
          className="h-12 w-12"
        />
        <div className="flex items-center gap-1">
          <Badge
            variant="secondary"
            className="text-xs font-semibold bg-secondary/60"
          >
            {job.typeOfWork?.name ?? 'Tam Zamanlı'}
          </Badge>
          <SaveButton saved={saved} onToggle={handleSave} />
        </div>
      </div>

      {/* Title & company */}
      <h3 className="font-bold text-base line-clamp-1 group-hover:text-primary transition-colors duration-200">
        {job.jobTitle.title}
      </h3>
      <p className="text-sm font-medium text-muted-foreground mt-0.5 mb-3">
        {job.employer.companyName}
      </p>

      {/* Short description */}
      {job.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>
      )}

      {/* Meta */}
      <div className="flex flex-col gap-1.5 mt-auto mb-5">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary/60 shrink-0" />
          {job.city.name}
        </span>
        {deadline && (
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-primary/60 shrink-0" />
            Son başvuru: {deadline}
          </span>
        )}
      </div>

      {/* CTA */}
      <Button
        variant="outline"
        size="sm"
        className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
        asChild
      >
        <Link to={`/jobs/${job.id}`}>Detayları Gör</Link>
      </Button>
    </motion.article>
  );
}
