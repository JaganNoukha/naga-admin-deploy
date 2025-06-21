'use client';

import { columns } from '@/components/data-tables/outlets/columns';
import { MasterRecordDropdown } from '@/components/shared/master-record-dropdown';
import SpringBoard from '@/components/shared/spring-board';
import { StatusDropdown } from '@/components/shared/status-dropdown';
import { WarehouseDropdown } from '@/components/shared/warehouse-dropdown';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import EmptyState from '@/components/ui/empty-state';
import GenericError from '@/components/ui/generic-error';
import Loading from '@/components/ui/loading';
import { SearchInput } from '@/components/ui/search-input';
import { OutletStatus, OutletStatusEnum } from '@/constants/enums/outlet.enums';
import { useOutlets } from '@/features/dashboard/outlets/hooks/useOutlets';
import { useAppSelector } from '@/store/hooks';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const OutletPage = () => {
  const router = useRouter();
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>();
  const [selectedOutletType, setSelectedOutletType] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [searchQuery, setSearchQuery] = useState('');
  const { recordMaps } = useAppSelector((state) => state.masterRecords);
  const { warehouseMap } = useAppSelector((state) => state.warehouse);

  const { outlets } = useOutlets({
    ...(selectedWarehouse && { warehouseId: selectedWarehouse }),
    ...(selectedOutletType && { outlettypeId: selectedOutletType }),
    ...(selectedStatus && { outletStatus: selectedStatus }),
    ...(searchQuery && { search: searchQuery }),
  });

  const handleEdit = (outlet: any) => {
    router.push(
      `/dashboard/outlets/outlet-creation?mode=edit&outletId=${outlet.outletId}`
    );
  };

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium">Outlets</div>
        <SpringBoard />
      </div>
      <div className="w-full space-y-4 rounded-lg bg-white p-4">
        <div className="flex flex-col justify-between gap-10 pb-4 md:flex-row">
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <SearchInput
              placeholder="Search outlet name"
              className="md:w-full"
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <MasterRecordDropdown
              masterName="outlettype"
              value={selectedOutletType}
              onChange={setSelectedOutletType}
              placeholder="Outlet Type"
              className="md:w-full"
            />
            <WarehouseDropdown
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              placeholder="Warehouse"
              className="md:w-full"
            />
            <StatusDropdown
              value={selectedStatus}
              onChange={setSelectedStatus}
              statusEnum={OutletStatusEnum}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary">Bulk Upload</Button>
            <Button
              onClick={() => router.push('/dashboard/outlets/outlet-creation')}
            >
              <PlusIcon className="h-4 w-4" />
              Add Outlet
            </Button>
          </div>
        </div>
        {outlets.isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loading text="Loading outlets..." />
          </div>
        ) : outlets.error ? (
          <div className="flex h-64 items-center justify-center">
            <GenericError text="Error loading outlets. Please try again." />
          </div>
        ) : outlets.data?.data && outlets.data.data.length > 0 ? (
          <DataTable
            columns={columns(recordMaps, warehouseMap)}
            data={outlets.data.data.map((outlet: any) => ({
              ...outlet,
              onEdit: () => handleEdit(outlet),
              onViewLogs: () => {},
            }))}
          />
        ) : (
          <div className="flex h-64 items-center justify-center">
            <EmptyState text="We couldn't find any Outlets." />
          </div>
        )}
      </div>
    </section>
  );
};

export default OutletPage;
