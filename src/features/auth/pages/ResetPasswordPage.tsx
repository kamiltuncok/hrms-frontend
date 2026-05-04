import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { resetPasswordSchema, ResetPasswordValues } from '../types/schemas';
import { authService } from '../services/authService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { branding } from '@/shared/constants/branding';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!token) {
      setIsValidating(false);
      setIsTokenValid(false);
      return;
    }

    const validateToken = async () => {
      try {
        const result = await authService.validateResetToken(token);
        setIsTokenValid(result.valid);
      } catch {
        setIsTokenValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (values: ResetPasswordValues) => {
    setIsPending(true);
    setError(null);
    try {
      await authService.resetPassword(token, values.newPassword);
      toast.success('Şifreniz başarıyla değiştirildi. Yeni şifrenizle giriş yapabilirsiniz.');
      navigate('/login');
    } catch (err: any) {
      const message = err?.response?.data?.data || err?.response?.data?.message || 'Şifre sıfırlama başarısız oldu. Lütfen tekrar deneyin.';
      setError(message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-8 cursor-pointer hover:scale-105 transition-transform" onClick={() => window.location.href = '/'}>
        <img src={branding.logoFull} alt={branding.appName} className="h-24 object-contain" />
      </div>

      <Card className="w-full max-w-md shadow-lg border-2 border-primary/10">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Yeni Şifre Belirle</CardTitle>
          <CardDescription className="text-muted-foreground/80">
            Hesabınız için yeni bir şifre oluşturun.
          </CardDescription>
        </CardHeader>

        {isValidating ? (
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Bağlantı doğrulanıyor...</p>
            </div>
          </CardContent>
        ) : !isTokenValid ? (
          <CardContent className="space-y-4 pt-4 pb-8">
            <div className="p-4 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md animate-in fade-in zoom-in duration-300">
              Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir şifre sıfırlama talebi oluşturun.
            </div>
            <div className="text-center pt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
              >
                Yeni sıfırlama bağlantısı iste →
              </Link>
            </div>
          </CardContent>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CardContent className="space-y-4 pt-4">
                {error && (
                  <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md animate-in fade-in zoom-in duration-300">
                    {error}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Yeni Şifre</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          className="bg-background/50 focus-visible:ring-primary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Şifre Tekrarı</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          className="bg-background/50 focus-visible:ring-primary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pb-8">
                <Button
                  type="submit"
                  className="w-full text-lg h-12 font-bold shadow-md hover:shadow-xl transition-all"
                  disabled={isPending}
                >
                  {isPending ? 'Şifre değiştiriliyor...' : 'Şifreyi Değiştir'}
                </Button>
                <Link
                  to="/login"
                  className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                >
                  ← Giriş sayfasına dön
                </Link>
              </CardFooter>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
}
