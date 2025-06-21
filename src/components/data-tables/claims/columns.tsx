'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export const createColumns = (): ColumnDef<any>[] => [
  {
    accessorKey: 'claimId',
    header: 'Claim ID',
  },
  {
    accessorKey: 'userName',
    header: 'User Name',
  },
  {
    accessorKey: 'designation',
    header: 'Designation',
  },
  {
    accessorKey: 'claimDate',
    header: 'Claim Date',
    cell: ({ row }) => {
      const date = new Date(row.original.claimDate);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: 'claimType',
    header: 'Claim Type',
  },
  {
    accessorKey: 'applicableAmount',
    header: 'Applicable Amount',
    cell: ({ row }) => {
      return `₹${row.original.applicableAmount.toFixed(2)}`;
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
    cell: ({ row }) => {
      return `₹${row.original.totalAmount.toFixed(2)}`;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => row.original.onView()}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
]; 