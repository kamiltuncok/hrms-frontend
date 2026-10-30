import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { useActiveJobs } from '@/features/jobs/hooks/useJobs';
import { useJobTitles } from '@/features/jobtitles/hooks/useJobTitles';
import { useCities } from '@/features/jobs/hooks/useReferenceData';

// Optional hero background photo (leave empty to keep clean background color)
const HERO_BG_IMAGE = '';

export function HeroSection() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('Yazılım');

  const { data: allJobs = [] } = useActiveJobs();
  const { data: jobTitles = [] } = useJobTitles();
  const { data: cities = [] } = useCities();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (selectedCityId) params.set('cityId', selectedCityId);
    if (activeCategory && activeCategory !== 'all') params.set('category', activeCategory);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleTagClick = (tag: string) => {
    navigate(`/jobs?keyword=${encodeURIComponent(tag)}`);
  };

  const handleCategoryTab = (catName: string) => {
    setActiveCategory(catName);
    setKeyword(catName);
  };

  // Preview jobs for the dashboard card: take 3 active jobs
  const previewJobs = allJobs.slice(0, 3).map((job, idx) => {
    const avatarStyles = [
      { bg: '#e8ecff', fg: '#3b56f5' },
      { bg: '#fbe6f1', fg: '#c93a83' },
      { bg: '#e6f7ef', fg: '#0d945a' },
    ];
    const initial = job.employer?.companyName?.charAt(0).toUpperCase() || 'H';
    const tag = job.typeOfWork?.name || (idx === 0 ? 'Yeni' : idx === 1 ? 'Uzaktan' : 'Tam Zamanlı');
    return {
      id: job.id,
      initial,
      company: job.employer?.companyName || 'Şirket',
      title: job.jobTitle?.title || 'Açık Pozisyon',
      tag,
      avatarBg: avatarStyles[idx % avatarStyles.length].bg,
      avatarFg: avatarStyles[idx % avatarStyles.length].fg,
    };
  });

  const popularTags = jobTitles.length > 0 
    ? jobTitles.slice(0, 4).map(t => t.title)
    : ['Frontend', 'Backend', 'Ürün Yön.', 'UI/UX'];

  return (
    <section className="relative min-h-[calc(100vh-80px)] lg:min-h-screen flex items-center overflow-hidden bg-[#101319]">
      {/* ── Background with optional photo overlay ── */}
      {HERO_BG_IMAGE && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={HERO_BG_IMAGE}
            alt="Ofis ortamında gülümseyen ekip fotoğrafı"
            className="w-full h-full object-cover object-center filter brightness-[0.4] saturate-[0.85] scale-105 transform motion-safe:transition-transform duration-1000"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(115deg, rgba(16,19,25,0.97) 0%, rgba(16,19,25,0.88) 45%, rgba(16,19,25,0.55) 75%, rgba(16,19,25,0.25) 100%)',
            }}
          />
        </div>
      )}

      {/* ── Hero Container ── */}
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* ── Left Column: Headline & CTA (45%) ── */}
          <div className="lg:col-span-5 text-left">
            {/* Rating badge */}
            <div className="inline-flex items-center gap-2 text-[12.5px] px-3.5 py-1.5 rounded-full bg-[rgba(245,246,248,0.08)] border border-[rgba(245,246,248,0.14)] text-[rgba(245,246,248,0.85)] mb-6 backdrop-blur-sm">
              <span className="text-[#eb5fa6] tracking-widest font-bold">★★★★★</span>
              <span className="font-medium">500+ değerlendirme</span>
            </div>

            {/* Massive Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.02em] leading-[1.08] text-[#f5f6f8] m-0">
              Hayalinizdeki işi<br />bugün bulun
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg leading-relaxed text-[rgba(245,246,248,0.72)] max-w-md mt-5 mb-8">
              En iyi işverenlerle bağlantı kurun, yeteneklerinize uygun fırsatları keşfedin.
            </p>

            {/* Pink Primary CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#ilanlar"
                className="inline-flex items-center gap-2.5 text-[15px] font-bold px-7 py-3.5 rounded-full bg-[#eb5fa6] text-[#161016] hover:bg-[#f074b4] transition-all duration-200 shadow-[0_4px_22px_rgba(235,95,166,0.32)] hover:scale-[1.02]"
              >
                İlanları Keşfet
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#isverenler"
                className="inline-flex items-center text-[14.5px] font-semibold px-6 py-3.5 rounded-full border border-[rgba(245,246,248,0.18)] text-[#f5f6f8] hover:border-[rgba(245,246,248,0.35)] hover:bg-white/5 transition-all"
              >
                İşverenleri Gör
              </a>
            </div>
          </div>

          {/* ── Right Column: 3D Tilted Dashboard Window (55%) ── */}
          <div className="lg:col-span-7 perspective-[1400px]">
            <div className="w-full bg-[rgba(255,255,255,0.96)] backdrop-blur-md rounded-[20px] shadow-[0_40px_80px_rgba(0,0,0,0.55)] border border-white/60 text-[#1a1c22] overflow-hidden lg:transform lg:rotate-y-[-4deg] lg:rotate-x-[1.5deg] transition-transform duration-300 hover:rotate-0">
              {/* Window Title Bar */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-black/5 bg-white/70">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e4574a]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#e8b03e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#4caf6f]" />

                {/* Category Pills inside title bar */}
                <div className="ml-auto flex items-center gap-1.5 bg-[#f0f1f4] rounded-full p-1">
                  {['Yazılım', 'Pazarlama', 'Finans'].map((cat) => {
                    const isSelected = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryTab(cat)}
                        className={`text-xs px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#eb5fa6] text-[#161016] shadow-sm'
                            : 'text-[#6b7080] hover:text-[#1a1c22]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Window Content: Working Search Form */}
              <div className="p-5 sm:p-6">
                <form onSubmit={handleSearch} className="space-y-3 mb-4">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    {/* Keyword search input */}
                    <div className="flex-1 flex items-center gap-2.5 bg-[#f0f1f4] rounded-xl px-3.5 min-h-[46px] border border-transparent focus-within:border-[#7d92ff] focus-within:bg-white transition-all">
                      <Search className="h-4 w-4 text-[#8a8d99] shrink-0" />
                      <input
                        type="text"
                        placeholder="İş unvanı, anahtar kelime veya şirket..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-[13.5px] font-medium text-[#1a1c22] placeholder:text-[#8a8d99]"
                      />
                    </div>

                    {/* City input */}
                    <div className="sm:w-44 flex items-center gap-2 bg-[#f0f1f4] rounded-xl px-3 min-h-[46px] border border-transparent focus-within:border-[#7d92ff] focus-within:bg-white transition-all">
                      <MapPin className="h-4 w-4 text-[#8a8d99] shrink-0" />
                      <select
                        aria-label="Şehir Seçiniz"
                        value={selectedCityId}
                        onChange={(e) => setSelectedCityId(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-[13px] font-medium text-[#1a1c22] cursor-pointer"
                      >
                        <option value="">Tüm Şehirler</option>
                        {cities.slice(0, 30).map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Action button */}
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#eb5fa6] text-[#161016] rounded-xl font-bold text-sm hover:bg-[#f074b4] transition-all duration-150 shrink-0 min-h-[46px] cursor-pointer"
                    >
                      İş Ara
                    </button>
                  </div>
                </form>

                {/* Popular Tags */}
                <div className="flex items-center gap-1.5 flex-wrap mb-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#9a9da6] mr-1">
                    Popüler:
                  </span>
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className="text-[11.5px] font-medium px-2.5 py-1 rounded-full bg-[#eef0f5] text-[#4a4d57] hover:bg-[#eb5fa6] hover:text-[#161016] transition-all cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Suggested Jobs (Önerilen İlanlar) */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#9a9da6] mb-2.5">
                    Önerilen İlanlar
                  </div>

                  <div className="divide-y divide-black/5">
                    {previewJobs.map((pj) => (
                      <div
                        key={pj.id}
                        onClick={() => navigate(`/jobs/${pj.id}`)}
                        className="flex items-center gap-3 py-2.5 hover:bg-[#f0f1f4]/70 px-2 rounded-xl transition-colors cursor-pointer group"
                      >
                        <div
                          className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center font-bold text-sm shadow-sm"
                          style={{ backgroundColor: pj.avatarBg, color: pj.avatarFg }}
                        >
                          {pj.initial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-semibold text-[#1a1c22] truncate group-hover:text-[#7d92ff] transition-colors">
                            {pj.title}
                          </div>
                          <div className="text-[11.5px] text-[#8a8d99] truncate">
                            {pj.company}
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#f0e6fb] text-[#7440b0] shrink-0">
                          {pj.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
