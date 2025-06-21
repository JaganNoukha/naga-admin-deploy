'use client';

import { useState } from 'react';
import { columns } from '@/components/data-tables/warehouse/columns';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SpringBoard from '@/components/shared/spring-board';
import NavKeys from '@/constants/navkeys';
import { useWarehouse } from '@/features/warehouse-managment/hooks/useWarehouse';
import { Warehouse } from '@/components/data-tables/warehouse/columns';
import Loading from '@/components/ui/loading';
import GenericError from '@/components/ui/generic-error';
import EmptyState from '@/components/ui/empty-state';
import { DeleteConfirmationModal } from '@/components/modals/delete-confirmation-modal';
import { toast } from 'sonner';

const WarehouseManagementPage = () => {
  const router = useRouter();
  const { warehouses, deleteWarehouse } = useWarehouse();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    warehouse: null as Warehouse | null,
  });

  const handleDeleteWarehouse = async () => {
    if (!deleteModal.warehouse) return;
    
    toast.loading('Deleting warehouse...', { id: 'delete-warehouse' });
    try {
      await deleteWarehouse.mutateAsync(deleteModal.warehouse.warehouseId);
      toast.success('Warehouse deleted successfully!', { id: 'delete-warehouse' });
      setDeleteModal({ open: false, warehouse: null });
    } catch (error) {
      toast.error('Failed to delete warehouse', { id: 'delete-warehouse' });
    }
  };

  const openDeleteModal = (warehouse: Warehouse) => {
    setDeleteModal({ open: true, warehouse });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, warehouse: null });
  };

  const handleAddNew = () => {
    router.push(NavKeys.WarehouseCreate);
  };

  const handleEdit = (warehouse: Warehouse) => {
    router.push(`${NavKeys.WarehouseCreate}?mode=edit&warehouseId=${warehouse?.warehouseId}`);
  };

  if (warehouses.isLoading) {
    return (
      <section className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium">Warehouses</div>
          <SpringBoard />
        </div>
        <div className="w-full rounded-lg bg-white p-4">
          <div className="h-64 flex items-center justify-center">
            <Loading text="Loading warehouses..." />
          </div>
        </div>
      </section>
    );
  }

  if (warehouses.error) {
    return (
      <section className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium">Warehouses</div>
          <SpringBoard />
        </div>
        <div className="w-full rounded-lg bg-white p-4">
          <div className="h-64 flex items-center justify-center">
            <GenericError text="Error loading warehouses. Please try again." />
          </div>
        </div>
      </section>
    );
  }

  const filteredWarehouses = warehouses?.data?.data?.items?.map((warehouse: Warehouse) => ({
    ...warehouse,
    onEdit: () => handleEdit(warehouse),
    onDelete: () => openDeleteModal(warehouse),
  })) || [];

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium">Warehouses</div>
        <SpringBoard />
      </div>

      <div className="w-full space-y-4 rounded-lg bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search warehouse name or address..."
            className="w-fit"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <Button onClick={handleAddNew}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Warehouse
            </Button>
          </div>
        </div>

        {warehouses.data?.data?.items && warehouses.data.data.items.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredWarehouses}
          />
        ) : (
          <div className="h-64 flex items-center justify-center">
            <EmptyState text="No warehouses found. Start by adding your first warehouse." />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModal.open}
        onOpenChange={closeDeleteModal}
        onConfirm={handleDeleteWarehouse}
        title="Delete Warehouse"
        description={`Are you sure you want to delete "${deleteModal.warehouse?.warehouseName}"? This action cannot be undone.`}
        isLoading={deleteWarehouse.isPending}
      />
    </section>
  );
};

export default WarehouseManagementPage;
