/**
 * SmartCompanyLogo
 *
 * Conditional rendering:
 * - If `photoUrl` provided → shows actual image in rounded-xl container
 * - If no image → generates a blue-gradient initial avatar using the company name
 */

import { cn } from '@/shared/utils';

interface SmartCompanyLogoProps {
  photoUrl?: string | null;
  companyName: string;
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

// Deterministic but visually distinct hue shift per company name
function getGradientStyle(name: string): React.CSSProperties {
  // Seed a hue offset from the company name characters
  const seed = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  // Keep hues in the blue family: 200°–240°
  const hueA = 210 + (seed % 30);        // e.g. 210–240
  const hueB = 195 + ((seed * 7) % 30);  // e.g. 195–225 — slightly shifted

  return {
    background: `linear-gradient(135deg, hsl(${hueA} 83% 48%), hsl(${hueB} 72% 60%))`,
  };
}

const SIZE_MAP = {
  sm: { outer: 'w-10 h-10', text: 'text-base' },
  md: { outer: 'w-12 h-12', text: 'text-xl' },
  lg: { outer: 'w-16 h-16', text: 'text-2xl' },
};

export function SmartCompanyLogo({
  photoUrl,
  companyName,
  className,
  size = 'md',
}: SmartCompanyLogoProps) {
  const initial = (companyName?.trim().charAt(0) ?? '?').toUpperCase();
  const { outer, text } = SIZE_MAP[size];

  if (photoUrl) {
    // ── Image exists: show logo ──────────────────────────────────────────────
    return (
      <div
        className={cn(
          'rounded-xl border border-slate-200/80 bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm',
          outer,
          className
        )}
      >
        <img
          src={photoUrl}
          alt={`${companyName} logo`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initial if image fails to load
            (e.currentTarget as HTMLImageElement).style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.setAttribute('data-fallback', 'true');
              parent.style.background = `linear-gradient(135deg, hsl(217 83% 48%), hsl(200 72% 60%))`;
              parent.textContent = initial;
              parent.className = cn(
                parent.className,
                'text-white font-black justify-center items-center flex'
              );
            }
          }}
        />
      </div>
    );
  }

  // ── No image: styled initial avatar ───────────────────────────────────────
  return (
    <div
      className={cn(
        'rounded-xl flex items-center justify-center shrink-0 select-none shadow-md',
        text,
        'font-black text-white',
        outer,
        className
      )}
      style={getGradientStyle(companyName ?? '')}
      aria-label={`${companyName} logo`}
      title={companyName}
    >
      {initial}
    </div>
  );
}
