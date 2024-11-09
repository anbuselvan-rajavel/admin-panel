"use client"
import React, { useEffect, useState } from 'react'
import Title from './title'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';

const Employees = () => {
  const [employees, setEmployees] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try{
      let url = 'http://localhost:3000/api/employees/';
      const response = await axios.get(url);
      setEmployees(response.data);
    }catch(err){
      setError("Error fetching data");
    }finally{
setLoading(false);
    }
  }

  useEffect(() => {  
   fetchUsers();
  }, []);


  return (
    <div> 
        <Title/>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <DataTable value={employees} tableStyle={{ minWidth: '50rem' }}>
          <Column field='id' header="ID" sortable style={{ width: '5%' }}/>
          <Column field='name' header="Name" sortable style={{ width: '15%' }}/>
          <Column field='email' header="Email"sortable style={{ width: '25%' }}/>
          <Column field='role' header="Role"sortable style={{ width: '15%' }}/>
          <Column field='company' header="Company"sortable style={{ width: '15%' }}/>
          <Column field='joinDate'header="Join Date"sortable style={{ width: '10%' }}/>
          <Column field='salary'header="Salary"sortable style={{ width: '25%' }}/>
        </DataTable>
    </div>
  )
}

export default Employees