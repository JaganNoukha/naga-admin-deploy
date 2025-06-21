'use client';

import { createColumns } from '@/components/data-tables/products/columns';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';

import { MasterRecordDropdown } from '@/components/shared/master-record-dropdown';
import SpringBoard from '@/components/shared/spring-board';
import { WarehouseDropdown } from '@/components/shared/warehouse-dropdown';
import EmptyState from '@/components/ui/empty-state';
import GenericError from '@/components/ui/generic-error';
import Loading from '@/components/ui/loading';
import { useProducts } from '@/features/dashboard/products/hooks/useProducts';
import { PlusIcon, RefreshCw, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { WarehouseManagementModal } from '@/components/modals/warehouse-management-modal';
import { useAppSelector } from '@/store/hooks';

const ProductListPage = () => {
  const router = useRouter();
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>();
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
    undefined
  );
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<
    string | undefined
  >(undefined);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const { recordMaps } = useAppSelector((state) => state.masterRecords);

  const { products } = useProducts({
    ...(selectedWarehouse && { warehouseId: selectedWarehouse }),
    ...(selectedBrand && { brandId: selectedBrand }),
    ...(selectedCategory && { categoryId: selectedCategory }),
    ...(selectedSubcategory && { subcategoryId: selectedSubcategory }),
  });

  const handleAddNew = () => {
    router.push('/dashboard/products/product-creation');
  };

  const handleEdit = (product: any) => {
    router.push(
      `/dashboard/products/product-creation?mode=edit&productId=${product.productId}`
    );
  };

  const handleManageWarehouse = (product: any) => {
    setSelectedProductId(product.productId);
    setIsWarehouseModalOpen(true);
  };

  const handleRefresh = () => {
    products.refetch();
  };

  // if (products.isLoading) {
  //   return (
  //     <section className="w-full space-y-6">
  //       <div className="flex items-center justify-between">
  //         <div className="text-xl font-medium">Products</div>
  //         <SpringBoard />
  //       </div>
  //       <div className="w-full rounded-lg bg-white p-4">
  //         <div className="h-64 flex items-center justify-center">
  //           <Loading text="Loading products..." />
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  if (products.error) {
    return (
      <section className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium">Products</div>
          <SpringBoard />
        </div>
        <div className="w-full rounded-lg bg-white p-4">
          <div className="flex h-64 items-center justify-center">
            <GenericError text="Error loading products. Please try again." />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium">Products</div>
        <SpringBoard />
      </div>

      <div className="w-full space-y-4 rounded-lg bg-white p-4">
        <div className="flex flex-col">
          <div className="flex flex-col justify-between gap-10 pb-4 md:flex-row">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
              <Input
                placeholder="Search product name"
                className="pl-10 w-full md:w-[calc(50%-1rem)]"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleRefresh}
                disabled={products.isFetching}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${products.isFetching ? 'animate-spin' : ''}`}
                />
                Sync SAP
              </Button>
              <Button onClick={handleAddNew}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <MasterRecordDropdown
              masterName="brand"
              value={selectedBrand}
              onChange={setSelectedBrand}
              placeholder="Brand"
              className="w-full md:w-[calc(50%-0.5rem)]"
            />
            <MasterRecordDropdown
              masterName="category"
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Category"
              className="w-full md:w-[calc(50%-0.5rem)]"
            />
            <MasterRecordDropdown
              masterName="subcategory"
              value={selectedSubcategory}
              onChange={setSelectedSubcategory}
              placeholder="Subcategory"
              className="w-full md:w-[calc(50%-0.5rem)]"
            />
            <WarehouseDropdown
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              placeholder="Warehouse"
              className="w-full md:w-[calc(50%-0.5rem)]"
            />
          </div>
        </div>

        {products.isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loading text="Loading..." />
          </div>
        ) : products.data?.data?.items && products.data.data.items.length > 0 ? (
          <DataTable 
            columns={createColumns(recordMaps)} 
            data={products.data.data.items.map((product: any) => ({
              ...product,
              onEdit: () => handleEdit(product),
              onManageWarehouse: () => handleManageWarehouse(product),
              onViewLogs: () => {},
            }))}
          />
        ) : (
          <div className="flex h-64 items-center justify-center">
            <EmptyState text="No products found. Start by adding your first product." />
          </div>
        )}
      </div>

      <WarehouseManagementModal
        open={isWarehouseModalOpen}
        onOpenChange={(open) => {
          setIsWarehouseModalOpen(open);
          if (!open) {
            setSelectedProductId('');
          }
        }}
        productId={selectedProductId}
      />
    </section>
  );
};

export default ProductListPage;
