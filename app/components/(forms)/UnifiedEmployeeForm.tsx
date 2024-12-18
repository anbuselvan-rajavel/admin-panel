import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Controller, useForm, FieldError } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { zodResolver } from '@hookform/resolvers/zod';

import { ProgressSpinner } from 'primereact/progressspinner';
import { ZodError } from 'zod';
import { EmployeeFormData, employeeSchema } from 'app/schema/employeeSchema';

// More specific type for errors
type FormErrors = Partial<Record<keyof EmployeeFormData, { message: string }>>;

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  company: string;
  joinDate: string;
  salary: number;
  createdAt: string;
  updatedAt: string;
}

interface UnifiedEmployeeFormProps {
  mode?: 'create' | 'edit';
  onSubmit: (data: EmployeeFormData) => void;
  onCancel?: () => void;
  onHide?: () => void; 
  initialData?: Employee | null;
  resetForm?: () => void;
  errors?: FormErrors;
  roles?: string[];
  companies?: string[];
  isDialog?: boolean;
  visible?: boolean;
  loading?: boolean;
}

const defaultValues: EmployeeFormData = {
  name: '',
  email: '',
  role: '',
  company: '',
  joinDate: '',
  salary: 0,
};

const UnifiedEmployeeForm: React.FC<UnifiedEmployeeFormProps> = ({
  mode = 'create',
  onSubmit,
  onCancel = () => {},
  onHide, 
  initialData = null,
  resetForm,
  errors: formErrors = {},
  roles = [],
  companies = [],
  isDialog = false,
  visible = true,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData || defaultValues,
  });

  const toast = useRef<Toast>(null);

  // Memoize role and company options
  const roleOptions = useMemo(() => 
    roles.map(role => ({ label: role, value: role })), 
    [roles]
  );

  const companyOptions = useMemo(() => 
    companies.map(company => ({ label: company, value: company })), 
    [companies]
  );

  useEffect(() => {
    if (initialData) {
      const formattedData = {
        ...initialData,
        joinDate: initialData.joinDate
          ? new Date(initialData.joinDate).toISOString().split('T')[0]
          : '',
      };
      reset(formattedData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = useCallback(async (data: EmployeeFormData) => {
    try {
      const formattedData = {
        ...data,
        joinDate: data.joinDate || ''
      };
      await onSubmit(formattedData);
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: `Employee ${mode === 'create' ? 'created' : 'updated'} successfully`,
        life: 3000
      });

      if (mode === 'create') {
        reset(defaultValues);
      }
    } catch (submitError: unknown) {
      let errorMessage = 'An unexpected error occurred';
      
      if (submitError instanceof ZodError) {
        errorMessage = submitError.errors.map(err => err.message).join(', ');
      } else if (submitError instanceof Error) {
        errorMessage = submitError.message;
      }

      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to ${mode === 'create' ? 'create' : 'update'} employee: ${errorMessage}`,
        life: 3000
      });
    }
  }, [onSubmit, mode, reset]);

  const renderError = (error?: FieldError, formErrors?: {message: string}
  ) => {
    if (error?.message) {
      return <div className="text-red-500 mt-1 text-sm">{error.message}</div>;
    }
    if (formErrors?.message) {
      return <div className="text-red-500 mt-1 text-sm">{formErrors.message}</div>;
    }
    return null;
  };

  const formContent = (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Name field */}
      <div className="field">
        <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Name</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <InputText
              id="name"
              {...field}
              className={`w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200 ${errors.name || formErrors.name ? 'p-invalid' : ''}`}
            />
          )}
        />
        {renderError(errors.name, formErrors.name)}
      </div>

      {/* Email field */}
      <div className="field">
        <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <InputText
              id="email"
              {...field}
              className={`w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200 ${errors.email || formErrors.email ? 'p-invalid' : ''}`}
            />
          )}
        />
        {renderError(errors.email, formErrors.email)}
      </div>

      {/* Role field */}
      <div className="field">
        <label htmlFor="role" className="block mb-2 font-medium text-gray-700">Role</label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Dropdown
              id={field.name}
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
              options={roleOptions}
              className={`w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200 ${errors.role ? 'p-invalid' : ''}`}
              placeholder="Select a role"
            />
          )}
        />
        {renderError(errors.role, formErrors.role)}
      </div>

      {/* Company field */}
      <div className="field">
        <label htmlFor="company" className="block mb-2 font-medium text-gray-700">Company</label>
        <Controller
          name="company"
          control={control}
          render={({ field }) => (
            <Dropdown
              id={field.name}
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
              options={companyOptions}
              className={`w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200 ${errors.company || formErrors.role ? 'p-invalid' : ''}`}
              placeholder="Select a company"
            />
          )}
        />
        {renderError(errors.company, formErrors.company)}
      </div>

      {/* Join Date field */}
      <div className="field">
        <label htmlFor="joinDate" className="block mb-2 font-medium text-gray-700">Join Date</label>
        <Controller
          name="joinDate"
          control={control}
          render={({ field }) => (
            <Calendar
              id="joinDate"
              value={field.value ? new Date(field.value) : null}
              onChange={(e) => {
                const date = e.value as Date | null;
                field.onChange(date ? date.toISOString().split('T')[0] : '');
              }}
              dateFormat="dd/mm/yy"
              className={`w-full h-11 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200 ${errors.joinDate || formErrors.joinDate ? 'p-invalid' : ''}`}
              showIcon
              maxDate={new Date()}
            />
          )}
        />
        {renderError(errors.joinDate, formErrors.joinDate)}
      </div>

      {/* Salary field */}
      <div className="field">
        <label htmlFor="salary" className="block mb-2 font-medium text-gray-700">Salary</label>
        <Controller
          name="salary"
          control={control}
          render={({ field }) => (
            <InputNumber
              id="salary"
              value={field.value}
              onValueChange={(e) => field.onChange(e.value)}
              className={`w-full h-11 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200 ${errors.salary || formErrors.salary ? 'p-invalid' : ''}`}
              mode="currency"
              currency="INR"
              locale="en-IN"
              minFractionDigits={0}
            />
          )}
        />
        {renderError(errors.salary, formErrors.salary)}
      </div>

      {/* Form buttons */}
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          type="button"
          label="Cancel"
          icon="pi pi-times"
          className="bg-red-500 p-2 w-full"
          onClick={() => {
            reset();
            onCancel();
            resetForm?.();
          }}
        />
        <Button
          type="submit"
          label={mode === 'create' ? 'Create' : 'Save'}
          icon={mode === 'create' ? 'pi pi-save' : 'pi pi-check'}
          loading={isSubmitting || loading}
          className="bg-green-500 p-2 w-full"
        />
      </div>
    </form>
  );

  if (loading) {
    return <div className="flex justify-center items-center w-full h-full"><ProgressSpinner /></div>;
  }

  return (
    <>
      <Toast ref={toast} />
      {isDialog ? (
        <Dialog
          header={mode === 'create' ? 'Create Employee' : 'Edit Employee'}
          visible={visible}
          style={{ width: '50vw' }}
          onHide={onHide ? onHide : () => { reset(); onCancel(); }}  // Fallback to onCancel
          modal
          className="p-fluid"
          headerClassName="text-center"
        >
          {formContent}
        </Dialog>
      ) : (
        formContent
      )}
    </>
  );
};

export default UnifiedEmployeeForm;