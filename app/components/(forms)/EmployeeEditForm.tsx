import React, { useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmployeeFormData, employeeSchema } from '@/app/schema/employeeSchema';
import { Employee } from '@/types/employee';

interface EmployeeEditFormProps {
  visible: boolean;
  employee: Employee | null;
  onHide: () => void;
  onUpdate: (employee: Employee) => void;
  roles: string[];
  companies: string[];
}

const EmployeeEditForm: React.FC<EmployeeEditFormProps> = ({
  visible,
  employee,
  onHide,
  onUpdate,
  roles,
  companies,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      id: undefined, // Include id in default values
      name: '',
      email: '',
      role: '',
      company: '',
      joinDate: '',
      salary: 0,
    },
  });

  const toast = useRef<Toast>(null);

  // Reset form with employee data when it changes
  useEffect(() => {
    if (employee) {
      const formattedEmployee = {
        ...employee,
        joinDate: employee.joinDate ? new Date(employee.joinDate).toISOString().split('T')[0] : '',
      };
      reset(formattedEmployee);
    }
  }, [employee, reset]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      const formattedData = {
        ...data,
        joinDate: data.joinDate ? new Date(data.joinDate).toISOString().split('T')[0] : '',
      };
  
      await axios.put(
        `http://localhost:3000/api/employees/${data.id}`,
        formattedData
      );
      
      // Call onUpdate without waiting for the response
      onUpdate(formattedData as Employee);
      onHide();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update employee', life: 3000 });
      console.error('Error updating employee:', error);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Edit Employee"
        visible={visible}
        style={{ width: '50vw' }}
        onHide={() => {
          reset();
          onHide();
        }}
        modal
        className="p-fluid"
        headerClassName='text-center'
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <div className="field">
            <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
              Name
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={errors.name ? 'p-invalid' : 'w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200'}
                />
              )}
            />
            {errors.name && <small className="text-red-500">{errors.name.message}</small>}
          </div>

          {/* Email Input */}
          <div className="field">
            <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
              Email
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={errors.email ? 'p-invalid' : 'w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200'}
                />
              )}
            />
            {errors.email && <small className="text-red-500">{errors.email.message}</small>}
          </div>

          {/* Role Dropdown */}
          <div className="field">
            <label htmlFor="role" className="block mb-2 font-medium text-gray-700">
              Role
            </label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={roles}
                  className={errors.role ? 'p-invalid' : 'w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200'}
                />
              )}
            />
            {errors.role && <small className="text-red-500">{errors.role.message}</small>}
          </div>

          {/* Company Dropdown */}
          <div className="field">
            <label htmlFor="company" className="block mb-2 font-medium text-gray-700">
              Company
            </label>
            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={companies}
                  className={errors.company ? 'p-invalid' : 'w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200'}
                />
              )}
            />
            {errors.company && <small className="text-red-500">{errors.company.message}</small>}
          </div>

          {/* Join Date Calendar */}
          <div className="field">
            <label htmlFor="joinDate" className="block mb-2 font-medium text-gray-700">
              Join Date
            </label>
            <Controller
              name="joinDate"
              control={control}
              render={({ field }) => (
                <Calendar
                  id={field.name}
                  value={field.value ? new Date(field.value) : null}
                  onChange={(e) => {
                    const date = e.value as Date | null;
                    field.onChange(date ? date.toISOString().split('T')[0] : '');
                  }}
                  dateFormat="dd/mm/yy"
                  showIcon
                  maxDate={new Date()}
                  className={errors.joinDate ? 'p-invalid' : 'w-full p-2 border border-gray-300 rounded-md shadow-sm'}
                />
              )}
            />
            {errors.joinDate && <small className="text-red-500">{errors.joinDate.message}</small>}
          </div>

          {/* Salary Input */}
          <div className="field">
            <label htmlFor="salary" className="block mb-2 font-medium text-gray-700">
              Salary
            </label>
            <Controller
              name="salary"
              control={control}
              render={({ field }) => (
                <InputNumber
                  id={field.name}
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  mode="currency"
                  currency="INR"
                  locale="en-IN"
                  className={errors.salary ? 'p-invalid' : 'w-full p-2 border border-gray-300 rounded-md shadow-sm'}
                />
              )}
            />
            {errors.salary && <small className="text-red-500">{errors.salary.message}</small>}
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              label="Cancel"
              icon="pi pi-times"
              type="button"
              onClick={() => {
                reset();
                onHide();
              }}
              className="bg-red-500 p-2"
            />
            <Button
              label="Save"
              icon="pi pi-check"
              loading={isSubmitting}
              type="submit"
              className="bg-green-500 p-2"
            />
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default EmployeeEditForm;
