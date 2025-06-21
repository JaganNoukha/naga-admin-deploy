'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  warehouseFormSchema,
  type WarehouseFormData,
} from '@/lib/schemas/warehouse-schema';
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, Home, MapPin, Warehouse, Store } from 'lucide-react';
import Link from 'next/link';
import { useWarehouse } from '@/features/warehouse-managment/hooks/useWarehouse';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { LocationPickerModal } from '@/components/modals/location-picker-modal';
import Loading from '@/components/ui/loading';
import GenericError from '@/components/ui/generic-error';
import SpringBoard from '@/components/shared/spring-board';

const WarehouseCreatePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const warehouseId = searchParams.get('warehouseId');
  const { createWarehouse, updateWarehouse, warehouseById } = useWarehouse(
    warehouseId || undefined
  );
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const isEditMode = mode === 'edit' || !!warehouseId;
  const isLoading = warehouseId ? warehouseById.isLoading : false;
  const isSubmitting = createWarehouse.isPending || updateWarehouse.isPending;

  const form = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: {
      warehouseName: '',
      address: '',
      latitude: undefined,
      longitude: undefined,
    },
  });

  useEffect(() => {
    if (warehouseId && warehouseById.data?.data) {
      const warehouse = warehouseById.data.data;
      const coordinates = {
        lat: warehouse.address.location.coordinates[1],
        lng: warehouse.address.location.coordinates[0],
      };

      form.reset({
        warehouseName: warehouse.warehouseName,
        address: warehouse.address.streetAddress,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      });

      setSelectedCoordinates(coordinates);
    }
  }, [warehouseId, warehouseById.data, form]);

  const handleLocationSelect = (coordinates: { lat: number; lng: number }) => {
    setSelectedCoordinates(coordinates);
    form.setValue('latitude', coordinates.lat);
    form.setValue('longitude', coordinates.lng);
  };

  const onSubmit = async (data: WarehouseFormData) => {
    try {
      const coordinates: [number, number] = selectedCoordinates
        ? [selectedCoordinates.lng, selectedCoordinates.lat]
        : [78.0052919, 10.3865296];

      const payload = {
        warehouseName: data.warehouseName,
        address: {
          streetAddress: data.address,
          location: {
            type: 'Point',
            coordinates: coordinates,
          },
        },
      };

      if (isEditMode) {
        toast.loading('Updating warehouse...', { id: 'warehouse-action' });
        await updateWarehouse.mutateAsync({
          warehouseId: warehouseId!,
          data: payload,
        });
        toast.success('Warehouse updated successfully!', {
          id: 'warehouse-action',
        });
      } else {
        toast.loading('Creating warehouse...', { id: 'warehouse-action' });
        await createWarehouse.mutateAsync(payload);
        toast.success('Warehouse created successfully!', {
          id: 'warehouse-action',
        });
      }
      router.push('/warehouse-management/warehouse');
    } catch (error) {
      toast.error(
        `Failed to ${isEditMode ? 'update' : 'create'} warehouse. Please try again.`,
        { id: 'warehouse-action' }
      );
    }
  };

  if (isEditMode && isLoading) {
    return (
      <section className="flex h-full items-center justify-center">
        <Loading text="Loading warehouse data..." />
      </section>
    );
  }

  if (warehouseById.error) {
    return (
      <section className="flex h-full items-center justify-center">
        <GenericError text="Error loading warehouse data. Please try again." />
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
                href="/warehouse-management/warehouse"
                className="flex items-center gap-1"
              >
                <Home className="h-3 w-3" /> Warehouse
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isEditMode ? 'Edit Warehouse' : 'Create Warehouse'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/warehouse-management/warehouse"
              className="hover:bg-freshleaf/30 rounded-lg bg-neutral-200 p-2 text-neutral-500"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">
                {isEditMode ? 'Edit Warehouse' : 'Create New Warehouse'}
              </h1>
              <p className="text-sm text-neutral-500">
                {isEditMode
                  ? 'Update warehouse information'
                  : 'Provide information to create a warehouse'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Warehouse Information */}
          <div className="rounded-lg bg-white p-4">
            <div className="bg-background mb-4 rounded-lg p-2 text-lg font-medium">
              Warehouse Information
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="warehouseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warehouse Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter warehouse name"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Enter warehouse address"
                          {...field}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="tertiary"
                          onClick={() => setIsLocationModalOpen(true)}
                          disabled={isLoading}
                        >
                          <MapPin className="h-4 w-4" />
                          Pin Location
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/warehouse-management/warehouse">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting
                ? isEditMode
                  ? 'Updating...'
                  : 'Creating...'
                : isEditMode
                  ? 'Update Warehouse'
                  : 'Create Warehouse'}
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

export default WarehouseCreatePage;
