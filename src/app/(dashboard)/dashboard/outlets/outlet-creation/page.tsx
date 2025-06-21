'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  outletFormSchema,
  type OutletFormData,
} from '@/lib/schemas/outlet-schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormSelect } from '@/components/form/form-select';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, Home, Trash2, MapPin, Plus } from 'lucide-react';
import { IconBuildingStore } from  '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useOutlets } from '@/features/dashboard/outlets/hooks/useOutlets';
import { useWarehouse } from '@/features/warehouse-managment/hooks/useWarehouse';
import Loading from '@/components/ui/loading';
import GenericError from '@/components/ui/generic-error';
import SpringBoard from '@/components/shared/spring-board';
import { WarehouseDropdown } from '@/components/shared/warehouse-dropdown';
import { MasterRecordDropdown } from '@/components/shared/master-record-dropdown';
import { LocationPickerModal } from '@/components/modals/location-picker-modal';


const documentTypeOptions = [
  { label: 'GST', value: 'GST' },
  { label: 'FSSAI', value: 'FSSAI' },
  { label: 'Trade License', value: 'TRADE_LICENSE' },
  
];

const OutletCreatePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const outletId = searchParams.get('outletId');
  const isEditMode = mode === 'edit' && outletId;
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { createOutlet, updateOutlet, getOutlet } = useOutlets();

  
  const { warehouses } = useWarehouse();
  const outletQuery = getOutlet(outletId || '');
  const outletData = outletQuery.data?.data;

  const form = useForm<OutletFormData>({
    resolver: zodResolver(outletFormSchema),
    defaultValues: {
      outletName: '',
      outlettypeId: '',
      phoneNumber: '',
      outletImageUrl: '',
      warehouseId: '',
      outletAddress: {
        streetAddress: '',
        location: {
          type: 'Point',
          coordinates: [0, 0],
        },
      },
      verificationDocuments: [],
    },
    mode: 'onChange',
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditMode && outletData) {
      const coordinates = {
        lat: outletData.outletAddress.location.coordinates[1],
        lng: outletData.outletAddress.location.coordinates[0],
      };

      form.reset({
        outletName: outletData.outletName || '',
        outlettypeId: outletData.outlettypeId || '',
        phoneNumber: outletData.phoneNumber || '',
        outletImageUrl: outletData.outletImageUrl || '',
        warehouseId: outletData.warehouseId || '',
        outletAddress: {
          streetAddress: outletData.outletAddress.streetAddress || '',
          location: {
            type: 'Point',
            coordinates: [coordinates.lng, coordinates.lat],
          },
        },
        verificationDocuments: outletData.verificationDocuments || [],
      });
      setImagePreview(outletData.outletImageUrl || '');
      setSelectedCoordinates(coordinates);
    }
  }, [isEditMode, outletData, form]);

  const handleLocationSelect = (coordinates: { lat: number; lng: number }) => {
    setSelectedCoordinates(coordinates);
    form.setValue('outletAddress.location.coordinates', [coordinates.lng, coordinates.lat], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit = async (data: OutletFormData) => {
    try {
      if (!selectedCoordinates) {
        form.setError('outletAddress.location.coordinates', {
          type: 'manual',
          message: 'Please select a location on the map',
        });
        return;
      }

      const outletPayload = {
        outletName: data.outletName,
        outlettypeId: data.outlettypeId,
        phoneNumber: data.phoneNumber,
        outletImageUrl: data.outletImageUrl,
        warehouseId: data.warehouseId,
        outletAddress: {
          streetAddress: data.outletAddress.streetAddress,
          location: {
            type: 'Point',
            coordinates: [selectedCoordinates.lng, selectedCoordinates.lat],
          },
        },
        verificationDocuments: data.verificationDocuments,
      };

      if(outletPayload?.verificationDocuments?.length) {
        outletPayload.verificationDocuments.forEach((doc) => {
          if(!doc?.verificationStatus) {
            doc.verificationStatus = 'unverified';
          }
        });
      }

      if (isEditMode) {
        toast.loading('Updating outlet...', { id: 'outlet-action' });
        await updateOutlet.mutateAsync({ outletId: outletId!, data: outletPayload });
        toast.success('Outlet updated successfully!', { id: 'outlet-action' });
      } else {
        toast.loading('Creating outlet...', { id: 'outlet-action' });
        await createOutlet.mutateAsync(outletPayload);
        toast.success('Outlet created successfully!', { id: 'outlet-action' });
      }

      router.push('/dashboard/outlets');
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} outlet. Please try again.`, {
        id: 'outlet-action',
      });
    }
  };

  if (isEditMode && outletQuery.isLoading) {
    return (
      <section className="flex items-center justify-center h-full">
        <Loading text="Loading outlet data..." />
      </section>
    );
  }

  if (isEditMode && outletQuery.error) {
    return (
      <section className="flex items-center justify-center h-full">
        <GenericError text="Error loading outlet data. Please try again." />
      </section>
    );
  }

  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col gap-3 rounded-lg bg-white p-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard/outlets"
                className="flex items-center gap-1"
              >
                <Home className="h-3 w-3" /> Outlets
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isEditMode ? 'Edit Outlet' : 'Create Outlet'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/outlets"
              className="hover:bg-freshleaf/30 rounded-lg bg-neutral-200 p-2 text-neutral-500"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">{isEditMode ? 'Edit Outlet' : 'Create New Outlet'}</h1>
              <p className="text-sm text-neutral-500">
                {isEditMode ? 'Update outlet information' : 'Provide information to create an outlet'}
              </p>
            </div>
          </div>
          
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-lg bg-white p-4">
            <div className="bg-background mb-4 rounded-lg p-2 text-lg font-medium">
              Outlet Information
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="outletName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outlet Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter outlet name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="outlettypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outlet Type</FormLabel>
                    <FormControl>
                      <MasterRecordDropdown
                        masterName="outlettype"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select outlet type"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className="row-span-2 space-y-2">
                <FormLabel>Image</FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setImagePreview(url);
                      
                      form.setValue('outletImageUrl', file.name);
                    }
                  }}
                />
                <div
                  className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 hover:bg-gray-100"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Outlet"
                      className="h-full w-full object-contain rounded"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 px-2 text-center text-sm text-neutral-500">
                        Browse and choose the image you want to upload from your files
                      </p>
                      <div className="bg-freshleaf rounded-md p-2 text-neutral-50">
                        <Plus className="h-5 w-5" />
                      </div>
                    </div>
                  )}
                </div>
              </FormItem>

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="col-span-2 grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="outletAddress.streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Address</FormLabel>
                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs bg-freshleaf/20 text-freshleaf rounded-md px-1.5 py-0.5"
                          onClick={() => setIsLocationModalOpen(true)}
                        >
                          <MapPin className="h-2.5 w-2.5" />
                          Pin Location
                        </button>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Enter address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warehouseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warehouse</FormLabel>
                      <FormControl>
                        <WarehouseDropdown
                          value={field.value || ''}
                          onChange={field.onChange}
                          placeholder={
                            warehouses.isLoading
                              ? "Loading warehouses..."
                              : "Select warehouse"
                          }
                          defaultSelect={!!isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="outletAddress.location.coordinates"
                render={({ field }) => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="rounded-lg bg-white p-4">
            <div className="bg-background mb-4 rounded-lg p-2 text-lg font-medium">
              Verification Documents
            </div>
            <FormField
              control={form.control}
              name="verificationDocuments"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-4 mt-2">
                    {Array.isArray(field.value) && field.value.length > 0 ? (
                      field.value.map((doc, idx) => (
                        <div key={idx} className="flex items-end gap-2">
                          <div className="flex-1">
                            <FormSelect
                              control={form.control}
                              name={`verificationDocuments.${idx}.documentType`}
                              label="Type"
                              placeholder="Select type"
                              options={documentTypeOptions}
                            />
                          </div>
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name={`verificationDocuments.${idx}.value`}
                              render={({ field: docField }) => (
                                <FormItem>
                                  <FormLabel>Document No</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Paste document URL"
                                      {...docField}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const docs = [...(field.value || [])];
                              docs.splice(idx, 1);
                              field.onChange(docs);
                            }}
                            className="mb-2"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-neutral-400 text-sm">No documents added.</div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        field.onChange([
                          ...(field.value || []),
                          {
                            documentType: '',
                            value: '',
                            verificationStatus: 'unverified',
                          },
                        ]);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Document
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/outlets">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2"
              disabled={createOutlet.isPending || updateOutlet.isPending}
            >
              {isEditMode 
                ? (updateOutlet.isPending ? 'Updating...' : 'Update Outlet')
                : (createOutlet.isPending ? 'Creating...' : 'Create Outlet')
              }
            </Button>
          </div>
        </form>
      </Form>

      {/* Location Picker Modal */}
      <LocationPickerModal
        open={isLocationModalOpen}
        onOpenChange={setIsLocationModalOpen}
        onLocationSelect={handleLocationSelect}
        initialCoordinates={selectedCoordinates || undefined}
      />
    </section>
  );
};

export default OutletCreatePage;
