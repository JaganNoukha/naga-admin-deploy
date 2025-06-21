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
import { Switch } from '@/components/ui/switch';

export interface PermissionGroup {
  permissionGroupId: string;
  name: string;
  permissions: string[];
  isActive: boolean;
  description: string;
  onLogs?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
  onToggleActive?: (value: boolean) => void;
  toggleLoading?: boolean;
}

export const columns: ColumnDef<PermissionGroup>[] = [
  {
    accessorKey: 'name',
    header: 'Group Name',
  },
  {
    id: 'permissionCount',
    header: 'Permission Count',
    cell: ({ row }) => row.original.permissions.length,
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 min-w-[120px]">
        <Switch
          checked={row.original.isActive}
          onCheckedChange={row.original.onToggleActive}
          disabled={row.original.toggleLoading}
        />
        <span className="inline-block w-[60px] text-left">
          {row.original.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    ),
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
];
