"use client";
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import Title from './title';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Skeleton } from 'primereact/skeleton';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { GrEdit } from 'react-icons/gr';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import UnifiedEmployeeForm from '../components/(forms)/UnifiedEmployeeForm';
import { EmployeeFormData } from '../schema/employeeSchema';
import { useForm } from 'react-hook-form';

// Define the Employee interface directly here instead of importing
interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  company: string;
  joinDate: string;
  salary: number;
  createdAt: string;
  updatedAt: string;
}

// Constants
const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 20];
// const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface FilterState {
  name: string;
  role?: string;
  company?: string;
}

// Utility functions
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? dateString
      : new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

const formatSalary = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const Employees = () => {
  // State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<string[]>(['All']);
  const [roles, setRoles] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    name: '',
    role: undefined,
    company: undefined
  });
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalRecords: 0
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [mode, setMode] = useState<'edit' | 'create'>('create');  // Track the mode
  const { reset } = useForm();

  const toast = useRef<Toast | null>(null);

  // Fetch unique companies and roles
  const fetchCompaniesAndRoles = useCallback(async () => {
    try {
      const uniqueCompanies = new Set<string>(['All']);
      const uniqueRoles = new Set<string>(['All']);

      // First, fetch the first page to get total number of records
      const initialResponse = await axios.get(`/api/employees?page=1&limit=${pagination.limit}`);
      const totalRecords = initialResponse.data.meta.totalEmployees;
      const totalPages = Math.ceil(totalRecords / pagination.limit);

      // Process the first page
      initialResponse.data.data.forEach((employee: Employee) => {
        if (employee.company) uniqueCompanies.add(employee.company);
        if (employee.role) uniqueRoles.add(employee.role);
      });

      // Fetch remaining pages
      const remainingPages = Array.from(
        { length: totalPages - 1 },
        (_, i) => axios.get(`/api/employees?page=${i + 2}&limit=${pagination.limit}`)
      );

      const responses = await Promise.all(remainingPages);

      // Process remaining pages
      responses.forEach(response => {
        response.data.data.forEach((employee: Employee) => {
          if (employee.company) uniqueCompanies.add(employee.company);
          if (employee.role) uniqueRoles.add(employee.role);
        });
      });

      setCompanies(Array.from(uniqueCompanies));
      setRoles(Array.from(uniqueRoles));
    } catch (error) {
      console.error('Error fetching companies and roles:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch companies and roles',
        life: 3000
      });
    }
  }, [pagination.limit]);

  // Memoized values
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.role && filters.role !== 'All') count++;
    if (filters.company && filters.company !== 'All') count++;
    if (filters.name) count++;
    return count;
  }, [filters]);

  // API calls
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.limit.toString(),
        ...(filters.name && { name: filters.name }),
        ...(filters.role && filters.role !== 'All' && { role: filters.role }),
        ...(filters.company && filters.company !== 'All' && { company: filters.company })
      });

      const response = await axios.get(`/api/employees?${queryParams}`);
      setEmployees(response.data.data);
      setPagination(prev => ({ ...prev, totalRecords: response.data.meta.totalEmployees }));
    } catch (err) {
      setError("Error fetching data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, filters]);

  // Initial fetch of companies and roles
  useEffect(() => {
    fetchCompaniesAndRoles();
  }, [fetchCompaniesAndRoles]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees, refreshTrigger]);

  // Event handlers
  const handlePageChange = (event: PaginatorPageChangeEvent) => {
    setPagination(prev => ({
      ...prev,
      currentPage: event.page + 1,
      limit: event.rows
    }));
  };

  const handleUpdateEmployee = async (formData: EmployeeFormData) => {
    try {
      // Check if joinDate is valid
      if (isNaN(new Date(formData.joinDate).getTime())) {
        throw new Error('Invalid date format');
      }

      // Make the API call to update the employee
      await axios.put(`/api/employees/${formData.id}`, formData);

      // Refresh the employee list and roles/companies
      setRefreshTrigger(prev => prev + 1);
      await fetchCompaniesAndRoles();
      setEditDialogVisible(false);

      // Show success message
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Employee updated successfully',
        life: 3000
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update employee',
        life: 3000
      });
    }
  };

  const handleDelete = useCallback((employeeId: number) => {
    confirmDialog({
      message: 'Do you want to delete this employee?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      position: 'top',
      acceptClassName: 'm-2 w-10 border-2 border-gray-200',
      rejectClassName: 'm-2 w-10 border-2 border-gray-200',
      accept: async () => {
        try {
          await axios.delete(`/api/employees/${employeeId}`);
          await fetchEmployees();
          await fetchCompaniesAndRoles();
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Employee deleted successfully',
            life: 3000
          });
        } catch (error) {
          setError('Error deleting employee');
          console.error(error);
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete employee',
            life: 3000
          });
        }
      }
    });
  }, [fetchEmployees, fetchCompaniesAndRoles]);

  const handleEdit = useCallback((employee: Employee) => {
    try {
      // Ensure that joinDate is in the correct format for the calendar component
      const formattedEmployee: Employee = {
        ...employee,
        joinDate: new Date(employee.joinDate).toISOString().split('T')[0]  // Format as 'yyyy-mm-dd'
      };
      setMode('edit');
      setSelectedEmployee(formattedEmployee);
      setEditDialogVisible(true);
    } catch (error) {
      console.error('Error formatting employee data:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error preparing employee data for edit',
        life: 3000
      });
    }
  }, []);
  // Render methods
  const renderActionButtons = useCallback((rowData: Employee) => (
    <div className="flex justify-center gap-2">
      <button
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        onClick={() => handleEdit(rowData)}
      >
        <GrEdit className="text-blue-700 w-4 h-4" />
      </button>
      <button
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        onClick={() => handleDelete(rowData.id)}
      >
        <RiDeleteBin6Line className="text-red-500 w-4 h-4" />
      </button>
    </div>
  ), [handleEdit, handleDelete]);

  if (error) {
    return <p className="text-red-500 mb-4">{error}</p>;
  }
  const handleCancel = () => {
    setEditDialogVisible(false);
    setSelectedEmployee(null);
    if (mode === 'create') {
      reset();  // Reset form values when in create mode
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      <UnifiedEmployeeForm
        mode={mode}
        onSubmit={handleUpdateEmployee}
        visible={editDialogVisible}
        initialData={selectedEmployee}
        isDialog={true}
        onHide={handleCancel}
        onCancel={handleCancel}  // Ensure onCancel is implemented correctly
        roles={roles.filter(role => role !== 'All')}
        companies={companies.filter(company => company !== 'All')}
      />

      <div>
        <Title
          onFilter={(name) => setFilters(prev => ({ ...prev, name }))}
          onApplyFilters={(name, role, company) => {
            setFilters({ name, role, company });
            setPagination(prev => ({ ...prev, currentPage: 1 }));
          }}
          roles={roles}
          companies={companies}
          selectedRole={filters.role}
          selectedCompany={filters.company}
          onRoleFilter={(role) => setFilters(prev => ({ ...prev, role }))}
          onCompanyFilter={(company) => setFilters(prev => ({ ...prev, company }))}
          onResetFilters={() => {
            setFilters({ name: '', role: undefined, company: undefined });
            setPagination(prev => ({ ...prev, currentPage: 1 }));
          }}
          activeFilterCount={activeFilterCount}
          onRefreshEmployees={fetchEmployees}
        />

        <DataTable
          value={loading ? Array(10).fill({}) : employees}
          tableStyle={{ minWidth: '50rem' }}
          className="p-datatable-gridlines p-datatable-sm p-4 rounded-lg bg-white border-b border-gray-200"
        >
          <Column field="name" header="Name" sortable style={{ width: '15%' }}
            body={loading ? <Skeleton /> : undefined} />
          <Column field="email" header="Email" sortable style={{ width: '25%' }}
            body={loading ? <Skeleton /> : undefined} />
          <Column field="role" header="Role" sortable style={{ width: '15%' }}
            body={loading ? <Skeleton /> : undefined} />
          <Column field="company" header="Company" sortable style={{ width: '15%' }}
            body={loading ? <Skeleton /> : undefined} />
          <Column field="joinDate" header="Join Date" sortable style={{ width: '10%' }}
            body={loading ? <Skeleton /> : (rowData) => formatDate(rowData.joinDate)} />
          <Column field="salary" header="Salary" sortable style={{ width: '10%' }}
            body={loading ? <Skeleton /> : (rowData) => formatSalary(rowData.salary)} />
          <Column header="Actions" style={{ width: '6%' }}
            body={loading ? <Skeleton /> : renderActionButtons} />
        </DataTable>

        <Paginator
          first={(pagination.currentPage - 1) * pagination.limit}
          rows={pagination.limit}
          totalRecords={pagination.totalRecords}
          onPageChange={handlePageChange}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        />
      </div>
    </>
  );
};

export default Employees;
