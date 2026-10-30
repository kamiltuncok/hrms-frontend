import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../hooks/useRegistration';
import { 
  registerJobSeekerSchema, 
  registerEmployerSchema, 
  RegisterJobSeekerValues, 
  RegisterEmployerValues 
} from '../types/schemas';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { HedefIsLogo } from '@/components/common/HedefIsLogo';

export function RegisterPage() {
  const navigate = useNavigate();
  const { registerJobSeeker, registerEmployer } = useRegistration();

  const jobSeekerForm = useForm<RegisterJobSeekerValues>({
    resolver: zodResolver(registerJobSeekerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      identityNumber: '',
      birthYear: new Date().getFullYear() - 18,
    },
  });

  const employerForm = useForm<RegisterEmployerValues>({
    resolver: zodResolver(registerEmployerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      webAddress: '',
      phoneNumber: '',
    },
  });

  const onJobSeekerSubmit = (values: RegisterJobSeekerValues) => {
    registerJobSeeker.mutate(values, {
      onSuccess: () => {
        toast.success('Kayıt başarılı! Lütfen giriş yapın.');
        navigate('/login');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Kayıt başarısız');
      }
    });
  };

  const onEmployerSubmit = (values: RegisterEmployerValues) => {
    registerEmployer.mutate(values, {
      onSuccess: () => {
        toast.success('Kayıt başarılı! Lütfen giriş yapın.');
        navigate('/login');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Kayıt başarısız');
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#101319] p-4 py-12">
      <div className="mb-8 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/')}>
        <HedefIsLogo size={36} showText={true} />
      </div>

      <Card className="w-full max-w-2xl shadow-2xl bg-[#181c25] border border-[rgba(245,246,248,0.08)] rounded-2xl">
        <CardHeader className="space-y-1.5 text-center pt-8 pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-[#f5f6f8]">
            Hesap Oluştur
          </CardTitle>
          <CardDescription className="text-sm text-[rgba(245,246,248,0.65)]">
            Hedef İş kariyer platformuna bugün katılın.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 sm:px-8">
          <Tabs defaultValue="jobseeker" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#141822] p-1 rounded-full border border-[rgba(245,246,248,0.08)]">
              <TabsTrigger
                value="jobseeker"
                className="text-sm font-bold py-2.5 rounded-full transition-all data-[state=active]:bg-[#eb5fa6] data-[state=active]:text-[#161016] text-[rgba(245,246,248,0.7)]"
              >
                İş Arayan
              </TabsTrigger>
              <TabsTrigger
                value="employer"
                className="text-sm font-bold py-2.5 rounded-full transition-all data-[state=active]:bg-[#eb5fa6] data-[state=active]:text-[#161016] text-[rgba(245,246,248,0.7)]"
              >
                İşveren
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobseeker">
              <Form {...jobSeekerForm}>
                <form onSubmit={jobSeekerForm.handleSubmit(onJobSeekerSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={jobSeekerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Ad</FormLabel>
                          <FormControl>
                            <Input placeholder="Ahmet" {...field} className="bg-background/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={jobSeekerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Soyad</FormLabel>
                          <FormControl>
                            <Input placeholder="Yılmaz" {...field} className="bg-background/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={jobSeekerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">E-posta Adresi</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="ornek@email.com" {...field} className="bg-background/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={jobSeekerForm.control}
                      name="identityNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">T.C. Kimlik Numarası</FormLabel>
                          <FormControl>
                            <Input placeholder="11 haneli TCKN" maxLength={11} {...field} className="bg-background/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={jobSeekerForm.control}
                      name="birthYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Doğum Yılı</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value))}
                              className="bg-background/50" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={jobSeekerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Şifre</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} className="bg-background/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={jobSeekerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Şifre Tekrar</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} className="bg-background/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-sm h-11 font-bold bg-[#eb5fa6] text-[#161016] hover:bg-[#f074b4] rounded-full shadow-md hover:shadow-[0_4px_18px_rgba(235,95,166,0.35)] transition-all cursor-pointer"
                    disabled={registerJobSeeker.isPending}
                  >
                    {registerJobSeeker.isPending ? 'İşleniyor...' : 'İş Arayan Olarak Kayıt Ol'}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="employer">
              <Form {...employerForm}>
                <form onSubmit={employerForm.handleSubmit(onEmployerSubmit)} className="space-y-6">
                  <FormField
                    control={employerForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Şirket Adı</FormLabel>
                        <FormControl>
                          <Input placeholder="Şirket A.Ş." {...field} className="bg-background/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={employerForm.control}
                      name="webAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Web Sitesi</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.acme.com" {...field} className="bg-background/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={employerForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Telefon Numarası</FormLabel>
                          <FormControl>
                            <Input placeholder="05XX XXX XX XX" {...field} className="bg-background/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={employerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Kurumsal E-posta</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="ik@sirket.com" {...field} className="bg-background/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={employerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Şifre</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} className="bg-background/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={employerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Şifre Tekrar</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} className="bg-background/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-sm h-11 font-bold bg-[#eb5fa6] text-[#161016] hover:bg-[#f074b4] rounded-full shadow-md hover:shadow-[0_4px_18px_rgba(235,95,166,0.35)] transition-all cursor-pointer"
                    disabled={registerEmployer.isPending}
                  >
                    {registerEmployer.isPending ? 'İşleniyor...' : 'İşveren Olarak Kayıt Ol'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-[rgba(245,246,248,0.08)] py-6 bg-transparent">
          <p className="text-xs text-[rgba(245,246,248,0.6)]">
            Zaten bir hesabınız var mı?{' '}
            <button
              type="button"
              className="font-bold text-[#eb5fa6] hover:underline cursor-pointer ml-1"
              onClick={() => navigate('/login')}
            >
              Giriş Yap
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
