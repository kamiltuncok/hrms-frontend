export const queryKeys = {
  jobs: {
    all: ['jobs'] as const,
    active: (page?: number, size?: number) => [...queryKeys.jobs.all, 'active', page, size] as const,
    search: (keyword: string, city: string, page?: number) => [...queryKeys.jobs.all, 'search', keyword, city, page] as const,
    detail: (id: number) => [...queryKeys.jobs.all, 'detail', id] as const,
  },
  employers: {
    all: ['employers'] as const,
    top: () => [...queryKeys.employers.all, 'top'] as const,
  },
  referenceData: {
    jobTitles: ['jobTitles'] as const,
    cities: ['cities'] as const,
  }
};
