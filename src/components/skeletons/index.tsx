import { Skeleton } from '../ui/skeleton'

export function JobCardSkeleton() {
  return (
    <div className="flex flex-col p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex space-x-2 pt-4 border-t border-border mt-auto">
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="h-6 w-24 rounded-md" />
      </div>
    </div>
  )
}

export function CompanyCardSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
      <Skeleton className="w-16 h-16 rounded-full mb-4" />
      <Skeleton className="h-5 w-32 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  )
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-row items-center space-x-4 p-4 rounded-xl border border-border bg-muted/10">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}
