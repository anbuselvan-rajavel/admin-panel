// FilterSidebar.tsx
import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Control, FieldErrors } from 'react-hook-form';

// Make the filter options type generic
export interface FilterOptions {
  [key: string]: string[];
}

export interface FilterSidebarProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  control: Control<any>;
  errors: FieldErrors<any>;
  CustomFilterForm: React.FC<any>;
  filterOptions: FilterOptions;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  visible,
  onHide,
  onSubmit,
  onReset,
  control,
  errors,
  CustomFilterForm,
  filterOptions,
}) => {
  return (
    <Sidebar
      visible={visible}
      position="right"
      onHide={onHide}
      className="w-96"
    >
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold mb-4">Filters</h2>
          <form onSubmit={onSubmit}>
            <CustomFilterForm
              control={control}
              errors={errors}
              filterOptions={filterOptions}
            />
          </form>
        </div>
        <div className="flex row justify-around gap-2 mt-4">
          <Button
            label="Reset"
            severity="secondary"
            onClick={onReset}
            type="button"
            className='bg-red-500 w-full h-12 p-3 text-white flex justify-center items-center'
            icon="pi pi-times"
          />
          <Button
            label="Apply"
            severity="success"
            onClick={onSubmit}
            type="submit"
            className="bg-green-500 w-full h-12 p-3 text-white flex justify-center items-center"
            icon="pi pi-check"
          />
        </div>
      </div>
    </Sidebar>
  );
};

export default FilterSidebar;