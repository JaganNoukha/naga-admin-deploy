import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';

const formatStatusLabel = (status: string): string => {
  // Convert camelCase or SNAKE_CASE to Title Case
  return status
    // Split by underscore or capital letters
    .split(/[_\s]|(?=[A-Z])/)
    // Capitalize first letter of each word
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    // Join words with spaces
    .join(' ');
};

interface StatusDropdownProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  statusEnum: Record<string, string>;
  statusLabels?: Record<string, string>;
}

export function StatusDropdown({
  value,
  onChange,
  placeholder = 'Status',
  className = '',
  statusEnum,
  statusLabels,
}: StatusDropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusEnum).map(([key, value]) => (
          <SelectItem key={value} value={value}>
            {statusLabels?.[value] || formatStatusLabel(value)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 