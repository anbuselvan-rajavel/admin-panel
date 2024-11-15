// components/FilterSidebar.tsx
import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Control, FieldErrors, FieldValues } from 'react-hook-form';

interface FilterSidebarProps<T extends FieldValues> {
  visible: boolean;
  onHide: () => void;
  onSubmit: () => void;
  onReset: () => void;
  control: Control<T>;
  errors: FieldErrors<T>;
  CustomFilterForm: React.ComponentType<any>;
  filterOptions: {
    [key: string]: string[];
  };
}

const FilterSidebar = <T extends FieldValues>({
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
      position="right"
      onHide={onHide}
      className="p-sidebar-sm"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Filters</h2>
        </div>
        
        <CustomFilterForm
          onSubmit={onSubmit}
          onReset={onReset}
          control={control}
          errors={errors}
          filterOptions={filterOptions}
        />
      </div>
    </Sidebar>
  );
};

export default FilterSidebar;