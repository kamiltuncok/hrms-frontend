import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useJobTitlesByCategory } from '../hooks/useJobTitles';
import { useEffect } from 'react';

interface JobTitleSelectProps {
  categoryId?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function JobTitleSelect({ categoryId, value, onChange, placeholder = 'İş unvanı seçin', className }: JobTitleSelectProps) {
  const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : undefined;
  const { data: jobTitles = [], isLoading } = useJobTitlesByCategory(parsedCategoryId);

  // If category changes and value is not in new jobTitles (or category is reset), reset value
  useEffect(() => {
    if (!categoryId && value) {
      onChange('');
    }
    // If jobTitles are loaded and current value is not in them, reset
    if (jobTitles.length > 0 && value && !jobTitles.find(j => j.id.toString() === value)) {
      onChange('');
    }
  }, [categoryId, jobTitles, value, onChange]);

  return (
    <Select onValueChange={onChange} value={value} disabled={!categoryId || isLoading}>
      <SelectTrigger className={className}>
        <SelectValue 
          placeholder={
            !categoryId 
              ? 'Önce kategori seçin' 
              : isLoading 
                ? 'Unvanlar yükleniyor...' 
                : placeholder
          } 
        />
      </SelectTrigger>
      <SelectContent>
        {jobTitles.map((title) => (
          <SelectItem key={title.id} value={title.id.toString()}>
            {title.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
