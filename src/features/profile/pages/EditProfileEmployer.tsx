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
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2,
  Save,
  Undo2,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const employerAccountSchema = z.object({
  companyName: z.string().min(2, "Şirket adı zorunludur"),
  webAddress: z.string().min(2, "Web adresi zorunludur"),
  phoneNumber: z.string().min(10, "Telefon numarası zorunludur"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
});

export function EditProfileEmployer() {
  const user = useAuthStore(state => state.user);
  const { 
    profile, 
    isLoading, 
    updateEmployer
  } = useProfile(user?.id);

  const employerAccountForm = useForm({
    resolver: zodResolver(employerAccountSchema),
    values: {
      companyName: profile?.companyName || '',
      webAddress: profile?.webAddress || '',
      phoneNumber: profile?.phoneNumber || '',
      email: profile?.email || '',
    }
  });

  const onEmployerAccountSubmit = (data: z.infer<typeof employerAccountSchema>) => {
    updateEmployer.mutate(data, {
      onSuccess: () => toast.success('Şirket bilgileri güncellendi'),
      onError: () => toast.error('Güncelleme başarısız')
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101319] text-[#f5f6f8] pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#f5f6f8] uppercase flex items-center">
              <Building2 className="mr-3 h-8 w-8 text-[#eb5fa6]" />
              Şirket Profilini Düzenle
            </h1>
            <p className="text-[rgba(245,246,248,0.65)] mt-1">İş arayanlara şirketiniz hakkında doğru bilgiler sunun.</p>
          </div>
          <Button variant="outline" asChild className="rounded-full border-[rgba(245,246,248,0.18)] text-[#f5f6f8] hover:bg-[#181c25]">
            <Link to="/profile">
              <Undo2 className="h-4 w-4 mr-2" />
              Profile Dön
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-[#141822] border border-[rgba(245,246,248,0.08)] rounded-full p-1 h-auto">
            <TabsTrigger value="account" className="rounded-full px-8 py-2 data-[state=active]:bg-[#eb5fa6] data-[state=active]:text-[#161016] text-[rgba(245,246,248,0.7)]">Şirket Bilgileri</TabsTrigger>
          </TabsList>

          {/* Account Info */}
          <TabsContent value="account">
            <Card className="border border-[rgba(245,246,248,0.08)] bg-[#181c25] rounded-2xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-[#f5f6f8]">Genel Şirket Bilgileri</CardTitle>
                <CardDescription className="text-[rgba(245,246,248,0.6)]">Resmi şirket bilgilerinizi buradan güncelleyebilirsiniz.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...employerAccountForm}>
                  <form onSubmit={employerAccountForm.handleSubmit(onEmployerAccountSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={employerAccountForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[rgba(245,246,248,0.8)]">Şirket Adı</FormLabel>
                            <FormControl>
                              <Input className="bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] focus-visible:ring-[#7d92ff]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={employerAccountForm.control}
                        name="webAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[rgba(245,246,248,0.8)]">Web Adresi</FormLabel>
                            <FormControl>
                              <Input className="bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] focus-visible:ring-[#7d92ff]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={employerAccountForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[rgba(245,246,248,0.8)]">Telefon Numarası</FormLabel>
                            <FormControl>
                              <Input className="bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] focus-visible:ring-[#7d92ff]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={employerAccountForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[rgba(245,246,248,0.8)]">Kurumsal E-posta</FormLabel>
                            <FormControl>
                              <Input className="bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] focus-visible:ring-[#7d92ff]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" disabled={updateEmployer.isPending} className="font-bold px-8 rounded-full bg-[#eb5fa6] text-[#161016] hover:bg-[#d44d93]">
                      {updateEmployer.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="h-4 w-4 mr-2" />
                      Bilgileri Güncelle
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
