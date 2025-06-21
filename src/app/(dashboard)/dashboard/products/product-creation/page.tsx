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
import { ArrowLeftIcon, Home, Plus } from 'lucide-react';
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

  const subCategories = subCategoriesQuery.data?.data?.data
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
        image: productData.pictureUrl || '',
        mrp: productData.mrp || 0,
        minimumPrice: productData.minimumPrice || 0,
        gstPercentage: productData.gstPercentage || 0,
        hsnCode: productData.hsnCode || '',
        brand: productData.brandId || '',
        category: productData.categoryId || '',
        subCategory: productData.subcategoryId || '',
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
      productData?.subcategoryId &&
      subCategories?.length > 0 &&
      selectedCategory === productData.categoryId
    ) {
      // Ensure the subcategory exists in the current options
      const subCategoryExists = subCategories.some(
        (sub) => sub.value === productData.subcategoryId
      );
      
      if (subCategoryExists) {
        form.setValue('subCategory', productData.subcategoryId, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [isEditMode, productData?.subcategoryId, subCategories, selectedCategory, form]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        form.setValue('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
        subcategoryId: data.subCategory,
      };

      if (isEditMode) {
        toast.loading('Updating product...', { id: 'product-action' });
        await updateProduct.mutateAsync({ productId: productId!, data: productPayload });
        toast.success('Product updated successfully!', { id: 'product-action' });
      } else {
        toast.loading('Creating product...', { id: 'product-action' });
        await createProduct.mutateAsync(productPayload);
        toast.success('Product created successfully!', { id: 'product-action' });
      }

      router.push(NavKeys.DashboardProducts);
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} product. Please try again.`, {
        id: 'product-action',
      });
    }
  };

  if (isEditMode && productQuery.isLoading) {
    return (
      <section className="flex items-center justify-center h-full">
        <Loading text="Loading product data..." />
      </section>
    );
  }

  if (isEditMode && productQuery.error) {
    return (
      <section className="flex items-center justify-center h-full">
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
                <Home className="h-3 w-3" /> Products
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isEditMode ? 'Edit Product' : 'Create Product'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/products"
              className="hover:bg-freshleaf/30 rounded-lg bg-neutral-200 p-2 text-neutral-500"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">{isEditMode ? 'Edit Product' : 'Create New Product'}</h1>
              <p className="text-sm text-neutral-500">
                {isEditMode ? 'Update product information' : 'Provide information to create a product'}
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
              Basic Information
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="skuCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SKU code" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormItem className="row-span-2 space-y-2">
                <FormLabel>Image</FormLabel>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div 
                  className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 hover:bg-gray-100"
                  onClick={handleImageClick}
                >
                  {selectedImage ? (
                    <div className="relative h-full w-full">
                      <img
                        src={selectedImage}
                        alt="Selected product"
                        className="h-full w-full object-contain p-2"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(null);
                          form.setValue('image', '');
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
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
                name="mrp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MRP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter MRP"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimumPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Price</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter minimum price"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gstPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Percentage</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter GST percentage"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hsnCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HSN Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter HSN code" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Product Classification */}
          <div className="rounded-lg bg-white p-4">
            <div className="bg-background mb-4 rounded-lg p-2 text-lg font-medium">
              Product Classification
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormSelect
                control={form.control}
                name="brand"
                label="Brand"
                placeholder="Select brand"
                options={brands}
              />

              <FormSelect
                control={form.control}
                name="category"
                label="Category"
                placeholder="Select category"
                options={categories}
              />

              <FormSelect
                control={form.control}
                name="subCategory"
                label="Sub Category"
                placeholder="Select sub category"
                options={subCategories || []}
                disabled={!selectedCategory}
              />
            </div>
          </div>

          {/* Physical Properties */}
          <div className="rounded-lg bg-white p-4">
            <div className="bg-background mb-4 rounded-lg p-2 text-lg font-medium">
              Physical Properties
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter capacity"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormSelect
                control={form.control}
                name="uom"
                label="UOM"
                placeholder="Select UOM"
                options={uomOptions}
              />

              <FormSelect
                control={form.control}
                name="package"
                label="Packaging"
                placeholder="Select packaging"
                options={packages}
              />

              <FormField
                control={form.control}
                name="unitsPerCase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Units Per Case</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter units per case"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
                ? (updateProduct.isPending ? 'Updating...' : 'Update Product')
                : (createProduct.isPending ? 'Creating...' : 'Create Product')
              }
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default ProductCreatePage;
