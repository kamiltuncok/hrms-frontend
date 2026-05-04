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
import { branding } from '@/shared/constants/branding';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-8 cursor-pointer hover:scale-105 transition-transform" onClick={() => window.location.href = '/'}>
        <img src={branding.logoFull} alt={branding.appName} className="h-24 object-contain" />
      </div>

      <Card className="w-full max-w-md shadow-lg border-2 border-primary/10">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Şifre Sıfırlama</CardTitle>
          <CardDescription className="text-muted-foreground/80">
            Hesabınıza kayıtlı e-posta adresinizi girin.
          </CardDescription>
        </CardHeader>

        {isSubmitted ? (
          <CardContent className="space-y-4 pt-4 pb-8">
            <div className="p-4 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md animate-in fade-in zoom-in duration-300 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800">
              Eğer bu email sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderildi. Lütfen e-posta kutunuzu kontrol edin.
            </div>
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
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
                      <FormLabel className="font-semibold">E-posta</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ornek@email.com"
                          type="email"
                          autoComplete="email"
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
                  {isPending ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
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
