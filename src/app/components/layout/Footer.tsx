import { Link } from 'react-router-dom';
import { HedefIsLogo } from '@/components/common/HedefIsLogo';

export function Footer() {
  return (
    <footer className="border-t border-[rgba(245,246,248,0.08)] bg-[#101319] pt-14 pb-8">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="inline-block group">
              <HedefIsLogo size={26} showText={true} />
            </Link>
            <p className="text-sm text-[rgba(245,246,248,0.55)] max-w-sm leading-relaxed">
              Türkiye'nin dört bir yanından işverenleri ve profesyonelleri tek bir platformda bir araya getiriyoruz.
            </p>
          </div>

          {/* Column 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-[rgba(245,246,248,0.4)] mb-4">
              Keşfet
            </h4>
            <ul className="space-y-2.5 text-[13.5px]">
              <li>
                <Link to="/jobs" className="text-[rgba(245,246,248,0.7)] hover:text-[#f5f6f8] transition-colors">
                  İş İlanları
                </Link>
              </li>
              <li>
                <Link to="/employers" className="text-[rgba(245,246,248,0.7)] hover:text-[#f5f6f8] transition-colors">
                  İşverenler
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-[rgba(245,246,248,0.7)] hover:text-[#f5f6f8] transition-colors">
                  Kayıt Ol
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-[rgba(245,246,248,0.4)] mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-[13.5px]">
              <li>
                <a href="#" className="text-[rgba(245,246,248,0.7)] hover:text-[#f5f6f8] transition-colors">
                  Kullanım Koşulları
                </a>
              </li>
              <li>
                <a href="#" className="text-[rgba(245,246,248,0.7)] hover:text-[#f5f6f8] transition-colors">
                  Gizlilik Politikası
                </a>
              </li>
              <li>
                <a href="#" className="text-[rgba(245,246,248,0.7)] hover:text-[#f5f6f8] transition-colors">
                  İletişim & Destek
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[rgba(245,246,248,0.06)] pt-6 text-center text-xs text-[rgba(245,246,248,0.4)]">
          © {new Date().getFullYear()} Hedef İş. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
