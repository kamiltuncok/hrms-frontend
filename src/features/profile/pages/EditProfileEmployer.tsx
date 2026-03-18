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
    <div className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase flex items-center">
              <Building2 className="mr-3 h-8 w-8 text-primary" />
              Şirket Profilini Düzenle
            </h1>
            <p className="text-muted-foreground mt-1">İş arayanlara şirketiniz hakkında doğru bilgiler sunun.</p>
          </div>
          <Button variant="outline" asChild className="rounded-full">
            <Link to="/profile">
              <Undo2 className="h-4 w-4 mr-2" />
              Profile Dön
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-card border shadow-sm p-1 h-auto">
            <TabsTrigger value="account" className="rounded-md px-8 py-2">Şirket Bilgileri</TabsTrigger>
          </TabsList>

          {/* Account Info */}
          <TabsContent value="account">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Genel Şirket Bilgileri</CardTitle>
                <CardDescription>Resmi şirket bilgilerinizi buradan güncelleyebilirsiniz.</CardDescription>
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
                            <FormLabel>Şirket Adı</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                            <FormLabel>Web Adresi</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                            <FormLabel>Telefon Numarası</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                            <FormLabel>Kurumsal E-posta</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" disabled={updateEmployer.isPending} className="font-bold px-8">
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
