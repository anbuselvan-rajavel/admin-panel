import React, { useState, ChangeEvent } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Sidebar } from 'primereact/sidebar';
import { Dropdown } from 'primereact/dropdown';
import 'primeicons/primeicons.css';

interface TitleProps {
    onFilter: (filterText: string) => void;
    statuses: string[];
    selectedStatus: string | null;
    onStatusFilter: (status: string | null) => void;
}

const Title: React.FC<TitleProps> = ({ onFilter, statuses, selectedStatus, onStatusFilter }) => {
    const [filterText, setFilterText] = useState('');
    const [visibleRight, setVisibleRight] = useState(false);

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterText(e.target.value);
        onFilter(e.target.value);
    };

    const startContent = (
        <h1 className='text-4xl font-extrabold'>Users</h1>
    );

    const centerContent = (
        <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
                value={filterText}
                onChange={handleFilterChange}
                placeholder="Users..."
                className='pl-10 border-purple-500 border-2 rounded-md h-12 w-56 focus:outline-none focus:shadow-none'
            />
        </IconField>
    );

    const endContent = (
        <>
            <Button
                icon="pi pi-filter"
                className='border-none bg-zinc-200 h-12 p-5 font-extralight'
                severity="secondary"
                label='Filters'
                onClick={() => setVisibleRight(true)}
            />
            <Button
                icon="pi pi-plus"
                className='border-none bg-violet-400 h-12 p-5 text-slate-50 from-neutral-300'
                severity="help"
                label='Create'
            />
        </>
    );

    return (
        <div className='bg-zinc-100'>
            <div className='grid grid-cols-5 mb-4'>
                <div className='col-span-3'>
                    {startContent}
                </div>
                <div className='col-span-2 flex justify-evenly'>
                    {centerContent}
                    {endContent}
                </div>
            </div>
            <hr className='my-5' />
            <Sidebar visible={visibleRight} position='right' onHide={() => setVisibleRight(false)}>
                <h2>Filter Options</h2>
                <div className="flex mb-4">
                    <Dropdown 
                        value={selectedStatus} 
                        options={statuses} 
                        onChange={(e) => onStatusFilter(e.value)} 
                        placeholder="Filter by Status" 
                        className="mr-2" 
                    />
                </div>
            </Sidebar>
        </div>
    );
};

export default Title;
