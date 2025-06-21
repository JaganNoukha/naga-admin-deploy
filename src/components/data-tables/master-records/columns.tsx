'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch' // Assuming you have a custom or shadcn switch component
import { MoreVertical } from 'lucide-react'
import { camelCaseToReadable } from '@/utils/string-utils'
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

interface EnrichedRecord {
  id: string;
  [key: string]: string | number | boolean | (() => void);
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive?: (value: boolean) => void; // optional toggle handler
}

export const generateColumns = (fields: SchemaField[]): ColumnDef<EnrichedRecord>[] => {
  const normalColumns: ColumnDef<EnrichedRecord>[] = [];
  let isActiveColumn: ColumnDef<EnrichedRecord> | null = null;

  fields.forEach((field) => {
    if (field.name === "isActive") {
      isActiveColumn = {
        accessorKey: field.name,
        header: camelCaseToReadable(field.name),
        cell: ({ row }) => {
          const record = row.original;
          const isActive = Boolean(record[field.name]);

          return (
            <Switch
              checked={isActive}
              onCheckedChange={(value) => record.onToggleActive?.(value)}
            />
          );
        },
      };
    } else {
      normalColumns.push({
        accessorKey: field.name,
        header: camelCaseToReadable(field.name),
      });
    }
  });
  const actionColumn: ColumnDef<EnrichedRecord> = {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const record = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => record.onEdit?.()}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => record.onDelete?.()}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  return [...normalColumns, ...(isActiveColumn ? [isActiveColumn] : []), actionColumn];
};
