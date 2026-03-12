import { AlertCircle } from 'lucide-react'
import { Button } from '../ui/button'

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Something went wrong. Please try again later.", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-destructive/10 rounded-xl animate-in fade-in duration-500">
      <AlertCircle className="w-12 h-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Data</h3>
      <p className="text-muted-foreground max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  )
}
