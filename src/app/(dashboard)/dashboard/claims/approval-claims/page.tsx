'use client';

import ClaimsTab from '@/components/tabs/claims/claims-tabs';
import { createColumns } from '@/components/data-tables/claims/columns';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ApprovalClaimsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedDesignation, setSelectedDesignation] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<string>();

  // Mock data - replace with actual API call
  const mockData = [
    {
      claimId: 'CLM001',
      userName: 'John Doe',
      designation: 'Sales Executive',
      claimDate: '2024-03-20',
      claimType: 'Travel',
      applicableAmount: 5000,
      totalAmount: 4500,
      onView: () => console.log('View claim'),
    },
    // Add more mock data as needed
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Approval Claims</h1>
      </div>
      <ClaimsTab />
      
      <div className="w-full space-y-4 rounded-lg bg-white p-4 mt-6">
        <div className="flex flex-col">
          <div className="flex flex-col justify-between gap-10 pb-4 md:flex-row">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
              <Input
                placeholder="Search claim"
                className="pl-10 w-full md:w-[calc(50%-1rem)]"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {}}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 md:flex-row">
            <Select
              value={selectedDesignation}
              onValueChange={setSelectedDesignation}
            >
              <SelectTrigger className="w-full md:w-[calc(50%-0.5rem)]">
                <SelectValue placeholder="Designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales Executive</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-full md:w-[calc(50%-0.5rem)]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <DatePicker
              date={selectedDate}
              onSelect={setSelectedDate}
              className="w-full md:w-[calc(50%-0.5rem)]"
            />
          </div>
        </div>

        <DataTable 
          columns={createColumns()} 
          data={mockData}
        />
      </div>
    </div>
  );
} 