import { motion } from 'framer-motion';
import { useJobTitles } from '@/features/jobtitles/hooks/useJobTitles';
import { CategorySkeleton } from '@/components/skeletons';
import { ErrorState } from '@/components/common/ErrorState';
import { Code2, Monitor, Database, Layout, Smartphone, PieChart, Shield, Terminal } from 'lucide-react';

const icons = [Code2, Monitor, Database, Layout, Smartphone, PieChart, Shield, Terminal];

export function CategoriesSection() {
  const { data: jobTitles, isLoading, isError, refetch } = useJobTitles();

  if (isError) {
    return (
      <section className="py-16 container mx-auto px-4 max-w-7xl">
        <ErrorState message="Could not load categories." onRetry={refetch} />
      </section>
    );
  }

  // Display top 8 categories
  const categories = jobTitles?.slice(0, 8) || [];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Browse by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Explore jobs across popular tech and business domains.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, index) => {
              const Icon = icons[index % icons.length];
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group flex flex-row items-center space-x-4 p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{cat.title}</h3>
                    <p className="text-xs text-muted-foreground">200+ Jobs</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
