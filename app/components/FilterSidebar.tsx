import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Control, FieldErrors } from 'react-hook-form';
import { FilterFormValues } from '../schema/filterFormSchema';

interface FilterSidebarProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: () => void;
  onReset: () => void;
  control: Control<FilterFormValues>;
  errors: FieldErrors<FilterFormValues>;
  CustomFilterForm: React.ComponentType<any>;
  statuses: string[];  // expect statuses
  genders: string[];   // expect genders
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  visible,
  onHide,
  onSubmit,
  onReset,
  control,
  errors,
  CustomFilterForm,  // Expect the custom filter form
  statuses,         // Expect statuses
  genders,          // Expect genders
}) => {
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
          statuses={statuses}  // Pass statuses to the custom form
          genders={genders}    // Pass genders to the custom form
        />
      </div>
    </Sidebar>
  );
};

export default FilterSidebar;
