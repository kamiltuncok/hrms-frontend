import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  Inbox
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

export function ProfileEmployer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAuthStore(state => state.user);
  
  const profileId = id ? parseInt(id) : currentUser?.id;
  const isOwnProfile = !id || parseInt(id) === currentUser?.id;
  const isEmployerPath = location.pathname.startsWith('/employers');

  const { 
    profile, 
    isLoading 
  } = useProfile(profileId, true);

  // Fetch all active jobs then filter by this employer
  const { data: allJobs = [], isLoading: jobsLoading } = useActiveJobs();
  
  const employerJobs = useMemo(() => {
    if (!profileId || !allJobs.length) return [];
    return allJobs.filter(job => job.employer?.id === profileId);
  }, [allJobs, profileId]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl space-y-8">
           <Card className="border-none shadow-xl">
             <CardContent className="p-8 flex items-center gap-8">
               <Skeleton className="h-32 w-32 rounded-2xl" />
               <div className="space-y-3 flex-1">
                 <Skeleton className="h-8 w-1/3" />
                 <Skeleton className="h-4 w-1/2" />
                 <Skeleton className="h-4 w-1/4" />
               </div>
             </CardContent>
           </Card>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <Skeleton className="h-64 md:col-span-1" />
             <Skeleton className="h-96 md:col-span-2" />
           </div>
        </div>
      </div>
    );
  }

  if (!profile && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 text-center">
        <div className="space-y-4">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <h2 className="text-2xl font-bold">Şirket bulunamadı</h2>
          <p className="text-muted-foreground">Aradığınız şirket profili mevcut değil veya kaldırılmış.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-none shadow-xl overflow-hidden bg-card/80 backdrop-blur-sm relative">
            {/* Top accent bar with gradient */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60"></div>
            <CardContent className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative group">
                <Avatar className="h-32 w-32 rounded-2xl border-4 border-background shadow-lg overflow-hidden transition-transform group-hover:scale-105 duration-300">
                  <AvatarImage src={profile?.photoUrl} alt={profile?.companyName} className="object-cover" />
                  <AvatarFallback className="bg-primary/5 text-primary text-3xl font-black">
                    {profile?.companyName?.charAt(0) || 'E'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 font-bold border-emerald-500/20">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                      Onaylı İşveren
                    </Badge>
                    <Badge variant="outline" className="font-medium">
                      {employerJobs.length} Aktif İlan
                    </Badge>
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-foreground">
                    {profile?.companyName}
                  </h1>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center text-muted-foreground font-medium">
                    <Mail className="h-4 w-4 mr-2 text-primary" />
                    {profile?.email}
                  </div>
                  {profile?.phoneNumber && (
                    <div className="flex items-center text-muted-foreground font-medium">
                      <Phone className="h-4 w-4 mr-2 text-primary" />
                      {profile.phoneNumber}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  {profile?.webAddress && (
                    <Button variant="outline" size="sm" className="rounded-full bg-background/50 hover:bg-background h-10 px-4" asChild>
                      <a href={profile.webAddress.startsWith('http') ? profile.webAddress : `https://${profile.webAddress}`} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Website
                        <ExternalLink className="h-3 w-3 ml-1.5 opacity-50" />
                      </a>
                    </Button>
                  )}
                  {isOwnProfile && (
                    <Button className="rounded-full h-10 px-6 font-bold shadow-lg shadow-primary/20" asChild>
                      <Link to="/profile/edit">
                        <Edit className="h-4 w-4 mr-2" />
                        Hesabı Düzenle
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col items-center md:items-end gap-3">
                <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-secondary/30 text-secondary-foreground font-bold text-sm">
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
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-primary" />
                    Şirket İletişim
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Web Adresi</p>
                      <a 
                        href={profile?.webAddress?.startsWith('http') ? profile.webAddress : `https://${profile?.webAddress}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline truncate block"
                      >
                        {profile?.webAddress}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">E-posta</p>
                      <span className="font-medium truncate block">{profile?.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Telefon</p>
                      <span className="font-medium">{profile?.phoneNumber || 'Belirtilmemiş'}</span>
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
              <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                    İstatistikler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-background p-4 rounded-xl shadow-sm border border-primary/10 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-primary">{employerJobs.length}</p>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Aktif İlan</p>
                    </div>
                  </div>
                  <div className="bg-background p-4 rounded-xl shadow-sm border border-primary/10 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-primary">
                        {employerJobs.length}
                      </p>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Toplam İlan</p>
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
                <Card className="border-none shadow-lg bg-primary text-primary-foreground overflow-hidden">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                      <FileText className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Yeni Pozisyon Açın</h3>
                      <p className="text-sm text-primary-foreground/70 mt-1">En iyi yetenekleri şirketinize çekin</p>
                    </div>
                    <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold h-12 rounded-xl shadow-lg" asChild>
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
                <Card className="border-none shadow-lg bg-amber-500 text-white overflow-hidden mt-6">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                      <Inbox className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Gelen Başvurular</h3>
                      <p className="text-sm text-white/70 mt-1">Adayları değerlendirin ve yönetin</p>
                    </div>
                    <Button className="w-full bg-white text-amber-600 hover:bg-white/90 font-bold h-12 rounded-xl shadow-lg" asChild>
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
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-black flex items-center">
                    <Briefcase className="h-6 w-6 mr-3 text-primary" />
                    Aktif İş İlanları
                    {employerJobs.length > 0 && (
                      <Badge variant="secondary" className="ml-3 font-bold">
                        {employerJobs.length}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {jobsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-5 rounded-xl border border-border/50 space-y-3">
                          <Skeleton className="h-6 w-2/3" />
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : employerJobs.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Briefcase className="h-10 w-10 text-muted-foreground/40" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Henüz aktif ilan yok</h3>
                        <p className="text-muted-foreground mt-1">
                          {isOwnProfile 
                            ? 'İlk iş ilanınızı oluşturarak yetenekli adaylarla buluşun.' 
                            : 'Bu şirketin şu an aktif iş ilanı bulunmuyor.'
                          }
                        </p>
                      </div>
                      {isOwnProfile && (
                        <Button className="font-bold px-8 mt-2" asChild>
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
                          className="group p-5 rounded-xl border border-border/50 hover:border-primary/40 hover:shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden"
                        >
                          <div className="absolute left-0 top-0 h-full w-1 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <h4 className="text-lg font-bold group-hover:text-primary transition-colors">
                                  {job.jobTitle.title}
                                </h4>
                                <Badge variant="outline" className="text-xs font-bold bg-muted/40">
                                  {job.typeOfWork?.name || 'Tam Zamanlı'}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                                <span className="flex items-center">
                                  <MapPin className="h-3.5 w-3.5 mr-1 text-primary opacity-60" />
                                  {job.city.name}
                                </span>
                                <span className="flex items-center">
                                  <Users className="h-3.5 w-3.5 mr-1 text-primary opacity-60" />
                                  {job.typeOfWork?.name || 'Tam Zamanlı'}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1 text-primary opacity-60" />
                                  {job.applicationDeadline 
                                    ? `Son: ${new Date(job.applicationDeadline).toLocaleDateString('tr-TR')}` 
                                    : 'Süresiz'
                                  }
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center text-primary font-bold text-sm group-hover:translate-x-1 transition-transform shrink-0">
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
