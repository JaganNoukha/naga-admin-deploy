import { useWarehouse } from '@/features/warehouse-managment/hooks/useWarehouse';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

interface Warehouse {
  warehouseId: string;
  warehouseName: string;
}

interface WarehouseDropdownProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
  defaultSelect?: boolean;
}

export const WarehouseDropdown = ({
  value,
  onChange,
  placeholder = 'Select Warehouse',
  className,
  defaultSelect = false,
}: WarehouseDropdownProps) => {
  const { warehouses } = useWarehouse();
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);

  useEffect(() => {
    // Only set default value if defaultSelect is true and no value is provided
    if (defaultSelect && !value && warehouses.data?.data?.items?.length > 0) {
      const firstWarehouse = warehouses.data.data.items[0];
      setSelectedValue(firstWarehouse.warehouseId);
      onChange?.(firstWarehouse.warehouseId);
    } else {
      setSelectedValue(value);
    }
  }, [value, warehouses.data?.data?.items, onChange, defaultSelect]);

  const handleValueChange = (newValue: string) => {
    if (newValue === "select-warehouse") {
      setSelectedValue(undefined);
      onChange?.(undefined);
    } else {
      setSelectedValue(newValue);
      onChange?.(newValue);
    }
  };

  return (
    <Select value={selectedValue} onValueChange={handleValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="select-warehouse">Select Warehouse</SelectItem>
        {warehouses.data?.data?.items?.map((warehouse: Warehouse) => (
          <SelectItem key={warehouse.warehouseId} value={warehouse.warehouseId}>
            {warehouse.warehouseName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}; 