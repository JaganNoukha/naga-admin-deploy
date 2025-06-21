'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatWithLeadingZero } from '@/lib/utils';

interface SalesReturn {
  date: string;
  name: string;
  type: string;
  criteriaType: string;
  validity: string;
  productApplied: string;
  status: string;
  onViewReport?: () => void;
  onViewLogs?: () => void;
}

export const createColumns = () => {
  return [
    {
      id: 'sno',
      header: 'S.No',
      cell: ({ row }) => formatWithLeadingZero(row.index + 1),
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'criteriaType',
      header: 'Criteria Type',
    },
    {
      accessorKey: 'validity',
      header: 'Validity',
    },
    {
      accessorKey: 'productApplied',
      header: 'Product Applied',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="border-b border-neutral-200"
              onClick={() => row.original.onViewReport?.()}
            >
              View Report
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => row.original.onViewLogs?.()}>
              Logs
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ] as ColumnDef<SalesReturn>[];
};
