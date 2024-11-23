import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Control, FieldErrors } from 'react-hook-form';
import { UserFilterFormValues } from '../schema/filterFormSchema';
import { Button } from 'primereact/button';

interface FilterSidebarProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: () => void;
  onReset: () => void;
  control: Control<UserFilterFormValues>;
  errors: FieldErrors<UserFilterFormValues>;
  CustomFilterForm: React.ComponentType<{
    control: Control<UserFilterFormValues>;
    errors: FieldErrors<UserFilterFormValues>;
    filterOptions: { status: string[]; gender: string[]; };
    onSubmit: () => void;
    onReset: () => void;
  }>;
  filterOptions: {
    status: string[]; gender: string[];
  };
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
    <Sidebar visible={visible} onHide={onHide} className="p-sidebar-sm">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Filters</h2>
        </div>
        <CustomFilterForm 
        control={control} 
        errors={errors} 
        filterOptions={filterOptions}
        onSubmit={onSubmit} 
        onReset={onReset}
         />
        <div className="flex justify-end mt-4">
          <Button label="Reset" icon="pi pi-refresh" onClick={onReset} />
          <Button label="Apply" icon="pi pi-check" onClick={onSubmit} />
        </div>
      </div>
    </Sidebar>
  );
};

export default FilterSidebar;
