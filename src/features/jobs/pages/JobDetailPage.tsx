import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useJobDetail, useApplyToJob, useUserApplications } from '../hooks/useJobs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  MapPin,
  Calendar,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle2,
  Clock,
  Info,
  Briefcase,
  Globe,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { JobCardSkeleton } from '@/components/skeletons';
import { ErrorState } from '@/components/common/ErrorState';
import { cn } from '@/shared/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <span className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        <Icon className="h-4 w-4 text-primary/60" />
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user, isJobSeeker: checkIsJobSeeker } = useAuthStore();
  const { data: job, isLoading, isError, error } = useJobDetail(Number(id));
  const { data: applications } = useUserApplications(user?.id);
  const { mutate: apply, isPending: isApplying } = useApplyToJob();
  const [saved, setSaved] = useState(false);

  const isJobSeeker = checkIsJobSeeker();
  const hasApplied = applications?.some(
    (app) => app.jobAdvertisementId === Number(id),
  );

  if (isLoading)
    return (
      <div className="container mx-auto max-w-5xl py-24 px-4">
        <JobCardSkeleton />
      </div>
    );
  if (isError)
    return (
      <div className="container mx-auto max-w-5xl py-24 px-4">
        <ErrorState message={error?.message} />
      </div>
    );
  if (!job) return null;

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isJobSeeker) return;
    apply({ jobId: job.id, seekerId: user!.id });
  };

  const postedDate = format(new Date(job.createdDate), 'dd MMM yyyy', {
    locale: tr,
  });
  const deadlineDate = job.applicationDeadline
    ? format(new Date(job.applicationDeadline), 'dd MMM yyyy', { locale: tr })
    : null;

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back navigation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="group pl-0 font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            İlanlara Dön
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Left: Main Content ──────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Job Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Card className="border-border/60 shadow-sm overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                    {/* Company Avatar */}
                    <Avatar className="h-20 w-20 rounded-2xl ring-2 ring-border shrink-0">
                      <AvatarImage
                        src={job.employer.photoUrl}
                        alt={job.employer.companyName}
                      />
                      <AvatarFallback className="rounded-2xl bg-primary/8 text-primary text-2xl font-black">
                        {job.employer.companyName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Header info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.typeOfWork && (
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 font-semibold text-xs">
                            {job.typeOfWork.name}
                          </Badge>
                        )}
                      </div>
                      <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-2">
                        {job.jobTitle.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground font-medium">
                        <Link
                          to="/employers"
                          className="flex items-center gap-1.5 hover:text-primary transition-colors"
                        >
                          <Building2 className="h-4 w-4" />
                          {job.employer.companyName}
                        </Link>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {job.city.name}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {postedDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    İş Tanımı
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-5 pb-6 px-6">
                  <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                    {job.description}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
            >
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Gereksinimler
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-5 pb-6 px-6">
                  <ul className="space-y-2.5">
                    {[
                      'İlgili alanda üniversite mezunu veya dengi eğitim',
                      'Pozisyon gereksinimleri işveren tarafından belirlenecektir',
                      'Detaylı bilgi için işveren ile iletişime geçiniz',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Sorumluluklar
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-5 pb-6 px-6">
                  <ul className="space-y-2.5">
                    {[
                      'Pozisyon sorumluluklarını yerine getirmek',
                      'Takım ile etkin iletişim ve iş birliği sağlamak',
                      'Belirlenmiş hedef ve KPI\'lara ulaşmak',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary/60 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ── Right: Sticky Apply Panel ───────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-24">

            {/* Apply CTA card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="border-0 shadow-xl bg-primary text-primary-foreground overflow-hidden">
                <CardHeader className="pb-3 pt-6 px-6">
                  <CardTitle className="text-lg font-black text-primary-foreground">
                    Başvurmaya hazır mısınız?
                  </CardTitle>
                  <p className="text-sm text-primary-foreground/70 mt-1">
                    Özgeçmişinizi doğrudan işverene iletin.
                  </p>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-3">
                  {/* Apply button */}
                  <Button
                    className={cn(
                      'w-full h-11 font-bold text-sm transition-all',
                      hasApplied
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-white text-primary hover:bg-white/90 shadow-lg shadow-black/10',
                    )}
                    onClick={handleApply}
                    disabled={
                      isApplying ||
                      (isAuthenticated && !isJobSeeker) ||
                      hasApplied
                    }
                  >
                    {isApplying ? (
                      'Gönderiliyor...'
                    ) : hasApplied ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Başvuruldu
                      </span>
                    ) : (
                      'Hemen Başvur'
                    )}
                  </Button>

                  {/* Save button */}
                  <Button
                    variant="outline"
                    className="w-full h-11 font-semibold border-white/20 text-primary-foreground hover:bg-white/10 hover:border-white/30 bg-transparent"
                    onClick={() => setSaved((p) => !p)}
                  >
                    <Bookmark
                      className="mr-2 h-4 w-4"
                      fill={saved ? 'currentColor' : 'none'}
                    />
                    {saved ? 'Kaydedildi' : 'İlanı Kaydet'}
                  </Button>

                  {/* Share */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-primary-foreground/60 hover:text-primary-foreground hover:bg-white/10 text-xs"
                  >
                    <Share2 className="mr-1.5 h-3.5 w-3.5" />
                    İlanı Paylaş
                  </Button>

                  {/* Notices */}
                  {!isAuthenticated && (
                    <p className="text-xs text-center text-primary-foreground/50 italic pt-1">
                      Önce giriş yapmanız istenecek.
                    </p>
                  )}
                  {isAuthenticated && !isJobSeeker && (
                    <div className="flex items-start gap-2 p-3 bg-white/10 rounded-xl text-xs font-medium text-primary-foreground">
                      <Info className="h-4 w-4 shrink-0 mt-0.5" />
                      Başvurular yalnızca İş Arayanlar içindir.
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Job details card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-3 pt-5 px-5">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Önemli Detaylar
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <DetailItem
                    icon={Calendar}
                    label="Yayınlanma"
                    value={postedDate}
                  />
                  <DetailItem
                    icon={Clock}
                    label="Son Başvuru"
                    value={deadlineDate ?? 'Belirtilmedi'}
                  />
                  {job.typeOfWork && (
                    <DetailItem
                      icon={Briefcase}
                      label="Çalışma Şekli"
                      value={job.typeOfWork.name}
                    />
                  )}
                  <DetailItem
                    icon={MapPin}
                    label="Konum"
                    value={job.city.name}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Company mini card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-3 pt-5 px-5">
                  <CardTitle className="text-sm font-bold">Şirket Hakkında</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12 rounded-xl ring-2 ring-border">
                      <AvatarImage
                        src={job.employer.photoUrl}
                        alt={job.employer.companyName}
                      />
                      <AvatarFallback className="rounded-xl bg-primary/8 text-primary font-black">
                        {job.employer.companyName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-sm">{job.employer.companyName}</p>
                      <p className="text-xs text-muted-foreground">{job.city.name}</p>
                    </div>
                  </div>
                  {job.employer.webAddress && (
                    <a
                      href={job.employer.webAddress}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      {job.employer.webAddress}
                    </a>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 text-xs"
                    asChild
                  >
                    <Link to="/employers">Tüm İlanlarını Gör</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
