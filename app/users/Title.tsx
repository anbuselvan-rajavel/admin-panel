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

interface TitleProps {
  onFilter: (filterText: string) => void;
  statuses: string[];
  selectedStatus: string | undefined;
  onStatusFilter: (status: string | undefined) => void;
}

const filterSchema = z.object({
  status: z.string().min(1, 'Status is required').optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

const Title: React.FC<TitleProps> = ({
  onFilter,
  statuses,
  selectedStatus,
  onStatusFilter,
}) => {
  const [filterText, setFilterText] = useState('');
  const [visibleRight, setVisibleRight] = useState(false);

  // Use React Hook Form and Zod
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: { status: selectedStatus ?? undefined },
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
    onFilter(e.target.value);
  };

  const handleFormSubmit = (data: FilterFormValues) => {
    if (data.status) {
      onStatusFilter(data.status); // Pass the selected status to parent
    }
    setVisibleRight(false); // Close sidebar on submit
  };

  const startContent = <h1 className="text-4xl font-extrabold">Users</h1>;

  const centerContent = (
    <IconField iconPosition="left">
      <InputIcon className="pi pi-search" />
      <InputText
        value={filterText}
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
        className="border-none bg-zinc-200 h-12 p-5 font-extralight hover:bg-zinc-300"
        severity="secondary"
        label="Filters"
        onClick={() => setVisibleRight(true)}
      />
      <Button
        icon="pi pi-plus"
        className="border-none bg-violet-400 h-12 p-5 text-slate-50 from-neutral-300"
        severity="help"
        label="Create"
      />
    </>
  );

  return (
    <div className="bg-zinc-100">
      <div className="grid grid-cols-5 mb-4">
        <div className="col-span-3">{startContent}</div>
        <div className="col-span-2 flex justify-evenly">
          {centerContent}
          {endContent}
        </div>
      </div>
      <hr className="my-5" />
      <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)}>
        <h2>Filter Options</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="flex mb-4">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={statuses}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  placeholder="Filter by Status"
                  className="mr-2 mt-2 border-2 border-violet-500"
                />
              )}
            />
          </div>
          {errors.status && <p className="text-red-500">{errors.status.message}</p>}

          <Button
            type="submit"
            label="Apply"
            className="bg-violet-400 w-24 h-12 p-3 text-neutral-50 flex justify-center items-center"
            icon="pi pi-check" 
            severity='help'
          />
        </form>
      </Sidebar>
    </div>
  );
};

export default Title;
