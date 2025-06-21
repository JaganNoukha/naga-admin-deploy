'use client';

import { columns } from '@/components/data-tables/master-schema/columns';
import SpringBoard from '@/components/shared/spring-board';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import NavKeys from '@/constants/navkeys';
import { useMasterSchema } from '@/features/master-managment/hooks/useMasterSchema';
import { PlusIcon } from 'lucide-react';
import { RecordDeleteModal } from '@/components/modals/delete-record-alert';
import Loading from '@/components/ui/loading';
import GenericError from '@/components/ui/generic-error';

const MasterSchemaPage = () => {
  const router = useRouter();
  const { schemas, deleteSchema } = useMasterSchema();

  const [open, setOpen] = useState(false);
  const [schemaToDelete, setSchemaToDelete] = useState<{
    schemaName: string;
  } | null>(null);

  const handleEdit = (schema: any) => {
    const path = `${NavKeys.MasterSchemaCreation}?edit=${encodeURIComponent(schema.name)}`;
    router.push(path);
  };

  const handleAddNew = () => {
    router.push('/master-management/master-schema/master-schema-creation');
  };

  const confirmDelete = (schema: any) => {
    setSchemaToDelete({ schemaName: schema.name });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!schemaToDelete) return;
    toast.loading('Deleting master schema...', { id: 'delete-schema' });
    deleteSchema.mutate(schemaToDelete.schemaName, {
      onSuccess: () => {
        toast.success('Master schema deleted successfully!', {
          id: 'delete-schema',
        });
        setOpen(false);
        setSchemaToDelete(null);
      },
      onError: () => {
        toast.error('Failed to delete master schema. Please try again.', {
          id: 'delete-schema',
        });
      },
    });
  };

  if (schemas.error) {
    return (
      <section className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium">Master Schema</div>
          <SpringBoard />
        </div>
        <div className="w-full rounded-lg bg-white p-4">
          <div className="flex h-64 items-center justify-center">
            <GenericError text="Error loading master schema. Please try again." />
          </div>
        </div>
      </section>
    );
  }

  const enrichedData =
    schemas.data?.data.map((schema: any) => ({
      ...schema,
      onEdit: () => handleEdit(schema),
      onDelete: () => confirmDelete(schema),
    })) || [];

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium">Master Schema</div>
        <SpringBoard />
      </div>

      <div className="w-full rounded-lg bg-white p-4">
        <div className="flex justify-end pb-4">
          <Button disabled={schemas.isLoading} onClick={handleAddNew}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Schema
          </Button>
        </div>
        {schemas.isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loading text="Loading master schema..." />
          </div>
        ) : (
          <DataTable columns={columns} data={enrichedData} />
        )}
        {schemas.error && (
          <div className="flex h-64 items-center justify-center">
            <GenericError text="Error loading master schema. Please try again." />
          </div>
        )}
      </div>

      <RecordDeleteModal
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) setSchemaToDelete(null);
        }}
        onSubmit={handleSubmit}
        isSubmitting={deleteSchema.isPending}
      />
    </section>
  );
};

export default MasterSchemaPage;
