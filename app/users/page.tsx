"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Skeleton } from 'primereact/skeleton';
import Title from './Title';

interface User {
    id: number;
    name: string;
    status: string;
    gender: string;
    location: {
        name: string;
    };
}

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    const statuses = ['Alive', 'Dead', 'unknown'];

    const fetchUsers = async (page: number) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://rickandmortyapi.com/api/character/?page=${page}`);
            setUsers(response.data.results);
            setFilteredUsers(response.data.results);
            setTotalRecords(response.data.info.count);
        } catch (err) {
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const onPageChange = (event: any) => {
        setCurrentPage(event.page + 1);
    };

    const handleFilter = (filterText: string) => {
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(filterText.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleStatusFilter = (status: string | null) => {
        setSelectedStatus(status);
        if (status) {
            const filtered = users.filter(user => user.status === status);
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    };

    const statusBodyTemplate = (rowData: User) => {
        let bgColor;
        switch (rowData.status) {
            case 'Alive':
                bgColor = 'bg-green-500';
                break;
            case 'Dead':
                bgColor = 'bg-red-500';
                break;
            case 'unknown':
                bgColor = 'bg-gray-500';
                break;
            default:
                bgColor = 'bg-gray-300';
                break;
        }
        return <div className={`${bgColor} text-white p-2 rounded`}>{rowData.status}</div>;
    };

    const renderSkeleton = () => {
        return (
            <DataTable value={Array(20).fill({})} className="p-datatable-striped">
                <Column field="id" header="ID" style={{ width: '5%' }} body={<Skeleton />}></Column>
                <Column field="name" header="Name" style={{ width: '20%' }} body={<Skeleton />}></Column>
                <Column field="status" header="Status" style={{ width: '6%' }} body={<Skeleton />}></Column>
                <Column field="gender" header="Gender" style={{ width: '6%' }} body={<Skeleton />}></Column>
                <Column field="location" header="Location" style={{ width: '20%' }} body={<Skeleton />}></Column>
            </DataTable>
        );
    };

    const rowClassName = (rowData: User) => {
        return 'border-b border-gray-200';
    };

    return (
        <div className='card'>
            <Title 
                onFilter={handleFilter}
                statuses={statuses}
                selectedStatus={selectedStatus}
                onStatusFilter={handleStatusFilter}
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading ? renderSkeleton() : (
                <DataTable
                    value={filteredUsers}
                    paginator={false}
                    rowClassName={rowClassName}
                    className="p-datatable-gridlines p-datatable-sm p-4 rounded-lg bg-white"
                >
                    <Column field="id" header="ID" sortable />
                    <Column field="name" header="Name" sortable />
                    <Column field="status" header="Status" sortable body={statusBodyTemplate} />
                    <Column field="gender" header="Gender" sortable />
                    <Column field="location.name" header="Location" sortable />
                </DataTable>
            )}
            <Paginator
                first={(currentPage - 1) * 20}
                rows={20}
                totalRecords={totalRecords}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default Users;
