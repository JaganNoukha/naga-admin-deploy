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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatWithLeadingZero } from '@/lib/utils';

interface Warehouse {
  warehouseId: string;
  warehouseName: string;
  address: {
    streetAddress: string;
    location: string;
  };
  onEdit?: () => void;
  onViewLogs?: () => void;
  onDelete?: () => void;
}

export const columns: ColumnDef<Warehouse>[] = [
  {
    id: 'sno',
    header: 'S.No',
    cell: ({ row }) => formatWithLeadingZero(row.index + 1),
  },
  {
    accessorKey: 'warehouseName',
    header: 'Warehouse Name',
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => {
      const address = row.getValue('address') as {
        streetAddress: string;
        location: string;
      };
      const fullAddress = `${address.streetAddress}`;
      const truncatedAddress =
        fullAddress.length > 30
          ? fullAddress.substring(0, 30) + '...'
          : fullAddress;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-pointer">{truncatedAddress}</span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p>{fullAddress}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
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
              View & Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="border-b border-neutral-200"
              onClick={() => row.original.onViewLogs?.()}
            >
              Logs
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => row.original.onDelete?.()}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export type { Warehouse };
