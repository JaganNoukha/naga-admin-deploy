'use client';

import { columns, mockData } from '@/components/data-tables/collections/columns';
import { MasterRecordDropdown } from '@/components/shared/master-record-dropdown';
import SpringBoard from '@/components/shared/spring-board';
import { WarehouseDropdown } from '@/components/shared/warehouse-dropdown';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

const CollectionListPage = () => {
  const [selectedPaymentType, setSelectedPaymentType] = useState<string | undefined>(undefined);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [selectedCount, setSelectedCount] = useState<number>(0);

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium">Collections</div>
        <SpringBoard />
      </div>
      <div className="w-full space-y-4 rounded-lg bg-white p-4">
        <div className="flex flex-col">
          <div className="flex flex-col justify-between gap-10 pb-4 md:flex-row">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
              <Input
                placeholder="Search outlet name"
                className="w-full pl-10 md:w-[calc(50%-1rem)]"
              />
            </div>
            <div />
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <MasterRecordDropdown
              masterName="paymentType"
              value={selectedPaymentType}
              onChange={setSelectedPaymentType}
              placeholder="Payment Type"
              className="w-full md:w-[calc(25%-0.5rem)]"
            />
            <WarehouseDropdown
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              placeholder="Warehouse"
              className="w-full md:w-[calc(25%-0.5rem)]"
            />
            <MasterRecordDropdown
              masterName="status"
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Status"
              className="w-full md:w-[calc(25%-0.5rem)]"
            />
            <div className="w-full md:w-[calc(25%-0.5rem)]">
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Select Date"
                className="w-full"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end bg-background mb-4 rounded-lg p-2">
          <span className="text-base font-medium mr-4">
            {selectedCount.toString().padStart(2, '0')} Items Selected
          </span>
          <Button variant="default">Collect</Button>
        </div>
        <DataTable columns={columns} data={mockData} />
      </div>
    </section>
  );
};

export default CollectionListPage;
