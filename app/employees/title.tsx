// title.tsx for employees
import React, { useMemo, useRef, useState } from 'react';
import TitleBarActions from '../components/TitleBarActions';
import FilterSidebar from '../components/FilterSidebar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmployeeFilterFormValues, employeeFilterSchema } from '../schema/filterFormSchema';
import EmployeeFilterForm from '../components/(forms)/EmployeeFilterForm';
import axios from 'axios';
import { EmployeeFormData } from '../schema/employeeSchema';
import UnifiedEmployeeForm from '../components/(forms)/UnifiedEmployeeForm';
import { Toast } from 'primereact/toast';

interface EmployeeFilterOptions {
  role: string[];
  company: string[];
  }

interface TitleProps {
  onFilter: (filterText: string) => void;
  roles: string[];
  companies: string[];
  selectedRole: string | undefined;
  selectedCompany: string | undefined;
  onRoleFilter: (role: string | undefined) => void;
  onCompanyFilter: (company: string | undefined) => void;
  onResetFilters: () => void;
  onApplyFilters: (
    nameFilter: string,
    roleFilter: string | undefined,
    companyFilter: string | undefined
  ) => void;
  activeFilterCount: number;
  onRefreshEmployees: () => void;
}

const Title: React.FC<TitleProps> = ({
  onFilter,
  roles,
  companies,
  selectedRole,
  selectedCompany,
  onRoleFilter,
  onCompanyFilter,
  onResetFilters,
  onApplyFilters,
  activeFilterCount,
  onRefreshEmployees,
}) => {
  const [visibleRight, setVisibleRight] = useState(false);

    // Add this line to create the toast ref
    const toast = useRef<Toast>(null);

  // Determine the base URL, with a fallback
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const employeeFilterOptions: EmployeeFilterOptions = useMemo(
    () => ({
      role: roles,
      company: companies,
    }),
    [roles, companies]
  );

  const defaultRole = selectedRole ?? 'All';
  const defaultCompany = selectedCompany ?? 'All';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFilterFormValues>({
    resolver: zodResolver(employeeFilterSchema),
    defaultValues: {
      name: '',
      role: defaultRole,
      company: defaultCompany,
    },
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilter(e.target.value);
  };

  const handleFormSubmit = (data: EmployeeFilterFormValues) => {
    const roleFilter = data.role === 'All' ? undefined : data.role;
    const companyFilter = data.company === 'All' ? undefined : data.company;

    onRoleFilter(roleFilter);
    onCompanyFilter(companyFilter);
    onApplyFilters(data.name || '', roleFilter, companyFilter);
    setVisibleRight(false);
  };

  const handleResetFilters = () => {
    reset({ name: '', role: 'All', company: 'All' });
    onRoleFilter(undefined);
    onCompanyFilter(undefined);
    onResetFilters();
  };

  const handleCreateEmployee = async (data: EmployeeFormData) => {
    try {
     // Use the determined base URL for creating an employee
     await axios.post(`${BASE_URL}/api/employees`, data);
      
     // Refresh employees and show success toast
     onRefreshEmployees();
     
     // Success notification
     toast.current?.show({
       severity: 'success',
       summary: 'Employee Created',
       detail: 'New employee added successfully',
       life: 3000
     });
    } catch (error) {
      console.error('Error creating employee:', error);
      // Error notification with detailed message
      let errorMessage = 'Failed to create employee';
      if (axios.isAxiosError(error)) {
        // If it's an Axios error, we can get more specific error details
        errorMessage = error.response?.data?.message || 
                       error.response?.data?.error || 
                       'Failed to create employee';
      }
      
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 5000
      });
    }
  };


  return (
    <div className="bg-zinc-100">
       {/* Add Toast component at the top of your return */}
       <Toast ref={toast} />
      <div className="grid grid-cols-5 mb-4">
        <div className="col-span-3">
          <h1 className="text-4xl font-extrabold">Employees</h1>
        </div>
        <div className="col-span-2">
          <TitleBarActions
            handleFilterChange={handleFilterChange}
            setVisibleRight={setVisibleRight}
            activeFilterCount={activeFilterCount}
            searchPlaceholder="Search Employees..."
            roles={roles}
            companies={companies}
            FormComponent={UnifiedEmployeeForm}
            onCreate={handleCreateEmployee}
          />
        </div>
      </div>
      <hr className="my-5" />
      <FilterSidebar
        visible={visibleRight}
        onHide={() => setVisibleRight(false)}
        onSubmit={handleSubmit(handleFormSubmit)}
        onReset={handleResetFilters}
        control={control}
        errors={errors}
        CustomFilterForm={EmployeeFilterForm}
        filterOptions={employeeFilterOptions}
      />
    </div>
  );
};

export default Title;
