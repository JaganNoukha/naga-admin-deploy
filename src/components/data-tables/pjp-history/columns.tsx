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

interface PjpRecord {
  date: string;
  day: string;
  salesPerson: string;
  outlets: number;
  onViewMap?: () => void;
}

export const columns: ColumnDef<PjpRecord>[] = [
  {
    accessorKey: 'date',
    header: 'Time & Date',
  },
  {
    accessorKey: 'day',
    header: 'Day',
  },
  {
    accessorKey: 'salesPerson',
    header: 'Sales Person',
  },
  {
    accessorKey: 'outlets',
    header: 'Outlets',
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
            <DropdownMenuItem onClick={() => row.original.onViewMap?.()}>
              View Map
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
