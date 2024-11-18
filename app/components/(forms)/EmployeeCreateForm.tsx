import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmployeeCreateFormValues, employeeCreateSchema } from '@/app/schema/createEmployeeSchema';

interface EmployeeCreateFormProps {
  onSubmit: (data: EmployeeCreateFormValues) => Promise<void>; // Ensure this is a promise-returning function
  resetForm: () => void;
}

const defaultValues = {
  name: '',
  email: '',
  role: '',
  company: '',
  joinDate: undefined,
  salary: 0,
};

const EmployeeCreateForm: React.FC<EmployeeCreateFormProps> = ({ onSubmit, resetForm }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<EmployeeCreateFormValues>({
    resolver: zodResolver(employeeCreateSchema),
    defaultValues,
  });

  const toast = useRef<Toast>(null);

  const handleFormSubmit = async (data: EmployeeCreateFormValues) => {
    try {
      await onSubmit(data);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Employee created successfully', life: 3000 });
      resetForm();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to create employee', life: 3000 });
    }
  };

  const renderError = (error?: string) => {
    return error ? <p className="text-red-500">{error}</p> : null;
  };

  return (
    <>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="field">
          <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Name</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <InputText id="name" {...field} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200" />}
          />
          {renderError(errors.name?.message)}
        </div>

        <div className="field">
          <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => <InputText id="email" {...field} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200" />}
          />
          {renderError(errors.email?.message)}
        </div>

        <div className="field">
          <label htmlFor="role" className="block mb-2 font-medium text-gray-700">Role</label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => <InputText id="role" {...field} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200" />}
          />
          {renderError(errors.role?.message)}
        </div>

        <div className="field">
          <label htmlFor="company" className="block mb-2 font-medium text-gray-700">Company</label>
          <Controller
            name="company"
            control={control}
            render={({ field }) => <InputText id="company" {...field} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200" />}
          />
          {renderError(errors.company?.message)}
        </div>

        <div className="field">
          <label htmlFor="joinDate" className="block mb-2 font-medium text-gray-700">Join Date</label>
          <Controller
            name="joinDate"
            control={control}
            render={({ field }) => <Calendar id="joinDate" {...field} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200" dateFormat="mm/dd/yy" />}
          />
          {renderError(errors.joinDate?.message)}
        </div>

        <div className="field">
          <label htmlFor="salary" className="block mb-2 font-medium text-gray-700">Salary</label>
          <Controller
            name="salary"
            control={control}
            render={({ field }) => (
              <InputNumber
                id="salary"
                value={field.value || 0}
                onValueChange={(e) => field.onChange(e.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                mode="currency"
                currency="INR"
                locale="en-IN"
              />
            )}
          />
          {renderError(errors.salary?.message)}
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button type="submit" label="Create" icon="pi pi-save" className="bg-green-400 p-1" />
          <Button type="button" label="Reset" icon="pi pi-refresh" className="bg-violet-400 p-1" onClick={resetForm} />
        </div>
      </form>
    </>
  );
};

export default EmployeeCreateForm;