import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import { useEffect, useState } from 'react'

interface SearchInputProps {
  placeholder?: string;
  defaultValue?: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({ 
  placeholder = "Search...", 
  defaultValue = "", 
  onChange,
  debounceMs = 300,
  className = ""
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(value)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [value, debounceMs, onChange])

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9 bg-background shadow-sm"
      />
    </div>
  )
}
