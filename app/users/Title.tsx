import React, { useState, useMemo } from 'react';
import TitleBarActions from '../components/TitleBarActions';
import FilterSidebar from '../components/FilterSidebar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import 'primeicons/primeicons.css';
import { UserFilterFormValues, userFilterSchema } from '../schema/filterFormSchema';
import UserFilterForm from '../components/(forms)/UserFilterForm';
import UserCreateForm from '../components/(forms)/UserCreateForm';

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

  // Create filterOptions object using the props
  const filterOptions = useMemo(() => ({
    status: statuses,
    gender: genders
  }), [statuses, genders]);

  const defaultStatus = selectedStatus ?? 'All';
  const defaultGender = selectedGender ?? 'All';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFilterFormValues>({
    resolver: zodResolver(userFilterSchema),
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

  const handleFormSubmit = (data: UserFilterFormValues) => {
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
    setVisibleRight(false);
  };

  const handleCreateUser = async () => {
      
  }

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
             searchPlaceholder='Search Users...'
             FormComponent={UserCreateForm}
             onCreate={handleCreateUser}
          />
        </div>
      </div>
      <hr className='my-5' />

      <FilterSidebar
        visible={visibleRight}
        onHide={() => setVisibleRight(false)}
        onSubmit={handleSubmit(handleFormSubmit)}
        onReset={handleResetFilters}
        control={control}
        errors={errors}
        CustomFilterForm={UserFilterForm}
        filterOptions={filterOptions}
      />
    </div>
  );
};

export default Title;