import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useJobDetail, useApplyToJob, useUserApplications } from '../hooks/useJobs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  Share2, 
  Bookmark,
  CheckCircle2,
  Clock,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { JobCardSkeleton } from '@/components/skeletons';
import { ErrorState } from '@/components/common/ErrorState';
import { cn } from '@/shared/utils';

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user, isJobSeeker: checkIsJobSeeker } = useAuthStore();
  const { data: job, isLoading, isError, error } = useJobDetail(Number(id));
  const { data: applications } = useUserApplications(user?.id);
  const { mutate: apply, isPending: isApplying } = useApplyToJob();

  const isJobSeeker = checkIsJobSeeker();
  const hasApplied = applications?.some(app => app.jobAdvertisementId === Number(id));

  if (isLoading) return <div className="container mx-auto py-24"><JobCardSkeleton /></div>;
  if (isError) return <div className="container mx-auto py-24"><ErrorState message={error.message} /></div>;
  if (!job) return null;


  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isJobSeeker) {
      return;
    }
    apply({ jobId: job.id, seekerId: user!.id });
  };

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-6"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="group font-semibold text-muted-foreground hover:text-foreground pl-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            İlanlara Dön
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.4 }}
            >
              <Card className="border-none shadow-xl ring-1 ring-border/50">
                <CardHeader className="pb-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <Avatar className="h-20 w-20 rounded-2xl ring-4 ring-primary/5">
                      <AvatarImage src={job.employer.photoUrl} alt={job.employer.companyName} />
                      <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black">
                        {job.employer.companyName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                       <div className="flex flex-wrap items-center gap-2">
                         <Badge variant="secondary" className="bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors">
                           {job.typeOfWork?.name || 'Tam Zamanlı'}
                         </Badge>
                         <Badge variant="outline" className="font-semibold">
                           {job.typeOfWork?.name || 'Ofisten'}
                         </Badge>
                       </div>
                       <h1 className="text-3xl font-black tracking-tight">{job.jobTitle.title}</h1>
                       <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground font-medium">
                         <Link to={`/employers`} className="flex items-center hover:text-primary transition-colors">
                           <Building2 className="h-4 w-4 mr-2" />
                           {job.employer.companyName}
                         </Link>
                         <div className="flex items-center">
                           <MapPin className="h-4 w-4 mr-2" />
                           {job.city.name}
                         </div>
                         <div className="flex items-center">
                           <Calendar className="h-4 w-4 mr-2" />
                           Yayınlanma: {format(new Date(job.createdDate), 'MMM d, yyyy')}
                         </div>
                       </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 border-t font-medium leading-relaxed text-foreground/80">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-3 text-primary" />
                    İş Tanımı
                  </h3>
                  <div className="whitespace-pre-line text-lg">
                    {job.description}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.4, delay: 0.2 }}
             >
                <Card className="border-none shadow-xl ring-1 ring-border/50 bg-primary text-primary-foreground overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-black">Başvurmaya hazır mısınız?</CardTitle>
                    <p className="text-primary-foreground/80 text-sm">Özgeçmişinizi doğrudan işverene iletin.</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      className={cn(
                        "w-full rounded-full h-12 font-black text-lg transition-all shadow-lg shadow-black/10",
                        hasApplied 
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white cursor-default" 
                          : "bg-white text-primary hover:bg-white/90"
                      )}
                      onClick={handleApply}
                      disabled={isApplying || (isAuthenticated && !isJobSeeker) || hasApplied}
                    >
                      {isApplying ? 'Gönderiliyor...' : hasApplied ? (
                        <span className="flex items-center justify-center">
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Başvuruldu
                        </span>
                      ) : 'Hemen Başvur'}
                    </Button>
                    {!isAuthenticated && (
                      <p className="text-xs text-center text-primary-foreground/60 italic font-medium">
                        Önce giriş yapmanız istenecek.
                      </p>
                    )}
                    {isAuthenticated && !isJobSeeker && (
                      <div className="flex items-start gap-2 p-3 bg-white/10 rounded-xl text-xs font-semibold">
                         <Info className="h-4 w-4 shrink-0" />
                         Başvurular yalnızca İş Arayanlar içindir.
                      </div>
                    )}
                  </CardContent>
                </Card>
             </motion.div>

             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.4, delay: 0.3 }}
             >
                <Card className="border-none shadow-xl ring-1 ring-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-black flex items-center">
                      <Clock className="h-5 w-5 mr-3 text-primary" />
                      Önemli Detaylar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex items-center justify-between text-sm py-2 border-b">
                      <span className="text-muted-foreground font-semibold">Son Başvuru</span>
                      <span className="font-black text-foreground">
                        {job.applicationDeadline ? format(new Date(job.applicationDeadline), 'MMM d, yyyy') : 'Belirtilmedi'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2">
                       <span className="text-muted-foreground font-semibold">Sektör</span>
                       <span className="font-black text-foreground">Teknoloji & Yazılım</span>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" size="icon" className="flex-1 rounded-xl h-12">
                        <Bookmark className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon" className="flex-1 rounded-xl h-12">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
