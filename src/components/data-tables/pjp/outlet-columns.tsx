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

interface OutletRecord {
  id: string;
  day: string;
  outlet: string;
  onSwapOutlet?: () => void;
  onViewMap?: () => void;
}

export const columns: ColumnDef<OutletRecord>[] = [
  {
    accessorKey: 'day',
    header: 'Day',
  },
  {
    accessorKey: 'outlet',
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
            <DropdownMenuItem
              className="border-b border-neutral-200"
              onClick={() => row.original.onSwapOutlet?.()}
            >
              Swap Outlet
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => row.original.onViewMap?.()}>
              View Map
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

