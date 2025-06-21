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

interface Order {
  outletName: string;
  outletType: string;
  orderDate: string;
  orderId: string;
  weight: number;
  amount: number;
  warehouse: string;
  status: string;
  onOrderDetails?: () => void;
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
      accessorKey: 'outletName',
      header: 'Outlet Name',
    },
    {
      accessorKey: 'outletType',
      header: 'Outlet Type',
    },
    {
      accessorKey: 'orderDate',
      header: 'Order Date',
    },
    {
      accessorKey: 'orderId',
      header: 'Order ID',
    },
    {
      accessorKey: 'weight',
      header: 'Weight',
      cell: ({ row }) => `${row.getValue('weight')} kg`,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => `₹${row.getValue('amount')}`,
    },
    {
      accessorKey: 'warehouse',
      header: 'Warehouse',
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
              onClick={() => row.original.onOrderDetails?.()}
            >
              Order Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => row.original.onViewLogs?.()}>
              Logs
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ] as ColumnDef<Order>[];
};