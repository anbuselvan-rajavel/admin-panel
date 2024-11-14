// FilterForm.tsx
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Control, FieldErrors, Controller } from 'react-hook-form';
import { FilterFormValues } from '../schema/filterFormSchema';

interface FilterUserFormProps {
    onSubmit: () => void;
    onReset: () => void;
    control: Control<FilterFormValues>;
    errors: FieldErrors<FilterFormValues>;
    statuses: string[];
    genders: string[];
}

export const FilterUserForm: React.FC<FilterUserFormProps> = ({
    onSubmit,
    onReset,
    control,
    errors,
    statuses,
    genders,
}) => {
    // Transform arrays to dropdown options format
    const statusOptions = [
        { label: 'All', value: 'All' },
        ...statuses
            .filter(status => status !== 'All')
            .map(status => ({ label: status, value: status }))
    ];

    const genderOptions = [
        { label: 'All', value: 'All' },
        ...genders
            .filter(gender => gender !== 'All')
            .map(gender => ({ label: gender, value: gender }))
    ];

    return (
        <form onSubmit={onSubmit} className="flex flex-col">
            <div className="flex-grow space-y-4 mb-12">
                {/* Name Filter */}
                <div className="field">
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name
                    </label>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <InputText
                                id="name"
                                {...field}
                                className="w-full h-15 p-3 border-2 border-violet-500 focus:outline-none focus:shadow-none"
                                placeholder="Filter by name..."
                            />
                        )}
                    />
                    {errors.name && (
                        <small className="p-error">{errors.name.message}</small>
                    )}
                </div>

                {/* Status Filter */}
                <div className="field">
                    <label htmlFor="status" className="block text-sm font-medium mb-2">
                        Status
                    </label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Dropdown
                                id="status"
                                value={field.value}
                                options={statusOptions}
                                onChange={(e) => field.onChange(e.value)}
                                className="w-full border-2 border-violet-500"
                                placeholder="Select Status"
                            />
                        )}
                    />
                    {errors.status && (
                        <small className="p-error">{errors.status.message}</small>
                    )}
                </div>

                {/* Gender Filter */}
                <div className="field">
                    <label htmlFor="gender" className="block text-sm font-medium mb-2">
                        Gender
                    </label>
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <Dropdown
                                id="gender"
                                value={field.value}
                                options={genderOptions}
                                onChange={(e) => field.onChange(e.value)}
                                className="w-full border-2 border-violet-500"
                                placeholder="Select Gender"
                            />
                        )}
                    />
                    {errors.gender && (
                        <small className="p-error">{errors.gender.message}</small>
                    )}
                </div>
            </div>

            <div className="flex row justify-around">
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