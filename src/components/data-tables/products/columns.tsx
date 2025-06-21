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

interface Product {
  skuCode: string;
  productName: string;
  brand: string;
  category: string;
  subCategory: string;
  warehouse: string;
  onEdit?: () => void;
  onManageWarehouse?: () => void;
  onViewLogs?: () => void;
}

interface MasterRecordMaps {
  brandMap: Record<string, { brandName: string }>;
  categoryMap: Record<string, { categoryName: string }>;
  subcategoryMap: Record<string, { subcategoryName: string }>;
}

export const createColumns = (recordMaps: MasterRecordMaps) => {
  return [
    {
      id: 'sno',
      header: 'S.No',
      cell: ({ row }) => formatWithLeadingZero(row.index + 1),
    },
    {
      accessorKey: 'skuCode',
      header: 'SKU Code',
    },
    {
      accessorKey: 'productName',
      header: 'Product Name',
    },
    {
      accessorKey: 'brandId',
      header: 'Brand',
      cell: ({ row }) => {
        const brandId = row.getValue('brandId') as string;
        return recordMaps?.brand?.[brandId]?.brandName || brandId;
      },
    },
    {
      accessorKey: 'categoryId',
      header: 'Category',
      cell: ({ row }) => {
        const categoryId = row.getValue('categoryId') as string;
        return recordMaps?.category?.[categoryId]?.categoryName || categoryId;
      },
    },
    {
      accessorKey: 'subcategoryId',
      header: 'Sub Category',
      cell: ({ row }) => {
        const subcategoryId = row.getValue('subcategoryId') as string;
        return recordMaps?.subcategory?.[subcategoryId]?.subcategoryName || subcategoryId;
      },
    },
    {
      accessorKey: 'warehouses',
      header: 'Warehouse',
      cell: ({ row }) => {
        const warehouses = row.getValue('warehouses');
        const count = Array.isArray(warehouses) ? warehouses.length : 0;
        return formatWithLeadingZero(count);
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
                onClick={() => row.original.onManageWarehouse?.()}
              >
                Manage Warehouse
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => row.original.onViewLogs?.()}>
                Logs
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ] as ColumnDef<Product>[];
};
