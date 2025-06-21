import { z } from 'zod';

export const warehouseFormSchema = z.object({
  warehouseName: z.string().min(1, 'Warehouse name is required'),
  address: z.string().min(1, 'Address is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type WarehouseFormData = z.infer<typeof warehouseFormSchema>; 