'use client';

import { createColumns } from '@/components/data-tables/grn/grn-overview/columns';
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



const tableData = [
  {
    date: '25 May, 2025',
    productName: 'Naga Atta',
    noOfTons: 10,
    status: 'Partially',
    returnQuantity: 1,
  },
  {
    date: '25 May, 2025',
    productName: 'Naga Atta',
    noOfTons: 5,
    status: 'Delivered',
    returnQuantity: 0, 
  },
];

export default function GrnOverviewPage() {
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
                <Home className="h-3 w-3" /> Approval
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>GRN Overview</BreadcrumbPage>
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
            <h1 className="text-xl font-semibold">GRN Overview</h1>
            <p className="text-sm text-neutral-500">
              Verify GRN details
            </p>
          </div>
        </div>
      </div>



      <div className="rounded-lg bg-white p-4 space-y-4">
        <div className="mb-4 flex gap-4">
          <div className="bg-background flex-1 rounded-lg p-2 text-lg font-medium text-center">
            Total Order: 10
          </div>
          <div className="bg-background flex-1 rounded-lg p-2 text-lg font-medium text-center">
            Returned: 3
          </div>
          <div className="bg-background flex-1 rounded-lg p-2 text-lg font-medium text-center">
            Undelivered: 2
          </div>
          <div className="bg-background flex-1 rounded-lg p-2 text-lg font-medium text-center">
            Delivered: 5
          </div>
        </div>
        <DataTable columns={createColumns()} data={tableData} />
        <div className="bg-background flex items-center justify-between rounded-lg p-2 text-lg font-medium">
          <div className="flex-1 flex justify-center">
            <span className="mx-2">Total this</span>
            <span className="border-l border-neutral-300 h-6 mx-2"></span>
            <span className="mx-2">15</span>
          </div>
          <span className="text-base font-semibold">01</span>
        </div>
      </div>
    </section>
  );
}
