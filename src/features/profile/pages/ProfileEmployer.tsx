import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useProfile } from '../hooks/useProfile';
import { useActiveJobs } from '@/features/jobs/hooks/useJobs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  FileText, 
  Briefcase,
  Building2,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Clock,
  Users,
  TrendingUp,
  ExternalLink,
  Edit,
  Inbox,
  Camera
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

export function ProfileEmployer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore(state => state.user);
  const profileId = id ? parseInt(id) : currentUser?.id;
  const isOwnProfile = !id || parseInt(id) === currentUser?.id;

  const { 
    profile, 
    isLoading,
    uploadPhoto
  } = useProfile(profileId, true);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadPhoto.mutate({ file }, {
        onSuccess: () => toast.success('Firma logosu başarıyla güncellendi'),
        onError: () => toast.error('Firma logosu yüklenemedi')
      });
    }
  };

  // Fetch all active jobs then filter by this employer
  const { data: allJobs = [], isLoading: jobsLoading } = useActiveJobs();
  
  const employerJobs = useMemo(() => {
    if (!profileId || !allJobs.length) return [];
    return allJobs.filter(job => job.employer?.id === profileId);
  }, [allJobs, profileId]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 pb-12 bg-[#101319] text-[#f5f6f8]">
        <div className="container mx-auto px-4 max-w-5xl space-y-8">
           <Card className="border border-[rgba(245,246,248,0.08)] bg-[#181c25] rounded-2xl">
             <CardContent className="p-8 flex items-center gap-8">
               <Skeleton className="h-32 w-32 rounded-2xl bg-[#222838]" />
               <div className="space-y-3 flex-1">
                 <Skeleton className="h-8 w-1/3 bg-[#222838]" />
                 <Skeleton className="h-4 w-1/2 bg-[#222838]" />
                 <Skeleton className="h-4 w-1/4 bg-[#222838]" />
               </div>
             </CardContent>
           </Card>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <Skeleton className="h-64 md:col-span-1 bg-[#222838]" />
             <Skeleton className="h-96 md:col-span-2 bg-[#222838]" />
           </div>
        </div>
      </div>
    );
  }

  if (!profile && !isLoading) {
    return (
      <div className="min-h-screen bg-[#101319] text-[#f5f6f8] flex items-center justify-center pt-28 text-center">
        <div className="space-y-4">
          <Building2 className="h-16 w-16 mx-auto text-[rgba(245,246,248,0.3)]" />
          <h2 className="text-2xl font-bold">Şirket bulunamadı</h2>
          <p className="text-[rgba(245,246,248,0.6)]">Aradığınız şirket profili mevcut değil veya kaldırılmış.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101319] text-[#f5f6f8] pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border border-[rgba(245,246,248,0.08)] bg-[#181c25] rounded-2xl shadow-xl overflow-hidden relative">
            {/* Top accent bar with gradient */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#eb5fa6] to-[#7d92ff]"></div>
            <CardContent className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative group">
                <Avatar className="h-32 w-32 rounded-2xl border-4 border-[#141822] shadow-lg overflow-hidden transition-transform group-hover:scale-105 duration-300">
                  <AvatarImage src={profile?.profileImageUrl} alt={profile?.companyName} className="object-cover" />
                  <AvatarFallback className="bg-[#141822] text-[#eb5fa6] text-3xl font-black">
                    {profile?.companyName?.charAt(0) || 'E'}
                  </AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <label className="absolute -bottom-2 -right-2 bg-[#eb5fa6] text-[#161016] p-2 rounded-xl cursor-pointer shadow-lg hover:bg-[#d44d93] transition-colors border-2 border-[#181c25] group-hover:scale-110 duration-200">
                    <Camera className="h-4 w-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></div>
                      Onaylı İşveren
                    </Badge>
                    <Badge variant="outline" className="font-medium rounded-full border-[rgba(245,246,248,0.18)] text-[rgba(245,246,248,0.8)]">
                      {employerJobs.length} Aktif İlan
                    </Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#f5f6f8]">
                    {profile?.companyName}
                  </h1>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center text-[rgba(245,246,248,0.7)] font-medium">
                    <Mail className="h-4 w-4 mr-2 text-[#7d92ff]" />
                    {profile?.email}
                  </div>
                  {profile?.phoneNumber && (
                    <div className="flex items-center text-[rgba(245,246,248,0.7)] font-medium">
                      <Phone className="h-4 w-4 mr-2 text-[#7d92ff]" />
                      {profile.phoneNumber}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  {profile?.webAddress && (
                    <Button variant="outline" size="sm" className="rounded-full bg-[#141822] border-[rgba(245,246,248,0.18)] text-[#f5f6f8] hover:bg-[#181c25] h-10 px-4" asChild>
                      <a href={profile.webAddress.startsWith('http') ? profile.webAddress : `https://${profile.webAddress}`} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2 text-[#7d92ff]" />
                        Website
                        <ExternalLink className="h-3 w-3 ml-1.5 opacity-50" />
                      </a>
                    </Button>
                  )}
                  {isOwnProfile && (
                    <Button className="rounded-full h-10 px-6 font-bold bg-[#eb5fa6] text-[#161016] hover:bg-[#d44d93]" asChild>
                      <Link to="/profile/edit">
                        <Edit className="h-4 w-4 mr-2" />
                        Hesabı Düzenle
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col items-center md:items-end gap-3">
                <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-[#141822] text-[#7d92ff] border border-[#7d92ff]/20 font-bold text-sm">
                  İşveren ID: #{profile?.id}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* İletişim Bilgileri */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border border-[rgba(245,246,248,0.08)] bg-[#181c25] rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center text-[#f5f6f8]">
                    <Building2 className="h-5 w-5 mr-2 text-[#eb5fa6]" />
                    Şirket İletişim
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2.5 rounded-xl bg-[#eb5fa6]/10 text-[#eb5fa6]">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[rgba(245,246,248,0.5)]">Web Adresi</p>
                      <a 
                        href={profile?.webAddress?.startsWith('http') ? profile.webAddress : `https://${profile?.webAddress}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-[#7d92ff] hover:underline truncate block"
                      >
                        {profile?.webAddress}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2.5 rounded-xl bg-[#7d92ff]/10 text-[#7d92ff]">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[rgba(245,246,248,0.5)]">E-posta</p>
                      <span className="font-medium truncate block text-[#f5f6f8]">{profile?.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2.5 rounded-xl bg-[#eb5fa6]/10 text-[#eb5fa6]">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[rgba(245,246,248,0.5)]">Telefon</p>
                      <span className="font-medium text-[#f5f6f8]">{profile?.phoneNumber || 'Belirtilmemiş'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* İstatistikler */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border border-[rgba(245,246,248,0.08)] bg-[#181c25] rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center text-[#f5f6f8]">
                    <TrendingUp className="h-5 w-5 mr-2 text-[#7d92ff]" />
                    İstatistikler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-[#141822] p-4 rounded-xl border border-[rgba(245,246,248,0.08)] flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#eb5fa6]/10 text-[#eb5fa6]">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-[#eb5fa6]">{employerJobs.length}</p>
                      <p className="text-xs text-[rgba(245,246,248,0.5)] font-bold uppercase tracking-wider">Aktif İlan</p>
                    </div>
                  </div>
                  <div className="bg-[#141822] p-4 rounded-xl border border-[rgba(245,246,248,0.08)] flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#7d92ff]/10 text-[#7d92ff]">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-[#7d92ff]">
                        {employerJobs.length}
                      </p>
                      <p className="text-xs text-[rgba(245,246,248,0.5)] font-bold uppercase tracking-wider">Toplam İlan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* İlan Ver Butonu (Kendi profili ise) */}
            {isOwnProfile && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border border-[rgba(245,246,248,0.08)] bg-gradient-to-br from-[#eb5fa6]/20 to-[#7d92ff]/10 rounded-2xl shadow-lg text-[#f5f6f8] overflow-hidden">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[#eb5fa6]/20 flex items-center justify-center mx-auto text-[#eb5fa6]">
                      <FileText className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#f5f6f8]">Yeni Pozisyon Açın</h3>
                      <p className="text-sm text-[rgba(245,246,248,0.7)] mt-1">En iyi yetenekleri şirketinize çekin</p>
                    </div>
                    <Button className="w-full bg-[#eb5fa6] text-[#161016] hover:bg-[#d44d93] font-bold h-12 rounded-full shadow-lg" asChild>
                      <Link to="/jobs/post">
                        Yeni İlan Ver
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {isOwnProfile && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Card className="border border-[rgba(245,246,248,0.08)] bg-[#181c25] rounded-2xl shadow-lg text-[#f5f6f8] overflow-hidden mt-6">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-400">
                      <Inbox className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#f5f6f8]">Gelen Başvurular</h3>
                      <p className="text-sm text-[rgba(245,246,248,0.7)] mt-1">Adayları değerlendirin ve yönetin</p>
                    </div>
                    <Button className="w-full bg-transparent border border-[rgba(245,246,248,0.18)] text-[#f5f6f8] hover:bg-[rgba(245,246,248,0.08)] font-bold h-12 rounded-full" asChild>
                      <Link to="/jobs/applications">
                        Başvuruları Görüntüle
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Main Content - Aktif İş İlanları */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="border border-[rgba(245,246,248,0.08)] bg-[#181c25] rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-black flex items-center text-[#f5f6f8]">
                    <Briefcase className="h-6 w-6 mr-3 text-[#eb5fa6]" />
                    Aktif İş İlanları
                    {employerJobs.length > 0 && (
                      <Badge variant="secondary" className="ml-3 font-bold rounded-full bg-[#141822] text-[#7d92ff]">
                        {employerJobs.length}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {jobsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-5 rounded-xl border border-[rgba(245,246,248,0.08)] bg-[#141822] space-y-3">
                          <Skeleton className="h-6 w-2/3 bg-[#222838]" />
                          <Skeleton className="h-4 w-1/3 bg-[#222838]" />
                          <Skeleton className="h-4 w-1/2 bg-[#222838]" />
                        </div>
                      ))}
                    </div>
                  ) : employerJobs.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <div className="w-20 h-20 bg-[#141822] rounded-full flex items-center justify-center mx-auto">
                        <Briefcase className="h-10 w-10 text-[rgba(245,246,248,0.3)]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#f5f6f8]">Henüz aktif ilan yok</h3>
                        <p className="text-[rgba(245,246,248,0.6)] mt-1">
                          {isOwnProfile 
                            ? 'İlk iş ilanınızı oluşturarak yetenekli adaylarla buluşun.' 
                            : 'Bu şirketin şu an aktif iş ilanı bulunmuyor.'
                          }
                        </p>
                      </div>
                      {isOwnProfile && (
                        <Button className="font-bold px-8 mt-2 rounded-full bg-[#eb5fa6] text-[#161016] hover:bg-[#d44d93]" asChild>
                          <Link to="/jobs/post">İlk İlanı Oluştur</Link>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {employerJobs.map((job, index) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * index }}
                          onClick={() => navigate(`/jobs/${job.id}`)}
                          className="group p-5 rounded-xl border border-[rgba(245,246,248,0.08)] bg-[#141822] hover:border-[#eb5fa6]/40 transition-all duration-300 cursor-pointer relative overflow-hidden"
                        >
                          <div className="absolute left-0 top-0 h-full w-1 bg-[#eb5fa6] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <h4 className="text-lg font-bold text-[#f5f6f8] group-hover:text-[#eb5fa6] transition-colors">
                                  {job.jobTitle.title}
                                </h4>
                                <Badge variant="outline" className="text-xs font-bold bg-[#181c25] rounded-full border-[rgba(245,246,248,0.12)] text-[rgba(245,246,248,0.8)]">
                                  {job.typeOfWork?.name || 'Tam Zamanlı'}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-[rgba(245,246,248,0.6)]">
                                <span className="flex items-center">
                                  <MapPin className="h-3.5 w-3.5 mr-1 text-[#7d92ff]" />
                                  {job.city.name}
                                </span>
                                <span className="flex items-center">
                                  <Users className="h-3.5 w-3.5 mr-1 text-[#7d92ff]" />
                                  {job.typeOfWork?.name || 'Tam Zamanlı'}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1 text-[#7d92ff]" />
                                  {job.applicationDeadline 
                                    ? `Son: ${new Date(job.applicationDeadline).toLocaleDateString('tr-TR')}` 
                                    : 'Süresiz'
                                  }
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center text-[#eb5fa6] font-bold text-sm group-hover:translate-x-1 transition-transform shrink-0">
                              Detay
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
