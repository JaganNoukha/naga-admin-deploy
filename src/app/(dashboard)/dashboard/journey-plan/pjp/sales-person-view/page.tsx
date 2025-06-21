'use client';

import { columns } from '@/components/data-tables/pjp/outlet-columns';
import { AddOutletModal } from '@/components/modals/pjp/add-outlet-modal';
import { SwapOutletModal } from '@/components/modals/pjp/swap-outlet-modal';
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
import EmptyState from '@/components/ui/empty-state';
import { IconMapRoute } from '@tabler/icons-react';
import { ArrowLeftIcon, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

// Demo data for outlets
const demoOutletData = [
  {
    id: '1',
    day: '1',
    outlet: 'AM Stores',
  },
  {
    id: '2',
    day: '2',
    outlet: 'AB Stores',
  },
  {
    id: '3',
    day: '3',
    outlet: 'CD Stores',
  },
  {
    id: '4',
    day: '4',
    outlet: 'EF Stores',
  },
  {
    id: '5',
    day: '5',
    outlet: 'GH Stores',
  },
];

const SalesPersonViewPage = () => {
  const [swapOutletOpen, setSwapOutletOpen] = useState(false);
  const [addOutletOpen, setAddOutletOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState<any>(null);

  const handleSwapOutlet = (outlet: any) => {
    setSelectedOutlet(outlet);
    setSwapOutletOpen(true);
  };

  const handleAddOutlet = () => {
    setAddOutletOpen(true);
  };

  const handleSwapOutletSubmit = (data: any) => {
    console.log('Swap outlet data:', data);
    setSwapOutletOpen(false);
    setSelectedOutlet(null);
  };

  const handleAddOutletSubmit = (data: any) => {
    console.log('Add outlet data:', data);
    setAddOutletOpen(false);
  };

  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col gap-3 rounded-lg bg-white p-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard/journey-plan/pjp"
                className="flex items-center gap-1"
              >
                <Home className="h-3 w-3" /> PJP
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Sales Person View</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/journey-plan/pjp"
              className="hover:bg-freshleaf/30 rounded-lg bg-neutral-200 p-2 text-neutral-500"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">{'Sales Person View'}</h1>
              <p className="text-sm text-neutral-500">
                {'View and provide information to edit sales person journey'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-freshleaf/10 w-fit rounded-full p-2">
              <IconMapRoute className="text-freshleaf h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="rounded-lg bg-white p-4">
        <div className="flex flex-col justify-between gap-10 pb-4 md:flex-row">
          <div className="bg-background mb-4 rounded-lg p-2 text-lg font-medium">
            Sales Person Name : Alex
          </div>
          <div className="bg-background mb-4 rounded-lg p-2 text-lg font-medium">
            Plan : Weekly
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary"
              onClick={() => console.log("View Maps")}
            >
              View Map
            </Button>
            <Button onClick={handleAddOutlet}>Add Outlet</Button>
          </div>
        </div>
        <div className="">
          {demoOutletData.length > 0 ? (
            <DataTable
              columns={columns}
              data={demoOutletData.map((outlet: any) => ({
                ...outlet,
                onSwapOutlet: () => handleSwapOutlet(outlet),
                onViewMap: () => console.log("View Maps"),
              }))}
            />
          ) : (
            <EmptyState text="No outlets found." />
          )}

          <SwapOutletModal
            open={swapOutletOpen}
            onOpenChange={setSwapOutletOpen}
            onSubmit={handleSwapOutletSubmit}
            initialData={selectedOutlet ? {
              salesPerson: selectedOutlet.outlet,
              day: selectedOutlet.day as any
            } : null}
            mode="edit"
            isSubmitting={false}
          />
          <AddOutletModal
            open={addOutletOpen}
            onOpenChange={setAddOutletOpen}
            onSubmit={handleAddOutletSubmit}
            initialData={null}
            mode="create"
            isSubmitting={false}
          />
        </div>
      </div>
    </section>
  );
};

export default SalesPersonViewPage;
