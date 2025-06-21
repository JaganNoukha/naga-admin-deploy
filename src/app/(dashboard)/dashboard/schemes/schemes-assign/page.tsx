'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  productFormSchema,
  type ProductFormData,
} from '@/lib/schemas/product-schema';
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
import { ArrowLeftIcon, Home, Plus, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { IconPackage } from '@tabler/icons-react';
import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useBrands,
  useCategories,
  usePackages,
  useSubcategories,
} from '@/features/master-managment/hooks/useMasterRecords';
import { useProducts } from '@/features/dashboard/products/hooks/useProducts';
import Loading from '@/components/ui/loading';
import GenericError from '@/components/ui/generic-error';
import NavKeys from '@/constants/navkeys';
import { useWarehouse } from '@/features/warehouse-managment/hooks/useWarehouse';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const MASTER_RECORDS_ENDPOINT =
  'https://l6nqns5r-3000.inc1.devtunnels.ms/api/naga-mdm-service/master';

interface SubCategory {
  subcategoryName: string;
  subcategoryId: string;
}

const uomOptions = [
  { label: 'KG', value: 'kg' },
  { label: 'GM', value: 'gm' },
  { label: 'LTR', value: 'ltr' },
  { label: 'PCS', value: 'pcs' },
];

const ProductCreatePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get('mode');
  const productId = searchParams.get('productId');
  const isEditMode = mode === 'edit' && productId;

  const { createProduct, updateProduct, getProduct } = useProducts();

  const { records: brandsQuery } = useBrands();
  const { records: categoriesQuery } = useCategories();
  const { records: packagesQuery } = usePackages();
  const { records: subCategoriesQuery } = useSubcategories();
  const { warehouses: warehouses } = useWarehouse();

  const brands =
    brandsQuery.data?.data?.data?.map((item: any) => ({
      label: item.brandName,
      value: item.brandId,
    })) || [];

  const categories =
    categoriesQuery.data?.data?.data?.map((item: any) => ({
      label: item.categoryName,
      value: item.categoryId,
    })) || [];

  const packages =
    packagesQuery.data?.data?.data?.map((item: any) => ({
      label: item.packagename,
      value: item.packageId,
    })) || [];

  const subCategories =
    subCategoriesQuery.data?.data?.data
      ?.filter((item: any) => item.categoryId === selectedCategory)
      .map((item: any) => ({
        label: item.subcategoryName,
        value: item.subcategoryId,
      })) || [];

  const productQuery = getProduct(productId || '');
  const productData = productQuery.data?.data;

  // Check if all required data is loaded
  const isDataLoaded = isEditMode
    ? productData &&
      brands.length > 0 &&
      categories.length > 0 &&
      packages.length > 0
    : true;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      skuCode: '',
      productName: '',
      totalQuantity: '',
      image: '',
      mrp: 0,
      minimumPrice: 0,
      gstPercentage: 0,
      hsnCode: '',
      brand: '',
      category: '',
      subCategory: '',
      capacity: 0,
      uom: '',
      package: '',
      unitsPerCase: 1,
    },
  });

  const [rows, setRows] = useState([
    {
      sNo: '',
      brand: '',
      category: '',
      subCategory: '',
      product: '',
      type: '',
      min: '',
      max: '',
      action: '',
    },
  ]);

  const handleDeleteRow = (indexToDelete) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== indexToDelete));
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        sNo: '',
        brand: '',
        category: '',
        subCategory: '',
        product: '',
        type: '',
        min: '',
        max: '',
        action: '',
      },
    ]);
  };

  const selectOptions = [
    { value: '', label: 'Select' },
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  useEffect(() => {
    if (isEditMode && isDataLoaded && productData) {
      // First set the category to trigger subcategory loading
      if (productData.categoryId) {
        setSelectedCategory(productData.categoryId);
      }

      // Then reset the form with all values
      form.reset({
        skuCode: productData.skuCode || '',
        productName: productData.productName || '',
        totalQuantity: productData.totalQuantity || '',
        image: productData.pictureUrl || '',
        mrp: productData.mrp || 0,
        minimumPrice: productData.minimumPrice || 0,
        gstPercentage: productData.gstPercentage || 0,
        hsnCode: productData.hsnCode || '',
        brand: productData.brandId || '',
        category: productData.categoryId || '',
        subCategory: productData.subCategoryId || '',
        capacity: productData.capacity || 0,
        uom: productData.uom || '',
        package: productData.packageId || '',
        unitsPerCase: productData.unitsPerCase || 1,
      });
    }
  }, [isEditMode, isDataLoaded, productData, form]);

  // Watch for category changes to update subcategories
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'category') {
        setSelectedCategory(value.category || '');
        // Only reset subcategory if category changes
        if (value.category !== productData?.categoryId) {
          form.setValue('subCategory', '');
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, productData?.categoryId]);

  // Handle subcategory selection after data is loaded
  useEffect(() => {
    if (
      isEditMode &&
      productData?.subCategoryId &&
      subCategories?.length > 0 &&
      selectedCategory === productData.categoryId
    ) {
      // Ensure the subcategory exists in the current options
      const subCategoryExists = subCategories.some(
        (sub) => sub.value === productData.subCategoryId
      );

      if (subCategoryExists) {
        form.setValue('subCategory', productData.subCategoryId, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [
    isEditMode,
    productData?.subCategoryId,
    subCategories,
    selectedCategory,
    form,
  ]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      const productPayload = {
        productName: data.productName,
        skuCode: data.skuCode,
        description: data.productName,
        hsnCode: data.hsnCode,
        pictureUrl: data.image || 'https://example.com/images/brown-rice.jpg',
        isActive: true,
        mrp: data.mrp,
        minimumPrice: data.minimumPrice,
        gstPercentage: data.gstPercentage,
        unitsPerCase: data.unitsPerCase,
        packageId: data.package,
        brandId: data.brand,
        uom: data.uom,
        capacity: data.capacity,
        categoryId: data.category,
        subCategoryId: data.subCategory,
      };

      if (isEditMode) {
        toast.loading('Updating product...', { id: 'product-action' });
        await updateProduct.mutateAsync({
          productId: productId!,
          data: productPayload,
        });
        toast.success('Product updated successfully!', {
          id: 'product-action',
        });
      } else {
        toast.loading('Creating product...', { id: 'product-action' });
        await createProduct.mutateAsync(productPayload);
        toast.success('Product created successfully!', {
          id: 'product-action',
        });
      }

      router.push(NavKeys.DashboardProducts);
    } catch (error) {
      toast.error(
        `Failed to ${isEditMode ? 'update' : 'create'} product. Please try again.`,
        {
          id: 'product-action',
        }
      );
    }
  };

  if (isEditMode && productQuery.isLoading) {
    return (
      <section className="flex h-full items-center justify-center">
        <Loading text="Loading product data..." />
      </section>
    );
  }

  if (isEditMode && productQuery.error) {
    return (
      <section className="flex h-full items-center justify-center">
        <GenericError text="Error loading product data. Please try again." />
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
                href="/dashboard/products"
                className="flex items-center gap-1"
              >
                <Home className="h-3 w-3" /> Schemes
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isEditMode ? 'Edit Scheme' : 'Assign Scheme'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/schemes"
              className="hover:bg-freshleaf/30 rounded-lg bg-neutral-200 p-2 text-neutral-500"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">
                {isEditMode ? 'Edit Scheme' : 'Assign Scheme'}
              </h1>
              <p className="text-sm text-neutral-500">
                {isEditMode
                  ? 'Update scheme information'
                  : 'Provide information to assign scheme'}
              </p>
            </div>
          </div>
          <div className="bg-freshleaf/10 w-fit rounded-full p-2">
            <IconPackage className="text-freshleaf h-5 w-5" />
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="rounded-lg bg-white p-4">
            <div className="bg-background mb-4 rounded-lg p-2 text-lg font-medium">
              Scheme Information
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormSelect
                control={form.control}
                name="schemeHolderType"
                label="Scheme Holder Type"
                placeholder="Select"
                options={brands}
              />
              <FormSelect
                control={form.control}
                name="warehouse"
                label="Warehouse"
                placeholder="Select Warehouse"
                options={warehouses || []}
                disabled={!warehouses}
              />

              <FormField
                control={form.control}
                name="mrp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outlet</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Outlet"
                        type="text"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 pt-5 md:grid-cols-10">
              <div className="flex items-center gap-2"></div>
              <Checkbox checked={form.isRequired} />
              <Label>QPS Group</Label>
              <Checkbox checked={form.isRequired} />
              <Label>Multiple Group</Label>
            </div>
            <div className="grid grid-cols-1 gap-4 pt-5 md:grid-cols-3">
              <FormSelect
                control={form.control}
                name="schemeList"
                label="Scheme List"
                placeholder="Select"
                options={warehouses || []}
                disabled={!warehouses}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 pt-5 md:grid-cols-10">
              <Checkbox checked={form.isRequired} />
              <Label>Scheme Reversal</Label>
              <Checkbox checked={form.isRequired} />
              <Label>Mandate Scheme</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/products">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2"
              disabled={createProduct.isPending || updateProduct.isPending}
              onClick={() => console.log(form.getValues(), 'form.getValues()')}
            >
              {isEditMode
                ? updateProduct.isPending
                  ? 'Updating...'
                  : 'Update'
                : createProduct.isPending
                  ? 'Creating...'
                  : 'Assign'}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default ProductCreatePage;
