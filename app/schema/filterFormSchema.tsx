// app/schema/filterFormSchema.ts
import { z } from 'zod';

export const filterSchema = z.object({
  name: z.string().optional(),
  status: z.string(),
  gender: z.string(),
});

export type FilterFormValues = z.infer<typeof filterSchema>;
