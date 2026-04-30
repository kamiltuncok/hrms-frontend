import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Building2, 
  User as UserIcon, 
  LogOut, 
  Search, 
  Briefcase, 
  Users,
  PlusCircle,
  Inbox
} from 'lucide-react';
import { cn } from '@/shared/utils';

export function AppLayout() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();

  const navLinks = [
    { name: 'İş İlanları', href: '/jobs', icon: Search },
    { name: 'Şirketler', href: '/employers', icon: Users },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-background selection:bg-primary/10">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center mx-auto px-4 max-w-7xl justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="h-9 w-9 bg-primary flex items-center justify-center rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                HRMS.
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200",
                      isActive 
                        ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden">
                   <Search className="h-5 w-5" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/10 hover:ring-primary/20 p-0 overflow-hidden transition-all">
                      <Avatar className="h-full w-full">
                        <AvatarImage src={user?.profileImageUrl} alt={user?.email} />
                        <AvatarFallback className="bg-primary/5 text-primary font-bold">
                          {user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 mt-2" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal px-4 py-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none">{user?.email}</p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          Rol: {user?.role?.name || 'Misafir'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer py-2 px-4 focus:bg-primary/5 focus:text-primary">
                      <Link to="/profile" className="flex items-center w-full">
                        <UserIcon className="mr-3 h-4 w-4" />
                        <span>Profilim</span>
                      </Link>
                    </DropdownMenuItem>
                    {user?.role?.name === 'ROLE_EMPLOYER' && (
                      <DropdownMenuItem asChild className="cursor-pointer py-2 px-4 focus:bg-primary/5 focus:text-primary">
                        <Link to="/jobs/applications" className="flex items-center w-full">
                          <Inbox className="mr-3 h-4 w-4" />
                          <span>Gelen Başvurular</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {user?.role?.name === 'ROLE_JOBSEEKER' && (
                      <DropdownMenuItem asChild className="cursor-pointer py-2 px-4 focus:bg-primary/5 focus:text-primary">
                        <Link to="/profile/applied-jobs" className="flex items-center w-full">
                          <Briefcase className="mr-3 h-4 w-4" />
                          <span>Başvurulan İlanlar</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer py-2 px-4 text-destructive focus:bg-destructive/5 focus:text-destructive"
                      onClick={() => logout()}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Çıkış Yap</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {user?.role?.name === 'ROLE_EMPLOYER' && (
                  <Link to="/jobs/post">
                    <Button className="hidden sm:flex rounded-full font-bold shadow-lg shadow-primary/20">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      İlan Ver
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="hidden sm:block">
                  <Button variant="ghost" className="font-bold">Giriş Yap</Button>
                </Link>
                <Link to="/register">
                  <Button className="rounded-full shadow-lg shadow-primary/20 px-6 font-bold">
                    Kayıt Ol
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-muted/20 pb-12 pt-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-6 w-6 text-primary" />
                <span className="font-black text-xl tracking-tight">HRMS.</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs transition-colors hover:text-foreground">
                Türkiye'nin önde gelen şirketleri ile yetenekli profesyonelleri bir araya getiriyoruz.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-primary">Keşfet</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/jobs" className="hover:text-primary transition-colors">İş İlanları</Link></li>
                <li><Link to="/employers" className="hover:text-primary transition-colors">Şirketler</Link></li>
                <li><Link to="/register" className="hover:text-primary transition-colors">Kayıt Ol</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-primary">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Kullanım Koşulları</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Gizlilik Politikası</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">İletişim</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} HRMS. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                <Building2 className="h-5 w-5" />
                <Briefcase className="h-5 w-5" />
                <Users className="h-5 w-5" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
