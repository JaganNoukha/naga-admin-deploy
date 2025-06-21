import { z } from 'zod';

export const claimFormSchema = z.object({
  claimType: z.enum(['food', 'lodging', 'travel', 'others'], {
    required_error: 'Please select a claim type',
  }),
  attachment: z.string().optional(),
  claimAmount: z.number().min(0, 'Amount must be greater than 0'),
  claimDate: z.date({
    required_error: 'Please select a date',
  }),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  description: z.string().min(1, 'Description is required'),
  legitimacyScore: z.number().optional(),
  legitimacyReasons: z.array(z.string()).optional(),
});

export type ClaimFormData = z.infer<typeof claimFormSchema>; 