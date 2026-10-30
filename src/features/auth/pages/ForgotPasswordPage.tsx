import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { forgotPasswordSchema, ForgotPasswordValues } from '../types/schemas';
import { authService } from '../services/authService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { HedefIsLogo } from '@/components/common/HedefIsLogo';

export function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setIsPending(true);
    try {
      await authService.forgotPassword(values.email);
    } catch {
      // Silently handle - always show success to prevent email enumeration
    } finally {
      setIsPending(false);
      setIsSubmitted(true);
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
          <CardTitle className="text-2xl font-extrabold tracking-tight text-[#f5f6f8]">Şifre Sıfırlama</CardTitle>
          <CardDescription className="text-[rgba(245,246,248,0.6)]">
            Hesabınıza kayıtlı e-posta adresinizi girin.
          </CardDescription>
        </CardHeader>

        {isSubmitted ? (
          <CardContent className="space-y-4 pt-4 pb-8">
            <div className="p-4 text-sm font-medium text-[#7d92ff] bg-[#7d92ff]/10 border border-[#7d92ff]/30 rounded-xl animate-in fade-in zoom-in duration-300">
              Eğer bu email sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderildi. Lütfen e-posta kutunuzu kontrol edin.
            </div>
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-sm text-[#a6b4ff] hover:text-[#eb5fa6] transition-colors"
              >
                ← Giriş sayfasına dön
              </Link>
            </div>
          </CardContent>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CardContent className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[rgba(245,246,248,0.8)]">E-posta</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ornek@email.com"
                          type="email"
                          autoComplete="email"
                          className="bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] placeholder:text-[rgba(245,246,248,0.4)] focus-visible:ring-[#7d92ff]"
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
                  {isPending ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
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
