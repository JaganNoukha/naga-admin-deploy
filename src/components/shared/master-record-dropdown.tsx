import { useMasterRecords } from '@/features/master-managment/hooks/useMasterRecords';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setMasterRecords, setSelectedValue } from '@/store/slices/masterRecordsSlice';
import { useEffect } from 'react';

interface MasterRecord {
  _id: string;
  [key: string]: string | number | boolean;
}

interface MasterRecordDropdownProps {
  masterName: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const MasterRecordDropdown = ({
  masterName,
  value,
  onChange,
  placeholder = 'Select',
  className,
}: MasterRecordDropdownProps) => {
  const dispatch = useAppDispatch();
  const { records, selectedValues } = useAppSelector((state) => state.masterRecords);
  const { records: recordsQuery } = useMasterRecords(masterName);
  const displayField = `${masterName}Name`;

  // Store records in Redux when they are fetched
  useEffect(() => {
    if (recordsQuery?.data?.data?.data) {
      dispatch(setMasterRecords({
        masterName,
        records: recordsQuery.data.data.data
      }));
    }
  }, [recordsQuery?.data?.data?.data, masterName, dispatch]);

  const handleValueChange = (newValue: string) => {
    if (newValue === "select-master") {
      dispatch(setSelectedValue({ masterName, value: "" }));
      onChange?.("");
    } else {
      dispatch(setSelectedValue({ masterName, value: newValue }));
      onChange?.(newValue);
    }
  };

  // Use records from Redux store
  const masterRecords = records[masterName] || [];

  return (
    <Select value={value || selectedValues[masterName] || ''} onValueChange={handleValueChange}>
      <SelectTrigger className={cn('md:w-full', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="select-master">Select {masterName}</SelectItem>
        {masterRecords.map((record: MasterRecord) => (
          <SelectItem 
            key={String(record[`${masterName}Id`])} 
            value={String(record[`${masterName}Id`])}
          >
            {String(record[displayField])}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}; 