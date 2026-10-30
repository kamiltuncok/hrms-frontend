import { Link } from 'react-router-dom';

interface SectionHeaderProps {
  kicker?: string;
  kickerColor?: string;
  title: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  className?: string;
}

export function SectionHeader({
  kicker,
  kickerColor = '#7d92ff',
  title,
  description,
  actionText,
  actionHref,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 ${className}`}>
      <div>
        {kicker && (
          <span
            className="block text-xs uppercase tracking-[0.06em] font-semibold mb-2"
            style={{ color: kickerColor }}
          >
            {kicker}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.01em] text-[#f5f6f8] m-0">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-[rgba(245,246,248,0.65)] mt-1.5 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actionText && actionHref && (
        <Link
          to={actionHref}
          className="inline-flex items-center gap-1.5 shrink-0 text-sm font-semibold px-5 py-2.5 rounded-full border border-[rgba(245,246,248,0.18)] text-[#f5f6f8] hover:border-[rgba(245,246,248,0.35)] hover:bg-white/5 transition-all self-start sm:self-end"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
