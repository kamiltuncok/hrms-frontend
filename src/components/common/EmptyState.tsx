import { SearchX } from 'lucide-react'
import { Button } from '../ui/button'

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  title = "No results found", 
  description = "We couldn't find anything matching your criteria.",
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/30 rounded-xl border border-border border-dashed animate-in fade-in duration-500">
      <div className="bg-muted p-4 rounded-full mb-4">
        <SearchX className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="default">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
