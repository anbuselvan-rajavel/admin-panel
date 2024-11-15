import React from 'react';
import { Control, FieldErrors, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { UserFilterFormValues } from '@/app/schema/filterFormSchema';


interface UserFilterFormProps {
  onSubmit: () => void;
  onReset: () => void;
  control: Control<UserFilterFormValues>;
  errors: FieldErrors<UserFilterFormValues>;
  filterOptions: {
    status: string[];
    gender: string[];
  };
}

const UserFilterForm: React.FC<UserFilterFormProps> = ({
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
        <label htmlFor="status" className='block text-sm font-medium'>Status</label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Dropdown
              id={field.name}
              value={field.value}
              onChange={field.onChange}
              options={filterOptions.status}
              className='w-full border-2 border-violet-500'
              placeholder='Select Status'
            />
          )}
        />
        {errors.status && (
          <small className="text-red-500">{errors.status.message}</small>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="gender" className='block text-sm font-medium'>Gender</label>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Dropdown
              id={field.name}
              value={field.value}
              onChange={field.onChange}
              options={filterOptions.gender}
              className='w-full border-2 border-violet-500'
              placeholder='Select Gender'
            />
          )}
        />
        {errors.gender && (
          <small className="text-red-500">{errors.gender.message}</small>
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

export default UserFilterForm;