import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET method - Retrieve a single employee by ID
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const formattedEmployee = {
      ...employee,
      joinDate: employee.joinDate.toISOString().split('T')[0],
    };

    return NextResponse.json(formattedEmployee, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 });
  }
}

// PUT method - Update an employee's details
export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
  }

  try {
    const data = await request.json();

    if (!data.name) {
      return NextResponse.json({ error: 'Name field is required' }, { status: 400 });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        company: data.company,
        joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
        salary: data.salary,
      },
    });

    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

// DELETE method - Delete an employee by ID
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
  }

  try {
    const deletedEmployee = await prisma.employee.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Employee deleted', employee: deletedEmployee }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}