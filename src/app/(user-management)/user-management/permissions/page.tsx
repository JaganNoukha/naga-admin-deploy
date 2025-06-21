'use client';
import React, { useState, useEffect } from 'react';
import { columns } from '@/components/data-tables/permissions/columns';
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
import { usePermissions } from '@/features/user-managment/permissions/hooks/usePermissions';
import Loading from '@/components/ui/loading';
import GenericError from '@/components/ui/generic-error';
import EmptyState from '@/components/ui/empty-state';
import SpringBoard from '@/components/shared/spring-board';

const PermissionsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>();
  // Add local state for permission toggling
  const [localPermissions, setLocalPermissions] = useState<any[]>([]);
  const [toggleLoading, setToggleLoading] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 700);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { permissions, updatePermission } = usePermissions({
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(selectedStatus && { status: selectedStatus }),
  });

  // Sync localPermissions with fetched data
  useEffect(() => {
    if (permissions.data?.data) {
      setLocalPermissions(permissions.data.data);
    }
  }, [permissions.data?.data]);

  const handleAddPermission = () => {
    router.push('/user-management/permissions/create');
  };

  // Handler to toggle isActive with updatePermission API (optimistic update)
  const handleToggleActive = async (permissionId: string, value: boolean) => {
    // Optimistically update UI
    setLocalPermissions((prev) =>
      prev.map((perm) =>
        perm.permissionId === permissionId
          ? { ...perm, isActive: value }
          : perm
      )
    );
    setToggleLoading((prev) => ({ ...prev, [permissionId]: true }));
    try {
      await updatePermission.mutateAsync({
        permissionId,
        data: { isActive: value },
      });
      // No need to update localPermissions again, already done optimistically
    } catch (error) {
      // Revert on error
      setLocalPermissions((prev) =>
        prev.map((perm) =>
          perm.permissionId === permissionId
            ? { ...perm, isActive: !value }
            : perm
        )
      );
      // Optionally show error feedback
      // alert('Failed to update status');
    } finally {
      setToggleLoading((prev) => ({ ...prev, [permissionId]: false }));
    }
  };

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium">Permissions</div>
        <SpringBoard />
      </div>
      <div className="w-full rounded-lg bg-white p-4 space-y-4">
        <div className="flex flex-col justify-between gap-10 pb-4 md:flex-row">
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <Input
              placeholder="Search permission name"
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
            <Button onClick={handleAddPermission}>
              <Plus className="w-4 h-4 mr-2" />
              Add Permission
            </Button>
          </div>
        </div>
        <div>
          {permissions.isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Loading text="Loading permissions..." />
            </div>
          ) : permissions.error ? (
            <div className="h-64 flex items-center justify-center">
              <GenericError text="Error loading permissions. Please try again." />
            </div>
          ) : localPermissions && localPermissions.length > 0 ? (
            <DataTable
              columns={columns}
              data={localPermissions.map((permission: any) => ({
                ...permission,
                onLogs: () => {},
                onUpdate: () => {
                  router.push(
                    `/user-management/permissions/create?mode=edit&permissionId=${permission.permissionId}`
                  );
                },
                onDelete: () => {},
                onToggleActive: (value: boolean) =>
                  handleToggleActive(permission.permissionId, value),
                toggleLoading: !!toggleLoading[permission.permissionId], // pass loading state if needed
              }))}
            />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <EmptyState text="No permissions found. Start by adding your first permission." />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PermissionsPage;
