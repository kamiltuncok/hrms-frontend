import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CallToActionSection() {
  return (
    <section className="py-28 relative overflow-hidden" style={{ background: '#0A1929' }}>
      {/* ── Mesh gradient blobs ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 translate-x-1/5 w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, hsl(217 83% 52% / 0.30) 0%, transparent 65%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-0 -translate-x-1/5 w-[560px] h-[560px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, hsl(200 88% 55% / 0.18) 0%, transparent 65%)',
        }}
      />

      {/* ── Fine dot grid ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1.5px, transparent 1.5px)',
          backgroundSize: '38px 38px',
        }}
      />

      <div className="container relative z-10 mx-auto px-6 max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-10"
        >

          {/* Headline */}
          <div className="space-y-5">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.06]">
              Kariyerinize{' '}
              <span
                className="relative inline-block"
                style={{ color: '#60A5FA' }}
              >
                Hız Kazandırın
                <svg
                  aria-hidden
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 400 12"
                  fill="none"
                >
                  <path
                    d="M2 8 Q100 2 200 6 Q300 10 398 4"
                    stroke="#60A5FA"
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="0.45"
                  />
                </svg>
              </span>
            </h2>
            <p className="text-xl text-white/55 max-w-2xl mx-auto font-medium leading-relaxed">
              Her gün yeni fırsatlar bulan binlerce profesyonele ve en iyi yetenekleri arayan işverenlere katılın.
            </p>
          </div>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-12 text-base font-extrabold bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 rounded-2xl transition-all duration-200 hover:scale-[1.04] flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Ücretsiz Hesap Oluştur
              </Button>
            </Link>
            <Link to="/jobs" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-14 px-12 text-base font-extrabold bg-transparent border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 rounded-2xl transition-all duration-200 flex items-center gap-2"
              >
                <Building2 className="w-5 h-5" />
                İlanları Keşfet
                <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Trust line */}
          <p className="text-white/35 text-sm font-semibold pt-2">
            10.000+ aktif ilan · 5.000+ kayıtlı şirket · Türkiye genelinde
          </p>
        </motion.div>
      </div>
    </section>
  );
}
