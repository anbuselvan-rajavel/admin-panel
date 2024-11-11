"use client"
import React, { useEffect, useState } from 'react'
import Title from './title'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { Skeleton } from 'primereact/skeleton';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { classNames } from 'primereact/utils';
import { Ripple } from 'primereact/ripple';
import { Dropdown } from 'primereact/dropdown';

interface Employee {
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
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10); // You can adjust this or make it dynamic if needed
  const [totalRecords, setTotalRecords] = useState(0);  // Total number of records

  const fetchEmployees = async () => {
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
      setTotalPages(response.data.meta.totalPages)
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, limit]); // Refetch data whenever page or limit changes

  const rowClassName = (rowData: Employee) => {
    return "border-b border-gray-200"
  }

  // Pagination Change handler
  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setPage(event.page + 1);  // PrimeReact pagination is zero-indexed, so add 1
    setLimit(event.rows); // Update rows per page
  }

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
      )
    },
    CurrentPageReport: (options: any) => {
      return (
        <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
          {options.first} - {options.last} of {options.totalRecords}
        </span>
      );
    }
  }

  const renderSkeleton = () => {
    return (
      <DataTable value={Array(10).fill({})} className='p-datatable-striped'>
        <Column field='name' header="Name" sortable style={{ width: '15%' }} body={<Skeleton />} />
        <Column field='email' header="Email" sortable style={{ width: '25%' }} body={<Skeleton />} />
        <Column field='role' header="Role" sortable style={{ width: '15%' }} body={<Skeleton />} />
        <Column field='company' header="Company" sortable style={{ width: '15%' }} body={<Skeleton />} />
        <Column field='joinDate' header="Join Date" sortable style={{ width: '10%' }} body={<Skeleton />} />
        <Column field='salary' header="Salary" sortable style={{ width: '25%' }} body={<Skeleton />} />
      </DataTable>
    )
  }


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
            <Column field='salary' header="Salary" sortable style={{ width: '25%' }} />
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
  )
}

export default Employees