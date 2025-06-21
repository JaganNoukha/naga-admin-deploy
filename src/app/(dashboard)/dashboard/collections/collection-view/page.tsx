'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeftIcon, Home } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const CollectionViewPage = () => {
  const [collectedAmount, setCollectedAmount] = useState('');
  const [reason, setReason] = useState('');

  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col gap-3 rounded-lg bg-white p-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard/collections"
                className="flex items-center gap-1"
              >
                <Home className="h-3 w-3" /> Collections
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Collection View</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/collections"
              className="hover:bg-freshleaf/30 rounded-lg bg-neutral-200 p-2 text-neutral-500"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">Collection View</h1>
              <p className="text-sm text-neutral-500">
                Provide information to confirm collection
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4">
        <div className="bg-background mb-4 rounded-lg p-2 text-lg font-medium">
          Collection Information
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-base font-normal mb-1">Outlet Name</label>
            <div style={{ fontWeight: 500, fontSize: 16 }}>Sk Stores</div>
          </div>
          <div>
            <label className="block text-base font-normal mb-1">Date</label>
            <div style={{ fontWeight: 500, fontSize: 16 }}>25 May, 2025</div>
          </div>
          <div>
            <label className="block text-base font-normal mb-1">Payment Type</label>
            <div style={{ fontWeight: 500, fontSize: 16 }}>Cash</div>
          </div>
          <div>
            <label className="block text-base font-normal mb-1">Reference Number</label>
            <div style={{ fontWeight: 500, fontSize: 16 }}>#12345678</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-base font-normal mb-1">Warehouse</label>
            <div style={{ fontWeight: 500, fontSize: 16 }}>Trichy</div>
          </div>
          <div>
            <label className="block text-base font-normal mb-1">Invoice Number</label>
            <div style={{ fontWeight: 500, fontSize: 16 }}>12345678</div>
          </div>
          <div>
            <label className="block text-base font-normal mb-1">Invoice Amount</label>
            <div style={{ fontWeight: 500, fontSize: 16 }}>5000</div>
          </div>
          <div>
            <label className="block text-base font-normal mb-1">Collector Name</label>
            <div style={{ fontWeight: 500, fontSize: 16 }}>5000</div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 space-y-4">
        <div className="bg-background mb-4 rounded-lg p-2 text-lg font-medium">
          Confirm Collection
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-base font-normal mb-1">Collected Amount</label>
            <Input
              type="number"
              placeholder="Enter"
              value={collectedAmount}
              onChange={e => setCollectedAmount(e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <label className="block text-base font-normal mb-1">Reason</label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="bg-white w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Payment</SelectItem>
                <SelectItem value="partial">Partial Payment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/collections">Cancel</Link>
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={() => {}}
        >
          Collect
        </Button>
      </div>
    </section>
  );
};

export default CollectionViewPage;
