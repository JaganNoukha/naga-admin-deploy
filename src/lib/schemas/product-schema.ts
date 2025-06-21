import { z } from 'zod';

export const productFormSchema = z.object({
  skuCode: z.string().min(1, 'SKU code is required'),
  productName: z.string().min(1, 'Product name is required'),
  image: z.string().optional(),
  mrp: z.coerce.number().min(0, 'MRP must be a positive number'),
  minimumPrice: z.coerce
    .number()
    .min(0, 'Minimum price must be a positive number'),
  gstPercentage: z.coerce
    .number()
    .min(0)
    .max(100, 'GST percentage must be between 0 and 100'),
  hsnCode: z.string().min(1, 'HSN code is required'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().min(1, 'Sub category is required'),
  capacity: z.coerce.number().min(0, 'Capacity must be a positive number'),
  uom: z.string().min(1, 'UOM is required'),
  package: z.string().min(1, 'Package is required'),
  unitsPerCase: z.coerce.number().min(1, 'Units per case must be at least 1'),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
