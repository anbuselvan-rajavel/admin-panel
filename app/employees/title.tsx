import React, { useMemo, useState } from 'react'
import TitleBarActions from '../components/TitleBarActions'
import FilterSidebar from '../components/FilterSidebar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmployeeFilterFormValues, employeeFilterSchema } from '../schema/filterFormSchema';
import EmployeeFilterForm from '../components/(forms)/EmployeeFilterForm';
import { EmployeeCreateFormValues } from '../schema/createEmployeeSchema';
import axios from 'axios';
import EmployeeCreateForm from '../components/(forms)/EmployeeCreateForm';


interface TitleProps {
    onFilter: (filterText: string) => void;
    roles: string[];
    companies: string[];
    selectedRole: string | undefined;
    selectedCompany: string | undefined;
    onRoleFilter: (role: string | undefined) => void;
    onCompanyFilter: (company: string | undefined) => void;
    onResetFilters: () => void;
    onApplyFilters: (nameFilter: string, roleFilter: string | undefined, companyFilter: string | undefined) => void;
    activeFilterCount: number;
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
}) => {
    const [visibleRight, setVisibleRight] = useState(false);

     // State to store employees list
     const [employees, setEmployees] = useState<any[]>([]); // You can define a more specific type if needed

    //create filterOptions object using the props
    const filterOptions = useMemo(() => ({
        role: roles,
        company: companies,
    }), [roles, companies]);

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
        }
    })

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        onFilter(text);
    };

    const handleFormSubmit = (data: EmployeeFilterFormValues) => {
        const roleFilter = data.role === "All" ? undefined : data.role;
        const companyFilter = data.company === "All" ? undefined : data.company;

        onRoleFilter(roleFilter);
        onCompanyFilter(companyFilter);
        onApplyFilters(data.name || '', roleFilter, companyFilter);
        setVisibleRight(false);
    }

    const handleResetFilters = () => {
        reset({
            name: '',
            role: 'All',
            company: 'All',
        });
        onRoleFilter(undefined);
        onCompanyFilter(undefined);
        onResetFilters();
    }

    
  const handleCreateEmployee = async (data: EmployeeCreateFormValues) => {
    try{
      const response = await axios.post('http://localhost:3000/api/employees', data);
       // Update the employees state after successful creation
      setEmployees(prevEmployees => [...prevEmployees, response.data]);
    }catch(error){
      console.error("Error creating employee:", error);      
    }
  }
    return (
        <div className='bg-zinc-100'>
            <div className='grid grid-cols-5 mb-4'>
                <div className='col-span-3'>
                    <h1 className='text-4xl font-extrabold'>Employees</h1>
                </div>
                <div className="col-span-2">
                    <TitleBarActions
                        handleFilterChange={handleFilterChange}
                        setVisibleRight={setVisibleRight}
                        activeFilterCount={activeFilterCount}
                        searchPlaceholder='Search Employees...'
                        FormComponent={EmployeeCreateForm}
                        onCreate={handleCreateEmployee} 
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
                CustomFilterForm={EmployeeFilterForm}
                filterOptions={filterOptions}
            />
        </div>
    )
}

export default Title