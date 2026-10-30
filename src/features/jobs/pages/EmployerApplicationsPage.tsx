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
      <div className="min-h-screen bg-[#101319] text-[#f5f6f8] flex items-center justify-center pt-28">
        <div className="text-center space-y-4">
          <p className="text-[#eb5fa6] font-medium text-lg">Başvurular yüklenemedi.</p>
          <Button onClick={() => window.location.reload()} className="rounded-full bg-[#eb5fa6] text-[#161016] font-bold">Tekrar Dene</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101319] text-[#f5f6f8] pt-28 pb-12">
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
            className="group font-semibold text-[rgba(245,246,248,0.6)] hover:text-[#f5f6f8] pl-0 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Geri Dön
          </Button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center text-[#f5f6f8]">
                <FileText className="h-9 w-9 mr-3 text-[#eb5fa6]" />
                Gelen Başvurular
              </h1>
              <p className="text-[rgba(245,246,248,0.65)] text-lg">
                İlanlarınıza yapılan tüm başvuruları takip edin.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3">
              <div className="bg-[#181c25] rounded-2xl px-5 py-3 border border-[rgba(245,246,248,0.08)] text-center">
                <p className="text-2xl font-black text-[#eb5fa6]">{applications.length}</p>
                <p className="text-xs text-[rgba(245,246,248,0.6)] font-bold uppercase">Toplam</p>
              </div>
              <div className="bg-[#181c25] rounded-2xl px-5 py-3 border border-amber-500/20 text-center">
                <p className="text-2xl font-black text-amber-400">{statusCounts.PENDING}</p>
                <p className="text-xs text-amber-400 font-bold uppercase">Bekleyen</p>
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
          <Card className="border border-[rgba(245,246,248,0.08)] bg-[#181c25] rounded-2xl">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgba(245,246,248,0.4)] group-focus-within:text-[#eb5fa6] transition-colors" />
                <Input
                  placeholder="Aday adı, e-posta veya pozisyon ara..."
                  className="pl-10 h-11 bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] placeholder:text-[rgba(245,246,248,0.4)] focus-visible:ring-[#7d92ff]"
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
                    className={`font-bold h-11 px-4 rounded-full ${
                      statusFilter === status 
                        ? 'bg-[#eb5fa6] text-[#161016] hover:bg-[#d44d93]' 
                        : 'border-[rgba(245,246,248,0.18)] text-[#f5f6f8] hover:bg-[rgba(245,246,248,0.05)]'
                    }`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status === 'ALL' ? 'Tümü' : statusConfig[status].label}
                    <Badge variant="secondary" className="ml-2 text-xs bg-[rgba(245,246,248,0.1)] rounded-full text-inherit">
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
              <Card key={i} className="border border-[rgba(245,246,248,0.08)] bg-[#181c25] rounded-2xl">
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-1/3 bg-[#222838]" />
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full bg-[#222838]" />
                    <Skeleton className="h-16 w-full bg-[#222838]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#181c25] rounded-2xl p-16 text-center border border-[rgba(245,246,248,0.08)] shadow-sm"
          >
            <div className="w-20 h-20 bg-[#141822] rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-[rgba(245,246,248,0.3)]" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-[#f5f6f8]">
              {applications.length === 0 ? 'Henüz başvuru yok' : 'Eşleşen başvuru bulunamadı'}
            </h3>
            <p className="text-[rgba(245,246,248,0.6)] mb-6">
              {applications.length === 0
                ? 'İlanlarınıza başvuru geldiğinde burada listelenecektir.'
                : 'Farklı bir arama terimi veya filtre deneyin.'
              }
            </p>
            {applications.length === 0 && (
              <Button asChild className="font-bold px-8 rounded-full bg-[#eb5fa6] text-[#161016] hover:bg-[#d44d93]">
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
                  <Card className="border border-[rgba(245,246,248,0.08)] bg-[#181c25] rounded-2xl overflow-hidden shadow-lg">
                    {/* Job Header */}
                    <CardHeader className="bg-[#141822]/70 border-b border-[rgba(245,246,248,0.08)] pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold flex items-center text-[#f5f6f8]">
                          <Briefcase className="h-5 w-5 mr-2 text-[#eb5fa6]" />
                          {jobApplications[0]?.jobTitle || 'Pozisyon'}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-bold rounded-full border-[rgba(245,246,248,0.18)] text-[rgba(245,246,248,0.8)]">
                            <Users className="h-3.5 w-3.5 mr-1" />
                            {jobApplications.length} Başvuru
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="font-medium text-[#7d92ff] hover:text-[#eb5fa6] hover:bg-transparent"
                            onClick={() => navigate(`/jobs/${jobId}`)}
                          >
                            İlanı Gör
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Applications List */}
                    <CardContent className="p-0">
                      <div className="divide-y divide-[rgba(245,246,248,0.06)]">
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
