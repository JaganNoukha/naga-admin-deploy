'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMasterRecords } from '@/features/master-managment/hooks/useMasterRecords';
import { useMasterSchema } from '@/features/master-managment/hooks/useMasterSchema';
import { FieldTypes } from '@/constants/master-schema';
import { useMasterCategories } from '@/features/master-managment/hooks/useMasterCategory';

function usePageHooks() {
  const router = useRouter();
  const [fields, setFields] = useState([]);
  const searchParams = useSearchParams();
  const schemaName = searchParams.get('schemaName');
  const editMode = searchParams.get('edit');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>('');

  const { schemas, createSchema, schemaById } = useMasterSchema(
    schemaName || undefined,
    editMode || undefined
  );
  const { recordById, updateRecord, createRecord } = useMasterRecords(
    schemaName || '',
    editMode || undefined
  );
  const {categories } = useMasterCategories();

  interface RecordPayload {
    [key: string]: string | number | boolean;
  }

  interface RecordData {
    _id: string;
    [key: string]: any;
  }

  console.log(recordById,'dsadasd')

  useEffect(() => {
  if (schemaById?.data?.data?.fields) {
    const schemaFields = schemaById.data.data.fields.map((field: any) => ({
      ...field,
      value: '',
    }));
    setFields(schemaFields);

    if (editMode && recordById?.data?.data) {
      const recordData = recordById.data.data as RecordData;

      setFields((prevFields) =>
        prevFields.map((field) => {
          const fieldValue = recordData[field.name];
          return {
            ...field,
            value:
              fieldValue !== undefined && fieldValue !== null
                ? fieldValue.toString()
                : '',
          };
        })
      );

      if (recordData.categoryId) {
        setSelectedCategory(recordData.categoryId.toString());
      }
    }
  }
}, [schemaById?.data?.data?.fields, editMode, recordById?.data?.data]);


  useEffect(() => {
    if (editMode && recordById?.data?.data) {
      const recordData = recordById.data.data as RecordData;
      setFields((prevFields) =>
        prevFields.map((field) => {
          // Dynamically get the value from record data based on field name
          const fieldValue = recordData[field.name];
          return {
            ...field,
            value:
              fieldValue !== undefined && fieldValue !== null
                ? fieldValue.toString()
                : '',
          };
        })
      );
    }
  }, [editMode, recordById?.data?.data]);

  const handleFieldChange = (updatedField: Field) => {
    setFields(
      fields.map((field) =>
        field.name === updatedField.name ? updatedField : field
      )
    );
  };

  const handleRemoveField = (fieldId: string) => {
    setFields(fields.filter((field) => field.name !== fieldId));
  };

  const handleCreate = async () => {
    try {
      const payload: RecordPayload = {};

      fields.forEach((field) => {
        if (field.value !== '') {
          // Convert value based on field type
          let finalValue: string | number | boolean = field.value;
          switch (field.type) {
            case FieldTypes.Number:
              finalValue = Number(field.value);
              break;
            case FieldTypes.Boolean:
              finalValue = field.value.toLowerCase() === 'true';
              break;
            default:
              finalValue = field.value;
          }
          payload[field.name] = finalValue;
        }
      });
       if (selectedCategory) {
      payload['categoryId'] = selectedCategory;
    }

      if (editMode) {
        await updateRecord.mutateAsync({
          data: payload,
          masterName: schemaName || '',
          recordId: editMode || '',
        });
      } else {
        await createRecord.mutateAsync({
          data: payload,
          masterName: schemaName || '',
        });
      }

      router.push(`/master-management/master-records?schemaName=${schemaName}`);
    } catch (error) {
      console.error('Failed to create/update records:', error);
    }
  };

  const handleCancel = () => {
    router.push('/master-management/master-records');
  };

  return {
    fields,
    setFields,
    handleFieldChange,
    handleRemoveField,
    handleCreate,
    handleCancel,
    editMode,
    schemas,
    createSchema,
    recordById,
    selectedCategory,
    setSelectedCategory,
    categories,
  };
}

export default usePageHooks;
