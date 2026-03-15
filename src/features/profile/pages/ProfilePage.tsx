import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useProfile } from '../hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  Github, 
  Linkedin, 
  GraduationCap, 
  Briefcase, 
  Globe, 
  FileText, 
  Upload,
  Camera,
  Calendar,
  Languages,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const currentUser = useAuthStore(state => state.user);
  
  // If no ID in URL, show current user's profile
  const profileId = id ? parseInt(id) : currentUser?.id;
  const isOwnProfile = !id || parseInt(id) === currentUser?.id;

  const { 
    profile, 
    isLoading, 
    uploadPhoto, 
    uploadCv 
  } = useProfile(profileId);

  const isEmployer = currentUser?.role?.name === 'ROLE_EMPLOYER';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadPhoto.mutate({ file }, {
        onSuccess: () => toast.success('Photo updated successfully'),
        onError: () => toast.error('Failed to upload photo')
      });
    }
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadCv.mutate({ file }, {
        onSuccess: () => toast.success('CV updated successfully'),
        onError: () => toast.error('Failed to upload CV')
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl space-y-8">
           <Card className="border-none shadow-xl">
             <CardContent className="p-8 flex items-center gap-8">
               <Skeleton className="h-32 w-32 rounded-2xl" />
               <div className="space-y-3 flex-1">
                 <Skeleton className="h-8 w-1/3" />
                 <Skeleton className="h-4 w-1/2" />
               </div>
             </CardContent>
           </Card>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <Skeleton className="h-64 md:col-span-1" />
             <Skeleton className="h-96 md:col-span-2" />
           </div>
        </div>
      </div>
    );
  }

  if (!profile && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 text-center">
        <div className="space-y-4">
          <Award className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <h2 className="text-2xl font-bold">Profile not found</h2>
          <p className="text-muted-foreground">The profile you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-none shadow-xl overflow-hidden bg-card/80 backdrop-blur-sm relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
            <CardContent className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative group">
                <Avatar className="h-32 w-32 rounded-2xl border-4 border-background shadow-lg overflow-hidden transition-transform group-hover:scale-105 duration-300">
                  <AvatarImage src={profile?.photoUrl} alt={profile?.description} className="object-cover" />
                  <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black">
                    {isEmployer ? profile?.companyName?.charAt(0) : (profile?.firstName?.charAt(0) || 'U')}
                  </AvatarFallback>
                </Avatar>
                {!isEmployer && isOwnProfile && (
                  <label className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-xl cursor-pointer shadow-lg hover:bg-primary/90 transition-colors border-4 border-background group-hover:scale-110 duration-200">
                    <Camera className="h-4 w-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
                    {isEmployer ? profile?.companyName : 'Resume Profile'}
                  </h1>
                  <p className="text-lg text-muted-foreground mt-1 font-medium">
                    {isEmployer ? 'Verified Employer' : 'Professional Job Seeker'}
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  {isEmployer ? (
                    <>
                      <Button variant="outline" size="sm" className="rounded-full bg-background/50 hover:bg-background h-10 px-4" asChild>
                        <a href={profile?.webAddress?.startsWith('http') ? profile.webAddress : `https://${profile.webAddress}`} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4 mr-2" />
                          Website
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full bg-background/50 hover:bg-background h-10 px-4">
                        <FileText className="h-4 w-4 mr-2" />
                        {profile?.email}
                      </Button>
                    </>
                  ) : (
                    <>
                      {profile?.githubAccount && (
                        <Button variant="outline" size="sm" className="rounded-full bg-background/50 hover:bg-background h-10 px-4" asChild>
                          <a href={profile.githubAccount} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {profile?.linkedinAccount && (
                        <Button variant="outline" size="sm" className="rounded-full bg-background/50 hover:bg-background h-10 px-4" asChild>
                          <a href={profile.linkedinAccount} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                    </>
                  )}
                  {isOwnProfile && (
                    <Button className="rounded-full h-10 px-6 font-bold shadow-lg shadow-primary/20">
                      Edit {isEmployer ? 'Company' : 'Profile'}
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col items-center md:items-end gap-3">
                <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-secondary/30 text-secondary-foreground font-bold text-sm">
                  {isEmployer ? 'Employer' : 'Candidate'} ID: #{profile?.id}
                </Badge>
                {!isEmployer && profile?.cvUrl && (
                   <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 font-bold" asChild>
                     <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        View Full CV
                     </a>
                   </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact / About Info */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-primary" />
                  {isEmployer ? 'Company Contact' : 'About'}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {isEmployer ? (
                  <>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Globe className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{profile?.webAddress}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{profile?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{profile?.phoneNumber}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{profile?.description || 'No professional summary provided yet.'}"
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Resume Upload (Own profile only - seekers only) */}
            {!isEmployer && isOwnProfile && (
               <Card className="border-none shadow-lg bg-primary/5 ring-1 ring-primary/10">
                 <CardContent className="p-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">Upload New CV</h3>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOCX formats supported</p>
                    </div>
                    <label className="w-full">
                       <Button variant="outline" className="w-full bg-background font-bold border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all" asChild>
                         <span>
                           Choose File
                           <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleCvUpload} />
                         </span>
                       </Button>
                    </label>
                 </CardContent>
               </Card>
            )}

            {!isEmployer && (
              <>
                {/* Skills */}
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center">
                      <Award className="h-5 w-5 mr-2 text-primary" />
                      Professional Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {profile?.skills?.map((skill: any) => (
                      <Badge key={skill.id} variant="outline" className="px-3 py-1 bg-muted/30 font-medium">
                        {skill.skillName}
                      </Badge>
                    ))}
                    {(!profile?.skills || profile.skills.length === 0) && (
                       <p className="text-sm text-muted-foreground">No skills listed yet.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Languages */}
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center">
                      <Languages className="h-5 w-5 mr-2 text-primary" />
                      Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile?.languages?.map((lang: any) => (
                      <div key={lang.id} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold">{lang.languageName}</span>
                          <span className="text-muted-foreground">Level {lang.level}/5</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(lang.level / 5) * 100}%` }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {isEmployer ? (
              <Card className="border-none shadow-lg bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-2xl font-black uppercase text-primary flex items-center">
                    <Briefcase className="h-6 w-6 mr-3" />
                    Company Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 text-center space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background p-6 rounded-2xl shadow-sm border border-primary/10">
                      <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-2">Active Jobs</p>
                      <p className="text-4xl font-black text-primary">0</p>
                    </div>
                    <div className="bg-background p-6 rounded-2xl shadow-sm border border-primary/10">
                      <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-2">Applications</p>
                      <p className="text-4xl font-black text-primary">0</p>
                    </div>
                  </div>
                  <Button className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20">
                    Post New Job Advertisement
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Accordion type="single" collapsible defaultValue="experience" className="space-y-4">
                {/* Experience */}
                <AccordionItem value="experience" className="border-none shadow-lg rounded-2xl bg-card overflow-hidden">
                  <AccordionTrigger className="px-8 hover:no-underline hover:bg-muted/30 transition-colors">
                    <div className="flex items-center text-xl font-black uppercase text-primary">
                       <Briefcase className="h-6 w-6 mr-3" />
                       Work Experience
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pt-6 pb-10">
                    <div className="space-y-8 relative before:absolute before:left-[1.2rem] before:top-4 before:bottom-0 before:w-0.5 before:bg-muted">
                       {profile?.jobExperiences?.map((exp: any) => (
                         <div key={exp.id} className="relative pl-12">
                           <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                             <Briefcase className="h-5 w-5 text-primary" />
                           </div>
                           <div className="space-y-1">
                             <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{exp.positionName}</h4>
                             <p className="font-semibold text-primary/80">{exp.workplaceName}</p>
                             <div className="flex items-center text-sm text-muted-foreground mt-2">
                               <Calendar className="h-4 w-4 mr-2 opacity-60" />
                               {new Date(exp.startDate).toLocaleDateString()} - {exp.leaveDate ? new Date(exp.leaveDate).toLocaleDateString() : 'Present'}
                             </div>
                           </div>
                         </div>
                       ))}
                       {(!profile?.jobExperiences || profile.jobExperiences.length === 0) && (
                         <div className="text-center py-8 text-muted-foreground">
                           No work experience listed yet.
                         </div>
                       )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Education */}
                <AccordionItem value="education" className="border-none shadow-lg rounded-2xl bg-card overflow-hidden">
                  <AccordionTrigger className="px-8 hover:no-underline hover:bg-muted/30 transition-colors">
                    <div className="flex items-center text-xl font-black uppercase text-primary">
                       <GraduationCap className="h-6 w-6 mr-3" />
                       Education
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pt-6 pb-10">
                  <div className="space-y-8 relative before:absolute before:left-[1.2rem] before:top-4 before:bottom-0 before:w-0.5 before:bg-muted">
                       {profile?.schools?.map((school: any) => (
                         <div key={school.id} className="relative pl-12">
                           <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                             <GraduationCap className="h-5 w-5 text-primary" />
                           </div>
                           <div className="space-y-1">
                             <h4 className="text-lg font-bold">{school.schoolName}</h4>
                             <p className="font-semibold text-primary/80">{school.departmentName}</p>
                             <div className="flex items-center text-sm text-muted-foreground mt-2">
                               <Calendar className="h-4 w-4 mr-2 opacity-60" />
                               {new Date(school.startDate).toLocaleDateString()} - {school.graduationDate ? new Date(school.graduationDate).toLocaleDateString() : 'Continuing'}
                             </div>
                           </div>
                         </div>
                       ))}
                       {(!profile?.schools || profile.schools.length === 0) && (
                         <div className="text-center py-8 text-muted-foreground">
                           No education history listed yet.
                         </div>
                       )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
