'use client';

import { createColumns } from '@/components/data-tables/grn/outlet-view/columns';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { DataTable } from '@/components/ui/data-table';
import { ArrowLeftIcon, Home } from 'lucide-react';
import Link from 'next/link';

const orderDetails = {
  outletId: '1234567',
  outletName: 'Sk Stores',
  invoiceId: 'INV001',
  orderQuantity: '12',
  package: '02',
  receivedPackage: '02',
  receivedDate: '25 May, 2025',
  grnNo: 'GRN001',
};

const productMock = [
  {
    productName: 'Naga Maida',
    quantity: 50,
    case: '5',
    unit: '10',
    price: 300,
  },
];

const OutletViewPage = () => {
  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col gap-3 rounded-lg bg-white p-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard/grn"
                className="flex items-center gap-1"
              >
                <Home className="h-3 w-3" /> GRN Receipt Note Approval
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Outlet View</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/grn"
            className="hover:bg-freshleaf/30 rounded-lg bg-neutral-200 p-2 text-neutral-500"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold">Outlet View</h1>
            <p className="text-sm text-neutral-500">
              Verify outlet order details
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4">
        <div className="bg-background mb-4 rounded-lg p-2 text-lg font-medium">
          Order Details
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-base font-normal mb-1">Outlet ID</label>
            <div style={{ fontWeight: 500, fontSize: 16 }}>{orderDetails.outletId}</div>
          </div>
          <div>
            <label className="block text-base font-normal mb-1">Outlet Name</label>
            <div style={{ fontWeight: 500, fontSize: 16 }}>{orderDetails.outletName}</div>
          </div>
          <div>
            <label className="block text-base font-normal mb-1">Invoice ID</label>
            <div style={{ fontWeight: 500, fontSize: 16 }}>{orderDetails.invoiceId}</div>
          </div>
          <div>
            <label className="block text-base font-normal mb-1">Order Quantity</label>
            <div style={{ fontWeight: 500, fontSize: 16 }}>{orderDetails.orderQuantity}</div>
          </div>
          <div>
            <label className="block text-base font-normal mb-1">Package</label>
            <div style={{ fontWeight: 500, fontSize: 16 }}>{orderDetails.package}</div>
          </div>
          <div>
            <label className="block text-base font-normal mb-1">Received Package</label>
            <div style={{ fontWeight: 500, fontSize: 16 }}>{orderDetails.receivedPackage}</div>
          </div>
          <div>
            <label className="block text-base font-normal mb-1">Received Date</label>
            <div style={{ fontWeight: 500, fontSize: 16 }}>{orderDetails.receivedDate}</div>
          </div>
          <div>
            <label className="block text-base font-normal mb-1">GRN NO</label>
            <div style={{ fontWeight: 500, fontSize: 16 }}>{orderDetails.grnNo}</div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 space-y-4">
        <div className="bg-background mb-4 rounded-lg p-2 text-lg font-medium">
          Product Information
        </div>
        <DataTable columns={createColumns()} data={productMock} />
        <div className="bg-background flex justify-between items-center rounded-lg p-2 text-lg font-medium">
          <span></span>
          <span className="text-base font-semibold">Order Value: 3000</span>
        </div>
      </div>
    </section>
  );
};

export default OutletViewPage;
