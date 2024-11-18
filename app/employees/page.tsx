"use client"
import React, { useEffect, useState, useMemo, useRef } from 'react';
import Title from './title';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Skeleton } from 'primereact/skeleton';
import { Paginator, PaginatorChangeEvent, PaginatorPageChangeEvent, PaginatorRowsPerPageDropdownOptions, PaginatorTemplateOptions } from 'primereact/paginator';
import { Dropdown } from 'primereact/dropdown';
import { GrEdit } from 'react-icons/gr';
import { RiDeleteBin6Line } from 'react-icons/ri';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primeicons/primeicons.css';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import EmployeeEditForm from '../components/(forms)/EmployeeEditForm';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  joinDate: string;
  salary: number;
}

interface CurrentPageReportOptions {
  first: number;
  last: number;
  totalRecords: number;
}

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>(undefined);
  const [nameFilter, setNameFilter] = useState('');
  // In your Employees component, add these state variables
const [editDialogVisible, setEditDialogVisible] = useState(false);
const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const companies = [
    "All",
    "InnovateTech",
    "Creative Solutions",
    "Tech Innovations",
    "CloudCorp",
    "BuildWave",
    "DevWorks",
    "PeopleFirst",
    "SecureTech",
    "NetOps",
    "Sales Dynamics",
    "Creative Studio",
    "Data Solutions"
  ];

  const roles = [
    "All",
    "Product Manager",
    "UI/UX Designer",
    "Data Scientist",
    "Backend Developer",
    "Project Manager",
    "Frontend Developer",
    "HR Manager",
    "DevOps Engineer",
    "Senior Developer",
    "Software Engineer",
    "QA Engineer",
    "Business Analyst",
    "Network Administrator",
    "Sales Manager",
    "Technical Support",
    "Graphic Designer",
    "Database Administrator"
  ];

  // calculate active filter count
  const activeFilterCount = useMemo(() => {
let count = 0;
if(selectedRole && selectedRole !== 'All') count++;
if(selectedCompany && selectedCompany !== 'All') count++;
if(nameFilter && nameFilter !== '') count++;
return count;
  }, [selectedRole, selectedCompany, nameFilter]);

