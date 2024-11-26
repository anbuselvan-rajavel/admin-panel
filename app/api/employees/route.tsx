// /app/api/employees/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const prisma = new PrismaClient();

// Exactly matching your frontend schema
export const employeeSchema = z.object({
    id: z.number().optional(), 
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    role: z.string().min(1, "Role is required"),
    company: z.string().min(1, "Company is required"),
    joinDate: z.string(), 
    salary: z.number().min(0, "Salary must be positive")
});

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: List employees with pagination and filtering
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Employee'
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const limit = Number(url.searchParams.get('limit')) || 10;
  const baseUrl = `${url.protocol}//${url.host}${url.pathname}`;

  const skip = (page - 1) * limit;

  // Extract filter parameters from the query string
  const nameFilter = url.searchParams.get('name') || '';
  const roleFilter = url.searchParams.get('role') || '';
  const companyFilter = url.searchParams.get('company') || '';

  try {
    // Check for invalid pagination parameters
    if (page <= 0 || limit <= 0) {
      return NextResponse.json({ 
        error: 'Page and limit must be positive integers' 
      }, { status: 400 });
    }

    // Get the employees with pagination and filters
    const [employees, totalEmployees] = await Promise.all([
      prisma.employee.findMany({
        skip,
        take: limit,
        where: {
          name: { contains: nameFilter, mode: 'insensitive' },
          role: { contains: roleFilter, mode: 'insensitive' },
          company: { contains: companyFilter, mode: 'insensitive' },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.employee.count({
        where: {
          name: { contains: nameFilter, mode: 'insensitive' },
          role: { contains: roleFilter, mode: 'insensitive' },
          company: { contains: companyFilter, mode: 'insensitive' },
        },
      })
    ]);

    const totalPages = Math.ceil(totalEmployees / limit);

    // Format joinDate to string to match frontend schema
    const formattedEmployees = employees.map((employee) => ({
      ...employee,
      joinDate: employee.joinDate.toISOString().split('T')[0],
    }));

    return NextResponse.json({
      meta: {
        page,
        limit,
        totalEmployees,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
        prevPage: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null
      },
      data: formattedEmployees,
    }, { status: 200 });
  } catch (error) {
    console.error('Employee fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch employees', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               role:
 *                 type: string
 *                 example: "Software Engineer"
 *               company:
 *                 type: string
 *                 example: "Tech Corp"
 *               joinDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               salary:
 *                 type: number
 *                 example: 75000
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  try {
    const { name, email, role, company, joinDate, salary } = await request.json();

    // Convert joinDate to Date object if it's a string (ensures valid date format)
    const newJoinDate = new Date(joinDate);

    const newEmployee = await prisma.employee.create({
      data: {
        name,
        email,
        role,
        company,
        joinDate: newJoinDate,  // Store as Date object
        salary,
      },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
