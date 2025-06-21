'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { ArrowLeftIcon, Home, User, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useUsers, useUser } from '@/features/user-managment/users/hooks/useUsers';
import { WarehouseDropdown } from '@/components/shared/warehouse-dropdown';
import { MasterRecordDropdown } from '@/components/shared/master-record-dropdown';
import { LocationPickerModal } from '@/components/modals/location-picker-modal';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Loading from '@/components/ui/loading';
import GenericError from '@/components/ui/generic-error';
import { StatusDropdown } from '@/components/shared/status-dropdown';
import { UserStatusEnum, UserTypeEnum } from '@/constants/enums/user.enums';

const userFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  employeeCode: z.string().min(1, 'Employee code is required'),
  imeiNo: z.string().min(1, 'IMEI number is required'),
  grade: z.string().min(1, 'Grade is required'),
  userType: z.string().min(1, 'User type is required'),
  roleId: z.string().min(1, 'Role is required'),
  userAddress: z.object({
    streetAddress: z.string().min(1, 'Street address is required'),
    location: z.object({
      type: z.literal('Point'),
      coordinates: z.array(z.number()).length(2),
    }),
  }),
  status: z.string().min(1, 'Status is required'),
  doj: z.string().min(1, 'Date of joining is required'),
  permissionGroup: z.array(z.string()).min(1, 'At least one permission group is required'),
  warehouse: z.array(z.object({
    warehouseId: z.string().min(1, 'Warehouse is required'),
  })).min(1, 'At least one warehouse is required'),
  userName: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type UserFormData = z.infer<typeof userFormSchema>;

const gradeOptions = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
];

const UserCreatePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const userId = searchParams.get('userId');
  const isEditMode = mode === 'edit' && userId;
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { createUser, updateUser } = useUsers();
  const { data: userData, isLoading, error } = useUser(userId || '');

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      email: '',
      employeeCode: '',
      imeiNo: '',
      grade: '',
      userType: '',
      roleId: '',
      userAddress: {
        streetAddress: '',
        location: {
          type: 'Point',
          coordinates: [0, 0] as [number, number],
        },
      },
      status: 'active',
      doj: '',
      permissionGroup: [],
      warehouse: [],
      userName: '',
      password: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isEditMode && userData?.data) {
      const coordinates = {
        lat: userData.data.userAddress.location.coordinates[1],
        lng: userData.data.userAddress.location.coordinates[0],
      };

      // Format the date to YYYY-MM-DD
      const formattedDoj = userData.data.doj ? new Date(userData.data.doj).toISOString().split('T')[0] : '';

      // Get the first warehouse ID if available
      const warehouseId = userData.data.warehouse?.[0]?.warehouseId || '';

      // Ensure roleId is a string
      const roleId = userData.data.roleId?.toString() || '';

      form.reset({
        name: userData.data.name || '',
        phoneNumber: userData.data.phoneNumber || '',
        email: userData.data.email || '',
        employeeCode: userData.data.employeeCode || '',
        imeiNo: userData.data.imeiNo || '',
        grade: userData.data.grade || '',
        userType: userData.data.userType || '',
        roleId: roleId,
        userAddress: {
          streetAddress: userData.data.userAddress.streetAddress || '',
          location: {
            type: 'Point',
            coordinates: [coordinates.lng, coordinates.lat] as [number, number],
          },
        },
        status: userData.data.status || 'active',
        doj: formattedDoj,
        permissionGroup: userData.data.permissionGroup || [],
        warehouse: [{ warehouseId }],
        userName: userData.data.userName || '',
        password: '', // Don't populate password in edit mode
      });
      setSelectedCoordinates(coordinates);
    }
  }, [isEditMode, userData, form]);

  const handleLocationSelect = (coordinates: { lat: number; lng: number }) => {
    setSelectedCoordinates(coordinates);
    form.setValue('userAddress.location.coordinates', [coordinates.lng, coordinates.lat] as [number, number], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      if (!selectedCoordinates) {
        form.setError('userAddress.location.coordinates', {
          type: 'manual',
          message: 'Please select a location on the map',
        });
        return;
      }

      const userPayload = {
        ...data,
        userAddress: {
          ...data.userAddress,
          location: {
            type: 'Point' as const,
            coordinates: [selectedCoordinates.lng, selectedCoordinates.lat] as [number, number],
          },
        },
      };

      if (isEditMode) {
        toast.loading('Updating user...', { id: 'user-action' });
        await updateUser.mutateAsync({ userId: userId!, data: userPayload });
        toast.success('User updated successfully!', { id: 'user-action' });
      } else {
        toast.loading('Creating user...', { id: 'user-action' });
        await createUser.mutateAsync(userPayload);
        toast.success('User created successfully!', { id: 'user-action' });
      }

      // Wait a bit to ensure the toast is visible before navigation
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/user-management/users');
    } catch (err) {
      console.error('Error:', err);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} user. Please try again.`, {
        id: 'user-action',
      });
    }
  };

  if (isEditMode && isLoading) {
    return (
      <section className="flex items-center justify-center h-full">
        <Loading text="Loading user data..." />
      </section>
    );
  }

  if (isEditMode && error) {
    return (
      <section className="flex items-center justify-center h-full">
        <GenericError text="Error loading user data. Please try again." />
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
                href="/user-management/users"
                className="flex items-center gap-1"
              >
                <Home className="h-3 w-3" /> Users
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isEditMode ? 'Edit User' : 'Create User'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/user-management/users"
              className="hover:bg-freshleaf/30 rounded-lg bg-neutral-200 p-2 text-neutral-500"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">{isEditMode ? 'Edit User' : 'Create New User'}</h1>
              <p className="text-sm text-neutral-500">
                {isEditMode ? 'Update user information' : 'Provide information to create a user'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-freshleaf/10 w-fit rounded-full p-2">
              <User className="text-freshleaf h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-lg bg-white p-4">
            <div className="bg-background mb-4 rounded-lg p-2 text-lg font-medium">
              Basic Information
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employeeCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter employee code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imeiNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IMEI Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter IMEI number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gradeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Type</FormLabel>
                    <FormControl>
                      <StatusDropdown
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select user type"
                        statusEnum={UserTypeEnum}
                        statusLabels={{
                          [UserTypeEnum.PERMANENT]: 'Permanent',
                          [UserTypeEnum.TEMPORARY]: 'Temporary'
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <MasterRecordDropdown
                        masterName="role"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select role"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <StatusDropdown
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select status"
                        statusEnum={UserStatusEnum}
                        statusLabels={{
                          [UserStatusEnum.ACTIVE]: 'Active',
                          [UserStatusEnum.INACTIVE]: 'Inactive',
                          [UserStatusEnum.TERMINATED]: 'Terminated'
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="doj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Joining</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="rounded-lg bg-white p-4">
            <div className="bg-background mb-4 rounded-lg p-2 text-lg font-medium">
              Address Information
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="userAddress.streetAddress"
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
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warehouse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warehouse</FormLabel>
                    <FormControl>
                      <WarehouseDropdown
                        value={field.value?.[0]?.warehouseId}
                        onChange={(value) => field.onChange(value ? [{ warehouseId: value }] : [])}
                        placeholder="Select warehouse"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="rounded-lg bg-white p-4">
            <div className="bg-background mb-4 rounded-lg p-2 text-lg font-medium">
              Account Information
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/user-management/users">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2"
              disabled={createUser.isPending || updateUser.isPending}
              onClick={() => {
                if(isEditMode) {
                  onSubmit(form.getValues());
                } else {
                  onSubmit(form.getValues());
                }
              }}
            >
              {isEditMode 
                ? (updateUser.isPending ? 'Updating...' : 'Update User')
                : (createUser.isPending ? 'Creating...' : 'Create User')
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

export default UserCreatePage;
