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
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

interface Schemes {
  id: string;
  skuCode: string;
  productName: string;
  brandId: string;
  categoryId: string;
  subCategoryId: string;
  date: string;
  type: string;
  criteriaType: string;
  validity: string;
  productApplied: string;
  status: string;
  onEdit?: () => void;
  onViewLogs?: () => void;
}

export const columns: ColumnDef<Schemes>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: 'productName',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => row.getValue('type') || '-',
  },
  {
    accessorKey: 'criteriaType',
    header: 'Criteria Type',
    cell: ({ row }) => row.getValue('criteriaType') || '-',
  },
  {
    accessorKey: 'validity',
    header: 'Validity',
    cell: ({ row }) => row.getValue('validity') || '-',
  },
  {
    accessorKey: 'productApplied',
    header: 'Product Applied',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const isActive = status === 'Active';
      
      return (
        <Switch
          checked={isActive}
          onCheckedChange={(checked) => {
            console.log('Status changed:', checked ? 'Active' : 'Inactive');
          }}
        />
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
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
            onClick={() => row.original.onViewLogs?.()}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
