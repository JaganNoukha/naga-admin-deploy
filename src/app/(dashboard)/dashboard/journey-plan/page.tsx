'use client';

import { columns } from '@/components/data-tables/pjp/columns';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import SpringBoard from '@/components/shared/spring-board';
import EmptyState from '@/components/ui/empty-state';
import PjpTab from '@/components/tabs/pjp/pjp-tabs';
import { WarehouseDropdown } from '@/components/shared/warehouse-dropdown';
import { useState } from 'react';

const demoPjpData = [
  {
    id: '1',
    salesPerson: 'John Smith',
    noOfDays: 5,
    noOfOutlets: 12,
    travelTime: '6 hours',
  },
  {
    id: '2',
    salesPerson: 'Sarah Johnson',
    noOfDays: 7,
    noOfOutlets: 18,
    travelTime: '8 hours',
  },
  {
    id: '3',
    salesPerson: 'Mike Wilson',
    noOfDays: 4,
    noOfOutlets: 10,
    travelTime: '5 hours',
  },
  {
    id: '4',
    salesPerson: 'Emily Davis',
    noOfDays: 6,
    noOfOutlets: 15,
    travelTime: '7 hours',
  },
  {
    id: '5',
    salesPerson: 'David Brown',
    noOfDays: 5,
    noOfOutlets: 14,
    travelTime: '6.5 hours',
  },
];

const JourneyPlanPage = () => {
  const router = useRouter();
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>();
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddNew = () => {
    router.push('/dashboard/journey-plan/pjp/journey-creation');
  };

  const handleEdit = (record: any) => {
    router.push(
      `/dashboard/journey-plan/pjp/sales-person-view`
    );
  };

  const filteredPjpData = demoPjpData.filter((record) =>
    record.salesPerson.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="flex flex-col gap-2 md:flex-row">
            <Input
              placeholder="Search sales Person name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <WarehouseDropdown
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              placeholder="Warehouse"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleAddNew}>Optimize PJP</Button>
          </div>
        </div>
        {filteredPjpData.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredPjpData.map((record: any) => ({
              ...record,
              onEdit: () => handleEdit(record),
              onViewLogs: () => {},
            }))}
          />
        ) : (
          <div className="flex h-64 items-center justify-center">
            <EmptyState text="No PJP found. Start by adding your first journey plan." />
          </div>
        )}
      </div>
    </section>
  );
};

export default JourneyPlanPage;
