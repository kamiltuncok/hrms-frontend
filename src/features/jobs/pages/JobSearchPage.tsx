import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useJobSearch } from '../hooks/useJobSearch';
import { useWorkModels } from '../hooks/useReferenceData';
import { JobCardSkeleton } from '@/components/skeletons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
import { CategoryFilter } from '@/features/categories/components/CategoryFilter';
import { PaginationControls } from '@/components/common/PaginationControls';

const ITEMS_PER_PAGE = 10;

export function JobSearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { jobs, isLoading, filters, updateFilters, updateCategoryFilter, toggleListFilter } =
    useJobSearch();

  const { data: workModels = [] } = useWorkModels();

  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const [currentPage, setCurrentPage] = useState(
    isNaN(pageParam) || pageParam < 1 ? 1 : pageParam
  );

  // Sync state with URL parameter changes (e.g. forward/back browser buttons)
  useEffect(() => {
    const p = parseInt(searchParams.get('page') || '1', 10);
    setCurrentPage(isNaN(p) || p < 1 ? 1 : p);
  }, [searchParams]);

  // Reset to first page when any search filter is modified
  useEffect(() => {
    setCurrentPage(1);
    if (searchParams.get('page')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('page');
      setSearchParams(nextParams, { replace: true });
    }
  }, [
    filters.searchQuery,
    filters.cityId,
    filters.selectedCategory,
    filters.selectedCities,
    filters.selectedWorkModels,
    filters.selectedTypeOfWorks,
  ]);

  const handleCategoryChange = (val: string) => {
    updateCategoryFilter(val);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ searchQuery: e.target.value });
  };

  const clearFilters = () => {
    updateFilters({
      searchQuery: '',
      cityId: undefined,
      selectedCategory: undefined,
      selectedCities: [],
      selectedWorkModels: [],
      selectedTypeOfWorks: [],
    });
    setCurrentPage(1);
    const nextParams = new URLSearchParams();
    setSearchParams(nextParams);
  };

  // Sort jobs according to selected option
  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      const dateA = a.createdDate ? new Date(a.createdDate).getTime() : a.id;
      const dateB = b.createdDate ? new Date(b.createdDate).getTime() : b.id;
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [jobs, sortBy]);

  const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Slice exactly 10 jobs per page
  const paginatedJobs = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return sortedJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedJobs, safeCurrentPage]);

  const handlePageChange = (newPage: number) => {
    const clampedPage = Math.min(Math.max(1, newPage), totalPages);
    setCurrentPage(clampedPage);
    const nextParams = new URLSearchParams(searchParams);
    if (clampedPage <= 1) {
      nextParams.delete('page');
    } else {
      nextParams.set('page', String(clampedPage));
    }
    setSearchParams(nextParams);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const activeFiltersCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.cityId ? 1 : 0) +
    (filters.selectedCategory ? 1 : 0) +
    filters.selectedCities.length +
    filters.selectedWorkModels.length +
    filters.selectedTypeOfWorks.length;

  return (
    <div className="min-h-screen bg-[#101319] pt-8 pb-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="text-xs uppercase tracking-[0.06em] font-semibold text-[#7d92ff] block mb-2">
            Kariyer Fırsatları
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.02em] text-[#f5f6f8] mb-2">
            Sıradaki Kariyerinize Adım Atın
          </h1>
          <p className="text-sm sm:text-base text-[rgba(245,246,248,0.65)]">
            Türkiye çapında binlerce iş fırsatını keşfedin.
          </p>
        </motion.div>

        {/* Top search bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="mb-8 p-3 sm:p-4 rounded-2xl bg-[#181c25] border border-[rgba(245,246,248,0.08)] shadow-sm">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgba(245,246,248,0.45)] group-focus-within:text-[#7d92ff] transition-colors" />
                <Input
                  placeholder="İş unvanı, anahtar kelime veya şirket..."
                  className="pl-10 h-11 bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] placeholder:text-[rgba(245,246,248,0.4)] focus-visible:border-[#7d92ff]"
                  value={filters.searchQuery || ''}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="md:w-60">
                <LocationSelector
                  value={filters.cityId}
                  onChange={(val) => updateFilters({ cityId: val })}
                  className="h-11 bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8]"
                />
              </div>
              <Button className="h-11 px-8 rounded-full font-bold bg-[#eb5fa6] text-[#161016] hover:bg-[#f074b4] shrink-0 cursor-pointer shadow-sm">
                <Search className="h-4 w-4 mr-1.5" />
                İş Ara
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* ── Filter Sidebar ─────────────────────────────────────────────── */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="rounded-2xl bg-[#181c25] border border-[rgba(245,246,248,0.08)] p-5 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(245,246,248,0.08)]">
                <h2 className="text-sm font-bold flex items-center gap-2 text-[#f5f6f8]">
                  <SlidersHorizontal className="h-4 w-4 text-[#eb5fa6]" />
                  Filtreler
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-[#eb5fa6] text-[#161016] text-[11px] font-extrabold leading-none">
                      {activeFiltersCount}
                    </span>
                  )}
                </h2>
                {activeFiltersCount > 0 && (
                  <button
                    className="text-xs text-[rgba(245,246,248,0.6)] hover:text-[#eb5fa6] flex items-center gap-1 transition-colors cursor-pointer"
                    onClick={clearFilters}
                  >
                    <X className="h-3 w-3" />
                    Temizle
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[rgba(245,246,248,0.5)] flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-[#7d92ff]" />
                  Kategori
                </p>
                <CategoryFilter 
                  value={filters.selectedCategory || 'all'} 
                  onChange={handleCategoryChange} 
                  className="w-full bg-[#141822] border-[rgba(245,246,248,0.12)] text-[#f5f6f8] hover:border-[#7d92ff]"
                />
              </div>

              {/* Work Models */}
              {workModels.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-[rgba(245,246,248,0.06)]">
                  <p className="text-xs font-bold uppercase tracking-wider text-[rgba(245,246,248,0.5)] flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-[#eb5fa6]" />
                    Çalışma Şekli
                  </p>
                  <div className="space-y-2.5">
                    {workModels.map((model) => {
                      const isChecked = filters.selectedWorkModels.includes(model.id);
                      return (
                        <div key={model.id} className="flex items-center gap-2.5">
                          <Checkbox
                            id={`wm-${model.id}`}
                            checked={isChecked}
                            onCheckedChange={() => toggleListFilter(model.id, 'selectedWorkModels')}
                            className="data-[state=checked]:bg-[#eb5fa6] data-[state=checked]:border-[#eb5fa6] border-[rgba(245,246,248,0.3)] cursor-pointer"
                          />
                          <Label
                            htmlFor={`wm-${model.id}`}
                            className={`text-sm cursor-pointer transition-colors ${
                              isChecked
                                ? 'text-[#f5f6f8] font-semibold'
                                : 'text-[rgba(245,246,248,0.6)] hover:text-[#f5f6f8]'
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
            </div>
          </aside>

          {/* ── Job List ────────────────────────────────────────────────────── */}
          <main className="lg:col-span-3 space-y-4">
            {/* Results header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {jobs.length > 0 ? (
                  <>
                    Toplam <span className="font-semibold text-foreground">{jobs.length}</span> ilandan{' '}
                    <span className="font-semibold text-foreground">
                      {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}-
                      {Math.min(safeCurrentPage * ITEMS_PER_PAGE, jobs.length)}
                    </span>{' '}
                    arası gösteriliyor
                  </>
                ) : (
                  <span>0 aktif ilan</span>
                )}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>Sırala:</span>
                <select
                  aria-label="İlanları Sırala"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                  className="bg-background border border-border/60 rounded-md px-2.5 py-1 text-sm font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-colors shadow-sm"
                >
                  <option value="newest">En Yeni</option>
                  <option value="oldest">En Eski</option>
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
                <div className="space-y-6">
                  <div className="space-y-3">
                    {paginatedJobs.map((job) => (
                      <JobCardList
                        key={job.id}
                        job={job}
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      />
                    ))}
                  </div>

                  <PaginationControls
                    currentPage={safeCurrentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
