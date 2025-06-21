'use client';

import { columns } from '@/components/data-tables/master-groups/columns';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useMasterGroups } from '@/features/master-managment/hooks/useMasterGroups';
import { GroupModal } from '@/components/modals/master-groups-modal';
import SpringBoard from '@/components/shared/spring-board';
import Loading from '@/components/ui/loading';
import GenericError from '@/components/ui/generic-error';

const MasterGroupsPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<null | {
    groupId: string;
    groupName: string;
    displayName: string;
  }>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  const { groups, createGroup, updateGroup } = useMasterGroups();

  const handleSubmit = (data: { groupName: string; displayName: string }) => {
    if (mode === 'create') {
      createGroup.mutate(data, {
        onSuccess: () => setOpen(false),
      });
    } else if (mode === 'edit' && selectedGroup) {
      updateGroup.mutate(
        { groupId: selectedGroup.groupId, data },
        {
          onSuccess: () => {
            setOpen(false);
            setSelectedGroup(null);
          },
        }
      );
    }
  };

  const handleEdit = (group: {
    groupId: string;
    groupName: string;
    displayName: string;
  }) => {
    setSelectedGroup(group);
    setMode('edit');
    setOpen(true);
  };

  const handleViewLogs = (group: { groupId: string }) => {
    console.log('Im testing the logs', group.groupId);
  };

  const handleAddNew = () => {
    setMode('create');
    setSelectedGroup(null);
    setOpen(true);
  };

  if (groups.error) {
    return (
      <section className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium">Master Groups</div>
          <SpringBoard />
        </div>
        <div className="w-full rounded-lg bg-white p-4">
          <div className="flex h-64 items-center justify-center">
            <GenericError text="Error loading master groups. Please try again." />
          </div>
        </div>
      </section>
    );
  }

  const enrichedData =
    groups.data?.data.map((group: any) => ({
      ...group,
      onEdit: handleEdit,
      onViewLogs: handleViewLogs,
    })) || [];

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium">Master Groups</div>
        <SpringBoard />
      </div>
      <div className="w-full rounded-lg bg-white p-4">
        <div className="flex justify-end pb-4">
          <Button disabled={groups.isLoading} onClick={handleAddNew}>
            <PlusIcon />
            Add New Group
          </Button>
        </div>
        {groups.isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loading text="Loading master groups..." />
          </div>
        ) : (
          <DataTable columns={columns} data={enrichedData} />
        )}
        <GroupModal
          open={open}
          onOpenChange={setOpen}
          onSubmit={handleSubmit}
          initialData={selectedGroup}
          mode={mode}
          isSubmitting={
            mode === 'create' ? createGroup.isPending : updateGroup.isPending
          }
        />
      </div>
    </section>
  );
};

export default MasterGroupsPage;
