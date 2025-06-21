'use client';

import { createColumns } from '@/components/data-tables/orders/order-details/columns';
import { MasterRecordDropdown } from '@/components/shared/master-record-dropdown';
import { WarehouseDropdown } from '@/components/shared/warehouse-dropdown';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { useWarehouse } from '@/features/warehouse-managment/hooks/useWarehouse';
import { ArrowLeftIcon, Home, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const orderDetailsMock = [
  {
    productName: 'Naga Rawa',
    quantity: 50,
    mrp: 5000,
    schemeApplied: '-',
    case: '5',
    unit: '10',
    price: 4800,
    onEdit: () => alert('Edit clicked'),
  },
];

const OrderDetailsPage = () => {
  const { warehouses } = useWarehouse();
  const [outletName, setOutletName] = useState('');
  const [outletType, setOutletType] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [status, setStatus] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [address, setAddress] = useState('');

  const handleAprove = () => {
  };

  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col gap-3 rounded-lg bg-white p-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard/orders"
                className="flex items-center gap-1"
              >
                <Home className="h-3 w-3" /> Orders
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Order Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/orders"
              className="hover:bg-freshleaf/30 rounded-lg bg-neutral-200 p-2 text-neutral-500"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">Order Details</h1>
              <p className="text-sm text-neutral-500">
                View order details here
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4">
        <div className="bg-background mb-4 rounded-lg p-2 text-lg font-medium">
          Order Details
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Outlet Name</label>
            <Input
              value={outletName}
              onChange={e => setOutletName(e.target.value)}
              placeholder="Enter outlet name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Outlet Type</label>
            <MasterRecordDropdown
              masterName="outletType"
              value={outletType}
              onChange={setOutletType}
              placeholder="Select outlet type"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order ID</label>
            <Input
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              placeholder="Enter order ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order Date</label>
            <Input
              type="date"
              value={orderDate}
              onChange={e => setOrderDate(e.target.value)}
              placeholder="Select order date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <MasterRecordDropdown
              masterName="status"
              value={status}
              onChange={setStatus}
              placeholder="Select status"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Warehouse</label>
            <WarehouseDropdown
              value={warehouse}
              onChange={setWarehouse}
              placeholder={warehouses.isLoading ? "Loading warehouses..." : "Select warehouse"}
              className="w-full"
            />
          </div>
          <div className="">
            <label className="block text-sm font-medium mb-1">Address</label>
            <Input
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Enter address"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 space-y-4">
        <div className="flex items-center bg-background rounded-lg p-2 mb-2">
          <span className="text-lg font-medium">Product List</span>
        </div>
        <DataTable columns={createColumns()} data={orderDetailsMock} />
        <div className="flex items-center justify-between mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {}}
            className="flex flex-row justify-center items-center gap-2"
            style={{ color: '#00A551', borderColor: '#00A551' }}
          >
            <Plus className="w-5 h-5" color="#00A551" />
            <span style={{ color: '#00A551' }}>Add Product</span>
          </Button>
          <div className="flex-1 ml-4">
            <div
              className="bg-background rounded-lg w-full flex justify-end"
              style={{ height: 40, padding: '10px 16px' }}
            >
              <span className="font-semibold">
                Order Value: ₹ 0
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/orders">Reject</Link>
        </Button>
        <Button
          type="button"
          className="flex items-center gap-2"
          onClick={handleAprove}
        >
          Approve
        </Button>
      </div>
    </section>
  );
};

export default OrderDetailsPage;




