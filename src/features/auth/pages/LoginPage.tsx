import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useAuth';
import { loginSchema, LoginValues } from '../types/schemas';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

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
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg border-2 border-primary/10">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Login</CardTitle>
          <CardDescription className="text-muted-foreground/80">
            Welcome back! Access your HRMS account.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-4 pt-4">
              {isError && (
                <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md animate-in fade-in zoom-in duration-300">
                  {error?.message || 'Authentication failed. Please check your credentials.'}
                </div>
              )}
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        className="bg-background/50 focus-visible:ring-primary/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="pb-8">
              <Button type="submit" className="w-full text-lg h-12 font-bold shadow-md hover:shadow-xl transition-all" disabled={isPending}>
                {isPending ? 'Logging in...' : 'Sign In'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
