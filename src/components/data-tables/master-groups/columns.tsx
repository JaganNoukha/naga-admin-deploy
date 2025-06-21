"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type MasterGroup = {
  groupId: string
  groupName: string
  displayName: string
  onEdit?: (group: MasterGroup) => void;
  onViewLogs?: (group: MasterGroup) => void;
}

export const columns: ColumnDef<MasterGroup>[] = [
  {
    id: "serialNumber",
    header: "S.No",
    cell: ({ row }) => {
      const index = row.index;
      return index < 9 ? `0${index + 1}` : `${index + 1}`;
    },
  },
  {
    accessorKey: "groupName",
    header: "Group Name",
  },
  {
    accessorKey: "displayName",
    header: "Display Name",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const group = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => row.original.onEdit?.(group)}
            >
              View & Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => row.original.onViewLogs?.(group)}
            >
              Logs
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 