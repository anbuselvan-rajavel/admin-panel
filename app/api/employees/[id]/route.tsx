import { PrismaClient, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

function isPrismaError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Get an employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 *       400:
 *         description: Invalid ID format
 *       500:
 *         description: Internal server error
 *   
 *   put:
 *     summary: Update an employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
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
 *                 example: "John Doe Updated"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.updated@example.com"
 *               role:
 *                 type: string
 *                 example: "Senior Software Engineer"
 *               company:
 *                 type: string
 *                 example: "Tech Corp"
 *               joinDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               salary:
 *                 type: number
 *                 example: 85000
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Employee updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 *       400:
 *         description: Invalid input or ID format
 *       500:
 *         description: Internal server error
 * 
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Employee deleted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 *       400:
 *         description: Invalid ID format
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Update an employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
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
 *                 example: "John Doe Updated"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.updated@example.com"
 *               role:
 *                 type: string
 *                 example: "Senior Software Engineer"
 *               company:
 *                 type: string
 *                 example: "Tech Corp"
 *               joinDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               salary:
 *                 type: number
 *                 example: 85000
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Employee updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 *       400:
 *         description: Invalid input or ID format
 *       500:
 *         description: Internal server error
 */
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

    // Revalidate both the list and detail pages
    revalidatePath('/employees');
    revalidatePath(`/employees/${id}`);

    return NextResponse.json({
      success: true,
      message: 'Employee updated successfully',
      data: formattedEmployee
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      }
    });
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

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Employee deleted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 *       400:
 *         description: Invalid ID format
 *       500:
 *         description: Internal server error
 */
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