import { z } from 'zod';

export const outletFormSchema = z.object({
  outletName: z.string().min(1, 'Outlet name is required'),
  outlettypeId: z.string().min(1, 'Outlet type is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  outletImageUrl: z.string().optional(),
  warehouseId: z.string().min(1, 'Warehouse is required'),
  outletAddress: z.object({
    streetAddress: z.string().min(1, 'Street address is required'),
    location: z.object({
      type: z.literal('Point'),
      coordinates: z
        .array(z.number())
        .length(2, 'Coordinates must be [longitude, latitude]')
        .refine(
          (coords) => coords[0] !== 0 && coords[1] !== 0,
          'Please select a location on the map'
        ),
    }),
  }),
  verificationDocuments: z.array(
    z.object({
      documentType: z.string().min(1, 'Document type is required'),
      value: z.string().optional(),
      verificationStatus: z.string().min(1, 'Verification status is required'),
    })
  ),
});

export type OutletFormData = z.infer<typeof outletFormSchema>;
