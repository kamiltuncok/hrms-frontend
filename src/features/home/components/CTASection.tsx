import { Link } from 'react-router-dom';

export function CallToActionSection() {
  return (
    <section className="py-8 pb-16 lg:pb-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
      <div className="bg-gradient-to-br from-[#1c2130] to-[#141822] rounded-[24px] p-8 sm:p-12 lg:p-16 flex flex-col gap-4 items-start border border-[rgba(245,246,248,0.08)] shadow-lg relative overflow-hidden">
        {/* Subtle glow effect */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(125,146,255,0.12) 0%, transparent 70%)',
          }}
        />

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.01em] max-w-xl text-[#f5f6f8] m-0 leading-tight">
          Kariyerinize <span className="text-[#7d92ff]">Hız Kazandırın</span>
        </h2>

        <p className="text-base sm:text-lg leading-relaxed text-[rgba(245,246,248,0.65)] max-w-2xl m-0">
          Her gün yeni fırsatlar bulan binlerce profesyonel ve en iyi yetenekleri arayan işverenlere katılın.
        </p>

        <div className="flex flex-wrap gap-3.5 pt-3">
          <Link
            to="/register"
            className="text-[14.5px] font-bold px-7 py-3.5 rounded-full bg-[#eb5fa6] text-[#161016] hover:bg-[#f074b4] transition-all shadow-md hover:shadow-[0_4px_20px_rgba(235,95,166,0.35)]"
          >
            Ücretsiz Hesap Oluştur
          </Link>
          <Link
            to="/jobs"
            className="text-[14px] font-semibold px-7 py-3.5 rounded-full border border-[rgba(245,246,248,0.2)] text-[#f5f6f8] hover:border-[rgba(245,246,248,0.4)] hover:bg-white/5 transition-all"
          >
            İlanları Keşfet →
          </Link>
        </div>
      </div>
    </section>
  );
}
