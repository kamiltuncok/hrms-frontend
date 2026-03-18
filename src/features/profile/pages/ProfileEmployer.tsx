import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useProfile } from '../hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  FileText, 
  Briefcase,
  Building2,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

export function ProfileEmployer() {
  const { id } = useParams<{ id: string }>();
  const currentUser = useAuthStore(state => state.user);
  
  // If no ID in URL, show current user's profile
  const profileId = id ? parseInt(id) : currentUser?.id;
  const isOwnProfile = !id || parseInt(id) === currentUser?.id;

  const { 
    profile, 
    isLoading 
  } = useProfile(profileId);

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
            <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
            <CardContent className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative group">
                <Avatar className="h-32 w-32 rounded-2xl border-4 border-background shadow-lg overflow-hidden transition-transform group-hover:scale-105 duration-300">
                  <AvatarImage src={profile?.photoUrl} alt={profile?.description} className="object-cover" />
                  <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black">
                    {profile?.companyName?.charAt(0) || 'E'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
                    {profile?.companyName}
                  </h1>
                  <p className="text-lg text-muted-foreground mt-1 font-medium">
                    Onaylı İşveren
                  </p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Button variant="outline" size="sm" className="rounded-full bg-background/50 hover:bg-background h-10 px-4" asChild>
                    <a href={profile?.webAddress?.startsWith('http') ? profile.webAddress : `https://${profile.webAddress}`} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full bg-background/50 hover:bg-background h-10 px-4">
                    <FileText className="h-4 w-4 mr-2" />
                    {profile?.email}
                  </Button>
                  {isOwnProfile && (
                    <Button className="rounded-full h-10 px-6 font-bold shadow-lg shadow-primary/20" asChild>
                      <Link to="/profile/edit">
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
          <div className="lg:col-span-1 space-y-8">
            {/* Şirket İletişim */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-primary" />
                  Şirket İletişim
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Globe className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{profile?.webAddress}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{profile?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{profile?.phoneNumber || 'Belirtilmemiş'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-lg bg-primary/5">
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase text-primary flex items-center">
                  <Briefcase className="h-6 w-6 mr-3" />
                  Şirket İstatistikleri
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 text-center space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background p-6 rounded-2xl shadow-sm border border-primary/10">
                    <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-2">Aktif İlanlar</p>
                    <p className="text-4xl font-black text-primary">0</p>
                  </div>
                  <div className="bg-background p-6 rounded-2xl shadow-sm border border-primary/10">
                    <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-2">Başvurular</p>
                    <p className="text-4xl font-black text-primary">0</p>
                  </div>
                </div>
                {isOwnProfile && (
                  <Button className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20" asChild>
                    <Link to="/job-posts/new">
                      Yeni İlan Ver
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
