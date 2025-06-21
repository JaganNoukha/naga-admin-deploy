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

export interface User {
  _id: string;
  name: string;
  userType: string;
  roleId: string;
  warehouse: Array<{ warehouseId: string }>;
  onLogs?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}

interface MasterRecordMaps {
  roleMap: Record<string, { roleName: string }>;
}

export const createColumns = (recordMaps: MasterRecordMaps) => {
  return [
    {
      id: 'sno',
      header: 'S.No',
      cell: ({ row }) => formatWithLeadingZero(row.index + 1),
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'userType',
      header: 'User Type',
    },
    {
      accessorKey: 'roleId',
      header: 'Role',
      cell: ({ row }) => {
        const roleId = row.getValue('roleId') as string;
        return recordMaps?.role?.[roleId]?.roleName || roleId;
      },
    },
    {
      accessorKey: 'warehouse',
      header: 'Warehouse',
      cell: ({ row }) => {
        const warehouses = row.original.warehouse;
        return warehouses.length;
      },
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
            <DropdownMenuItem onClick={() => row.original.onLogs?.()}>
              Logs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => row.original.onUpdate?.()}>
              Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => row.original.onDelete?.()}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ] as ColumnDef<User>[];
};
