'use client';

import { columns } from '@/components/data-tables/pjp-history/columns';
import SpringBoard from '@/components/shared/spring-board';
import { WarehouseDropdown } from '@/components/shared/warehouse-dropdown';
import PjpTab from '@/components/tabs/pjp/pjp-tabs';
import { DataTable } from '@/components/ui/data-table';
import EmptyState from '@/components/ui/empty-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

const demoPjpHistoryData = [
  {
    id: '1',
    date: 'May 21, 2025 ; 10:00 AM',
    day: '1',
    salesPerson: 'John Smith',
    outlets: 'Outlet1',
  },
  {
    id: '2',
    date: 'May 22, 2025 ; 11:30 AM',
    day: '2',
    salesPerson: 'Sarah Johnson',
    outlets: 'Outlet1',
  },
  {
    id: '3',
    date: 'May 23, 2025 ; 09:15 AM',
    day: '3',
    salesPerson: 'Mike Wilson',
    outlets: 'Outlet1',
  },
  {
    id: '4',
    date: 'May 24, 2025 ; 14:45 PM',
    day: '4',
    salesPerson: 'Emily Davis',
    outlets: 'Outlet1',
  },
  {
    id: '5',
    date: 'May 25, 2025 ; 08:30 AM',
    day: '5',
    salesPerson: 'David Brown',
    outlets: 'Outlet1',
  },
];

const JourneyPlanPage = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>();
  const [selectedDesignation, setSelectedDesignation] = useState<string>();

  const filteredPjpData = demoPjpHistoryData.filter((record) =>
    record.salesPerson.toLowerCase()
  );

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium">Permanent Journey Plan</div>
        <SpringBoard />
      </div>

      <div className="w-full space-y-3 rounded-lg bg-white p-4">
        <PjpTab />
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <div className="flex flex-col gap-2 md:flex-row">
              <WarehouseDropdown
                value={selectedWarehouse}
                onChange={setSelectedWarehouse}
                placeholder="Warehouse"
              />
              <Select
                value={selectedDesignation}
                onValueChange={setSelectedDesignation}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sales Person" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Amruth</SelectItem>
                  <SelectItem value="manager">Kiran</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {filteredPjpData.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredPjpData.map((record: any) => ({
              ...record,
              onViewMap: () => {
                console.log('Viewing map');
              },
            }))}
          />
        ) : (
          <div className="flex h-64 items-center justify-center">
            <EmptyState text="No PJP history found." />
          </div>
        )}
      </div>
    </section>
  );
};

export default JourneyPlanPage;
