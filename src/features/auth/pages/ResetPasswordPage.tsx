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
import { HedefIsLogo } from '@/components/common/HedefIsLogo';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#101319] text-[#f5f6f8] p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-[#eb5fa6]/10 to-[#7d92ff]/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="mb-8 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.location.href = '/'}>
        <HedefIsLogo size="lg" />
      </div>

      <Card className="w-full max-w-md bg-[#181c25] border border-[rgba(245,246,248,0.08)] rounded-2xl shadow-2xl relative z-10">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-extrabold tracking-tight text-[#f5f6f8]">Yeni Şifre Belirle</CardTitle>
          <CardDescription className="text-[rgba(245,246,248,0.6)]">
            Hesabınız için yeni bir şifre oluşturun.
          </CardDescription>
        </CardHeader>

        {isValidating ? (
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#eb5fa6] border-t-transparent" />
              <p className="text-sm text-[rgba(245,246,248,0.6)]">Bağlantı doğrulanıyor...</p>
            </div>
          </CardContent>
        ) : !isTokenValid ? (
          <CardContent className="space-y-4 pt-4 pb-8">
            <div className="p-4 text-sm font-medium text-[#eb5fa6] bg-[#eb5fa6]/10 border border-[#eb5fa6]/30 rounded-xl animate-in fade-in zoom-in duration-300">
              Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir şifre sıfırlama talebi oluşturun.
            </div>
            <div className="text-center pt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-[#a6b4ff] hover:text-[#eb5fa6] transition-colors"
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
                  <div className="p-3 text-sm font-medium text-[#eb5fa6] bg-[#eb5fa6]/10 border border-[#eb5fa6]/30 rounded-xl animate-in fade-in zoom-in duration-300">
                    {error}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[rgba(245,246,248,0.8)]">Yeni Şifre</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          className="bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] focus-visible:ring-[#7d92ff]"
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
                      <FormLabel className="text-sm font-medium text-[rgba(245,246,248,0.8)]">Şifre Tekrarı</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          className="bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] focus-visible:ring-[#7d92ff]"
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
                  className="w-full h-11 font-bold rounded-full bg-[#eb5fa6] hover:bg-[#d44d93] text-[#161016] shadow-md transition-all"
                  disabled={isPending}
                >
                  {isPending ? 'Şifre değiştiriliyor...' : 'Şifreyi Değiştir'}
                </Button>
                <Link
                  to="/login"
                  className="text-sm text-[rgba(245,246,248,0.6)] hover:text-[#a6b4ff] transition-colors"
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
