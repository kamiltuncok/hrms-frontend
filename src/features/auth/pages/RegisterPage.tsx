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
        toast.success('Registration successful! Please login.');
        navigate('/login');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Registration failed');
      }
    });
  };

  const onEmployerSubmit = (values: RegisterEmployerValues) => {
    registerEmployer.mutate(values, {
      onSuccess: () => {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Registration failed');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4 py-12">
      <Card className="w-full max-w-2xl shadow-xl border-2 border-primary/10">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Create an Account</CardTitle>
          <CardDescription className="text-muted-foreground/80 text-lg">
            Join the modern HRMS platform today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="jobseeker" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="jobseeker" className="text-base font-semibold py-3 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Job Seeker
              </TabsTrigger>
              <TabsTrigger value="employer" className="text-base font-semibold py-3 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Employer
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
                          <FormLabel className="font-semibold">First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} className="bg-background/50" />
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
                          <FormLabel className="font-semibold">Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} className="bg-background/50" />
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
                        <FormLabel className="font-semibold">Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} className="bg-background/50" />
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
                          <FormLabel className="font-semibold">Identity Number (TCKN)</FormLabel>
                          <FormControl>
                            <Input placeholder="11 digits" maxLength={11} {...field} className="bg-background/50" />
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
                          <FormLabel className="font-semibold">Birth Year</FormLabel>
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
                          <FormLabel className="font-semibold">Password</FormLabel>
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
                          <FormLabel className="font-semibold">Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} className="bg-background/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full text-lg h-12 font-bold transition-all shadow-md hover:shadow-xl" disabled={registerJobSeeker.isPending}>
                    {registerJobSeeker.isPending ? 'Processing...' : 'Register as Job Seeker'}
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
                        <FormLabel className="font-semibold">Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corp" {...field} className="bg-background/50" />
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
                          <FormLabel className="font-semibold">Web Address</FormLabel>
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
                          <FormLabel className="font-semibold">Phone Number</FormLabel>
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
                        <FormLabel className="font-semibold">Business Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="hr@acme.com" {...field} className="bg-background/50" />
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
                          <FormLabel className="font-semibold">Password</FormLabel>
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
                          <FormLabel className="font-semibold">Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} className="bg-background/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full text-lg h-12 font-bold transition-all shadow-md hover:shadow-xl" variant="secondary" disabled={registerEmployer.isPending}>
                    {registerEmployer.isPending ? 'Processing...' : 'Register as Employer'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-6 bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" className="p-0 h-auto font-bold text-primary" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
