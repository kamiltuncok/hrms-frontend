import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Calendar, ArrowRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JobApplicationResponse } from '../types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/shared/utils';

interface AppliedJobCardProps {
  application: JobApplicationResponse;
  index?: number;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return { label: 'Kabul Edildi', color: 'bg-emerald-500', icon: CheckCircle2 };
    case 'REJECTED':
      return { label: 'Reddedildi', color: 'bg-rose-500', icon: XCircle };
    case 'PENDING':
    default:
      return { label: 'Değerlendiriliyor', color: 'bg-amber-500', icon: Clock };
  }
};

export function AppliedJobCard({ application, index = 0 }: AppliedJobCardProps) {
  const appliedDate = application.applicationDate
    ? format(new Date(application.applicationDate), 'dd MMM yyyy', { locale: tr })
    : 'Belirtilmedi';

  const statusConfig = getStatusConfig(application.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-3xl p-6 md:p-7 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-100 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        {/* Left Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-primary transition-colors">
              {application.jobTitle}
            </h3>
            <Badge variant="outline" className={cn("text-white border-0 py-0.5 px-2.5 font-bold gap-1", statusConfig.color)}>
              <StatusIcon className="w-3.5 h-3.5" />
              {statusConfig.label}
            </Badge>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3">
            <span className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
              <Building2 className="w-4 h-4 text-primary/60" />
              {application.companyName}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
              <Calendar className="w-4 h-4 text-primary/60" />
              Başvuru: {appliedDate}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          <Button
            variant="outline"
            className="w-full md:w-auto font-extrabold rounded-2xl border-slate-200 text-slate-700 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
            asChild
          >
            <Link to={`/jobs/${application.jobAdvertisementId}`} className="flex items-center gap-2">
              İlanı Gör <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

      </div>
    </motion.article>
  );
}
