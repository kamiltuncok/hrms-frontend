import { motion } from 'framer-motion';
import { UserPlus, Search, FileSignature, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up as a job seeker or employer in minutes.',
  },
  {
    icon: Search,
    title: 'Search Jobs',
    description: 'Find roles that match your skills securely.',
  },
  {
    icon: FileSignature,
    title: 'Apply Easily',
    description: 'Submit your resume and track application statuses.',
  },
  {
    icon: CheckCircle,
    title: 'Get Hired',
    description: 'Connect with HR teams and land the position.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">How It Works</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
          Whether you are hunting for talent or for jobs, navigating the platform is simple.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex flex-col items-center"
              >
                {/* Connector line for desktop */}
                {index !== steps.length - 1 && (
                   <div className="hidden lg:block absolute top-10 left-1/2 w-full h-[2px] bg-border -z-10" />
                )}
                
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 ring-8 ring-background">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
