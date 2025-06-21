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

interface PjpRecord {
  id: string;
  salesPerson: string;
  noOfDays: number;
  noOfOutlets: number;
  travelTime: string;
  onEdit?: () => void;
  onViewLogs?: () => void;
}

export const columns: ColumnDef<PjpRecord>[] = [
  {
    id: 'sno',
    header: 'S.No',
    cell: ({ row }) => formatWithLeadingZero(row.index + 1),
  },
  {
    accessorKey: 'salesPerson',
    header: 'Sales Person',
  },
  {
    accessorKey: 'noOfDays',
    header: 'No of Days',
  },
  {
    accessorKey: 'noOfOutlets',
    header: 'No of Outlets',
  },
  {
    accessorKey: 'travelTime',
    header: 'Travel Time',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="border-b border-neutral-200"
              onClick={() => row.original.onEdit?.()}
            >
              View Sales Person
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => row.original.onViewLogs?.()}>
              Logs
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
