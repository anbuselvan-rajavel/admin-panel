import React from 'react';
import { Control, FieldErrors, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { UserFilterFormValues } from 'app/schema/filterFormSchema';


interface UserFilterFormProps {
  control: Control<{
    name?: string;
    status?: string;
    gender?: string;
  }>;
  errors: FieldErrors<{
    name?: string;
    status?: string;
    gender?: string;
  }>;
  filterOptions: {
    status: string[]; // Must be required
    gender: string[]; // Must be required
  };
  onSubmit: () => void;
  onReset: () => void;
}

const UserFilterForm: React.FC<UserFilterFormProps> = ({
  onSubmit,
  control,
  errors,
  filterOptions,
}) => {
  // Helper function to safely get error message 
  const getErrorMessage = (fieldError: FieldErrors<UserFilterFormValues>[keyof UserFilterFormValues]): string => { 
    if (typeof fieldError?.message === 'string') {
       return fieldError.message; 
      } 
      return ''; 
    };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
          )
          }
        />
        {errors.name && (
          <small className="text-red-500"> 
          {getErrorMessage(errors.name)} 
          </small>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="status">Status</label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Dropdown
              id="status"
              value={field.value}
              onChange={field.onChange}
              options={['All', ...filterOptions.status]}
              className={`w-full border-2 border-violet-500 custom-boxShadow ${errors.status ? 'p-invalid' : ''}`}
            />
          )}
        />
        {errors.status && (<small className="text-red-500"> {getErrorMessage(errors.status)} </small>)}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="gender">Gender</label>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Dropdown
              id="gender"
              value={field.value}
              onChange={field.onChange}
              options={['All', ...filterOptions.gender]}
              className={`w-full border-2 border-violet-500 custom-boxShadow ${errors.gender ? 'p-invalid' : ''}`}
            />
          )}
        />
        {errors.gender && (<small className="text-red-500"> {getErrorMessage(errors.gender)} </small>)}
      </div>
    </form>
  );
};

export default UserFilterForm;