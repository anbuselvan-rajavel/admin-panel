import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Control, FieldErrors } from 'react-hook-form';
import { Button } from 'primereact/button';

interface FilterOptions {
  role: string[];
  company: string[];
}

interface FilterSidebarProps<T> {
  visible: boolean;
  onHide: () => void;
  onSubmit: () => void;
  onReset: () => void;
  control: Control<T>;
  errors: FieldErrors<T>;
  CustomFilterForm: React.ComponentType<{
    control: Control<T>;
    errors: FieldErrors<T>;
    filterOptions: FilterOptions;
    onSubmit: () => void;
    onReset: () => void;
  }>;
  filterOptions: FilterOptions;
}

const FilterSidebar = <T,>({
  visible,
  onHide,
  onSubmit,
  onReset,
  control,
  errors,
  CustomFilterForm,
  filterOptions,
}: FilterSidebarProps<T>) => {
  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      className="p-sidebar-sm"
      position='right'
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Filters</h2>
        </div>
        <div className="flex-grow">
          <CustomFilterForm
            control={control}
            errors={errors}
            filterOptions={filterOptions}
            onSubmit={onSubmit}
            onReset={onReset}
          />
        </div>
        <div className="flex justify-between">
          <Button
            label="Reset"
            icon="pi pi-refresh"
            onClick={onReset}
            className="bg-red-500 h-12 p-2 w-32"
          />
          <Button
            label="Apply"
            icon="pi pi-check"
            onClick={onSubmit}
            className="bg-green-500 h-12 p-2 w-32"
          />
        </div>
      </div>
    </Sidebar>
  );
};

export default FilterSidebar;
