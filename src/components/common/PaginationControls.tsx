import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  pages.push(1);

  if (currentPage > 3) {
    pages.push('ellipsis');
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push('ellipsis');
  }

  pages.push(totalPages);
  return pages;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Sayfalama"
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/40 mt-8 ${className}`}
    >
      <div className="text-sm text-muted-foreground order-2 sm:order-1">
        Toplam <span className="font-semibold text-foreground">{totalPages}</span> sayfadan{' '}
        <span className="font-semibold text-foreground">{currentPage}</span>. sayfa gösteriliyor
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 order-1 sm:order-2">
        {/* İlk Sayfa */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 hidden sm:flex cursor-pointer"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          title="İlk Sayfa"
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">İlk Sayfa</span>
        </Button>

        {/* Önceki */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 cursor-pointer"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          title="Önceki Sayfa"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Önceki</span>
        </Button>

        {/* Numaralar */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((p, idx) => {
            if (p === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-7 text-center text-muted-foreground select-none"
                >
                  …
                </span>
              );
            }

            const isActive = p === currentPage;
            return (
              <Button
                key={p}
                variant={isActive ? 'default' : 'outline'}
                size="icon"
                className={`h-9 w-9 text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'shadow-sm pointer-events-none'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => onPageChange(p)}
                aria-current={isActive ? 'page' : undefined}
              >
                {p}
              </Button>
            );
          })}
        </div>

        {/* Sonraki */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 cursor-pointer"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          title="Sonraki Sayfa"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Sonraki</span>
        </Button>

        {/* Son Sayfa */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 hidden sm:flex cursor-pointer"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          title="Son Sayfa"
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Son Sayfa</span>
        </Button>
      </div>
    </nav>
  );
}
