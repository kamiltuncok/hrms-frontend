import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '../hooks/useCategories';

interface CategorySelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CategorySelect({ value, onChange, placeholder = 'Kategori seçin', className }: CategorySelectProps) {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className={className} disabled={isLoading}>
        <SelectValue placeholder={isLoading ? 'Kategoriler yükleniyor...' : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={cat.id.toString()}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
