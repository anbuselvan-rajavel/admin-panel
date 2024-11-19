import React, { useRef, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmployeeFormData, employeeSchema } from '@/app/schema/employeeSchema';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

interface EmployeeCreateFormProps {
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  resetForm: () => void;
}

const API_BASE_URL = 'http://localhost:3000/api';

const defaultValues: EmployeeFormData = {
  name: '',
  email: '',
  role: '',
  company: '',
  joinDate: '',
  salary: 0,
};

const EmployeeCreateForm: React.FC<EmployeeCreateFormProps> = ({ 
  onSubmit, 
  resetForm,
 }) => {
  const [companies, setCompanies] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, formState: { errors } } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  });

  const toast = useRef<Toast>(null);

  // Fetch companies and roles from API
  const fetchCompaniesAndRoles = async () => {
    try {
      setLoading(true);
      // First, fetch initial page to get total records
      const initialResponse = await axios.get(`${API_BASE_URL}/employees?page=1&limit=10`);
      const totalRecords = initialResponse.data.meta.totalEmployees;
      const totalPages = Math.ceil(totalRecords / 10);

      const uniqueCompanies = new Set<string>();
      const uniqueRoles = new Set<string>();

      // Process first page
      initialResponse.data.data.forEach((employee: any) => {
        if (employee.company) uniqueCompanies.add(employee.company);
        if (employee.role) uniqueRoles.add(employee.role);
      });

      // Fetch remaining pages
      const remainingPages = Array.from(
        { length: totalPages - 1 },
        (_, i) => axios.get(`${API_BASE_URL}/employees?page=${i + 2}&limit=10`)
      );

      const responses = await Promise.all(remainingPages);

      // Process remaining pages
      responses.forEach(response => {
        response.data.data.forEach((employee: any) => {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompaniesAndRoles();
  }, []);

  const handleFormSubmit = async (data: EmployeeFormData) => {
    try {
      const formattedData = {
        ...data,
        joinDate: data.joinDate || ''
      };
      
      await onSubmit(formattedData);
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Employee created successfully', 
        life: 3000 
      });
      resetForm();
    } catch (error) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to create employee', 
        life: 3000 
      });
    }
  };

  const renderError = (error?: string) => {
    return error ? <p className="text-red-500">{error}</p> : null;
  };

  if (loading) {
    return <div className="p-4">Loading form data...</div>;
  }

  return (
    <>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Name field */}
        <div className="field">
          <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Name</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <InputText 
                id="name" 
                {...field} 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200" 
              />
            )}
          />
          {renderError(errors.name?.message)}
        </div>

        {/* Email field */}
        <div className="field">
          <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <InputText 
                id="email" 
                {...field} 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200" 
              />
            )}
          />
          {renderError(errors.email?.message)}
        </div>

        {/* Role field */}
        <div className="field">
          <label htmlFor="role" className="block mb-2 font-medium text-gray-700">Role</label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Dropdown
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                options={roles}
                className={errors.role ? 'p-invalid w-full' : 'w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200'}
                placeholder="Select a role"
              />
            )}
          />
          {renderError(errors.role?.message)}
        </div>

        {/* Company field */}
        <div className="field">
          <label htmlFor="company" className="block mb-2 font-medium text-gray-700">Company</label>
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <Dropdown
                id={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                options={companies}
                className={errors.company ? 'p-invalid w-full' : 'w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200'}
                placeholder="Select a company"
              />
            )}
          />
          {renderError(errors.company?.message)}
        </div>

        {/* Join Date field */}
        <div className="field">
          <label htmlFor="joinDate" className="block mb-2 font-medium text-gray-700">Join Date</label>
          <Controller
            name="joinDate"
            control={control}
            render={({ field }) => (
              <Calendar
                id="joinDate"
                value={field.value ? new Date(field.value) : null}
                onChange={(e) => {
                  const date = e.value as Date | null;
                  const formattedDate = date 
                    ? date.toISOString().split('T')[0]
                    : '';
                  field.onChange(formattedDate);
                }}
                dateFormat="dd/mm/yy"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200"
                showIcon
                maxDate={new Date()}
              />
            )}
          />
          {renderError(errors.joinDate?.message)}
        </div>

        {/* Salary field */}
        <div className="field">
          <label htmlFor="salary" className="block mb-2 font-medium text-gray-700">Salary</label>
          <Controller
            name="salary"
            control={control}
            render={({ field }) => (
              <InputNumber
                id="salary"
                value={field.value}
                onValueChange={(e) => field.onChange(e.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200"
                mode="currency"
                currency="INR"
                locale="en-IN"
                minFractionDigits={0}
              />
            )}
          />
          {renderError(errors.salary?.message)}
        </div>

        {/* Form buttons */}
        <div className="flex justify-end space-x-2 mt-4">
          <Button 
            type="submit" 
            label="Create" 
            icon="pi pi-save" 
            className="bg-green-500 p-2 w-full" 
          />
          <Button 
            type="button" 
            label="Reset" 
            icon="pi pi-refresh" 
            className="bg-red-500 p-2 w-full" 
            onClick={resetForm} 
          />
        </div>
      </form>
    </>
  );
};

export default EmployeeCreateForm;