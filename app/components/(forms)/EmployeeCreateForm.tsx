    import React from 'react';
    import { Controller, useForm } from 'react-hook-form';
    import { InputText } from 'primereact/inputtext';
    import { Calendar } from 'primereact/calendar';
    import { InputNumber } from 'primereact/inputnumber';
    import { Button } from 'primereact/button';
    import { zodResolver } from '@hookform/resolvers/zod';
    import { EmployeeCreateFormValues, employeeCreateSchema } from '@/app/schema/createEmployeeSchema';


    interface EmployeeCreateFormProps {
        onSubmit: (data: EmployeeCreateFormValues) => void;
        resetForm: () => void;
             }
      
      const EmployeeCreateForm: React.FC<EmployeeCreateFormProps> = ({ onSubmit, resetForm}) => {
        const { control, handleSubmit, formState: {errors} } = useForm<EmployeeCreateFormValues>({
          resolver: zodResolver(employeeCreateSchema),
          defaultValues: {
            name: '',
            email: '',
            role: 'Product Manager',
            company: 'InnovateTech',
            joinDate: undefined,
            salary: 0,
          }
        });
      
        return (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <InputText id="name" {...field} className="w-full border" />}
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
      
            <div className="field">
              <label htmlFor="email">Email</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => <InputText id="email" {...field} className="w-full border" />}
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
      
            <div className="field">
              <label htmlFor="role">Role</label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => <InputText id="role" {...field} className="w-full border" />}
              />
              {errors.role && <p className="text-red-500">{errors.role.message}</p>}
            </div>
      
            <div className="field">
              <label htmlFor="company">Company</label>
              <Controller
                name="company"
                control={control}
                render={({ field }) => <InputText id="company" {...field} className="w-full border" />}
              />
              {errors.company && <p className="text-red-500">{errors.company.message}</p>}
            </div>
      
            <div className="field">
              <label htmlFor="joinDate">Join Date</label>
              <Controller
                name="joinDate"
                control={control}
                render={({ field }) => <Calendar id="joinDate" {...field} className="w-full border" dateFormat="mm/dd/yy" />}
              />
              {errors.joinDate && <p className="text-red-500">{errors.joinDate.message}</p>}
            </div>
      
            <div className="field">
              <label htmlFor="salary">Salary</label>
              <Controller
                name="salary"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    id="salary"
                    value={field.value || 0}
                    onValueChange={(e) => field.onChange(e.value)}
                    className="w-full border"
                    mode="currency"
                    currency="INR"
                    locale="en-IN"
                  />
                )}
              />
              {errors.salary && <p className="text-red-500">{errors.salary.message}</p>}
            </div>
      
            <div className="flex justify-end mt-4">
              <Button type="submit" label="Create" icon="pi pi-save" className="border bg-green-500 p-1 text-neutral-50" />
              <Button
          type="button"
          label="Reset"
          icon="pi pi-refresh"
          className="border bg-gray-500 p-1 text-neutral-50"
          onClick={resetForm}
        />
            </div>
          </form>
        );
      };
      
      export default EmployeeCreateForm;