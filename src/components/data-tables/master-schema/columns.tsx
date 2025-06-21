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

interface SchemaField {
  name: string;
  type: string;
  required?: boolean;
  unique?: boolean;
}

interface Schema {
  name: string;
  displayName: string;
  fields: SchemaField[];
  groupId: string;
  onEdit?: (group: Schema) => void;
  onDelete?: (group: Schema) => void;
}

export const columns: ColumnDef<Schema>[] = [
  {
    id: 'sno',
    header: 'S.No',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'displayName',
    header: 'Display Name',
  },
  {
    accessorKey: 'fields',
    header: 'Fields',
    cell: ({ row }) => {
      const fields = row.original.fields;
      return fields.map((f) => f.name).join(', ');
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const group = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => row.original.onEdit?.(group)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => row.original.onDelete?.(group)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
