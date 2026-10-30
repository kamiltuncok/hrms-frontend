import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { loginSchema, LoginValues } from '../types/schemas';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { HedefIsLogo } from '@/components/common/HedefIsLogo';

export function LoginPage() {
  const { mutate: login, isPending, isError, error } = useLogin();
  
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginValues) => {
    login(values);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#101319] p-4">
      <Link to="/" className="mb-8 group">
        <HedefIsLogo size={36} showText={true} />
      </Link>

      <Card className="w-full max-w-md shadow-2xl bg-[#181c25] border border-[rgba(245,246,248,0.08)] rounded-2xl">
        <CardHeader className="space-y-1.5 text-center pt-8 pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-[#f5f6f8]">
            Giriş Yap
          </CardTitle>
          <CardDescription className="text-sm text-[rgba(245,246,248,0.65)]">
            Tekrar hoş geldiniz! Hedef İş hesabınıza erişin.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <CardContent className="space-y-4 px-6 sm:px-8">
              {isError && (
                <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl animate-in fade-in zoom-in duration-200">
                  {error?.message || 'Girilen bilgiler hatalı!'}
                </div>
              )}
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-[rgba(245,246,248,0.7)]">
                      E-posta
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ornek@email.com"
                        type="email"
                        autoComplete="email"
                        className="bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] rounded-xl h-11 focus-visible:border-[#7d92ff]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-[rgba(245,246,248,0.7)]">
                      Şifre
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        className="bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] rounded-xl h-11 focus-visible:border-[#7d92ff]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-xs font-semibold text-[#7d92ff] hover:text-[#a6b4ff] hover:underline transition-colors"
                >
                  Şifremi Unuttum?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 px-6 sm:px-8 pb-8">
              <Button
                type="submit"
                className="w-full h-11 text-sm font-bold bg-[#eb5fa6] text-[#161016] hover:bg-[#f074b4] rounded-full shadow-md hover:shadow-[0_4px_18px_rgba(235,95,166,0.35)] transition-all cursor-pointer"
                disabled={isPending}
              >
                {isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>

              <div className="text-center text-xs text-[rgba(245,246,248,0.6)]">
                Henüz bir hesabınız yok mu?{' '}
                <Link to="/register" className="font-bold text-[#eb5fa6] hover:underline">
                  Kayıt Olun
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
