import { PrismaClient, Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

function isPrismaError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

// GET method - Retrieve a single employee by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json({ 
      success: false,
      error: 'Valid employee ID is required' 
    }, { status: 400 });
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
    });

    if (!employee) {
      return NextResponse.json({ 
        success: false,
        error: 'Employee not found' 
      }, { status: 404 });
    }

    const formattedEmployee = {
      ...employee,
      joinDate: employee.joinDate.toISOString().split('T')[0],
    };

    return NextResponse.json({
      success: true,
      data: formattedEmployee
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching employee:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch employee' 
    }, { status: 500 });
  }
}

// PUT method - Update an employee
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json({ 
      success: false,
      error: 'Valid employee ID is required' 
    }, { status: 400 });
  }

  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'role'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        company: data.company,
        joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
        salary: data.salary ? parseFloat(data.salary) : undefined,
      },
    });

    const formattedEmployee = {
      ...updatedEmployee,
      joinDate: updatedEmployee.joinDate.toISOString().split('T')[0],
    };

    return NextResponse.json({
      success: true,
      message: 'Employee updated successfully',
      data: formattedEmployee
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error updating employee:', error);
    
    if (isPrismaError(error)) {
      if (error.code === 'P2025') {
        return NextResponse.json({ 
          success: false,
          error: 'Employee not found' 
        }, { status: 404 });
      }
    }

    return NextResponse.json({ 
      success: false,
      error: 'Failed to update employee' 
    }, { status: 500 });
  }
}

// DELETE method - Delete an employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json({ 
      success: false,
      error: 'Valid employee ID is required' 
    }, { status: 400 });
  }

  try {
    const deletedEmployee = await prisma.employee.delete({
      where: { id: parseInt(id) },
    });

    const formattedEmployee = {
      ...deletedEmployee,
      joinDate: deletedEmployee.joinDate.toISOString().split('T')[0],
    };

    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully',
      data: formattedEmployee
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error deleting employee:', error);

    if (isPrismaError(error)) {
      if (error.code === 'P2025') {
        return NextResponse.json({ 
          success: false,
          error: 'Employee not found' 
        }, { status: 404 });
      }
    }

    return NextResponse.json({ 
      success: false,
      error: 'Failed to delete employee' 
    }, { status: 500 });
  }
}