import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '../services/jobService';
import { JobAdvertisementResponse } from '../types';
import { turkishCaseInsensitiveSearch } from '@/shared/utils/string';
import { useLocation, useNavigate } from 'react-router-dom';

export interface JobFilter {
  jobTitleId?: number;
  cityId?: number;
  selectedCities: number[];
  selectedWorkModels: number[];
  selectedTypeOfWorks: number[];
  searchQuery?: string;
  searchQuery?: string;
  cityQuery?: string;
  selectedCategory?: string;
}

export const useJobSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const keyword = params.get("keyword") || "";
  const cityId = params.get("cityId") || "";
  const categoryParam = params.get("category") || "";

  const [filters, setFilters] = useState<JobFilter>({
    selectedCities: [],
    selectedWorkModels: [],
    selectedTypeOfWorks: [],
  });

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      searchQuery: keyword,
      cityId: cityId ? Number(cityId) : undefined,
      selectedCategory: categoryParam || undefined,
    }));
  }, [keyword, cityId, categoryParam]);

  const { data: allJobs = [], isLoading, isError } = useQuery<JobAdvertisementResponse[]>({
    queryKey: ['jobs', 'active'],
    queryFn: () => jobService.getActiveJobs(),
  });

  const updateFilters = useCallback((newFilters: Partial<JobFilter>) => {
    // If updating search Query or City, update URL instead of just state
    const newParams = new URLSearchParams(location.search);
    
    if ('searchQuery' in newFilters) {
      if (newFilters.searchQuery) {
        newParams.set('keyword', newFilters.searchQuery);
      } else {
        newParams.delete('keyword');
      }
    }
    if ('cityId' in newFilters) {
      if (newFilters.cityId) {
        newParams.set('cityId', String(newFilters.cityId));
      } else {
        newParams.delete('cityId');
      }
    }
    if ('selectedCategory' in newFilters) {
      if (newFilters.selectedCategory && newFilters.selectedCategory !== 'all') {
        newParams.set('category', newFilters.selectedCategory);
      } else {
        newParams.delete('category');
      }
    }
    
    // For list filters (work models, etc.), keep in state for now
    setFilters(prev => ({ ...prev, ...newFilters }));
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  }, [location.search, location.pathname, navigate]);

  const toggleListFilter = useCallback((id: number, key: 'selectedCities' | 'selectedWorkModels' | 'selectedTypeOfWorks') => {
    setFilters((prev: JobFilter) => {
      const current = prev[key];
      const next = current.includes(id) 
        ? current.filter((item: number) => item !== id)
        : [...current, id];
      return { ...prev, [key]: next };
    });
  }, []);

  const updateCategoryFilter = useCallback((category: string | undefined) => {
    updateFilters({ selectedCategory: category });
  }, [updateFilters]);

  const filteredJobs = useMemo(() => {
    let result = allJobs;

    result = result.filter(job => {
      const matchesKeyword =
        !keyword ||
        (job.jobTitle.title && turkishCaseInsensitiveSearch(job.jobTitle.title, keyword)) ||
        (job.employer?.companyName && turkishCaseInsensitiveSearch(job.employer.companyName, keyword));

      const matchesCity =
        !cityId || job.city.id === Number(cityId);

      const matchesCategory =
        !categoryParam || categoryParam === 'all' || job.jobTitle.categoryName === categoryParam;

      return matchesKeyword && matchesCity && matchesCategory;
    });

    // 3. Category/List Filters
    if (filters.selectedCities.length > 0) {
      result = result.filter(job => filters.selectedCities.includes(job.city.id));
    }
    if (filters.selectedWorkModels.length > 0) {
      // In this version, workModel and typeOfWork are treated as the same in the DB
      result = result.filter(job => 
        job.typeOfWork?.id && filters.selectedWorkModels.includes(job.typeOfWork.id)
      );
    }
    if (filters.selectedTypeOfWorks.length > 0) {
      result = result.filter(job => job.typeOfWork?.id && filters.selectedTypeOfWorks.includes(job.typeOfWork.id));
    }

    return result;
  }, [allJobs, keyword, cityId, categoryParam, filters]);

  return {
    jobs: filteredJobs,
    allJobs,
    isLoading,
    isError,
    filters,
    updateFilters,
    updateCategoryFilter,
    toggleListFilter,
  };
};
