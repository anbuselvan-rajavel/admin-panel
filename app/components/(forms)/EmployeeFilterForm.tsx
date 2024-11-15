import React from 'react';
import { Control, FieldErrors, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { EmployeeFilterFormValues } from '@/app/schema/filterFormSchema';


interface EmployeeFilterFormProps {
  onSubmit: () => void;
  onReset: () => void;
  control: Control<EmployeeFilterFormValues>;
  errors: FieldErrors<EmployeeFilterFormValues>;
  filterOptions: {
    role: string[];
    company: string[];
  };
}

const EmployeeFilterForm: React.FC<EmployeeFilterFormProps> = ({
  onSubmit,
  onReset,
  control,
  errors,
  filterOptions,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className='block text-sm font-medium'>Name</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <InputText
              id="name"
              {...field}
              className='w-full h-15 p-3 border-2 border-violet-500 focus:outline-none focus:shadow-none'
              placeholder='Filter by name...'
            />
          )}
        />
        {errors.name && (
          <small className="text-red-500">{errors.name.message}</small>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="role" className='block text-sm font-medium'>Role</label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Dropdown
              id={field.name}
              value={field.value}
              onChange={field.onChange}
              options={filterOptions.role}
              className='w-full border-2 border-violet-500'
              placeholder='Select Role'
            />
          )}
        />
        {errors.role && (
          <small className="text-red-500">{errors.role.message}</small>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="company" className='block text-sm font-medium'>Company</label>
        <Controller
          name="company"
          control={control}
          render={({ field }) => (
            <Dropdown
              id={field.name}
              value={field.value}
              onChange={field.onChange}
              options={filterOptions.company}
              className='w-full border-2 border-violet-500'
              placeholder='Select Company'
            />
          )}
        />
        {errors.company && (
          <small className="text-red-500">{errors.company.message}</small>
        )}
      </div>

      <div className="flex row justify-around mt-6">
        <Button
          label="Reset"
          onClick={onReset}
          className="bg-red-400 w-24 h-12 p-3 text-neutral-50 flex justify-center items-center"
          icon="pi pi-times"
        />
        <Button
          type="submit"
          label="Apply"
          className="bg-green-400 w-24 h-12 p-3 text-neutral-50 flex justify-center items-center"
          icon="pi pi-check"
        />
      </div>
    </form>
  );
};

export default EmployeeFilterForm;