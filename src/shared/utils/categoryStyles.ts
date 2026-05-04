import {
  Code2,
  Palette,
  TrendingUp,
  Calculator,
  Megaphone,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';

// ── Category visual config ──────────────────────────────────────────────────────
// Maps category names (from the database) to a unique icon, accent colors, and
// a Turkish display label. Matching is case-insensitive and partial — the first
// entry whose `keywords` match the category name wins.

export interface CategoryStyle {
  icon: LucideIcon;
  label: string;
  from: string;   // gradient start
  to: string;     // gradient end
  text: string;   // dark text variant
  bg: string;     // light background
  iconBg: string; // icon container bg
}

const CATEGORY_STYLES: { keywords: string[]; style: CategoryStyle }[] = [
  {
    keywords: ['design', 'tasarım', 'ui', 'ux', 'grafik'],
    style: {
      icon: Palette,
      label: 'Tasarım',
      from: '#8B5CF6',
      to: '#A78BFA',
      text: '#4C1D95',
      bg: '#F5F3FF',
      iconBg: '#EDE9FE',
    },
  },
  {
    keywords: ['sales', 'satış', 'pazarlama', 'marketing'],
    style: {
      icon: TrendingUp,
      label: 'Satış & Pazarlama',
      from: '#F59E0B',
      to: '#FCD34D',
      text: '#92400E',
      bg: '#FFFBEB',
      iconBg: '#FEF3C7',
    },
  },
  {
    keywords: ['finance', 'finans', 'muhasebe', 'accounting'],
    style: {
      icon: Calculator,
      label: 'Finans & Muhasebe',
      from: '#10B981',
      to: '#34D399',
      text: '#065F46',
      bg: '#ECFDF5',
      iconBg: '#D1FAE5',
    },
  },
  {
    keywords: ['it', 'yazılım', 'software', 'developer', 'code', 'tech'],
    style: {
      icon: Code2,
      label: 'Yazılım & IT',
      from: '#1D6FEB',
      to: '#38BDF8',
      text: '#0A3D8F',
      bg: '#EFF6FF',
      iconBg: '#DBEAFE',
    },
  },
  {
    keywords: ['marketing', 'pazarlama', 'seo', 'social'],
    style: {
      icon: Megaphone,
      label: 'Pazarlama',
      from: '#EC4899',
      to: '#F472B6',
      text: '#831843',
      bg: '#FDF2F8',
      iconBg: '#FCE7F3',
    },
  },
];

// Default fallback
const DEFAULT_STYLE: CategoryStyle = {
  icon: Briefcase,
  label: 'Diğer',
  from: '#64748B',
  to: '#94A3B8',
  text: '#334155',
  bg: '#F8FAFC',
  iconBg: '#E2E8F0',
};

/**
 * Resolves a category name to its visual style configuration.
 * Matches are case-insensitive and keyword-based.
 */
export function getCategoryStyle(categoryName?: string | null): CategoryStyle {
  if (!categoryName) return DEFAULT_STYLE;
  
  const lower = categoryName.toLowerCase();
  
  for (const entry of CATEGORY_STYLES) {
    if (entry.keywords.some((kw) => lower.includes(kw) || lower === kw)) {
      return entry.style;
    }
  }
  
  return DEFAULT_STYLE;
}

/**
 * Returns the Lucide icon component for a given category name.
 */
export function getCategoryIcon(categoryName?: string | null): LucideIcon {
  return getCategoryStyle(categoryName).icon;
}
