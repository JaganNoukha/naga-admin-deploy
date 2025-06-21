import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  debounceMs?: number;
  minWidth?: string;
}

export function SearchInput({
  placeholder = 'Search...',
  value,
  onChange,
  className = '',
  debounceMs = 300,
  minWidth = '200px',
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue.length >= 3 || searchValue.length === 0) {
        onChange(searchValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, onChange, debounceMs]);

  return (
    <div className="relative" style={{ minWidth }}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className={`pl-9 ${className}`}
      />
    </div>
  );
} 