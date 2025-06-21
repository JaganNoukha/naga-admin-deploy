'use client';

import { ArrowLeftIcon, Home, PlusIcon, TrashIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useMasterGroups } from '@/features/master-managment/hooks/useMasterGroups';
import { useMasterSchema } from '@/features/master-managment/hooks/useMasterSchema';
import Loading from '@/components/ui/loading';
import GenericError from '@/components/ui/generic-error';
import {
  FieldType,
  FIELD_VALUE_TYPES,
  FieldValueType,
  RELATIONSHIP_TYPES,
} from '@/constants/master-schema';

interface Field {
  id: string;
  fieldType: FieldValueType | '';
  fieldName: string;
  isRequired: boolean;
  isUnique: boolean;
  masterId?: string;
  relation?: string;
}

const MasterSchemaCreationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get('edit');

  const { groups } = useMasterGroups();
  const { schemas, createSchema, updateSchema } = useMasterSchema();

  const [schemaName, setSchemaName] = useState('');
  const [schemaDisplayName, setSchemaDisplayName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<{
    groupId: string;
    groupName: string;
  } | null>(null);
  const [fields, setFields] = useState<Field[]>([
    {
      id: '1',
      fieldType: '',
      fieldName: '',
      isRequired: false,
      isUnique: false,
    },
  ]);

  useEffect(() => {
    if (editMode && schemas.data) {
      const schemaToEdit = schemas.data.data.find(
        (schema: any) => schema.name === editMode
      );
      if (schemaToEdit) {
        setSchemaName(schemaToEdit.name);
        setSchemaDisplayName(schemaToEdit.displayName);
        setSelectedGroup({
          groupId: schemaToEdit.groupId,
          groupName: schemaToEdit.groupName,
        });

        const mappedFields = schemaToEdit.fields.map(
          (field: any, index: number) => ({
            id: (index + 1).toString(),
            fieldType: (field.type.charAt(0).toUpperCase() +
              field.type.slice(1)) as FieldValueType,
            fieldName: field.name,
            isRequired: field.required || false,
            isUnique: field.unique || false,
            ...(field.type === 'master' && {
              masterId: field.masterType,
              relation: field.relationshipType,
            }),
          })
        );
        setFields(mappedFields);
      }
    }
  }, [editMode, schemas.data]);

  const handleAddField = () => {
    setFields([
      ...fields,
      {
        id: Math.random().toString(),
        fieldType: '',
        fieldName: '',
        isRequired: false,
        isUnique: false,
      },
    ]);
  };

  const handleFieldChange = (fieldId: string, updates: Partial<Field>) => {
    setFields(
      fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
  };

  const handleRemoveField = (fieldId: string) => {
    setFields(fields.filter((field) => field.id !== fieldId));
  };

  const handleSubmit = async () => {
    if (!selectedGroup) return;

    const payload = {
      name: schemaName.toLowerCase(),
      displayName: schemaDisplayName,
      groupId: selectedGroup.groupId,
      groupName: selectedGroup.groupName,
      fields: fields.map((field) => ({
        name: field.fieldName.toLowerCase(),
        type: field.fieldType.toLowerCase(),
        required: field.isRequired,
        unique: field.isUnique,
        ...(field.fieldType === 'Master' && {
          masterType: field.masterId,
          relationshipType: field.relation,
        }),
      })),
    };

    try {
      if (editMode) {
        toast.loading('Updating master schema...', { id: 'schema-action' });
        await updateSchema.mutateAsync({ schemaId: editMode, data: payload });
        toast.success('Master schema updated successfully!', {
          id: 'schema-action',
        });
      } else {
        toast.loading('Creating master schema...', { id: 'schema-action' });
        await createSchema.mutateAsync(payload);
        toast.success('Master schema created successfully!', {
          id: 'schema-action',
        });
      }
      router.push('/master-management/master-schema');
    } catch (error) {
      console.error('Failed to create/update schema:', error);
      toast.error(
        `Failed to ${editMode ? 'update' : 'create'} master schema. Please try again.`,
        {
          id: 'schema-action',
        }
      );
    }
  };

  const handleCancel = () => {
    router.push('/master-management/master-schema');
  };

  if (groups.isLoading || schemas.isLoading) {
    return (
      <section className="flex h-full items-center justify-center">
        <Loading />
      </section>
    );
  }

  if (groups.error || schemas.error) {
    return (
      <section className="flex h-full items-center justify-center">
        <GenericError text="Error loading data" />
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
                href="/master-management/master-schema"
                className="flex items-center gap-1"
              >
                <Home className="h-3 w-3" /> Master Schema
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {editMode ? 'Edit Schema' : 'Create Schema'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <Link
            href="/master-management/master-schema"
            className="hover:bg-freshleaf/30 rounded-lg bg-neutral-200 p-2 text-neutral-500"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold">
              {editMode ? 'Edit Schema' : 'Create New Schema'}
            </h1>
            <p className="text-sm text-neutral-500">
              Provide information to {editMode ? 'edit' : 'create'} a master
              schema
            </p>
          </div>
        </div>
      </div>

      {/* The Schema Information Fields */}
      <div className="rounded-lg bg-white p-4">
        <div className="bg-background rounded-lg p-2 text-lg">
          Schema Information
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Schema Name</Label>
            <Input
              placeholder="Enter schema name"
              value={schemaName}
              onChange={(e) => setSchemaName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Schema Display Name</Label>
            <Input
              placeholder="Enter schema display name"
              value={schemaDisplayName}
              onChange={(e) => setSchemaDisplayName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Group</Label>
            <Select
              value={selectedGroup?.groupId}
              onValueChange={(value) => {
                const group = groups.data?.data.find(
                  (g: any) => g.groupId === value
                );
                if (group) {
                  setSelectedGroup({
                    groupId: group.groupId,
                    groupName: group.groupName,
                  });
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {groups.data?.data.map((group: any) => (
                  <SelectItem key={group.groupId} value={group.groupId}>
                    {group.groupName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* The Master Schema Fields */}
      <div className="rounded-lg bg-white p-4">
        <div className="bg-background rounded-lg p-2 text-lg">Fields</div>
        <div className="mt-4 space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4 border-b pb-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Field Value Type</Label>
                  <Select
                    value={field.fieldType}
                    onValueChange={(value) =>
                      handleFieldChange(field.id, {
                        fieldType: value as FieldValueType,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a field value type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_VALUE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {field.fieldType && (
                  <div className="space-y-2">
                    <Label>Field Name</Label>
                    <Input
                      placeholder="Enter Field Name"
                      value={field.fieldName}
                      onChange={(e) =>
                        handleFieldChange(field.id, {
                          fieldName: e.target.value,
                        })
                      }
                    />
                  </div>
                )}

                {field.fieldType === FieldType.Master && (
                  <>
                    <div className="space-y-2">
                      <Label>Master</Label>
                      <Select
                        value={field.masterId}
                        onValueChange={(value) =>
                          handleFieldChange(field.id, { masterId: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Master" />
                        </SelectTrigger>
                        <SelectContent>
                          {schemas.data?.data.map((schema: any) => (
                            <SelectItem key={schema.name} value={schema.name}>
                              {schema.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Relation</Label>
                      <Select
                        value={field.relation}
                        onValueChange={(value) =>
                          handleFieldChange(field.id, { relation: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a relation type" />
                        </SelectTrigger>
                        <SelectContent>
                          {RELATIONSHIP_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Checkbox
                      checked={field.isRequired}
                      onCheckedChange={(checked) =>
                        handleFieldChange(field.id, {
                          isRequired: checked as boolean,
                        })
                      }
                    />
                    <Label>Required</Label>
                  </div>
                  <div className="flex items-center gap-1">
                    <Checkbox
                      checked={field.isUnique}
                      onCheckedChange={(checked) =>
                        handleFieldChange(field.id, {
                          isUnique: checked as boolean,
                        })
                      }
                    />
                    <Label>Unique</Label>
                  </div>
                </div>
                {index > 0 && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveField(field.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                    Remove Field
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={handleAddField}>
            <PlusIcon className="h-4 w-4" />
            Add Field
          </Button>
        </div>
      </div>

      {/* The Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            createSchema.isPending ||
            updateSchema.isPending ||
            !schemaName ||
            !schemaDisplayName ||
            !selectedGroup
          }
        >
          {editMode
            ? updateSchema.isPending
              ? 'Updating Master Schema...'
              : 'Update Master Schema'
            : createSchema.isPending
              ? 'Creating Master Schema...'
              : 'Create Master Schema'}
        </Button>
      </div>
    </section>
  );
};

export default MasterSchemaCreationPage;
