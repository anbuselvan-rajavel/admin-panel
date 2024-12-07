// /app/api/employees/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

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
  const page = Number(url.searchParams.get('page')) || 1; // Default to page 1
  const limit = Number(url.searchParams.get('limit')) || 10; // Default to 10 items per page
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const skip = (page - 1) * limit; // calculate the number of records to skip

  // Extract filter parameters from the query string
  const nameFilter = url.searchParams.get('name') || '';
  const roleFilter = url.searchParams.get('role') || '';
  const companyFilter = url.searchParams.get('company') || '';

  try {
    // Get the employees with pagination
    const employees = await prisma.employee.findMany({
      skip, // skip the first (page - 1) * limit records
      take: limit, // limit the number of records to 'limit'
      where: {
        name: {
          contains: nameFilter,
          mode: 'insensitive',
        },
        role: {
          contains: roleFilter,
          mode: 'insensitive',
        },
        company: {
          contains: companyFilter,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc'  // Ensure the records are sorted by `createdAt` in descending order
      },
    });

    // Get the total number of employees for pagination purposes
    const totalEmployees = await prisma.employee.count({
      where: {
        name: {
          contains: nameFilter,
          mode: 'insensitive',
        },
        role: {
          contains: roleFilter,
          mode: 'insensitive',
        },
        company: {
          contains: companyFilter,
          mode: 'insensitive',
        },
      },
    });
    const totalPages = Math.ceil(totalEmployees / limit);

    // Format joinDate to YYYY-MM-DD for each employee
    const formattedEmployees = employees.map((employee) => ({
      ...employee,
      joinDate: employee.joinDate.toISOString().split('T')[0], // Remove the time part
    }));

    if (page <= 0 || limit <= 0) {
      return NextResponse.json({ error: 'Page and limit must be positive integers' }, { status: 400 });
    }

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
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
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
