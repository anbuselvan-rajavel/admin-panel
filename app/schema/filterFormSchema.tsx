// schemas/filterFormSchema.ts
import { z } from "zod";

// Base schema for common fields
const baseFilterSchema = z.object({
  name: z.string().optional(),
});

// User-specific filter schema
export const userFilterSchema = baseFilterSchema.extend({
  status: z.string().optional(),
  gender: z.string().optional(),
});

// Employee-specific filter schema
export const employeeFilterSchema = baseFilterSchema.extend({
  role: z.string().optional(),
  company: z.string().optional(),
});

// Infer types from schemas
export type UserFilterFormValues = z.infer<typeof userFilterSchema>;
export type EmployeeFilterFormValues = z.infer<typeof employeeFilterSchema>;