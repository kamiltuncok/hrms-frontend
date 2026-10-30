import { useNavigate } from 'react-router-dom';
import { useEmployers } from '../hooks/useEmployers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Building2, 
  Globe, 
  Phone, 
  Mail, 
  ExternalLink,
  ChevronRight,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';

export function EmployerListPage() {
  const navigate = useNavigate();
  const { data: employers = [], isLoading, isError } = useEmployers();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployers = useMemo(() => {
    if (!searchQuery) return employers;
    const lowerQuery = searchQuery.toLowerCase();
    return employers.filter(emp => 
      emp.companyName.toLowerCase().includes(lowerQuery) ||
      emp.webAddress.toLowerCase().includes(lowerQuery)
    );
  }, [employers, searchQuery]);

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium text-lg">Şirketler yüklenemedi.</p>
          <Button onClick={() => window.location.reload()}>Tekrar Dene</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101319] pt-8 pb-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.06em] font-semibold text-[#eb5fa6] block">
              Şirket Rehberi
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.02em] text-[#f5f6f8]">
              Şirketler
            </h1>
            <p className="text-sm sm:text-base text-[rgba(245,246,248,0.65)]">
              Platformumuzda yetenek arayan en iyi şirketlerle tanışın.
            </p>
          </div>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgba(245,246,248,0.4)] group-focus-within:text-[#7d92ff] transition-colors" />
            <Input 
              placeholder="Şirketleri filtrele..." 
              className="pl-10 h-11 bg-[#181c25] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] placeholder:text-[rgba(245,246,248,0.4)] rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#181c25] border border-[rgba(245,246,248,0.08)] space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-xl bg-white/5" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4 bg-white/5" />
                    <Skeleton className="h-4 w-1/2 bg-white/5" />
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-full bg-white/5" />
                  <Skeleton className="h-4 w-full bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEmployers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#181c25] rounded-2xl p-16 text-center border border-[rgba(245,246,248,0.08)]"
          >
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-[rgba(245,246,248,0.4)]" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-[#f5f6f8]">Şirket bulunamadı</h3>
            <p className="text-sm text-[rgba(245,246,248,0.6)]">Farklı bir arama terimi deneyin veya daha sonra tekrar kontrol edin.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployers.map((employer, index) => (
              <motion.div
                key={employer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
              >
                <div 
                  className="group relative h-full flex flex-col justify-between p-6 rounded-2xl bg-[#181c25] border border-[rgba(245,246,248,0.08)] hover:border-[rgba(245,246,248,0.22)] shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/employers/${employer.id}`)}
                >
                  <div className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-4 w-4 text-[#7d92ff]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-4 mb-5">
                      <Avatar className="h-14 w-14 rounded-xl border border-[rgba(245,246,248,0.12)]">
                        <AvatarImage src={employer.profileImageUrl} alt={employer.companyName} />
                        <AvatarFallback className="bg-[rgba(125,146,255,0.15)] text-[#a6b4ff] font-bold text-lg">
                          {employer.companyName?.charAt(0).toUpperCase() || 'Ş'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-[#f5f6f8] truncate group-hover:text-[#7d92ff] transition-colors">
                          {employer.companyName}
                        </h3>
                        <Badge variant="secondary" className="mt-1 text-[11px] font-semibold bg-[rgba(125,146,255,0.12)] text-[#a6b4ff] border-0">
                          Partner Şirket
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2.5 mb-6 text-sm text-[rgba(245,246,248,0.65)]">
                      {employer.webAddress && (
                        <div className="flex items-center gap-2.5 truncate hover:text-[#f5f6f8]">
                          <Globe className="h-4 w-4 shrink-0 text-[#7d92ff]" />
                          <span className="truncate">{employer.webAddress.replace(/^https?:\/\//, '')}</span>
                        </div>
                      )}
                      {employer.phoneNumber && (
                        <div className="flex items-center gap-2.5">
                          <Phone className="h-4 w-4 shrink-0 text-[#eb5fa6]" />
                          <span>{employer.phoneNumber}</span>
                        </div>
                      )}
                      {employer.email && (
                        <div className="flex items-center gap-2.5 truncate">
                          <Mail className="h-4 w-4 shrink-0 text-[#7d92ff]" />
                          <span className="truncate">{employer.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full text-xs font-semibold rounded-full border-[rgba(245,246,248,0.18)] text-[#f5f6f8] hover:border-[rgba(245,246,248,0.35)] hover:bg-white/5 h-10 group/btn"
                  >
                    Profili Gör
                    <ChevronRight className="h-4 w-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
