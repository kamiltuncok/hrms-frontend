import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LocationSelector } from '@/components/common/LocationSelector';
import { Briefcase, Building2, MapPin, Search, TrendingUp } from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { icon: Briefcase, value: '10,000+', label: 'Aktif İlan' },
  { icon: Building2, value: '5,000+', label: 'Kayıtlı Şirket' },
  { icon: MapPin, value: '81', label: 'İl Geneli' },
  { icon: TrendingUp, value: '%94', label: 'Yerleşim Oranı' },
];

const POPULAR_TAGS = [
  'Frontend Developer',
  'Veri Bilimci',
  'Ürün Yöneticisi',
  'Backend Developer',
  'UI/UX Tasarımcı',
  'DevOps Mühendisi',
];

// ─── Animations ───────────────────────────────────────────────────────────────

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroSection() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [cityId, setCityId] = useState<number | undefined>(undefined);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('keyword', keyword.trim() || '');
    params.set('cityId', cityId ? String(cityId) : '');
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-[#F0F6FF] py-28 lg:py-40">
      {/* ── Mesh gradient blobs ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 -right-48 w-[750px] h-[750px] rounded-full hero-blob-1 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full hero-blob-3 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-48 w-[620px] h-[620px] rounded-full hero-blob-2 blur-3xl"
      />

      {/* ── Fine dot grid ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, hsl(217 83% 52% / 0.07) 1.5px, transparent 1.5px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container relative z-10 mx-auto px-6 max-w-5xl">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="text-center space-y-10"
        >


          {/* ── Hero Headline ── */}
          <motion.div variants={fadeUp} className="space-y-6">
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.04]"
              style={{ color: '#0A1929' }}
            >
              Hayalinizdeki İşi{' '}
              <span
                className="relative inline-block"
                style={{ color: 'hsl(217 83% 52%)' }}
              >
                Bugün
                {/* Blue underline accent */}
                <svg
                  aria-hidden
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M2 8 Q75 2 150 6 Q225 10 298 4"
                    stroke="hsl(217 83% 52%)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                </svg>
              </span>{' '}
              Bulun
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
              En iyi işverenlerle bağlantı kurun,{' '}
              <span className="text-slate-700 font-semibold">
                yeteneklerinize uygun fırsatları
              </span>{' '}
              keşfedin.
            </p>
          </motion.div>

          {/* ── Command Palette Search Bar ── */}
          <motion.div variants={fadeUp} className="max-w-3xl mx-auto">
            <div
              className="flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/12 ring-1 ring-blue-100 focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-300"
            >
              {/* Keyword input */}
              <div className="flex-1 flex items-center px-6 py-1 border-b md:border-b-0 md:border-r border-slate-100">
                <Search className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
                <Input
                  id="hero-search-keyword"
                  placeholder="İş unvanı, anahtar kelime veya şirket…"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border-0 shadow-none bg-transparent focus-visible:ring-0 h-14 pl-0 text-base font-medium placeholder:text-slate-400 text-slate-800"
                />
              </div>

              {/* City selector */}
              <div className="flex-[0.65] px-2 py-2 md:border-r border-slate-100 flex items-center">
                <LocationSelector
                  value={cityId}
                  onChange={setCityId}
                  className="h-11 border-0 shadow-none bg-transparent hover:bg-slate-50 focus-visible:ring-0 text-sm font-medium w-full"
                />
              </div>

              {/* Search CTA */}
              <div className="p-3 flex items-center">
                <Button
                  id="hero-search-btn"
                  onClick={handleSearch}
                  className="w-full md:w-auto px-10 h-11 rounded-2xl font-extrabold text-sm tracking-wide bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/35 transition-all duration-200 hover:scale-[1.03]"
                >
                  <Search className="w-4 h-4 mr-2" />
                  İş Ara
                </Button>
              </div>
            </div>

            {/* Popular tags */}
            <div className="flex flex-wrap justify-center gap-2.5 mt-6">
              <span className="text-xs font-bold text-slate-400 self-center uppercase tracking-widest mr-1">
                Popüler:
              </span>
              {POPULAR_TAGS.map((tag) => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(tag)}`)}
                  className="px-4 py-2 rounded-full bg-white border border-blue-100 text-xs font-bold text-slate-600 hover:border-primary hover:text-primary hover:bg-blue-50 shadow-sm transition-all duration-150 cursor-pointer"
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* ── Stats row ── */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto pt-4"
          >
            {STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 bg-white/70 backdrop-blur-sm border border-blue-100 rounded-2xl p-5 shadow-sm"
              >
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide text-center">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
