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
    <div className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Yeni İş İlanı Oluştur</h1>
            <p className="text-muted-foreground text-lg">Binlerce nitelikli adaya dakikalar içinde ulaşın.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card className="border-none shadow-xl ring-1 ring-border/50 overflow-hidden">
                <div className="h-2 bg-primary"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-2xl font-bold">
                    <FileText className="mr-3 h-6 w-6 text-primary" />
                    İlan Detayları
                  </CardTitle>
                  <CardDescription>
                    İşe alım yaptığınız pozisyon hakkında temel bilgileri girin.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 opacity-60" />
                          Kategori
                        </label>
                        <CategorySelect 
                          value={selectedCategory} 
                          onChange={(val) => {
                            setSelectedCategory(val);
                            form.setValue('jobTitleId', '');
                            form.clearErrors('jobTitleId');
                          }} 
                          className="h-11 bg-background/50 border-border/50 transition-all hover:border-primary/50"
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="jobTitleId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold flex items-center text-sm text-muted-foreground">
                              İş Unvanı
                            </FormLabel>
                            <JobTitleSelect 
                              categoryId={selectedCategory}
                              value={field.value}
                              onChange={field.onChange}
                              className="h-11 bg-background/50 border-border/50 transition-all hover:border-primary/50"
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
                          <FormLabel className="font-bold flex items-center">
                            <MapPin className="h-4 w-4 mr-2 opacity-60" />
                            Konum
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-background/50 border-border/50 transition-all hover:border-primary/50">
                                <SelectValue placeholder="Şehir seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                          <FormLabel className="font-bold flex items-center">
                            <Building2 className="h-4 w-4 mr-2 opacity-60" />
                            Çalışma Şekli
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-background/50 border-border/50">
                                <SelectValue placeholder="Opsiyonel: Uzaktan, Ofisten..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                        <FormLabel className="font-bold">Detaylı İş Tanımı</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Adaylara pozisyon, gereksinimler ve yan haklar hakkında bilgi verin..."
                            className="min-h-[200px] bg-background/50 border-border/50 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
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
                        <FormLabel className="font-bold mb-1 flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 opacity-60" />
                          Son Başvuru Tarihi
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="h-11 bg-background/50 border-border/50 w-full md:w-64"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
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
                  className="font-bold"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  className="px-10 h-12 rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
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
