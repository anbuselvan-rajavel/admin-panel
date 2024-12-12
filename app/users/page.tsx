"use client"
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import UserTitle from "./Title";

interface User {
  id: number;
  name: string;
  status: string;
  gender: string;
  location: {
    name: string;
  };
}

interface PageChangeEvent {
   page: number; 
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedGender, setSelectedGender] = useState<string | undefined>(undefined);
  const [nameFilter, setNameFilter] = useState("");

  const statuses = ["All", "Alive", "Dead", "unknown"];
  const genders = ["All", "Male", "Female", "unknown"];

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedStatus && selectedStatus !== "All") count++;
    if (selectedGender && selectedGender !== "All") count++;
    if (nameFilter && nameFilter !== "") count++;
    return count;
  }, [selectedStatus, selectedGender, nameFilter]);

  const fetchUsers = async (page: number, status?: string, name?: string, gender?: string) => {
    setLoading(true);
    try {
      let url = `https://rickandmortyapi.com/api/character/?page=${page}`;

      const filters: Array<string> = [];
      if (status && status !== "All") filters.push(`status=${status.toLowerCase()}`);
      if (name && name.trim() !== "") filters.push(`name=${encodeURIComponent(name)}`);
      if (gender && gender !== "All") filters.push(`gender=${gender.toLowerCase()}`);

      if (filters.length > 0) {
        url += `&${filters.join('&')}`;
      }

      const response = await axios.get(url);
      
      if (response.data.results.length === 0) {
        setUsers([]);
        setFilteredUsers([]);
        setTotalRecords(0);
      } else {
        setUsers(response.data.results);
        setFilteredUsers(response.data.results);
        setTotalRecords(response.data.info.count);
      }
    } catch (err: any) {
      setUsers([]);
      setFilteredUsers([]);
      setTotalRecords(0);
      console.error(err); // Just log errors instead of showing a toast
    } finally {
      setLoading(false);
    }
  };

    // Severity configuration for status
    const severityConfig: { [key: string]: "info" | "danger" | "success" | "warning" | "secondary" | "contrast" | undefined } = {
      alive: "success", // Green for alive
      dead: "danger", // Red for dead
      unknown: "warning", // Yellow for unknown
    };
  
    const getSeverity = (status: string): "info" | "danger" | "success" | "warning" | "secondary" | "contrast" | undefined => {
      return severityConfig[status.toLowerCase()] || "secondary"; // Default to 'secondary' if status is unrecognized
    };

  useEffect(() => {
    fetchUsers(currentPage, selectedStatus, nameFilter, selectedGender);
  }, [currentPage, selectedStatus, nameFilter, selectedGender]);

  const onPageChange = (event: PageChangeEvent) => {
    setCurrentPage(event.page + 1);
  };

  const handleFilter = (filterText: string) => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleApplyFilters = (name: string, status: string | undefined, gender: string | undefined) => {
    setNameFilter(name);
    setSelectedStatus(status);
    setSelectedGender(gender);
    fetchUsers(currentPage, status, name, gender);
  };

  const handleResetFilters = () => {
    setNameFilter("");
    setSelectedStatus(undefined);
    setSelectedGender(undefined);
    fetchUsers(currentPage, undefined, "", ""); // Reset filters in the API request
  };

  const statusBodyTemplate = (rowData: User) => {
    return <Tag value={rowData.status} severity={getSeverity(rowData.status)} className="w-24 rounded-2xl" />;
  };

  const renderSkeleton = () => {
    return (
      <DataTable value={Array(20).fill({})} className="p-datatable-striped">
        <Column field="id" header="ID" style={{ width: "5%" }} body={<Skeleton />} />
        <Column field="name" header="Name" style={{ width: "20%" }} body={<Skeleton />} />
        <Column field="status" header="Status" style={{ width: "6%" }} body={<Skeleton />} />
        <Column field="gender" header="Gender" style={{ width: "6%" }} body={<Skeleton />} />
        <Column field="location" header="Location" style={{ width: "20%" }} body={<Skeleton />} />
      </DataTable>
    );
  };

  const rowClassName = () => {
    return "border-b border-gray-200";
  };

  return (
    <div className="card">
      <UserTitle
        onFilter={handleFilter}
        onApplyFilters={handleApplyFilters}
        statuses={statuses}
        genders={genders}
        selectedStatus={selectedStatus}
        selectedGender={selectedGender}
        onStatusFilter={(status) => setSelectedStatus(status)}
        onGenderFilter={(gender) => setSelectedGender(gender)}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />
      {loading ? (
        renderSkeleton()
      ) : (
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
      <Paginator first={(currentPage - 1) * 20} rows={20} totalRecords={totalRecords} onPageChange={onPageChange} />
    </div>
  );
};

export default Users;
