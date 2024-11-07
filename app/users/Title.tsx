import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Sidebar } from 'primereact/sidebar';
import { Dropdown } from 'primereact/dropdown';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import 'primeicons/primeicons.css';
import './Title.css';
import { FloatLabel } from 'primereact/floatlabel';
import { Badge } from 'primereact/badge';

interface TitleProps {
  onFilter: (filterText: string) => void;
  onApplyFilters: (nameFilter: string, statusFilter: string | undefined, genderFilter: string | undefined) => void;
  statuses: string[];
  genders: string[];
  selectedStatus: string | undefined;
  selectedGender: string | undefined;
  onStatusFilter: (status: string | undefined) => void;
  onGenderFilter: (gender: string | undefined) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

const filterSchema = z.object({
  status: z.string().min(1, 'Status is required').optional(),
  name: z.string().optional(),
  gender: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

const Title: React.FC<TitleProps> = ({
  onFilter,
  onApplyFilters,
  statuses,
  selectedStatus,
  genders,
  selectedGender,
  onStatusFilter,
  onGenderFilter,
  onResetFilters,
  activeFilterCount,
}) => {
  const [visibleRight, setVisibleRight] = useState(false);

  // React Hook Form
  const {
    control,
    handleSubmit,
    reset, // Get reset function from useForm
    formState: { errors },
  } = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      status: selectedStatus ?? 'All',  // Ensuring fallback value 'All' for undefined
      gender: selectedGender ?? 'All'    // Ensuring fallback value 'All' for undefined
    },
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    onFilter(text); // Call parent function for name filtering
  };

  const handleFormSubmit = (data: FilterFormValues) => {
    onStatusFilter(data.status); // Pass selected status to parent
    onApplyFilters(data.name || '', data.status, data.gender); // Apply both name and status filters
    setVisibleRight(false); // Close sidebar after apply
    console.log(data);
  };

  const handleResetFilters = () => {
    reset({
      name: '',      // Clear name filter
      status: 'All', // Reset to 'All' status
      gender: 'All', // Reset to 'All' gender
    });

    onStatusFilter('All'); // Reset status to 'All'
    onGenderFilter('All'); // Reset gender to 'All'
    onResetFilters(); // Notify parent to reset any applied filters
  };

  const startContent = <h1 className="text-4xl font-extrabold">Users</h1>;

  const centerContent = (
    <IconField iconPosition="left">
      <InputIcon className="pi pi-search" />
      <InputText
        onChange={handleFilterChange}
        placeholder="Search Users..."
        className="pl-10 border-purple-500 border-2 rounded-md h-12 w-56 focus:outline-none focus:shadow-none"
      />
    </IconField>
  );

  const endContent = (
    <>
      <Button
        icon="pi pi-filter"
        className="border-none bg-zinc-200 h-12 p-6 w-32 font-extralight hover:bg-zinc-300 relative"
        severity="secondary"
        label="Filters"
        onClick={() => setVisibleRight(true)}
      >
        <Badge
          value={activeFilterCount}
          severity={activeFilterCount > 0 ? 'danger' : 'secondary'}
          className='absolute top-4 right-2'
        />
      </Button>
      <Button
        icon="pi pi-plus"
        className="border-none bg-violet-400 h-12 p-5 text-slate-50"
        severity="help"
        label="Create"
      />
    </>
  );

  return (
    <div className="bg-zinc-100">
      {/* Title Bar */}
      <div className="grid grid-cols-5 mb-4">
        <div className="col-span-3">{startContent}</div>
        <div className="col-span-2 flex justify-between">
          {centerContent}
          {endContent}
        </div>
      </div>

      {/* Main Content */}
      <hr className="my-5 border-gray-200" />
      <Sidebar visible={visibleRight} position="right" header="Filter Options" onHide={() => setVisibleRight(false)}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="flex mb-4">
            <FloatLabel className='mt-6'>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <InputText
                    {...field}
                    className="mr-2 w-[280px] h-15 p-3 border-2 border-violet-500 focus:outline-none focus:shadow-none"
                  />
                )}
              />
              <label htmlFor="name">Name</label>
            </FloatLabel>
          </div>

          <div className="flex mb-4">
            <FloatLabel className="w-full">
              <Controller
                name="status"
                control={control}
                render={({ field }) => {
                  // Ensure value is always a valid string (e.g., 'All', 'Alive', 'Dead')
                  const value = field.value || 'All';  // Fallback to 'All' if undefined
                  return (
                    <Dropdown
                      {...field}
                      options={statuses}
                      value={value} // Always provide a valid value
                      onChange={(e) => field.onChange(e.value)}
                      placeholder="Select Status" // Placeholder shown above the dropdown
                      className="mr-2 mt-2 w-full border-2 border-violet-500"
                    />
                  );
                }}
              />
              <label htmlFor="status" className='absolute top-1'>Status</label>
            </FloatLabel>
          </div>
          {errors.status && <p className="text-red-500">{errors.status.message}</p>}

          <div className="flex mb-4">
            <FloatLabel className="w-full">
              <Controller
                name="gender"
                control={control}
                render={({ field }) => {
                  // Ensure value is always a valid string (e.g., 'All', 'Male', 'Female')
                  const value = field.value || 'All';  // Fallback to 'All' if undefined
                  return (
                    <Dropdown
                      {...field}
                      options={genders}
                      value={value} // Always provide a valid value
                      onChange={(e) => field.onChange(e.value)}
                      placeholder="Select Gender" // Placeholder shown above the dropdown
                      className="mr-2 mt-2 w-full border-2 border-violet-500"
                    />
                  );
                }}
              />
              <label htmlFor="gender" className='absolute top-1'>Gender</label>
            </FloatLabel>
          </div>
          {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}


          <div className="flex row justify-around">
            <Button
              type="button"
              label="Reset"
              className="bg-red-400 w-24 h-12 p-3 text-neutral-50 flex justify-center items-center"
              icon="pi pi-times"
              severity="danger"
              onClick={handleResetFilters}
            />
            <Button
              type="submit"
              label="Apply"
              className="bg-violet-400 w-24 h-12 p-3 text-neutral-50 flex justify-center items-center"
              icon="pi pi-check"
              severity="help"
            />
          </div>
        </form>
      </Sidebar>
    </div>
  );
};

export default Title;
