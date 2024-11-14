// /app/api/employees/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET method - Retrieve paginated employees
export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page')) || 1; // Default to page 1
  const limit = Number(url.searchParams.get('limit')) || 10; // Default to 10 items per page
  const baseUrl = `${url.protocol}//${url.host}${url.pathname}`;

  const skip = (page - 1) * limit; // calculate the number of records to skip

  try {
    // Get the employees with pagination
    const employees = await prisma.employee.findMany({
      skip, // skip the first (page - 1) * limit records
      take: limit, // limit the number of records to 'limit'
      orderBy: {
        createdAt: 'asc'  // Ensure the records are sorted by `createdAt` in ascending order
      },
    });

    // Get the total number of employees for pagination purposes
    const totalEmployees = await prisma.employee.count();
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

// POST method - Create a new employee with a formatted joinDate
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
