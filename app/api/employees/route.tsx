import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET method - Retrieve all employees with formatted joinDate
export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        createdAt: 'asc'  // Ensure the records are sorted by `createdAt` in ascending order
      },
    });

    // Format joinDate to YYYY-MM-DD for each employee
    const formattedEmployees = employees.map((employee) => ({
      ...employee,
      joinDate: employee.joinDate.toISOString().split('T')[0], // Remove the time part
    }));

    return NextResponse.json(formattedEmployees, { status: 200 });
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
