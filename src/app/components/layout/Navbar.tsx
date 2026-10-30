import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { HedefIsLogo } from '@/components/common/HedefIsLogo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User as UserIcon,
  LogOut,
  Briefcase,
  PlusCircle,
  Inbox,
  Menu,
  X,
} from 'lucide-react';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'İş İlanları', href: '/jobs' },
    { name: 'İşverenler', href: '/employers' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#101319]/90 backdrop-blur-md border-b border-[rgba(245,246,248,0.08)]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between gap-6">
        {/* Left: Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link to="/" className="group flex items-center">
            <HedefIsLogo size={30} showText={true} />
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-[14.5px] font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'text-[#f5f6f8] text-white'
                      : 'text-[rgba(245,246,248,0.7)] hover:text-[#f5f6f8]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Auth buttons or User Profile */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {user?.role?.name === 'ROLE_EMPLOYER' && (
                <Link to="/jobs/post">
                  <Button
                    size="sm"
                    className="bg-[#eb5fa6] text-[#161016] hover:bg-[#f074b4] font-bold rounded-full px-5 h-10 shadow-sm"
                  >
                    <PlusCircle className="h-4 w-4 mr-1.5" />
                    İlan Ver
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="Kullanıcı Menüsü"
                    className="relative h-10 w-10 rounded-full ring-2 ring-[rgba(245,246,248,0.15)] hover:ring-[#7d92ff] p-0 overflow-hidden transition-all cursor-pointer"
                  >
                    <Avatar className="h-full w-full">
                      <AvatarImage src={user?.profileImageUrl} alt={user?.email} />
                      <AvatarFallback className="bg-[rgba(125,146,255,0.15)] text-[#a6b4ff] font-bold">
                        {user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 mt-2 bg-[#181c25] border border-[rgba(245,246,248,0.12)] text-[#f5f6f8]"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal px-4 py-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{user?.email}</p>
                      <p className="text-xs text-[rgba(245,246,248,0.5)] mt-1">
                        Rol: {user?.role?.name || 'Kullanıcı'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[rgba(245,246,248,0.08)]" />
                  <DropdownMenuItem asChild className="cursor-pointer py-2.5 px-4 focus:bg-white/5 focus:text-white">
                    <Link to="/profile" className="flex items-center w-full">
                      <UserIcon className="mr-3 h-4 w-4 text-[#7d92ff]" />
                      <span>Profilim</span>
                    </Link>
                  </DropdownMenuItem>

                  {user?.role?.name === 'ROLE_EMPLOYER' && (
                    <DropdownMenuItem asChild className="cursor-pointer py-2.5 px-4 focus:bg-white/5 focus:text-white">
                      <Link to="/jobs/applications" className="flex items-center w-full">
                        <Inbox className="mr-3 h-4 w-4 text-[#7d92ff]" />
                        <span>Gelen Başvurular</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {user?.role?.name === 'ROLE_JOBSEEKER' && (
                    <DropdownMenuItem asChild className="cursor-pointer py-2.5 px-4 focus:bg-white/5 focus:text-white">
                      <Link to="/profile/applied-jobs" className="flex items-center w-full">
                        <Briefcase className="mr-3 h-4 w-4 text-[#7d92ff]" />
                        <span>Başvurulan İlanlar</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-[rgba(245,246,248,0.08)]" />
                  <DropdownMenuItem
                    className="cursor-pointer py-2.5 px-4 text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-[#f5f6f8] px-5 py-2.5 rounded-full hover:bg-white/5 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className="text-sm font-bold bg-[#eb5fa6] text-[#161016] px-6 py-2.5 rounded-full hover:bg-[#f074b4] transition-all shadow-sm hover:shadow-[0_4px_16px_rgba(235,95,166,0.35)]"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen((p) => !p)}
          className="lg:hidden p-2 text-[#f5f6f8] rounded-xl hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          aria-label="Menüyü Aç"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#141822] border-b border-[rgba(245,246,248,0.08)] px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold py-2.5 text-[rgba(245,246,248,0.8)] hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-[rgba(245,246,248,0.08)] flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm font-semibold text-[#f5f6f8]"
                >
                  <UserIcon className="h-4 w-4 text-[#7d92ff]" />
                  Profilim ({user?.email})
                </Link>
                {user?.role?.name === 'ROLE_EMPLOYER' && (
                  <Link
                    to="/jobs/post"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full py-3 rounded-full bg-[#eb5fa6] text-[#161016] font-bold text-sm"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    İlan Ver
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 text-sm text-destructive font-semibold"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full border border-[rgba(245,246,248,0.18)] text-sm font-semibold text-[#f5f6f8]"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-[#eb5fa6] text-[#161016] font-bold text-sm"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
