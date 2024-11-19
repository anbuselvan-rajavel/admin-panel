import { z } from 'zod';

export const employeeSchema = z.object({
    id: z.number().optional(), // Add id as an optional string
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    role: z.string().min(1, "Role is required"),
    company: z.string().min(1, "Company is required"),
    joinDate: z.string(), // Define as string, not date
    salary: z.number().min(0, "Salary must be positive")
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;