import { z } from 'zod';

export const employeeCreateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  role: z.string().min(1, { message: 'Role is required' }),
  company: z.string().min(1, { message: 'Company is required' }),
  joinDate: z.date().refine(date => date <= new Date(), { message: 'Join date cannot be in the future' }),
  salary: z.number().positive({ message: 'Salary must be a positive number' }),
});

export type EmployeeCreateFormValues = z.infer<typeof employeeCreateSchema>;
