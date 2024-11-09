import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET method - Retrieve a single employee with formatted joinDate
export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Format joinDate to YYYY-MM-DD
    const formattedEmployee = {
      ...employee,
      joinDate: employee.joinDate.toISOString().split('T')[0],  // Remove time part
    };

    return NextResponse.json(formattedEmployee, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 });
  }
}

// PUT method - Update an employee's details with a formatted joinDate
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    // Await the params to ensure you have the id
    const { id } = params;
  
    try {
      // Parse the request body once
      const data = await req.json();
  
      // Check if the name exists in the request body (you can extend this check for other fields)
      if (!data.name) {
        return NextResponse.json({ error: 'Name field is required' }, { status: 400 });
      }
  
      // Update only the fields provided in the request body (e.g., name, email, etc.)
      const updatedEmployee = await prisma.employee.update({
        where: { id: parseInt(id) },
        data: {
          name: data.name, // Only update fields provided in the body
          email: data.email, // Optional field, can be included in the request body if needed
          role: data.role,   // Optional field
          company: data.company, // Optional field
          joinDate: data.joinDate ? new Date(data.joinDate) : undefined, // Optional, format if provided
          salary: data.salary,  // Optional field
        },
      });
  
      return NextResponse.json(updatedEmployee, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
    }
  }

// DELETE method - Delete an employee by ID
export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;

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
