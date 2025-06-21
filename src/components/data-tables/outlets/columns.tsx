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

interface Outlet {
  outletId: string;
  outletName: string;
  outlettypeId: string;
  warehouseId: string;
  outletStatus: string;
  onEdit?: () => void;
  onViewLogs?: () => void;
}

interface MasterRecordMaps {
  outlettypeMap: Record<string, { outlettypeName: string }>;
  warehouseMap: Record<string, { warehouseName: string }>;
}

export const columns = (recordMaps: MasterRecordMaps, warehouseMap: Record<string, { warehouseName: string }>): ColumnDef<Outlet>[] => [
  {
    id: 'sno',
    header: 'S.No',
    cell: ({ row }) => formatWithLeadingZero(row.index + 1),
  },
  {
    accessorKey: 'outletName',
    header: 'Outlet Name',
  },
  {
    accessorKey: 'outlettypeId',
    header: 'Outlet Type',
    cell: ({ row }) => {
      const outlettypeId = row.getValue('outlettypeId') as string;
      return recordMaps?.outlettype?.[outlettypeId]?.outlettypeName || outlettypeId;
    },
  },
  {
    accessorKey: 'warehouseId',
    header: 'Warehouse',
    cell: ({ row }) => {
      const warehouseId = row.getValue('warehouseId') as string;
      return warehouseMap?.[warehouseId]?.warehouseName || warehouseId;
    },
  },
  {
    accessorKey: 'outletStatus',
    header: 'Status',
    cell: ({ row }) => row.getValue('outletStatus') || '-',
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
            <DropdownMenuItem onClick={() => row.original.onViewLogs?.()}>
              Logs
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
