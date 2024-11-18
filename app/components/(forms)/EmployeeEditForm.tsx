import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import axios from 'axios';

// Modify the schema to match existing data structure
const employeeEditSchema = z.object({
    id: z.string(),
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    role: z.string().min(1, { message: 'Role is required' }),
    company: z.string().min(1, { message: 'Company is required' }),
    joinDate: z.string().refine(dateStr => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime()) && date <= new Date();
    }, { message: 'Join date cannot be in the future' }),
    salary: z.number().positive({ message: 'Salary must be a positive number' }),
});

type EmployeeEditFormValues = z.infer<typeof employeeEditSchema>;

interface EditEmployeeDialogProps {
    visible: boolean;
    employee: EmployeeEditFormValues | null;
    onHide: () => void;
    onUpdate: (updatedEmployee: EmployeeEditFormValues) => void;
    roles: string[];
    companies: string[];
}

const EmployeeEditForm: React.FC<EditEmployeeDialogProps> = ({
    visible,
    employee,
    onHide,
    onUpdate,
    roles,
    companies
}) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<EmployeeEditFormValues>({
        resolver: zodResolver(employeeEditSchema),
        defaultValues: employee || undefined
    });

    // Reset form when employee changes
    useEffect(() => {
        if (employee) {
            reset(employee);
        }
    }, [employee, reset]);

    const onSubmit = async (data: EmployeeEditFormValues) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/employees/${data.id}`, data);
            onUpdate(response.data);
            onHide();
        } catch (error) {
            console.error('Error updating employee', error);
        }
    };

    const dialogFooter = (
        <div>
            <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={onHide}
                className="p-button-text"
            />
            <Button
                label="Save"
                icon="pi pi-check"
                onClick={handleSubmit(onSubmit)}
                autoFocus
            />
        </div>
    );

    if (!employee) return null;

    return (
        <Dialog
            header="Edit Employee"
            visible={visible}
            style={{ width: '50vw' }}
            onHide={onHide}
            footer={dialogFooter}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="grid p-fluid">
                <div className="col-12 md:col-6">
                    <label htmlFor="name">Name</label>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <>
                                <InputText {...field} className='border-2'/>
                                {errors.name && <small className="p-error">{errors.name.message}</small>}
                            </>
                        )}
                    />
                </div>
                <div className="col-12 md:col-6">
                    <label htmlFor="email">Email</label>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <>
                                <InputText {...field} className='border-2'/>
                                {errors.email && <small className="p-error">{errors.email.message}</small>}
                            </>
                        )}
                    />
                </div>
                <div className="col-12 md:col-6">
                    <label htmlFor="role">Role</label>
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Dropdown
                                    {...field}
                                    options={roles.filter(r => r !== 'All')}
                                    placeholder="Select a Role"
                                    onChange={(e) => field.onChange(e.value)}
                                    className='border-2'
                                />
                                {errors.role && <small className="p-error">{errors.role.message}</small>}
                            </>
                        )}
                    />
                </div>
                <div className="col-12 md:col-6">
                    <label htmlFor="company">Company</label>
                    <Controller
                        name="company"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Dropdown
                                    {...field}
                                    options={companies.filter(c => c !== 'All')}
                                    placeholder="Select a Company"
                                    onChange={(e) => field.onChange(e.value)}
                                    className='border-2'
                                />
                                {errors.company && <small className="p-error">{errors.company.message}</small>}
                            </>
                        )}
                    />
                </div>
                <div className="col-12 md:col-6">
                    <label htmlFor="joinDate">Join Date</label>
                    <Controller
                        name="joinDate"
                        control={control}
                        render={({ field }) => (
                            <>
                                <InputText
                                    {...field}
                                    type="date"
                                    className='border-2'
                                />
                                {errors.joinDate && <small className="p-error">{errors.joinDate.message}</small>}
                            </>
                        )}
                    />
                </div>
                <div className="col-12 md:col-6">
                    <label htmlFor="salary">Salary</label>
                    <Controller
                        name="salary"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                            <>
                                <InputText
                                    {...field}
                                    type="number"
                                    value={value.toString()} // Convert number to string
                                    onChange={(e) => {
                                        const numValue = Number(e.target.value);
                                        onChange(numValue);
                                    }}
                                    className='border-2'
                                />
                                {errors.salary && <small className="p-error">{errors.salary.message}</small>}
                            </>
                        )}
                    />
                </div>
            </form>
        </Dialog>
    );
};

export default EmployeeEditForm;