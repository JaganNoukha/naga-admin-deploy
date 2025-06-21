'use client';

import { columns } from '@/components/data-tables/schemes/columns';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { MasterRecordDropdown } from '@/components/shared/master-record-dropdown';
import SpringBoard from '@/components/shared/spring-board';
import EmptyState from '@/components/ui/empty-state';
import Loading from '@/components/ui/loading';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const demoSchemes = [
  {
    id: '1',
    skuCode: 'SCH001',
    productName: 'Summer Sale Scheme',
    brandId: 'Brand A',
    categoryId: 'Electronics',
    subCategoryId: 'Mobile',
    date: '2024-01-15',
    type: 'Discount',
    criteriaType: 'Volume Based',
    validity: '30 Days',
    productApplied: '01',
    status: 'Active'
  },
  {
    id: '2',
    skuCode: 'SCH002',
    productName: 'Winter Clearance',
    brandId: 'Brand B',
    categoryId: 'Fashion',
    subCategoryId: 'Clothing',
    date: '2024-01-10',
    type: 'Percentage',
    criteriaType: 'Amount Based',
    validity: '15 Days',
    productApplied: '03',
    status: 'Inactive'
  },
  {
    id: '3',
    skuCode: 'SCH003',
    productName: 'New Year Special',
    brandId: 'Brand C',
    categoryId: 'Home & Garden',
    subCategoryId: 'Furniture',
    date: '2024-01-01',
    type: 'Fixed Amount',
    criteriaType: 'Quantity Based',
    validity: '45 Days',
    productApplied: '06',
    status: 'Active'
  }
];

const SchemeListPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>();
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const products = {}

  const handleAddScheme = () => {
    router.push('/dashboard/schemes/schemes-creation');
  };

  const handleAssignScheme = () => {
    router.push('/dashboard/schemes/schemes-assign');
  };

  const handleEdit = (scheme: any) => {
    router.push(`/dashboard/schemes/schemes-creation?mode=edit&schemeId=${scheme.id}`);
  };

  const filteredSchemes = demoSchemes.filter(scheme => {
    const matchesSearch = scheme.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || scheme.type === selectedType;
    const matchesStatus = !selectedStatus || scheme.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium">Schemes</div>
        <SpringBoard />
      </div>

      <div className="w-full rounded-lg bg-white p-4 space-y-4">
        <div className="flex flex-col justify-between gap-10 pb-4 md:flex-row">
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <Input 
              placeholder="Search Scheme name" 
              className="md:w-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MasterRecordDropdown
              masterName="type"
              value={selectedType}
              onChange={setSelectedType}
              placeholder="Type"
              className="md:w-full"
            />
            <MasterRecordDropdown
              masterName="status"
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Status"
              className="md:w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handleAssignScheme}>
              Assign Scheme
            </Button>
            <Button onClick={handleAddScheme}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Scheme
            </Button>
          </div>
        </div>
        {products.isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loading text="Loading..." />
          </div>
        ) : products.data?.data?.items && products.data.data.items.length > 0 ? (
          <DataTable
            columns={columns} 
            data={products.data.data.items.map((scheme: any) => ({
              ...scheme,
              onEdit: () => handleEdit(scheme),
              onViewLogs: () => {},
            }))} 
          />
        ) : (
          <div className="h-64 flex items-center justify-center">
            <EmptyState text="No schemes found. Start by adding your first scheme." />
          </div>
        )}
      </div>
    </section>
  );
};

export default SchemeListPage;