const fetchEmployees = async (
  page: number,
  limit: number,
  name?: string,
  role?: string,
  company?: string
) => {
  setLoading(true);
  try{
    let url = 'http://localhost:3000/api/employees';

    // create an array of filters
    const filters: {[key: string]: string | number | undefined} = {
      page,
      limit,
      name: name || undefined,
      role: role && role !== "All" ? role : undefined,
      company: company && company !== 'All' ? company : undefined
    };

    // Add filters to URL using URLSearchParams
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    }

    const finalUrl = `${url}?${queryParams.toString()}`;
    const response = await axios.get(finalUrl);

    setEmployees(response.data.data);
    setTotalRecords(response.data.meta.totalEmployees);
    setFilteredEmployees(response.data.data);
  }
  catch(err){
    setError("Error fetching data");
    console.error(err);    
  }finally{
    setLoading(false);
  }
};

  useEffect(() => {
    fetchEmployees(currentPage, limit, nameFilter, selectedRole, selectedCompany);
  }, [currentPage, limit, nameFilter, selectedRole, selectedCompany]); // Refetch data whenever page or limit changes

  useEffect(() => {
    // Whenever employees change, reset filtered employees
    setFilteredEmployees(employees);
  }, [employees]);

  const rowClassName = () => {
    return "border-b border-gray-200";
  };

  const toast = useRef<Toast | null>(null);

  const handleRefreshEmployees = () => {
    fetchEmployees(
      currentPage,
      limit,
      nameFilter,
      selectedRole,
      selectedCompany
    );
  };

  // Pagination Change handler
  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setCurrentPage(event.page + 1);  // PrimeReact pagination is zero-indexed, so add 1
    setLimit(event.rows); // Update rows per page
  };

  const handleFilter = (filterText: string) => {
    const filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const handleApplyFilters = (name: string, role: string | undefined, company: string | undefined) => {
    setNameFilter(name);
    setSelectedRole(role);
    setSelectedCompany(company);
    setCurrentPage(1);
  }

  const handleResetFilters = () => {
    setNameFilter("");
    setSelectedRole(undefined);
    setSelectedCompany(undefined);
    setCurrentPage(1);
  }
  const paginatorTemplate: PaginatorTemplateOptions = {
    layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport',
    
    RowsPerPageDropdown: (options: PaginatorRowsPerPageDropdownOptions) => {
      const dropdownOptions = [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 15, value: 15 },
        { label: 20, value: 20 },
      ];
      const handleChange = (event: PaginatorChangeEvent) => {
        options.onChange(event); // Pass event to the PaginatorChangeEvent handler
      }

      return (
        <React.Fragment>
          <Dropdown value={options.value} options={dropdownOptions} onChange={handleChange} className='border-2 border-gray-300 custom-boxShadow' />
        </React.Fragment>
      );
    },
    CurrentPageReport: (options: CurrentPageReportOptions) => {
      return (
        <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '300px', textAlign: 'center' }}>
         Showing {options.first} - {options.last} of {options.totalRecords} Results
        </span>
      );
    }
  };

  const renderSkeleton = () => {
    return (
      <DataTable value={Array(10).fill({})} className='p-datatable-striped'>
        <Column field='name' header="Name" sortable style={{ width: '15%' }} body={<Skeleton />} />
        <Column field='email' header="Email" sortable style={{ width: '25%' }} body={<Skeleton />} />
        <Column field='role' header="Role" sortable style={{ width: '15%' }} body={<Skeleton />} />
        <Column field='company' header="Company" sortable style={{ width: '15%' }} body={<Skeleton />} />
        <Column field='joinDate' header="Join Date" sortable style={{ width: '10%' }} body={<Skeleton />} />
        <Column field='salary' header="Salary" sortable style={{ width: '10%' }} body={<Skeleton />} />
        <Column field='action' header="Actions" sortable style={{ width: '6%' }} body={<Skeleton />} />
      </DataTable>
    );
  };

  // Handle Edit action
  const handleEdit = (employee: Employee) => {
    // Convert joinDate to date string
    const formattedEmployee = {
      ...employee,
      joinDate: employee.joinDate ? 
        (typeof employee.joinDate === 'string' 
          ? employee.joinDate 
          : new Date(employee.joinDate).toISOString().split('T')[0]) 
        : ''
    };
    setSelectedEmployee(formattedEmployee);
    setEditDialogVisible(true);
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
  }
  
  // Handle Delete action
  const handleDelete = (employeeId: string) => {
    confirmDialog({
      message: 'Are you sure you want to delete this employee?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      position: 'top',
      accept: async () => {
        try {
          await axios.delete(`http://localhost:3000/api/employees/${employeeId}`);
          setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== employeeId));
          setTotalRecords((prevTotal) => prevTotal - 1);
          // Add null check for toast
          toast.current?.show({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Employee deleted successfully', 
            life: 3000 
          });
        } catch (error) {
          setError('Error deleting employee');
          // Add null check for toast
          toast.current?.show({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to delete employee', 
            life: 3000 
          });
          console.log(error);
        }
      },
      reject: () => {
        // Add null check for toast
        toast.current?.show({ 
          severity: 'info', 
          summary: 'Cancelled', 
          detail: 'Delete operation cancelled', 
          life: 3000 
        });
      }
    });
  };
  const formatSalary = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0 // Removes decimal places
    }).format(value);
  }

   return (
    <>
     <Toast ref={toast} />
     <ConfirmDialog />
     <EmployeeEditForm 
       visible={editDialogVisible}
       employee={selectedEmployee}
       onHide={() => setEditDialogVisible(false)}
       onUpdate={handleUpdateEmployee}
       roles={roles}
       companies={companies}
     />
    <div>
      <Title
        onFilter={handleFilter}
        onApplyFilters={handleApplyFilters}
        roles={roles}
        companies={companies}
        selectedRole={selectedRole}
        selectedCompany={selectedCompany}
        onRoleFilter={(role) => setSelectedRole(role)}
        onCompanyFilter={(company) => setSelectedCompany(company)}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
        onRefreshEmployees={handleRefreshEmployees} 
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        renderSkeleton()
      ) : (
        <div>
          <DataTable
            value={filteredEmployees}
            tableStyle={{ minWidth: '50rem' }}
            rowClassName={rowClassName}
            className='p-datatable-gridlines p-datatable-sm p-4 rounded-lg bg-white'
          >
            <Column field='name' header="Name" sortable style={{ width: '15%' }} />
            <Column field='email' header="Email" sortable style={{ width: '25%' }} />
            <Column field='role' header="Role" sortable style={{ width: '15%' }} />
            <Column field='company' header="Company" sortable style={{ width: '15%' }} />
            <Column field='joinDate' header="Join Date" sortable style={{ width: '10%' }} />
            <Column field='salary' header="Salary" sortable style={{ width: '10%' }} body={(rowData) => formatSalary(rowData.salary)} />
            {/* Actions Column with Icons */}
            <Column
              header="Actions"
              body={(rowData: Employee) => (
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
              )}
              style={{ width: '6%' }}
            />
          </DataTable>

          <Paginator
            first={(currentPage - 1) * limit} // Calculate starting item index (zero-indexed)
            rows={limit}
            totalRecords={totalRecords} // Calculate total records based on pages
            onPageChange={onPageChange} // Handle page change
            template={paginatorTemplate}
          />
        </div>
      )}
    </div>
    </>
  );
};

export default Employees;
