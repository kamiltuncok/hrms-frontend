import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useProfile } from '../hooks/useProfile';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Github, 
  Linkedin, 
  Plus, 
  Trash2, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages,
  Loader2,
  Save,
  Undo2
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const summarySchema = z.object({
  summary: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
});

const socialSchema = z.object({
  githubAccount: z.string().url("Geçerli bir URL olmalıdır").optional().or(z.literal('')),
  linkedinAccount: z.string().url("Geçerli bir URL olmalıdır").optional().or(z.literal('')),
});

const jobSeekerAccountSchema = z.object({
  firstName: z.string().min(2, "İsim zorunludur"),
  lastName: z.string().min(2, "Soyisim zorunludur"),
  birthDate: z.string().min(1, "Doğum tarihi zorunludur"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phoneNumber: z.string().optional().or(z.literal('')),
});

const experienceSchema = z.object({
  workplaceName: z.string().min(2, "Şirket adı zorunludur"),
  positionName: z.string().min(2, "Pozisyon adı zorunludur"),
  startDate: z.string().min(1, "Başlangıç tarihi zorunludur"),
  leaveDate: z.string().optional().or(z.literal('')),
});

const educationSchema = z.object({
  schoolName: z.string().min(2, "Okul adı zorunludur"),
  departmentName: z.string().min(2, "Bölüm adı zorunludur"),
  educationDegree: z.string().min(1, "Eğitim derecesi zorunludur"),
  startDate: z.string().min(1, "Başlangıç tarihi zorunludur"),
  graduateDate: z.string().optional().or(z.literal('')),
});

const skillSchema = z.object({
  skillName: z.string().min(1, "Yetenek adı zorunludur"),
});

const languageSchema = z.object({
  languageName: z.string().min(1, "Dil adı zorunludur"),
  level: z.string().min(1, "Seviye seçiniz"),
});

export function EditProfileJobseeker() {
  const user = useAuthStore(state => state.user);
  const { 
    profile, 
    isLoading, 
    updateResume,
    addExperience,
    deleteExperience,
    addEducation,
    deleteEducation,
    addSkill,
    deleteSkill,
    addLanguage,
    deleteLanguage,
    updateJobSeeker
  } = useProfile(user?.id);

  const summaryForm = useForm({
    resolver: zodResolver(summarySchema),
    values: {
      summary: profile?.summary || '',
    }
  });

  const socialForm = useForm({
    resolver: zodResolver(socialSchema),
    values: {
      githubAccount: profile?.githubAccount || '',
      linkedinAccount: profile?.linkedinAccount || '',
    }
  });

  const jobSeekerAccountForm = useForm({
    resolver: zodResolver(jobSeekerAccountSchema),
    values: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      birthDate: profile?.birthDate || '',
      email: profile?.email || '',
      phoneNumber: profile?.phoneNumber || '',
    }
  });

  const experienceForm = useForm({ resolver: zodResolver(experienceSchema) });
  const educationForm = useForm({ resolver: zodResolver(educationSchema) });
  const skillForm = useForm({ resolver: zodResolver(skillSchema) });
  const languageForm = useForm({ resolver: zodResolver(languageSchema) });

  const onSummarySubmit = (data: z.infer<typeof summarySchema>) => {
    updateResume.mutate({ ...profile, ...data }, {
      onSuccess: () => toast.success('Özet başarıyla güncellendi'),
      onError: (err: any) => toast.error(`Güncellenemedi: ${err.response?.data || err.message}`)
    });
  };

  const onSocialSubmit = (data: z.infer<typeof socialSchema>) => {
    updateResume.mutate({ ...profile, ...data }, {
      onSuccess: () => toast.success('Sosyal hesaplar güncellendi'),
      onError: (err: any) => toast.error(`Güncellenemedi: ${err.response?.data || err.message}`)
    });
  };

  const onExperienceSubmit = (data: z.infer<typeof experienceSchema>) => {
    addExperience.mutate(data, {
      onSuccess: () => {
        toast.success('İş deneyimi eklendi');
        experienceForm.reset();
      },
      onError: (err: any) => {
        console.error("Experience add error:", err);
        toast.error(`Deneyim eklenemedi: ${err.response?.data || err.message}`);
      }
    });
  };

  const onEducationSubmit = (data: z.infer<typeof educationSchema>) => {
    addEducation.mutate(data, {
      onSuccess: () => {
        toast.success('Eğitim bilgisi eklendi');
        educationForm.reset();
      },
      onError: (err: any) => {
        console.error("Education add error:", err);
        toast.error(`Eğitim eklenemedi: ${err.response?.data || err.message}`);
      }
    });
  };

  const onSkillSubmit = (data: z.infer<typeof skillSchema>) => {
    addSkill.mutate(data, {
      onSuccess: () => {
        toast.success('Yetenek eklendi');
        skillForm.reset();
      },
      onError: (err: any) => {
        console.error("Skill add error:", err);
        toast.error(`Yetenek eklenemedi: ${err.response?.data || err.message}`);
      }
    });
  };

  const onLanguageSubmit = (data: z.infer<typeof languageSchema>) => {
    addLanguage.mutate(data, {
      onSuccess: () => {
        toast.success('Dil eklendi');
        languageForm.reset();
      },
      onError: (err: any) => {
        console.error("Language add error:", err);
        toast.error(`Dil eklenemedi: ${err.response?.data || err.message}`);
      }
    });
  };

  const onJobSeekerAccountSubmit = (data: z.infer<typeof jobSeekerAccountSchema>) => {
    updateJobSeeker.mutate(data, {
      onSuccess: () => toast.success('Hesap bilgileri güncellendi'),
      onError: (err: any) => {
        console.error("Job seeker update error:", err);
        toast.error(`Güncelleme başarısız: ${err.response?.data || err.message}`);
      }
    });
  };

  const onJobSeekerAccountError = (errors: any) => {
    console.error("Account validation errors:", errors);
    toast.error("Lütfen hesap bilgilerini kontrol edin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
              Profili Düzenle (Aday)
            </h1>
            <p className="text-muted-foreground mt-1">Profesyonel bilgilerinizi güncel tutarak daha kolay iş bulun.</p>
          </div>
          <Button variant="outline" asChild className="rounded-full">
            <Link to="/profile">
              <Undo2 className="h-4 w-4 mr-2" />
              Profile Dön
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="bg-card border shadow-sm p-1 h-auto flex-wrap gap-1">
            <TabsTrigger value="summary" className="rounded-md px-6 py-2">Profesyonel Özet</TabsTrigger>
            <TabsTrigger value="social" className="rounded-md px-6 py-2">Sosyal Hesaplar</TabsTrigger>
            <TabsTrigger value="account" className="rounded-md px-6 py-2">Hesap Bilgileri</TabsTrigger>
            <TabsTrigger value="experience" className="rounded-md px-6 py-2">İş Deneyimi</TabsTrigger>
            <TabsTrigger value="education" className="rounded-md px-6 py-2">Eğitim</TabsTrigger>
            <TabsTrigger value="skills" className="rounded-md px-6 py-2">Yetenekler & Diller</TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Profesyonel Özet</CardTitle>
                <CardDescription>Kariyer hedeflerinizi ve profesyonel geçmişinizi özetleyin.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...summaryForm}>
                  <form onSubmit={summaryForm.handleSubmit(onSummarySubmit)} className="space-y-6">
                    <FormField
                      control={summaryForm.control}
                      name="summary"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Kariyer hedeflerinizden bahsedin..." 
                              className="min-h-[200px] resize-none text-lg"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={updateResume.isPending} className="w-full md:w-auto px-8 font-bold">
                      {updateResume.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="h-4 w-4 mr-2" />
                      Özeti Kaydet
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Accounts Tab */}
          <TabsContent value="social">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Sosyal Hesaplar</CardTitle>
                <CardDescription>Profesyonel ağlarınızı ve portfolyo bağlantılarınızı ekleyin.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...socialForm}>
                  <form onSubmit={socialForm.handleSubmit(onSocialSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={socialForm.control}
                        name="githubAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Github className="h-4 w-4 mr-2" />
                              GitHub URL
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://github.com/username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={socialForm.control}
                        name="linkedinAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Linkedin className="h-4 w-4 mr-2" />
                              LinkedIn URL
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/in/username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" disabled={updateResume.isPending} className="w-full md:w-auto px-8 font-bold">
                      {updateResume.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="h-4 w-4 mr-2" />
                      Sosyal Hesapları Kaydet
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Info Tab */}
          <TabsContent value="account">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Hesap Bilgileri</CardTitle>
                <CardDescription>Kişisel bilgilerinizi ve iletişim detaylarınızı güncelleyin.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">

                <Form {...jobSeekerAccountForm}>
                  <form onSubmit={jobSeekerAccountForm.handleSubmit(onJobSeekerAccountSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={jobSeekerAccountForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>İsim</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={jobSeekerAccountForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Soyisim</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={jobSeekerAccountForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-posta Adresi</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={jobSeekerAccountForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefon Numarası</FormLabel>
                            <FormControl>
                              <Input placeholder="05xx xxx xx xx" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={jobSeekerAccountForm.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Doğum Tarihi</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" disabled={updateJobSeeker.isPending} className="font-bold">
                      {updateJobSeeker.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="h-4 w-4 mr-2" />
                      Hesap Bilgilerini Güncelle
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience */}
          <TabsContent value="experience" className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>İş Deneyimi Ekle</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...experienceForm}>
                  <form onSubmit={experienceForm.handleSubmit(onExperienceSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={experienceForm.control}
                        name="workplaceName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Şirket Adı</FormLabel>
                            <FormControl>
                              <Input placeholder="örn. Google" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={experienceForm.control}
                        name="positionName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pozisyon Adı (Unvan)</FormLabel>
                            <FormControl>
                              <Input placeholder="örn. Senior Frontend Developer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={experienceForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Başlangıç Tarihi</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={experienceForm.control}
                        name="leaveDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bitiş Tarihi (İsteğe Bağlı)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" disabled={addExperience.isPending} className="font-bold">
                       <Plus className="h-4 w-4 mr-2" />
                       Deneyim Ekle
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                Mevcut Deneyimler
              </h3>
              <AnimatePresence>
                {profile?.jobExperiences?.map((exp: any) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card className="border-none shadow-md overflow-hidden group">
                      <CardContent className="p-6 flex justify-between items-center">
                        <div className="space-y-1">
                          <h4 className="font-bold text-lg">{exp.positionName}</h4>
                          <p className="text-primary font-semibold">{exp.workplaceName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(exp.startDate).toLocaleDateString()} - {exp.leaveDate ? new Date(exp.leaveDate).toLocaleDateString() : 'Devam Ediyor'}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteExperience.mutate(exp.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* Education */}
          <TabsContent value="education" className="space-y-6">
          <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Eğitim Ekle</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...educationForm}>
                  <form onSubmit={educationForm.handleSubmit(onEducationSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={educationForm.control}
                        name="schoolName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Üniversite/Okul</FormLabel>
                            <FormControl>
                              <Input placeholder="örn. İstanbul Teknik Üniversitesi" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={educationForm.control}
                        name="departmentName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bölüm</FormLabel>
                            <FormControl>
                              <Input placeholder="örn. Bilgisayar Mühendisliği" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={educationForm.control}
                        name="educationDegree"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Eğitim Derecesi</FormLabel>
                            <FormControl>
                                <select 
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  {...field}
                                >
                                  <option value="">Seçiniz</option>
                                  <option value="HIGH_SCHOOL">Lise</option>
                                  <option value="BACHELOR">Lisans</option>
                                  <option value="MASTER">Yüksek Lisans</option>
                                  <option value="PHD">Doktora</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={educationForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Başlangıç Tarihi</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={educationForm.control}
                        name="graduateDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mezuniyet Tarihi (İsteğe Bağlı)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" disabled={addEducation.isPending} className="font-bold">
                       <Plus className="h-4 w-4 mr-2" />
                       Eğitim Ekle
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                Eğitim Geçmişi
              </h3>
              <AnimatePresence>
                {profile?.schools?.map((school: any) => (
                  <motion.div
                    key={school.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card className="border-none shadow-md overflow-hidden group">
                      <CardContent className="p-6 flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg">{school.schoolName}</h4>
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full border">{school.educationDegree}</span>
                          </div>
                          <p className="text-primary font-semibold">{school.departmentName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(school.startDate).toLocaleDateString()} - {school.graduateDate ? new Date(school.graduateDate).toLocaleDateString() : 'Devam Ediyor'}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteEducation.mutate(school.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* Skills & Languages */}
          <TabsContent value="skills">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Skills Section */}
                <div className="space-y-6">
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="h-5 w-5 mr-2 text-primary" />
                        Teknik Yetenekler
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Form {...skillForm}>
                        <form onSubmit={skillForm.handleSubmit(onSkillSubmit)} className="flex gap-2">
                           <FormField
                              control={skillForm.control}
                              name="skillName"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input placeholder="e.g. React" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" size="icon" disabled={addSkill.isPending}>
                               <Plus className="h-4 w-4" />
                            </Button>
                        </form>
                      </Form>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {profile?.skills?.map((skill: any) => (
                          <div 
                            key={skill.id} 
                            className="flex items-center bg-muted/50 rounded-full px-3 py-1 text-sm font-medium border group"
                          >
                            {skill.skillName}
                            <button 
                              onClick={() => deleteSkill.mutate(skill.id)}
                              className="ml-2 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Languages Section */}
                <div className="space-y-6">
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Languages className="h-5 w-5 mr-2 text-primary" />
                        Dil Yeterliliği
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <Form {...languageForm}>
                          <form onSubmit={languageForm.handleSubmit(onLanguageSubmit)} className="space-y-4">
                            <div className="flex gap-2">
                              <FormField
                                control={languageForm.control}
                                name="languageName"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input placeholder="örn. İngilizce" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={languageForm.control}
                                name="level"
                                render={({ field }) => (
                                  <FormItem className="w-32">
                                    <FormControl>
                                      <select 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        {...field}
                                      >
                                        <option value="">Seviye</option>
                                        <option value="A1">A1</option>
                                        <option value="A2">A2</option>
                                        <option value="B1">B1</option>
                                        <option value="B2">B2</option>
                                        <option value="C1">C1</option>
                                        <option value="C2">C2</option>
                                        <option value="Native">Anadil</option>
                                      </select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button type="submit" size="icon" disabled={addLanguage.isPending}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Dil seviyenizi seçiniz (A1-C2 / Anadil)</p>
                          </form>
                       </Form>

                       <div className="space-y-3 pt-2">
                          {profile?.languages?.map((lang: any) => (
                            <div key={lang.id} className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border group">
                               <div>
                                 <span className="font-bold">{lang.languageName}</span>
                                 <span className="ml-2 text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full border">{lang.level}</span>
                               </div>
                               <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deleteLanguage.mutate(lang.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                       </div>
                    </CardContent>
                  </Card>
                </div>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
