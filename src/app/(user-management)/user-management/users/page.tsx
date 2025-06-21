'use client';

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
import { PlusIcon, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SpringBoard from '@/components/shared/spring-board';
import Loading from '@/components/ui/loading';
import GenericError from '@/components/ui/generic-error';
import EmptyState from '@/components/ui/empty-state';
import { createColumns } from '@/components/data-tables/users/columns';
import { useUsers } from '@/features/user-managment/users/hooks/useUsers';
import { MasterRecordDropdown } from '@/components/shared/master-record-dropdown';
import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';

const UsersPage = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
  const { recordMaps } = useAppSelector((state) => state.masterRecords);

  const { users } = useUsers({
    ...(selectedRole && { roleId: selectedRole }),
  });

  const handleAddNew = () => {
    router.push('/user-management/users/create-user');
  };

  const handleEdit = (user: any) => {
    router.push(`/user-management/users/create-user?mode=edit&userId=${user.userId}`);
  };

  const handleRefresh = () => {
    users.refetch();
  };

  if (users.isLoading) {
    return (
      <section className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium">Users</div>
          <SpringBoard />
        </div>
        <div className="w-full rounded-lg bg-white p-4">
          <div className="h-64 flex items-center justify-center">
            <Loading text="Loading users..." />
          </div>
        </div>
      </section>
    );
  }

  if (users.error) {
    return (
      <section className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium">Users</div>
          <SpringBoard />
        </div>
        <div className="w-full rounded-lg bg-white p-4">
          <div className="h-64 flex items-center justify-center">
            <GenericError text="Error loading users. Please try again." />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium">Users</div>
        <SpringBoard />
      </div>

      <div className="w-full rounded-lg bg-white p-4 space-y-4">
        <div className="flex flex-col justify-between gap-10 pb-4 md:flex-row">
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <Input placeholder="Search user name" className="md:w-full " />
            <MasterRecordDropdown 
              masterName="role"
              value={selectedRole}
              onChange={setSelectedRole}
              placeholder="Role"
              className="md:w-full"
            />
            <Select>
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
            <Button variant="secondary" onClick={handleRefresh} disabled={users.isFetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${users.isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleAddNew}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Temp User
            </Button>
          </div>
        </div>
        {Array.isArray(users?.data?.data?.items) && users.data.data.items.length > 0 ? (
          <DataTable 
            columns={createColumns(recordMaps)} 
            data={users.data.data.items.map((user: any) => ({
              ...user,
              onUpdate: () => handleEdit(user),
              onViewLogs: () => {},
            }))} 
          />
        ) : (
          <div className="h-64 flex items-center justify-center">
            <EmptyState text="No users found. Start by adding your first user." />
          </div>
        )}
      </div>
    </section>
  );
};

export default UsersPage;
