'use client';

import { ArrowLeftIcon, Home, PlusIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePermissions } from '@/features/user-managment/permissions/hooks/usePermissions';
import { toast } from 'sonner';
import { IconShieldLock } from '@tabler/icons-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const moduleOptions = [
  { label: 'Order', value: 'order' },
  { label: 'PJP', value: 'pjp' },
  { label: 'Outlets', value: 'outlets' },
  { label: 'Warehouse', value: 'warehouse' },
  { label: 'Claims', value: 'claims' },
];

const codeOptions = [
  { label: 'Create', value: 'create' },
  { label: 'Delete', value: 'delete' },
  { label: 'View', value: 'view' },
  { label: 'Log', value: 'log' },
  { label: 'Edit', value: 'edit' },
];

const PermissionCreatePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const permissionId = searchParams.get('permissionId');
  const isEditMode = mode === 'edit' && permissionId;
  const { createPermission, updatePermission, getPermission } = usePermissions();
  const permissionQuery = getPermission(permissionId || '');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [module, setModule] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    if (
      isEditMode &&
      !permissionQuery.isLoading &&
      permissionQuery.data?.data
    ) {
      const [mod, cod] = (permissionQuery.data.data.code || '').split(':');
      setName(permissionQuery.data.data.name || '');
      setDescription(permissionQuery.data.data.description || '');
      setModule(mod || '');
      setCode(cod || '');
    }
  }, [isEditMode, permissionQuery.isLoading, permissionQuery.data]);

  const handleCancel = () => {
    router.push('/user-management/permissions');
  };

  const handleSubmit = async () => {
    if (!name || !description || !module || !code) {
      toast.error('Please fill all fields');
      return;
    }
    const payload = {
      name,
      description,
      code: `${module}:${code}`,
    };
    try {
      if (isEditMode) {
        toast.loading('Updating permission...', { id: 'perm-action' });
        await updatePermission.mutateAsync({ permissionId: permissionId!, data: payload });
        toast.success('Permission updated successfully!', { id: 'perm-action' });
      } else {
        toast.loading('Creating permission...', { id: 'perm-action' });
        await createPermission.mutateAsync(payload);
        toast.success('Permission created successfully!', { id: 'perm-action' });
      }
      router.push('/user-management/permissions');
    } catch {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} permission. Please try again.`, { id: 'perm-action' });
    }
  };

  if (isEditMode && permissionQuery.isLoading) {
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
                href="/user-management/permissions"
                className="flex items-center gap-1"
              >
                <Home className="h-3 w-3" /> Permissions
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isEditMode ? 'Edit Permission' : 'Create Permission'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/user-management/permissions"
              className="hover:bg-freshleaf/30 rounded-lg bg-neutral-200 p-2 text-neutral-500"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">
                {isEditMode ? 'Edit Permission' : 'Create New Permission'}
              </h1>
              <p className="text-sm text-neutral-500">
                Provide information to {isEditMode ? 'edit' : 'create'} a permission
              </p>
            </div>
          </div>
          <div className="bg-blue-100 w-fit rounded-full p-2">
            <IconShieldLock className="text-freshleaf h-5 w-5" />
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-white p-4">
        <div className="bg-background rounded-lg p-2 text-lg">
          Permission Information
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="font-medium">Name</label>
            <Input
              placeholder="Permission name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium">Module</label>
            <Select
              value={module}
              onValueChange={setModule}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select module" />
              </SelectTrigger>
              <SelectContent>
                {moduleOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="font-medium">Code</label>
            <Select
              value={code}
              onValueChange={setCode}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select code" />
              </SelectTrigger>
              <SelectContent>
                {codeOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="font-medium">Description</label>
            <Input
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
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
            createPermission.isPending ||
            updatePermission.isPending ||
            !name ||
            !description ||
            !module ||
            !code
          }
        >
          {isEditMode
            ? updatePermission.isPending
              ? 'Updating...'
              : 'Update Permission'
            : createPermission.isPending
              ? 'Creating...'
              : 'Create Permission'}
        </Button>
      </div>
    </section>
  );
};

export default PermissionCreatePage;
