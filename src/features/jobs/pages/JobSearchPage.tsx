import { useNavigate } from 'react-router-dom';
import { useJobSearch } from '../hooks/useJobSearch';
import { useCities, useWorkModels } from '../hooks/useReferenceData';
import { JobCardSkeleton } from '@/components/skeletons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Clock, 
  Search, 
  Filter, 
  X,
  ChevronRight
} from 'lucide-react';
import { LocationSelector } from '@/components/common/LocationSelector';
import { motion, AnimatePresence } from 'framer-motion';

export function JobSearchPage() {
  const navigate = useNavigate();
  const { 
    jobs, 
    isLoading, 
    filters, 
    updateFilters, 
    toggleListFilter 
  } = useJobSearch();

  const { data: cities = [] } = useCities();
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
    <div className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Sıradaki Kariyerinize Adım Atın</h1>
          <p className="text-muted-foreground">Türkiye çapında binlerce iş fırsatını keşfedin.</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 shadow-md border-none ring-1 ring-border/50 overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="İş unvanı, anahtar kelime veya şirket..." 
                  className="pl-10 h-12 bg-background/50 border-border/50 focus-visible:ring-primary/30"
                  value={filters.searchQuery || ''}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="md:w-64">
                <LocationSelector 
                  value={filters.cityId} 
                  onChange={(val) => updateFilters({ cityId: val })} 
                  className="h-12"
                />
              </div>
              <Button className="h-12 px-8 font-bold shadow-lg shadow-primary/20">
                İş Ara
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filtreler
              </h2>
              {activeFiltersCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs text-muted-foreground hover:text-primary"
                  onClick={clearFilters}
                >
                  <X className="h-3 w-3 mr-1" />
                  Temizle
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {/* Work Models */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Çalışma Şekli</h3>
                <div className="space-y-2">
                  {workModels.map((model) => (
                    <label key={model.id} className="flex items-center group cursor-pointer">
                      <div 
                        className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all ${
                          filters.selectedWorkModels.includes(model.id) 
                            ? 'bg-primary border-primary scale-110 shadow-sm' 
                            : 'border-muted-foreground/30 group-hover:border-primary/50'
                        }`}
                        onClick={() => toggleListFilter(model.id, 'selectedWorkModels')}
                      >
                        {filters.selectedWorkModels.includes(model.id) && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                      <span className={`text-sm transition-colors ${filters.selectedWorkModels.includes(model.id) ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {model.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cities */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Popüler Şehirler</h3>
                <div className="space-y-2">
                  {cities.slice(0, 10).map((city) => (
                    <label key={city.id} className="flex items-center group cursor-pointer">
                      <div 
                        className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all ${
                          filters.selectedCities.includes(city.id) 
                            ? 'bg-primary border-primary scale-110 shadow-sm' 
                            : 'border-muted-foreground/30 group-hover:border-primary/50'
                        }`}
                        onClick={() => toggleListFilter(city.id, 'selectedCities')}
                      >
                        {filters.selectedCities.includes(city.id) && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                      <span className={`text-sm transition-colors ${filters.selectedCities.includes(city.id) ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {city.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results Area */}
          <main className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground font-medium">
                <span className="text-foreground">{jobs.length}</span> aktif ilan gösteriliyor
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sırala:</span>
                <select className="bg-transparent text-sm font-semibold focus:outline-none cursor-pointer">
                  <option>En Yeni</option>
                  <option>En Eski</option>
                  <option>Pozisyonlar</option>
                </select>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <JobCardSkeleton key={i} />
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl p-12 text-center border-2 border-dashed border-muted-foreground/20"
                >
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Eşleşen ilan bulunamadı</h3>
                  <p className="text-muted-foreground mb-6">Daha fazla fırsat bulmak için arama terimlerini veya filtreleri değiştirmeyi deneyin.</p>
                  <Button variant="outline" onClick={clearFilters}>Tüm filtreleri sıfırla</Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {jobs.map((job) => (
                    <motion.div 
                      key={job.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ scale: 1.005 }}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="group p-5 bg-card rounded-xl border border-border/60 hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 h-full w-1 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                      
                      <div className="flex flex-col md:flex-row gap-5 items-start">
                        <div className="h-16 w-16 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground duration-300">
                          {job.employer.photoUrl ? (
                            <img src={job.employer.photoUrl} alt={job.employer.companyName} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <Building2 className="h-8 w-8" />
                          )}
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                             <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{job.jobTitle.title}</h3>
                             <Badge variant="outline" className="w-fit text-xs font-bold bg-muted/40">
                               {job.typeOfWork?.name || 'Tam Zamanlı'}
                             </Badge>
                          </div>
                         
                          <p className="text-base font-semibold text-muted-foreground mb-4">{job.employer.companyName}</p>
                          
                          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-muted-foreground pt-3 border-t border-border/40 mt-3">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1.5 text-primary opacity-60" />
                              {job.city.name}
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1.5 text-primary opacity-60" />
                              {job.workModel?.name || 'Ofisten'}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1.5 text-primary opacity-60" />
                              {job.applicationDeadline ? `Son Başvuru: ${new Date(job.applicationDeadline).toLocaleDateString()}` : 'Belirtilmedi'}
                            </div>
                            <div className="flex items-center ml-auto hidden md:flex text-primary font-bold group-hover:translate-x-1 transition-transform">
                              Hemen Başvur
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
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
