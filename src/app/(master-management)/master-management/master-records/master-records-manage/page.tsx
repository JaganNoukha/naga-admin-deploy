'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { useMasterGroups } from '@/features/master-managment/hooks/useMasterGroups';
import { ArrowLeftIcon, Home } from 'lucide-react';
import Link from 'next/link';
import usePageHooks from './usePageHooks';
import { FieldForm } from './initial-values';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MasterRecordsManagePage = () => {
  const { groups } = useMasterGroups();
  const {
    editMode,
    fields,
    handleFieldChange,
    handleCreate,
    handleRemoveField,
    handleCancel,
    createSchema,
    recordById,
    selectedCategory,
    setSelectedCategory,
    categories,
  } = usePageHooks();

  if (groups.isLoading || (editMode && recordById?.isLoading)) {
    return <div>Loading...</div>;
  }

  if (groups.error || (editMode && recordById?.error)) {
    return <div>Error loading data</div>;
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
                <Home className="h-3 w-3" /> Master Records
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
              {editMode ? 'Edit Record' : 'Create New Record'}
            </h1>
            <p className="text-sm text-neutral-500">
              Provide information to {editMode ? 'edit' : 'create'} a master
              record
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4">
        <div className="bg-background rounded-lg p-2 text-lg">
          Record Information
        </div>

        <div className="mt-4 space-y-7">
          <div className="space-y-2">
            {fields.map((field, index) => {
              // Check if the field is of type 'master'
              if (field.type === 'master') {
                const options = categories; // you can switch based on field.masterType
                const isMulti = field.relationshipType === 'oneToMany';
                const value = selectedCategory; // You may want dynamic mapping here
                const setValue = setSelectedCategory;

                return (
                  <div className="space-y-2" key={field.name}>
                    <Label>
                      {field.name
                        .replace(/Id$/, '')
                        .replace(/([A-Z])/g, ' $1')
                        .trim()}
                    </Label>

                    {isMulti ? (
                      // Multiselect
                      <Select
                        value={value}
                        onValueChange={(val) => setValue(val)}
                        multiple
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={`Select ${field.masterType}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {options.map((option: any) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      // Single select
                      <Select value={value} onValueChange={setValue}>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={`Select ${field.masterType}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {options.map((option: any) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                );
              }

              // Other field types
              return (
                <FieldForm
                  key={field.id}
                  field={field}
                  onChange={handleFieldChange}
                  onRemove={handleRemoveField}
                  isFirst={index === 0}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleCreate}>
          {editMode
            ? createSchema?.isPending
              ? 'Updating...'
              : 'Update'
            : createSchema?.isPending
              ? 'Creating...'
              : 'Create'}
        </Button>
      </div>
    </section>
  );
};

export default MasterRecordsManagePage;
