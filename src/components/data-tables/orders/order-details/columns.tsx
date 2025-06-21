'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { formatWithLeadingZero } from '@/lib/utils';

interface OrderDetail {
  productName: string;
  quantity: number;
  mrp: number;
  schemeApplied: string;
  case: string;
  unit: string;
  price: number;
  onEdit?: () => void;
}

export const createColumns = (): ColumnDef<OrderDetail>[] => [
  {
    id: 'sno',
    header: 'S.No',
    cell: ({ row }) => formatWithLeadingZero(row.index + 1),
  },
  {
    accessorKey: 'productName',
    header: 'Product Name',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
  {
    accessorKey: 'mrp',
    header: 'MRP',
    cell: ({ row }) => `₹${row.getValue('mrp')}`,
  },
  {
    accessorKey: 'schemeApplied',
    header: 'Scheme Applied',
  },
  {
    accessorKey: 'case',
    header: 'Case',
  },
  {
    accessorKey: 'unit',
    header: 'Unit',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => `₹${row.getValue('price')}`,
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => (
      <Button variant="outline" className="bg-[##D8FAE9]" size="sm" onClick={() => row.original.onEdit?.()}>
        Edit
      </Button>
    ),
  },
];
