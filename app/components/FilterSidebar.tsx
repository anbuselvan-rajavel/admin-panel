// FilterSidebar.tsx
import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import { FilterForm } from './FilterForm';
import { Control, FieldErrors } from 'react-hook-form';
import { FilterFormValues } from '../schema/filterFormSchema';

interface FilterSidebarProps {
    visible: boolean;
    onHide: () => void;
    onSubmit: () => void;
    onReset: () => void;
    control: Control<FilterFormValues>;
    errors: FieldErrors<FilterFormValues>;
    statuses: string[];
    genders: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    visible,
    onHide,
    onSubmit,
    onReset,
    control,
    errors,
    statuses,
    genders,
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
                
                <FilterForm
                    onSubmit={onSubmit}
                    onReset={onReset}
                    control={control}
                    errors={errors}
                    statuses={statuses}
                    genders={genders}
                />
            </div>
        </Sidebar>
    );
};

export default FilterSidebar;