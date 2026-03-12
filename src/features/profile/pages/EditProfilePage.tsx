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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Github, 
  Linkedin, 
  Plus, 
  Trash2, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages,
  Loader2,
  Save,
  Undo2
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const profileSchema = z.object({
  description: z.string().min(10, "Bio must be at least 10 characters"),
  githubAccount: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  linkedinAccount: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

const experienceSchema = z.object({
  workplaceName: z.string().min(2, "Workplace name is required"),
  positionName: z.string().min(2, "Position name is required"),
  startDate: z.string().min(1, "Start date is required"),
  leaveDate: z.string().optional().or(z.literal('')),
});

const educationSchema = z.object({
  schoolName: z.string().min(2, "School name is required"),
  departmentName: z.string().min(2, "Department name is required"),
  startDate: z.string().min(1, "Start date is required"),
  graduationDate: z.string().optional().or(z.literal('')),
});

const skillSchema = z.object({
  skillName: z.string().min(1, "Skill name is required"),
});

const languageSchema = z.object({
  languageName: z.string().min(1, "Language name is required"),
  level: z.coerce.number().min(1).max(5),
});

export function EditProfilePage() {
  const user = useAuthStore(state => state.user);
  const { 
    profile, 
    isLoading, 
    updateResume,
    addExperience,
    deleteExperience,
    addEducation,
    deleteEducation,
    addSkill,
    deleteSkill,
    addLanguage,
    deleteLanguage
  } = useProfile(user?.id);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    values: {
      description: profile?.description || '',
      githubAccount: profile?.githubAccount || '',
      linkedinAccount: profile?.linkedinAccount || '',
    }
  });

  const experienceForm = useForm({ resolver: zodResolver(experienceSchema) });
  const educationForm = useForm({ resolver: zodResolver(educationSchema) });
  const skillForm = useForm({ resolver: zodResolver(skillSchema) });
  const languageForm = useForm({ resolver: zodResolver(languageSchema) });

  const onProfileSubmit = (data: z.infer<typeof profileSchema>) => {
    updateResume.mutate(data, {
      onSuccess: () => toast.success('Profile updated successfully'),
      onError: () => toast.error('Failed to update profile')
    });
  };

  const onExperienceSubmit = (data: z.infer<typeof experienceSchema>) => {
    addExperience.mutate(data, {
      onSuccess: () => {
        toast.success('Experience added');
        experienceForm.reset();
      }
    });
  };

  const onEducationSubmit = (data: z.infer<typeof educationSchema>) => {
    addEducation.mutate(data, {
      onSuccess: () => {
        toast.success('Education added');
        educationForm.reset();
      }
    });
  };

  const onSkillSubmit = (data: z.infer<typeof skillSchema>) => {
    addSkill.mutate(data, {
      onSuccess: () => {
        toast.success('Skill added');
        skillForm.reset();
      }
    });
  };

  const onLanguageSubmit = (data: z.infer<typeof languageSchema>) => {
    addLanguage.mutate(data, {
      onSuccess: () => {
        toast.success('Language added');
        languageForm.reset();
      }
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
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
              Edit Professional Profile
            </h1>
            <p className="text-muted-foreground mt-1">Keep your professional information up to date to attract top employers.</p>
          </div>
          <Button variant="outline" asChild className="rounded-full">
            <Link to="/profile">
              <Undo2 className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="bg-card border shadow-sm p-1 h-auto flex-wrap gap-1">
            <TabsTrigger value="basic" className="rounded-md px-6 py-2">General</TabsTrigger>
            <TabsTrigger value="experience" className="rounded-md px-6 py-2">Experience</TabsTrigger>
            <TabsTrigger value="education" className="rounded-md px-6 py-2">Education</TabsTrigger>
            <TabsTrigger value="skills" className="rounded-md px-6 py-2">Skills & Languages</TabsTrigger>
          </TabsList>

          {/* Basic Info */}
          <TabsContent value="basic">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Global Information</CardTitle>
                <CardDescription>Update your professional summary and social links.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell employers about your expertise and career goals..." 
                              className="min-h-[150px] resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="githubAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Github className="h-4 w-4 mr-2" />
                              GitHub URL
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://github.com/username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="linkedinAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Linkedin className="h-4 w-4 mr-2" />
                              LinkedIn URL
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/in/username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" disabled={updateResume.isPending} className="w-full md:w-auto px-8 font-bold">
                      {updateResume.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience */}
          <TabsContent value="experience" className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Add Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...experienceForm}>
                  <form onSubmit={experienceForm.handleSubmit(onExperienceSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={experienceForm.control}
                        name="workplaceName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Google" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={experienceForm.control}
                        name="positionName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Senior Frontend Developer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={experienceForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={experienceForm.control}
                        name="leaveDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date (Optional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" disabled={addExperience.isPending} className="font-bold">
                       <Plus className="h-4 w-4 mr-2" />
                       Add Experience
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                Current Experiences
              </h3>
              <AnimatePresence>
                {profile?.jobExperiences.map((exp) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card className="border-none shadow-md overflow-hidden group">
                      <CardContent className="p-6 flex justify-between items-center">
                        <div className="space-y-1">
                          <h4 className="font-bold text-lg">{exp.positionName}</h4>
                          <p className="text-primary font-semibold">{exp.workplaceName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(exp.startDate).toLocaleDateString()} - {exp.leaveDate ? new Date(exp.leaveDate).toLocaleDateString() : 'Present'}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteExperience.mutate(exp.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* Education */}
          <TabsContent value="education" className="space-y-6">
          <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Add Education</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...educationForm}>
                  <form onSubmit={educationForm.handleSubmit(onEducationSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={educationForm.control}
                        name="schoolName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>University/School</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Istanbul Technical University" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={educationForm.control}
                        name="departmentName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department/Branch</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Computer Engineering" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={educationForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={educationForm.control}
                        name="graduationDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Graduation Date (Optional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" disabled={addEducation.isPending} className="font-bold">
                       <Plus className="h-4 w-4 mr-2" />
                       Add Education
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                Education History
              </h3>
              <AnimatePresence>
                {profile?.schools.map((school) => (
                  <motion.div
                    key={school.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card className="border-none shadow-md overflow-hidden group">
                      <CardContent className="p-6 flex justify-between items-center">
                        <div className="space-y-1">
                          <h4 className="font-bold text-lg">{school.schoolName}</h4>
                          <p className="text-primary font-semibold">{school.departmentName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(school.startDate).toLocaleDateString()} - {school.graduationDate ? new Date(school.graduationDate).toLocaleDateString() : 'Continuing'}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteEducation.mutate(school.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* Skills & Languages */}
          <TabsContent value="skills">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Skills Section */}
                <div className="space-y-6">
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="h-5 w-5 mr-2 text-primary" />
                        Technological Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Form {...skillForm}>
                        <form onSubmit={skillForm.handleSubmit(onSkillSubmit)} className="flex gap-2">
                           <FormField
                              control={skillForm.control}
                              name="skillName"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input placeholder="e.g. React" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" size="icon" disabled={addSkill.isPending}>
                               <Plus className="h-4 w-4" />
                            </Button>
                        </form>
                      </Form>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {profile?.skills.map((skill) => (
                          <div 
                            key={skill.id} 
                            className="flex items-center bg-muted/50 rounded-full px-3 py-1 text-sm font-medium border group"
                          >
                            {skill.skillName}
                            <button 
                              onClick={() => deleteSkill.mutate(skill.id)}
                              className="ml-2 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Languages Section */}
                <div className="space-y-6">
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Languages className="h-5 w-5 mr-2 text-primary" />
                        Language Proficiency
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <Form {...languageForm}>
                          <form onSubmit={languageForm.handleSubmit(onLanguageSubmit)} className="space-y-4">
                            <div className="flex gap-2">
                              <FormField
                                control={languageForm.control}
                                name="languageName"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input placeholder="e.g. English" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                               <FormField
                                control={languageForm.control}
                                name="level"
                                render={({ field }) => (
                                  <FormItem className="w-24">
                                    <FormControl>
                                      <Input 
                                 type="number" 
                                 min="1" 
                                 max="5" 
                                 placeholder="1-5" 
                                 {...field}
                                 value={field.value?.toString() ?? ""}
                                 onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                               />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button type="submit" size="icon" disabled={addLanguage.isPending}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Level: 1 (Basic) - 5 (Native)</p>
                          </form>
                       </Form>

                       <div className="space-y-3 pt-2">
                          {profile?.languages.map((lang) => (
                            <div key={lang.id} className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border group">
                               <div>
                                 <span className="font-bold">{lang.languageName}</span>
                                 <span className="ml-2 text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full border">Level {lang.level}</span>
                               </div>
                               <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deleteLanguage.mutate(lang.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                       </div>
                    </CardContent>
                  </Card>
                </div>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
