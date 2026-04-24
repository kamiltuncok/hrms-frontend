import { useNavigate } from 'react-router-dom';
import { useJobSearch } from '../hooks/useJobSearch';
import { useWorkModels } from '../hooks/useReferenceData';
import { JobCardSkeleton } from '@/components/skeletons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  SlidersHorizontal,
  X,
  Briefcase,
  ArrowUpDown,
} from 'lucide-react';
import { LocationSelector } from '@/components/common/LocationSelector';
import { JobCardList } from '@/components/common/JobCard';
import { EmptyState } from '@/components/common/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';

export function JobSearchPage() {
  const navigate = useNavigate();
  const { jobs, isLoading, filters, updateFilters, toggleListFilter } =
    useJobSearch();

  const { data: workModels = [] } = useWorkModels();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ searchQuery: e.target.value });
  };

  const clearFilters = () => {
    updateFilters({
      searchQuery: '',
      cityId: undefined,
      selectedCities: [],
      selectedWorkModels: [],
      selectedTypeOfWorks: [],
    });
  };

  const activeFiltersCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.cityId ? 1 : 0) +
    filters.selectedCities.length +
    filters.selectedWorkModels.length +
    filters.selectedTypeOfWorks.length;

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Sıradaki Kariyerinize Adım Atın
          </h1>
          <p className="text-muted-foreground">
            Türkiye çapında binlerce iş fırsatını keşfedin.
          </p>
        </motion.div>

        {/* Top search bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="mb-8 border-border/60 shadow-sm overflow-hidden">
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="İş unvanı, anahtar kelime veya şirket..."
                    className="pl-9 h-11 bg-background border-border/50 focus-visible:ring-primary/30"
                    value={filters.searchQuery || ''}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="md:w-60">
                  <LocationSelector
                    value={filters.cityId}
                    onChange={(val) => updateFilters({ cityId: val })}
                    className="h-11"
                  />
                </div>
                <Button className="h-11 px-7 font-semibold shrink-0">
                  <Search className="h-4 w-4 mr-2" />
                  İş Ara
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* ── Filter Sidebar ─────────────────────────────────────────────── */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    Filtreler
                    {activeFiltersCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground text-xs font-bold leading-none">
                        {activeFiltersCount}
                      </span>
                    )}
                  </CardTitle>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-primary px-2"
                      onClick={clearFilters}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Temizle
                    </Button>
                  )}
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="px-5 py-5 space-y-6">
                {/* Work Models */}
                {workModels.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" />
                      Çalışma Şekli
                    </p>
                    <div className="space-y-2.5">
                      {workModels.map((model) => {
                        const isChecked = filters.selectedWorkModels.includes(
                          model.id,
                        );
                        return (
                          <div key={model.id} className="flex items-center gap-2.5">
                            <Checkbox
                              id={`wm-${model.id}`}
                              checked={isChecked}
                              onCheckedChange={() =>
                                toggleListFilter(model.id, 'selectedWorkModels')
                              }
                              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <Label
                              htmlFor={`wm-${model.id}`}
                              className={`text-sm cursor-pointer transition-colors ${
                                isChecked
                                  ? 'text-foreground font-medium'
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {model.name}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* ── Job List ────────────────────────────────────────────────────── */}
          <main className="lg:col-span-3 space-y-4">
            {/* Results header */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{jobs.length}</span>{' '}
                aktif ilan gösteriliyor
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>Sırala:</span>
                <select className="bg-transparent text-sm font-semibold text-foreground focus:outline-none cursor-pointer">
                  <option>En Yeni</option>
                  <option>En Eski</option>
                </select>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <JobCardSkeleton key={i} />
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <EmptyState
                    title="Eşleşen ilan bulunamadı"
                    description="Daha fazla fırsat bulmak için arama terimlerini veya filtreleri değiştirmeyi deneyin."
                    actionLabel="Tüm filtreleri sıfırla"
                    onAction={clearFilters}
                  />
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <JobCardList
                      key={job.id}
                      job={job}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
