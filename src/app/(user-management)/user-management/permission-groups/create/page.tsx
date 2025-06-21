'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { usePermissions } from '@/features/user-managment/permissions/hooks/usePermissions';
import { usePermissionGroups } from '@/features/user-managment/permission-groups/hooks/usePermissionGroups';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, Home, Users2 } from 'lucide-react';
import { PermissionsMultiSelectModal } from '@/components/modals/permissions-multiselect-modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const userTypeOptions = [
  { label: 'Permanent', value: 'permanent' },
  { label: 'Temporary', value: 'temporary' },
];

const PermissionGroupCreatePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const permissionGroupId = searchParams.get('permissionGroupId');
  const isEditMode = mode === 'edit' && permissionGroupId;

  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [userType, setUserType] = useState('');
  const [roleId, setRoleId] = useState('');

  const { permissions } = usePermissions();
  const { createPermissionGroup, updatePermissionGroup, getPermissionGroup } = usePermissionGroups();
  const groupQuery = getPermissionGroup(permissionGroupId || '');

  useEffect(() => {
    if (isEditMode && groupQuery.data?.data) {
      setName(groupQuery.data.data.name || '');
      setSelectedPermissions(groupQuery.data.data.permissions || []);
      setUserType(groupQuery.data.data.userType || '');
      setRoleId(groupQuery.data.data.roleId || '');
    }
  }, [isEditMode, groupQuery.data]);

  const handleCancel = () => {
    router.push('/user-management/permission-groups');
  };

  const handleSubmit = async () => {
    if (!name || selectedPermissions.length === 0 || !userType) {
      toast.error('Please fill all required fields');
      return;
    }
    const payload = {
      name,
      permissions: selectedPermissions,
      userType,
      roleId: roleId || undefined,
    };
    try {
      if (isEditMode) {
        toast.loading('Updating group...', { id: 'pg-action' });
        await updatePermissionGroup.mutateAsync({ permissionGroupId: permissionGroupId!, data: payload });
        toast.success('Group updated successfully!', { id: 'pg-action' });
      } else {
        toast.loading('Creating group...', { id: 'pg-action' });
        await createPermissionGroup.mutateAsync(payload);
        toast.success('Group created successfully!', { id: 'pg-action' });
      }
      router.push('/user-management/permission-groups');
    } catch {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} group. Please try again.`, { id: 'pg-action' });
    }
  };

  if (isEditMode && groupQuery.isLoading) {
    return (
      <section className="flex items-center justify-center h-full">
        <div>Loading...</div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg bg-white p-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/user-management/permission-groups"
                className="flex items-center gap-1"
              >
                <Home className="h-3 w-3" /> Permission Groups
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isEditMode ? 'Edit Group' : 'Create Group'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <Link
            href="/user-management/permission-groups"
            className="hover:bg-freshleaf/30 rounded-lg bg-neutral-200 p-2 text-neutral-500"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold">{isEditMode ? 'Edit Permission Group' : 'Create New Permission Group'}</h1>
            <p className="text-sm text-neutral-500">
              {isEditMode ? 'Update group details' : 'Provide information to create a group'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4">
        <div className="bg-background rounded-lg p-2 text-lg font-medium">
          Group Information
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="font-medium">Name</label>
            <Input
              placeholder="Group name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium">Permissions</label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setPermissionsModalOpen(true)}
            >
              {selectedPermissions.length > 0
                ? `${selectedPermissions.length} selected`
                : 'Select Permissions'}
            </Button>
          </div>
          <div className="space-y-2">
            <label className="font-medium">User Type</label>
            <Select
              value={userType}
              onValueChange={setUserType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                {userTypeOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="font-medium">Role ID</label>
            <Input
              placeholder="Role ID"
              value={roleId}
              onChange={e => setRoleId(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            createPermissionGroup.isPending ||
            updatePermissionGroup.isPending ||
            !name ||
            selectedPermissions.length === 0 ||
            !userType
          }
        >
          {isEditMode
            ? (updatePermissionGroup.isPending ? 'Updating...' : 'Update Group')
            : (createPermissionGroup.isPending ? 'Creating...' : 'Create Group')}
        </Button>
      </div>
      <PermissionsMultiSelectModal
        open={permissionsModalOpen}
        onOpenChange={setPermissionsModalOpen}
        selectedPermissions={selectedPermissions}
        setSelectedPermissions={setSelectedPermissions}
      />
    </section>
  );
};

export default PermissionGroupCreatePage;
                  