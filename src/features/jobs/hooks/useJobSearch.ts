import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '../services/jobService';
import { JobAdvertisementResponse } from '../types';
import { turkishCaseInsensitiveSearch } from '@/shared/utils/string';

export interface JobFilter {
  jobTitleId?: number;
  cityId?: number;
  selectedCities: number[];
  selectedWorkModels: number[];
  selectedTypeOfWorks: number[];
  searchQuery?: string;
  cityQuery?: string;
}

export const useJobSearch = (initialFilter: Partial<JobFilter> = {}) => {
  const [filters, setFilters] = useState<JobFilter>({
    selectedCities: [],
    selectedWorkModels: [],
    selectedTypeOfWorks: [],
    ...initialFilter,
  });

  const { data: allJobs = [], isLoading, isError } = useQuery<JobAdvertisementResponse[]>({
    queryKey: ['jobs', 'active'],
    queryFn: () => jobService.getActiveJobs(),
  });

  const updateFilters = useCallback((newFilters: Partial<JobFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const toggleListFilter = useCallback((id: number, key: 'selectedCities' | 'selectedWorkModels' | 'selectedTypeOfWorks') => {
    setFilters((prev: JobFilter) => {
      const current = prev[key];
      const next = current.includes(id) 
        ? current.filter((item: number) => item !== id)
        : [...current, id];
      return { ...prev, [key]: next };
    });
  }, []);

  const filteredJobs = useMemo(() => {
    let result = allJobs;

    // 1. URL/Fixed Filters
    if (filters.jobTitleId) {
      result = result.filter(job => job.jobTitle.id === filters.jobTitleId);
    }
    if (filters.cityId) {
      result = result.filter(job => job.city.id === filters.cityId);
    }

    // 2. Query Search (Turkish aware)
    if (filters.searchQuery) {
      result = result.filter(job => 
        job.jobTitle.title && turkishCaseInsensitiveSearch(job.jobTitle.title, filters.searchQuery)
      );
    }
    if (filters.cityQuery) {
      result = result.filter(job => 
        job.city.name && turkishCaseInsensitiveSearch(job.city.name, filters.cityQuery)
      );
    }

    // 3. Category/List Filters
    if (filters.selectedCities.length > 0) {
      result = result.filter(job => filters.selectedCities.includes(job.city.id));
    }
    if (filters.selectedWorkModels.length > 0) {
      result = result.filter(job => job.workModel?.id && filters.selectedWorkModels.includes(job.workModel.id));
    }
    if (filters.selectedTypeOfWorks.length > 0) {
      result = result.filter(job => job.typeOfWork?.id && filters.selectedTypeOfWorks.includes(job.typeOfWork.id));
    }

    return result;
  }, [allJobs, filters]);

  return {
    jobs: filteredJobs,
    allJobs,
    isLoading,
    isError,
    filters,
    updateFilters,
    toggleListFilter,
  };
};
