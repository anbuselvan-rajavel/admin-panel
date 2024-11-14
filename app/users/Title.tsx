import React, { useState } from 'react';
import { FilterFormValues, filterSchema } from '../schema/filterFormSchema';
import TitleBarActions from '../components/TitleBarActions';
import FilterSidebar from '../components/FilterSidebar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import 'primeicons/primeicons.css';
import { FilterUserForm } from '../components/FilterUserForm';

interface TitleProps {
  onFilter: (filterText: string) => void;
  onApplyFilters: (nameFilter: string, statusFilter: string | undefined, genderFilter: string | undefined) => void;
  statuses: string[]; // expecting the statuses prop
  genders: string[];  // expecting the genders prop
  selectedStatus: string | undefined;
  selectedGender: string | undefined;
  onStatusFilter: (status: string | undefined) => void;
  onGenderFilter: (gender: string | undefined) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

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

  const defaultStatus = selectedStatus ?? 'All';
  const defaultGender = selectedGender ?? 'All';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      name: '',
      status: defaultStatus,
      gender: defaultGender,
    },
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    onFilter(text);
  };

  const handleFormSubmit = (data: FilterFormValues) => {
    const statusFilter = data.status === 'All' ? undefined : data.status;
    const genderFilter = data.gender === 'All' ? undefined : data.gender;

    onStatusFilter(statusFilter);
    onGenderFilter(genderFilter);
    onApplyFilters(data.name || '', statusFilter, genderFilter);
    setVisibleRight(false);
  };

  const handleResetFilters = () => {
    reset({
      name: '',
      status: 'All',
      gender: 'All',
    });
    onStatusFilter(undefined);
    onGenderFilter(undefined);
    onResetFilters();
  };

  return (
    <div className="bg-zinc-100">
      <div className="grid grid-cols-5 mb-4">
        <div className="col-span-3">
          <h1 className="text-4xl font-extrabold">Users</h1>
        </div>
        <div className="col-span-2 flex justify-evenly">
          <TitleBarActions
            handleFilterChange={handleFilterChange}
            setVisibleRight={setVisibleRight}
            activeFilterCount={activeFilterCount}
          />
        </div>
      </div>

      <FilterSidebar
        visible={visibleRight}
        onHide={() => setVisibleRight(false)}
        onSubmit={handleSubmit(handleFormSubmit)}
        onReset={handleResetFilters}
        control={control}
        errors={errors}
        CustomFilterForm={FilterUserForm}  // Pass the custom form here
        statuses={statuses}  // Pass statuses directly as props
        genders={genders}    // Pass genders directly as props
      />
    </div>
  );
};

export default Title;
