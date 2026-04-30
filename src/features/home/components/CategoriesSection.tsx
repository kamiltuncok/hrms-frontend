import { motion } from 'framer-motion';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { CategorySkeleton } from '@/components/skeletons';
import { ErrorState } from '@/components/common/ErrorState';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Monitor,
  Database,
  Layout,
  Smartphone,
  PieChart,
  Shield,
  Terminal,
  Cpu,
  Globe,
  Layers,
  BarChart2,
} from 'lucide-react';

// ── Bento layout for 5 items ────────────
const BENTO_CONFIG = [
  { span: 'col-span-1 md:col-span-2 row-span-1', size: 'large' },  
  { span: 'col-span-1', size: 'normal' },             
  { span: 'col-span-1', size: 'normal' },             
  { span: 'col-span-1 md:col-span-2 row-span-1', size: 'large' },  
  { span: 'col-span-1 md:col-span-2', size: 'normal' },             
];

const ICONS = [Code2, Monitor, Database, Layout, Smartphone, PieChart, Shield, Terminal, Cpu, Globe, Layers, BarChart2];

// Each category gets a distinct accent from the blue palette
const ACCENTS = [
  { from: '#1D6FEB', to: '#38BDF8', text: '#0A3D8F', bg: '#EFF6FF', iconBg: '#DBEAFE' },  // Blue
  { from: '#0EA5E9', to: '#38BDF8', text: '#075985', bg: '#F0F9FF', iconBg: '#E0F2FE' },  // Sky
  { from: '#6366F1', to: '#818CF8', text: '#3730A3', bg: '#EEF2FF', iconBg: '#E0E7FF' },  // Indigo
  { from: '#10B981', to: '#34D399', text: '#065F46', bg: '#ECFDF5', iconBg: '#D1FAE5' },  // Emerald
  { from: '#F59E0B', to: '#FCD34D', text: '#92400E', bg: '#FFFBEB', iconBg: '#FEF3C7' },  // Amber
  { from: '#1D6FEB', to: '#60A5FA', text: '#1E3A8A', bg: '#EFF6FF', iconBg: '#BFDBFE' },  // Blue (Design)
  { from: '#8B5CF6', to: '#A78BFA', text: '#4C1D95', bg: '#F5F3FF', iconBg: '#EDE9FE' },  // Violet
  { from: '#EC4899', to: '#F472B6', text: '#831843', bg: '#FDF2F8', iconBg: '#FCE7F3' },  // Pink
];

// ─── Bento Item ───────────────────────────────────────────────────────────────

interface BentoItemProps {
  title: string;
  icon: React.ElementType;
  span: string;
  isLarge: boolean;
  accent: typeof ACCENTS[0];
  index: number;
  onClick: () => void;
}

function BentoItem({ title, icon: Icon, span, isLarge, accent, index, onClick }: BentoItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.91, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.38, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.035, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${span} relative overflow-hidden rounded-3xl cursor-pointer group`}
      style={{
        background: accent.bg,
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)',
      }}
    >
      {/* Gradient blob inside */}
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle, ${accent.from}, transparent 70%)` }}
      />

      <div
        className={`relative z-10 flex ${isLarge ? 'flex-row items-center gap-7 p-8' : 'flex-col items-start gap-4 p-6'}`}
      >
        {/* Icon box */}
        <div
          className={`flex items-center justify-center rounded-2xl shadow-sm shrink-0 ${isLarge ? 'w-16 h-16' : 'w-12 h-12'}`}
          style={{ background: accent.iconBg }}
        >
          <Icon
            className={isLarge ? 'w-8 h-8' : 'w-6 h-6'}
            style={{ color: accent.from }}
            strokeWidth={1.8}
          />
        </div>

        {/* Text */}
        <div>
          <h3
            className={`font-extrabold leading-tight ${isLarge ? 'text-2xl' : 'text-sm'}`}
            style={{ color: '#0A1929' }}
          >
            {title}
          </h3>
          {isLarge && (
            <p className="text-sm font-semibold mt-1.5" style={{ color: accent.text }}>
              İlanları keşfet →
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function CategoriesSection() {
  const navigate = useNavigate();
  const { data: categoriesData, isLoading, isError, refetch } = useCategories();

  if (isError) {
    return (
      <section className="py-16 container mx-auto px-6 max-w-7xl">
        <ErrorState message="Kategoriler yüklenemedi." onRetry={refetch} />
      </section>
    );
  }

  const categories = categoriesData?.slice(0, 5) || [];

  return (
    <section className="py-28 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center mb-16 space-y-4"
        >
          <p className="text-xs font-extrabold text-primary uppercase tracking-widest">Kategoriler</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Alana Göre İş Ara
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
            Popüler teknoloji ve iş alanlarındaki fırsatları tek tıkla keşfedin.
          </p>
        </motion.div>

        {/* Bento Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={BENTO_CONFIG[i % BENTO_CONFIG.length].span}>
                <CategorySkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {categories.map((cat, index) => {
              const cfg = BENTO_CONFIG[index % BENTO_CONFIG.length];
              const Icon = ICONS[index % ICONS.length];
              const accent = ACCENTS[index % ACCENTS.length];
              return (
                <BentoItem
                  key={cat.id}
                  title={cat.name}
                  icon={Icon}
                  span={cfg.span}
                  isLarge={cfg.size === 'large'}
                  accent={accent}
                  index={index}
                  onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
