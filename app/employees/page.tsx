"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Title from './title';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Skeleton } from 'primereact/skeleton';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Dropdown } from 'primereact/dropdown';
import { GrEdit } from 'react-icons/gr';
import { RiDeleteBin6Line } from 'react-icons/ri';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  joinDate: string;
  salary: number;
}

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // You can adjust this or make it dynamic if needed
  const [totalRecords, setTotalRecords] = useState(0);  // Total number of records

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/employees', {
        params: {
          page,
          limit
        }
      });

      setEmployees(response.data.data);
      setTotalRecords(response.data.meta.totalEmployees);      
    } catch (err) {
      setError("Error fetching data");
      console.log(err);
      
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]); // Refetch data whenever page or limit changes

  const rowClassName = (rowData: Employee) => {
    return "border-b border-gray-200";
  };

  // Pagination Change handler
  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setPage(event.page + 1);  // PrimeReact pagination is zero-indexed, so add 1
    setLimit(event.rows); // Update rows per page
  };

  const paginatorTemplate = {
    layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport',
    RowsPerPageDropdown: (options: any) => {
      const dropdownOptions = [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 15, value: 15 },
        { label: 20, value: 20 },
      ];
      return (
        <React.Fragment>
          <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} className='border' />
        </React.Fragment>
      );
    },
    CurrentPageReport: (options: any) => {
      return (
        <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
          {options.first} - {options.last} of {options.totalRecords}
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
    console.log('Edit clicked for', employee);
    // Implement your edit logic here, maybe open a modal with the employee details
  };

  // Handle Delete action
  const handleDelete = async (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:3000/api/employees/${employeeId}`);
        setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== employeeId));
        setTotalRecords((prevTotal) => prevTotal - 1);
      } catch (error) {
        setError('Error deleting employee');
        console.log(error);
        
      }
    }
  };

  return (
    <div>
      <Title />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        renderSkeleton()
      ) : (
        <div>
          <DataTable
            value={employees}
            tableStyle={{ minWidth: '50rem' }}
            rowClassName={rowClassName}
            className='p-datatable-gridlines p-datatable-sm p-4 rounded-lg bg-white'
          >
            <Column field='name' header="Name" sortable style={{ width: '15%' }} />
            <Column field='email' header="Email" sortable style={{ width: '25%' }} />
            <Column field='role' header="Role" sortable style={{ width: '15%' }} />
            <Column field='company' header="Company" sortable style={{ width: '15%' }} />
            <Column field='joinDate' header="Join Date" sortable style={{ width: '10%' }} />
            <Column field='salary' header="Salary" sortable style={{ width: '10%' }} />
            {/* Actions Column with Icons */}
            <Column
              header="Actions"
              body={(rowData: Employee) => (
                <div className="flex justify-between">
                  <button
                    className="p-button p-button-rounded p-button-text p-button-info"
                    onClick={() => handleEdit(rowData)}
                  >
                    <GrEdit className="text-blue-700 w-5" />
                  </button>
                  <button
                    className="p-button p-button-rounded p-button-text p-button-danger"
                    onClick={() => handleDelete(rowData.id)}
                  >
                    <RiDeleteBin6Line className="text-red-500" />
                  </button>
                </div>
              )}
              style={{ width: '6%' }}
              headerStyle={{ textAlign: 'center' }} // Center the header
            />
          </DataTable>

          <Paginator
            first={(page - 1) * limit} // Calculate starting item index (zero-indexed)
            rows={limit}
            totalRecords={totalRecords} // Calculate total records based on pages
            onPageChange={onPageChange} // Handle page change
            template={paginatorTemplate}
          />
        </div>
      )}
    </div>
  );
};

export default Employees;
