'use client';

import { useEffect, useState } from 'react';
import { useMasterRecords } from '@/features/master-managment/hooks/useMasterRecords';
import { useMasterSchema } from '@/features/master-managment/hooks/useMasterSchema';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PlusIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { generateColumns } from '@/components/data-tables/master-records/columns';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import Loading from '@/components/ui/loading';
import SpringBoard from '@/components/shared/spring-board';
import GenericError from '@/components/ui/generic-error';

interface RecordData {
  _id: string;
  [key: string]: string | number;
}

interface EnrichedRecord extends RecordData {
  id: string;
  onEdit: () => void;
  onDelete: () => void;
}

interface ApiResponse {
  data: {
    data: RecordData[];
  };
}

const MasterRecordsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const schemaName = searchParams.get('schemaName');
  const { schemas, schemaById } = useMasterSchema(schemaName || undefined);
  const { records, deleteRecord } = useMasterRecords(schemaName || '');

  const [columns, setColumns] = useState<ColumnDef<EnrichedRecord>[]>([]);
  const [enrichedData, setEnrichedData] = useState<EnrichedRecord[]>([]);

  useEffect(() => {
    if (schemaName && schemaById?.data?.data?.fields) {
      const generatedColumns = generateColumns(schemaById.data.data.fields);
      setColumns(generatedColumns as ColumnDef<EnrichedRecord>[]);
    }
  }, [schemaName, schemaById?.data?.data?.fields]);

  useEffect(() => {
    const response = records.data as ApiResponse | undefined;
    if (response?.data?.data && Array.isArray(response.data.data)) {
      const enriched = response.data.data.map((record: RecordData) => ({
        ...record,
        id: record._id,
        onEdit: () => handleEdit(record),
        onDelete: () => handleDelete(record._id),
      }));
      setEnrichedData(enriched);
    } else {
      setEnrichedData([]);
    }
  }, [records.data]);

  const handleEdit = (record: RecordData) => {
    const dynamicIdField = `${schemaName}Id`;
    const recordId = record[dynamicIdField] as string;
    router.push(
      `/master-management/master-records/master-records-manage?edit=${recordId}&schemaName=${schemaName}&id=${recordId}`
    );
  };

  const handleDelete = async (recordId: string) => {
    try {
      await deleteRecord.mutateAsync({
        masterName: schemaName || '',
        recordId,
      });
      toast.success('Record deleted successfully');
    } catch {
      toast.error('Failed to delete record');
    }
  };

  const handleAddNew = () => {
    router.push(
      `/master-management/master-records/master-records-manage?schemaName=${schemaName}`
    );
  };

  if (schemas.error || (schemaName && schemaById?.error) || records.error) {
    return (
      <section className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium">Master Records</div>
          <SpringBoard />
        </div>
        <div className="w-full rounded-lg bg-white p-4">
          <div className="flex h-64 items-center justify-center">
            <GenericError text="Error loading master records. Please try again." />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium">Master Records</div>
        <SpringBoard />
      </div>
      <div className="w-full rounded-lg bg-white p-4">
        <div className="flex justify-end pb-4">
          <Button disabled={records.isLoading} onClick={handleAddNew}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Record
          </Button>
        </div>
        {schemas.isLoading ||
        (schemaName && schemaById?.isLoading) ||
        records.isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loading text="Loading master records..." />
          </div>
        ) : (
          <DataTable columns={columns} data={enrichedData} />
        )}
      </div>
    </section>
  );
};

export default MasterRecordsPage;
