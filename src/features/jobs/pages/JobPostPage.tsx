import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { jobService } from '../services/jobService';
import { useCities, useJobTitles, useWorkModels } from '../hooks/useReferenceData';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Briefcase, MapPin, Building2, Calendar as CalendarIcon, Users, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface JobPostValues {
  jobTitleId: string;
  cityId: string;
  workModelId?: string;
  typeOfWorkId?: string;
  description: string;
  openPositions: number;
  applicationDeadline?: string;
}

const jobPostSchema = z.object({
  jobTitleId: z.string().min(1, 'Job title is required'),
  cityId: z.string().min(1, 'City is required'),
  workModelId: z.string().optional(),
  typeOfWorkId: z.string().optional(),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  openPositions: z.preprocess((val) => Number(val), z.number().min(1, 'Must have at least 1 open position')),
  applicationDeadline: z.string().optional(),
});

export function JobPostPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const { data: jobTitles = [] } = useJobTitles();
  const { data: cities = [] } = useCities();
  const { data: workModelData = [] } = useWorkModels();

  const form = useForm<JobPostValues>({
    resolver: zodResolver(jobPostSchema) as any,
    defaultValues: {
      jobTitleId: '',
      cityId: '',
      workModelId: '',
      typeOfWorkId: '',
      description: '',
      openPositions: 1,
      applicationDeadline: '',
    },
  });

  const onSubmit: SubmitHandler<JobPostValues> = async (values) => {
    if (!user || user.role.name !== 'ROLE_EMPLOYER') {
      toast.error('Only employers can post jobs');
      return;
    }

    try {
      await jobService.addJobAdvertisement({
        ...values,
        employerId: user.id,
        jobTitleId: parseInt(values.jobTitleId),
        cityId: parseInt(values.cityId),
        workModelId: values.workModelId ? parseInt(values.workModelId) : undefined,
        typeOfWorkId: values.typeOfWorkId ? parseInt(values.typeOfWorkId) : undefined,
      });
      toast.success('Job advertisement posted successfully!');
      navigate('/jobs');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to post job advertisement';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Post a New Opportunity</h1>
            <p className="text-muted-foreground text-lg">Reach thousands of qualified candidates in minutes.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card className="border-none shadow-xl ring-1 ring-border/50 overflow-hidden">
                <div className="h-2 bg-primary"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-2xl font-bold">
                    <FileText className="mr-3 h-6 w-6 text-primary" />
                    Job Fundamentals
                  </CardTitle>
                  <CardDescription>
                    Provide the core details about the position you're hiring for.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="jobTitleId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 opacity-60" />
                            Job Title
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-background/50 border-border/50 transition-all hover:border-primary/50">
                                <SelectValue placeholder="Select a job title" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {jobTitles.map((title) => (
                                <SelectItem key={title.id} value={title.id.toString()}>
                                  {title.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold flex items-center">
                            <MapPin className="h-4 w-4 mr-2 opacity-60" />
                            Location
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-background/50 border-border/50 transition-all hover:border-primary/50">
                                <SelectValue placeholder="Select a city" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cities.map((city) => (
                                <SelectItem key={city.id} value={city.id.toString()}>
                                  {city.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="workModelId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold flex items-center">
                            <Building2 className="h-4 w-4 mr-2 opacity-60" />
                            Work Model
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-background/50 border-border/50">
                                <SelectValue placeholder="Optional: Remote, On-site..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {workModelData.map((model) => (
                                <SelectItem key={model.id} value={model.id.toString()}>
                                  {model.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="openPositions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold flex items-center">
                            <Users className="h-4 w-4 mr-2 opacity-60" />
                            Open Positions
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="e.g. 1"
                              className="h-11 bg-background/50 border-border/50"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Detailed Job Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell candidates about the role, requirements, and benefits..."
                            className="min-h-[200px] bg-background/50 border-border/50 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Use at least 20 characters to describe the role accurately.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="applicationDeadline"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-bold mb-1 flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 opacity-60" />
                          Application Deadline
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="h-11 bg-background/50 border-border/50 w-full md:w-64"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Leave blank for no specific deadline.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex items-center justify-end gap-4 pb-10">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-10 h-12 rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Posting Opportunity...' : 'Publish Job Advertisement'}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
