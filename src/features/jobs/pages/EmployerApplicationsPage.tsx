import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobApplicationService } from '../services/jobApplicationService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Users,
  Briefcase,
  Mail,
  Calendar,
  Search,
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';

export function EmployerApplicationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { data: applications = [], isLoading, isError } = useQuery({
    queryKey: ['applications', 'employer', user?.id],
    queryFn: () => jobApplicationService.getApplicationsByEmployerId(user!.id),
    enabled: !!user?.id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: 'ACCEPTED' | 'REJECTED' }) => 
      jobApplicationService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications', 'employer', user?.id] });
      toast.success(variables.status === 'ACCEPTED' ? 'Başvuru kabul edildi' : 'Başvuru reddedildi');
    },
    onError: () => {
      toast.error('İşlem sırasında bir hata oluştu');
    }
  });

  const filteredApplications = useMemo(() => {
    let result = applications;

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(app =>
        app.jobSeekerFirstName?.toLowerCase().includes(lowerQuery) ||
        app.jobSeekerLastName?.toLowerCase().includes(lowerQuery) ||
        app.jobSeekerEmail?.toLowerCase().includes(lowerQuery) ||
        app.jobTitle?.toLowerCase().includes(lowerQuery)
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(app => app.status === statusFilter);
    }

    return result;
  }, [applications, searchQuery, statusFilter]);

  // Group applications by job
  const groupedByJob = useMemo(() => {
    const grouped: Record<number, typeof filteredApplications> = {};
    filteredApplications.forEach(app => {
      if (!grouped[app.jobAdvertisementId]) {
        grouped[app.jobAdvertisementId] = [];
      }
      grouped[app.jobAdvertisementId].push(app);
    });
    return grouped;
  }, [filteredApplications]);

  const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode; color: string }> = {
    PENDING: { label: 'Beklemede', variant: 'secondary', icon: <Clock className="h-3.5 w-3.5" />, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    ACCEPTED: { label: 'Kabul Edildi', variant: 'default', icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    REJECTED: { label: 'Reddedildi', variant: 'destructive', icon: <XCircle className="h-3.5 w-3.5" />, color: 'text-red-600 bg-red-50 border-red-200' },
  };

  const statusCounts = useMemo(() => {
    return {
      ALL: applications.length,
      PENDING: applications.filter(a => a.status === 'PENDING').length,
      ACCEPTED: applications.filter(a => a.status === 'ACCEPTED').length,
      REJECTED: applications.filter(a => a.status === 'REJECTED').length,
    };
  }, [applications]);

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium text-lg">Başvurular yüklenemedi.</p>
          <Button onClick={() => window.location.reload()}>Tekrar Dene</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="group font-semibold text-muted-foreground hover:text-foreground pl-0 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Geri Dön
          </Button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight flex items-center">
                <FileText className="h-9 w-9 mr-3 text-primary" />
                Gelen Başvurular
              </h1>
              <p className="text-muted-foreground text-lg">
                İlanlarınıza yapılan tüm başvuruları takip edin.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3">
              <div className="bg-card rounded-xl px-5 py-3 shadow-sm border text-center">
                <p className="text-2xl font-black text-primary">{applications.length}</p>
                <p className="text-xs text-muted-foreground font-bold uppercase">Toplam</p>
              </div>
              <div className="bg-amber-50 rounded-xl px-5 py-3 shadow-sm border border-amber-200 text-center">
                <p className="text-2xl font-black text-amber-600">{statusCounts.PENDING}</p>
                <p className="text-xs text-amber-600 font-bold uppercase">Bekleyen</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="border-none shadow-md ring-1 ring-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Aday adı, e-posta veya pozisyon ara..."
                  className="pl-10 h-11 bg-background/50 border-border/50 focus-visible:ring-primary/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {(['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    className="font-bold h-11 px-4"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status === 'ALL' ? 'Tümü' : statusConfig[status].label}
                    <Badge variant="secondary" className="ml-2 text-xs bg-background/20">
                      {statusCounts[status]}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-none shadow-md">
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-1/3" />
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-16 text-center border-2 border-dashed border-muted-foreground/20 shadow-sm"
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {applications.length === 0 ? 'Henüz başvuru yok' : 'Eşleşen başvuru bulunamadı'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {applications.length === 0
                ? 'İlanlarınıza başvuru geldiğinde burada listelenecektir.'
                : 'Farklı bir arama terimi veya filtre deneyin.'
              }
            </p>
            {applications.length === 0 && (
              <Button asChild className="font-bold px-8">
                <Link to="/jobs/post">Yeni İlan Ver</Link>
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {Object.entries(groupedByJob).map(([jobId, jobApplications], groupIndex) => (
                <motion.div
                  key={jobId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: groupIndex * 0.05 }}
                >
                  <Card className="border-none shadow-lg ring-1 ring-border/50 overflow-hidden">
                    {/* Job Header */}
                    <CardHeader className="bg-muted/30 border-b pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold flex items-center">
                          <Briefcase className="h-5 w-5 mr-2 text-primary" />
                          {jobApplications[0]?.jobTitle || 'Pozisyon'}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-bold">
                            <Users className="h-3.5 w-3.5 mr-1" />
                            {jobApplications.length} Başvuru
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="font-medium text-primary"
                            onClick={() => navigate(`/jobs/${jobId}`)}
                          >
                            İlanı Gör
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Applications List */}
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {jobApplications.map((app, index) => {
                          const config = statusConfig[app.status] || statusConfig.PENDING;
                          return (
                            <motion.div
                              key={app.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.03 }}
                              className="p-5 hover:bg-muted/20 transition-colors"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                {/* Avatar & Info */}
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                  <Avatar className="h-12 w-12 rounded-xl border-2 border-primary/10 shrink-0">
                                    <AvatarFallback className="bg-primary/5 text-primary font-bold text-lg rounded-xl">
                                      {app.jobSeekerFirstName?.charAt(0) || 'A'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0">
                                    <h4 className="font-bold text-base truncate">
                                      {app.jobSeekerFirstName} {app.jobSeekerLastName}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-0.5">
                                      <span className="flex items-center">
                                        <Mail className="h-3.5 w-3.5 mr-1 opacity-60" />
                                        {app.jobSeekerEmail}
                                      </span>
                                      <span className="flex items-center">
                                        <Calendar className="h-3.5 w-3.5 mr-1 opacity-60" />
                                        {new Date(app.applicationDate).toLocaleDateString('tr-TR')}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex items-center gap-3 sm:shrink-0">
                                  <Badge className={`${config.color} border font-bold px-3 py-1 gap-1.5`}>
                                    {config.icon}
                                    {config.label}
                                  </Badge>

                                  {app.status === 'PENDING' && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 font-bold"
                                        onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'ACCEPTED' })}
                                        disabled={updateStatusMutation.isPending}
                                      >
                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                        Kabul Et
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 border-red-200 hover:bg-red-50 font-bold"
                                        onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'REJECTED' })}
                                        disabled={updateStatusMutation.isPending}
                                      >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Reddet
                                      </Button>
                                    </>
                                  )}

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-primary font-bold"
                                    onClick={() => navigate(`/profile/${app.jobSeekerId}`)}
                                  >
                                    <User className="h-4 w-4 mr-1" />
                                    Profil
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
