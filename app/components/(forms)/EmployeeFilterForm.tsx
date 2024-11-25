import React from 'react';
import { Control, FieldErrors, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FilterOptions } from '../FilterSidebar';


// Define the form values interface
interface EmployeeFilterValues {
  name: string;
  role: string;
  company: string;
}

interface EmployeeFilterFormProps {
  control: Control<EmployeeFilterValues>;
  errors: FieldErrors<EmployeeFilterValues>;
  filterOptions: FilterOptions;
}

const EmployeeFilterForm: React.FC<EmployeeFilterFormProps> = ({
  control,
  errors,
  filterOptions,
}) => {
  // Helper function to safely get error message
  const getErrorMessage = (fieldError: any): string => {
    if (typeof fieldError?.message === 'string') {
      return fieldError.message;
    }
    return '';
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="name">Name</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <InputText 
              id="name" 
              {...field} 
              className={`w-full h-15 p-3 border-2 border-violet-500 focus:outline-none focus:shadow-none ${errors.name ? 'p-invalid' : ''}`}
              placeholder='Filter by name...'
            />
          )}
        />
        {errors.name && (
          <small className="text-red-500">
            {getErrorMessage(errors.name)}
          </small>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="role">Role</label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Dropdown
              id="role"
              value={field.value}
              onChange={field.onChange}
              options={['All', ...filterOptions.role]}
              className={`w-full border-2 border-violet-500 custom-boxShadow ${errors.role ? 'p-invalid' : ''}`}
            />
          )}
        />
        {errors.role && (
          <small className="text-red-500">
            {getErrorMessage(errors.role)}
          </small>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="company">Company</label>
        <Controller
          name="company"
          control={control}
          render={({ field }) => (
            <Dropdown
              id="company"
              value={field.value}
              onChange={field.onChange}
              options={['All', ...filterOptions.company]}
              className={`w-full border-2 border-violet-500 custom-boxShadow ${errors.company ? 'p-invalid' : ''}`}
            />
          )}
        />
        {errors.company && (
          <small className="text-red-500">
            {getErrorMessage(errors.company)}
          </small>
        )}
      </div>
    </div>
  );
};

export default EmployeeFilterForm;