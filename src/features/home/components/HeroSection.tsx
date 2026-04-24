import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LocationSelector } from '@/components/common/LocationSelector';
import { Briefcase, Building2, MapPin, Search } from 'lucide-react';

// ─── Stats row ────────────────────────────────────────────────────────────────

const STATS = [
  { icon: Briefcase, value: '10.000+', label: 'Aktif İlan' },
  { icon: Building2, value: '5.000+', label: 'Kayıtlı Şirket' },
  { icon: MapPin, value: '81', label: 'İl' },
];

const POPULAR_TAGS = [
  'Frontend Geliştirici',
  'Veri Bilimci',
  'Ürün Yöneticisi',
  'Backend Geliştirici',
  'Tasarımcı',
];

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (cityId) params.set('cityId', String(cityId));
    navigate(`/jobs?${params.toString()}`);
  };

  const handleTagClick = (tag: string) => {
    navigate(`/jobs?keyword=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 lg:py-32">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 translate-x-1/3 w-[600px] h-[600px] rounded-full bg-primary/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-0 -translate-x-1/3 w-[480px] h-[480px] rounded-full bg-secondary/40 blur-3xl"
      />
      {/* Subtle dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,hsl(var(--border))_1px,transparent_1px)] bg-[length:32px_32px] opacity-40"
      />

      <div className="container relative z-10 mx-auto px-4 max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Türkiye'nin İş Platformu
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Hayalinizdeki İşi{' '}
              <span className="text-primary">Bugün</span> Bulun
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              En iyi işverenlerle bağlantı kurun ve yeteneklerinize uygun
              fırsatları keşfedin.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-col md:flex-row gap-0 bg-card border border-border shadow-lg rounded-2xl overflow-hidden max-w-3xl mx-auto">
              {/* Keyword */}
              <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-border px-4">
                <Search className="h-4 w-4 text-muted-foreground shrink-0 mr-2" />
                <Input
                  placeholder="İş unvanı, anahtar kelime veya şirket"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border-0 shadow-none bg-transparent focus-visible:ring-0 h-12 pl-0 text-sm"
                />
              </div>
              {/* City */}
              <div className="flex-1 p-2 md:border-r border-border">
                <LocationSelector
                  value={cityId}
                  onChange={setCityId}
                  className="h-10 border-0 shadow-none bg-transparent hover:bg-muted/50 focus-visible:ring-0"
                />
              </div>
              {/* CTA */}
              <div className="p-2 flex items-center">
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="w-full md:w-auto px-8 h-10 rounded-xl font-bold shadow-md shadow-primary/20"
                >
                  Ara
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Popular tags */}
          <motion.div variants={itemVariants} className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Popüler Aramalar
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_TAGS.map((tag) => (
                <motion.button
                  key={tag}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleTagClick(tag)}
                  className="px-4 py-1.5 rounded-full bg-card border border-border text-xs font-semibold text-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-x-10 gap-y-6 pt-4"
          >
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-black text-foreground leading-none">
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
