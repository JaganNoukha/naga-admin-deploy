'use client';

import React, { useState, useEffect } from 'react';
import { columns } from '@/components/data-tables/permission-groups/columns';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePermissionGroups } from '@/features/user-managment/permission-groups/hooks/usePermissionGroups';
import Loading from '@/components/ui/loading';
import GenericError from '@/components/ui/generic-error';
import EmptyState from '@/components/ui/empty-state';
import SpringBoard from '@/components/shared/spring-board';

const PermissionGroupsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [localGroups, setLocalGroups] = useState<any[]>([]);
  const [toggleLoading, setToggleLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 700);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { permissionGroups, updatePermissionGroup } = usePermissionGroups({
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(selectedStatus && { status: selectedStatus }),
  });

  // Sync localGroups with fetched data
  useEffect(() => {
    if (permissionGroups.data?.data) {
      setLocalGroups(permissionGroups.data.data);
    }
  }, [permissionGroups.data?.data]);

  const handleAddGroup = () => {
    router.push('/user-management/permission-groups/create');
  };

  // Optimistic toggle handler
  const handleToggleActive = async (permissionGroupId: string, value: boolean) => {
    setLocalGroups((prev) =>
      prev.map((group) =>
        group.permissionGroupId === permissionGroupId
          ? { ...group, isActive: value }
          : group
      )
    );
    setToggleLoading((prev) => ({ ...prev, [permissionGroupId]: true }));
    try {
      await updatePermissionGroup.mutateAsync({
        permissionGroupId,
        data: { isActive: value },
      });
      // No need to update localGroups again, already done optimistically
    } catch (error) {
      // Revert on error
      setLocalGroups((prev) =>
        prev.map((group) =>
          group.permissionGroupId === permissionGroupId
            ? { ...group, isActive: !value }
            : group
        )
      );
      // Optionally show error feedback
    } finally {
      setToggleLoading((prev) => ({ ...prev, [permissionGroupId]: false }));
    }
  };

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium">Permission Groups</div>
        <SpringBoard />
      </div>
      <div className="w-full rounded-lg bg-white p-4 space-y-4">
        <div className="flex flex-col justify-between gap-10 pb-4 md:flex-row">
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <Input
              placeholder="Search group name"
              className="md:w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="md:w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleAddGroup}>
              <Plus className="w-4 h-4 mr-2" />
              Add Group
            </Button>
          </div>
        </div>
        <div>
          {permissionGroups.isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Loading text="Loading permission groups..." />
            </div>
          ) : permissionGroups.error ? (
            <div className="h-64 flex items-center justify-center">
              <GenericError text="Error loading permission groups. Please try again." />
            </div>
          ) : localGroups && localGroups.length > 0 ? (
            <DataTable
              columns={columns}
              data={localGroups.map((group: any) => ({
                ...group,
                onLogs: () => {},
                onUpdate: () => {
                  router.push(
                    `/user-management/permission-groups/create?mode=edit&permissionGroupId=${group.permissionGroupId}`
                  );
                },
                onDelete: () => {},
                onToggleActive: (value: boolean) =>
                  handleToggleActive(group.permissionGroupId, value),
                toggleLoading: !!toggleLoading[group.permissionGroupId],
              }))}
            />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <EmptyState text="No permission groups found. Start by adding your first group." />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PermissionGroupsPage;

