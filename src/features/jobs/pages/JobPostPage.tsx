import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { jobService } from '../services/jobService';
import { useCities, useWorkModels } from '../hooks/useReferenceData';
import { CategorySelect } from '@/features/categories/components/CategorySelect';
import { JobTitleSelect } from '@/features/jobtitles/components/JobTitleSelect';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Briefcase, MapPin, Building2, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface JobPostValues {
  jobTitleId: string;
  cityId: string;
  typeOfWorkId?: string;
  description: string;
  applicationDeadline?: string;
}

const jobPostSchema = z.object({
  jobTitleId: z.string().min(1, 'İş unvanı zorunludur'),
  cityId: z.string().min(1, 'Şehir zorunludur'),
  typeOfWorkId: z.string().optional(),
  description: z.string().min(20, 'Açıklama en az 20 karakter olmalıdır'),
  applicationDeadline: z.string().optional(),
});

export function JobPostPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: cities = [] } = useCities();
  const { data: workModelData = [] } = useWorkModels();

  const form = useForm<JobPostValues>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      jobTitleId: '',
      cityId: '',
      typeOfWorkId: '',
      description: '',
      applicationDeadline: '',
    },
  });

  const onSubmit: SubmitHandler<JobPostValues> = async (values) => {
    if (!user || user.role.name !== 'ROLE_EMPLOYER') {
      toast.error('Yalnızca işverenler ilan verebilir');
      return;
    }

    try {
      await jobService.addJobAdvertisement({
        employerId: user.id,
        jobTitleId: parseInt(values.jobTitleId),
        cityId: parseInt(values.cityId),
        typeOfWorkId: values.typeOfWorkId ? parseInt(values.typeOfWorkId) : undefined,
        description: values.description,
        applicationDeadline: values.applicationDeadline || undefined,
      });
      toast.success('İş ilanı başarıyla yayınlandı!');
      navigate('/jobs');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'İş ilanı yayınlanamadı';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#101319] text-[#f5f6f8] pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-[#f5f6f8]">Yeni İş İlanı Oluştur</h1>
            <p className="text-[rgba(245,246,248,0.65)] text-lg">Binlerce nitelikli adaya dakikalar içinde ulaşın.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card className="bg-[#181c25] border border-[rgba(245,246,248,0.08)] rounded-2xl shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-[#eb5fa6] to-[#7d92ff]"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-2xl font-bold text-[#f5f6f8]">
                    <FileText className="mr-3 h-6 w-6 text-[#eb5fa6]" />
                    İlan Detayları
                  </CardTitle>
                  <CardDescription className="text-[rgba(245,246,248,0.6)]">
                    İşe alım yaptığınız pozisyon hakkında temel bilgileri girin.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center text-[rgba(245,246,248,0.8)]">
                          <Briefcase className="h-4 w-4 mr-2 text-[#7d92ff]" />
                          Kategori
                        </label>
                        <CategorySelect 
                          value={selectedCategory} 
                          onChange={(val) => {
                            setSelectedCategory(val);
                            form.setValue('jobTitleId', '');
                            form.clearErrors('jobTitleId');
                          }} 
                          className="h-11 bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] transition-all hover:border-[#7d92ff]/50"
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="jobTitleId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold flex items-center text-sm text-[rgba(245,246,248,0.8)]">
                              İş Unvanı
                            </FormLabel>
                            <JobTitleSelect 
                              categoryId={selectedCategory}
                              value={field.value}
                              onChange={field.onChange}
                              className="h-11 bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] transition-all hover:border-[#7d92ff]/50"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="cityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold flex items-center text-[rgba(245,246,248,0.8)]">
                            <MapPin className="h-4 w-4 mr-2 text-[#7d92ff]" />
                            Konum
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] transition-all hover:border-[#7d92ff]/50">
                                <SelectValue placeholder="Şehir seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#181c25] border-[rgba(245,246,248,0.12)] text-[#f5f6f8]">
                              {cities.map((city) => (
                                <SelectItem key={city.id} value={city.id.toString()}>
                                  {city.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="typeOfWorkId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold flex items-center text-[rgba(245,246,248,0.8)]">
                            <Building2 className="h-4 w-4 mr-2 text-[#7d92ff]" />
                            Çalışma Şekli
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8]">
                                <SelectValue placeholder="Opsiyonel: Uzaktan, Ofisten..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#181c25] border-[rgba(245,246,248,0.12)] text-[#f5f6f8]">
                              {workModelData.map((model) => (
                                <SelectItem key={model.id} value={model.id.toString()}>
                                  {model.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-[rgba(245,246,248,0.8)]">Detaylı İş Tanımı</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Adaylara pozisyon, gereksinimler ve yan haklar hakkında bilgi verin..."
                            className="min-h-[200px] bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] placeholder:text-[rgba(245,246,248,0.4)] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-[rgba(245,246,248,0.5)]">
                          Pozisyonu doğru tanımlamak için en az 20 karakter kullanın.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="applicationDeadline"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-bold mb-1 flex items-center text-[rgba(245,246,248,0.8)]">
                          <CalendarIcon className="h-4 w-4 mr-2 text-[#7d92ff]" />
                          Son Başvuru Tarihi
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="h-11 bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] w-full md:w-64"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-[rgba(245,246,248,0.5)]">
                          Belirli bir tarih yoksa boş bırakabilirsiniz.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex items-center justify-end gap-4 pb-10">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="font-bold text-[rgba(245,246,248,0.7)] hover:text-[#f5f6f8] rounded-full"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  className="px-10 h-12 rounded-full font-bold text-lg bg-[#eb5fa6] text-[#161016] hover:bg-[#d44d93] shadow-xl hover:scale-105 active:scale-95 transition-all"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'İlan Yayınlanıyor...' : 'İlanı Yayınla'}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
