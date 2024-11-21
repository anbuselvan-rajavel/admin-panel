"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import UserTitle from "./title";



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
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedGender, setSelectedGender] = useState<string | undefined>(undefined);
  const [nameFilter, setNameFilter] = useState("");

  const statuses = ["All", "Alive", "Dead", "unknown"];
  const genders = ["All", "Male", "Female", "unknown"];

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedStatus && selectedStatus !== "All") count++;
    if (selectedGender && selectedGender !== "All") count++;
    if (nameFilter && nameFilter !== "") count++;
    return count;
  }, [selectedStatus, selectedGender, nameFilter]);

  // Function to fetch users with status, name, and gender filter
  const fetchUsers = async (page: number, status?: string, name?: string, gender?: string) => {
    setLoading(true);
    try {
      let url = `https://rickandmortyapi.com/api/character/?page=${page}`;

      // Create an array of filters
      const filters: { [key: string]: string | undefined } = {
        status: status && status !== "All" ? status.toLowerCase() : undefined,
        name: name || undefined,
        gender: gender && gender !== "All" ? gender.toLowerCase() : undefined,
      };

      // Add filters to URL using for...of loop
      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          url += `&${key}=${value}`;
        }
      }

      const response = await axios.get(url);
      setUsers(response.data.results);
      setFilteredUsers(response.data.results);
      setTotalRecords(response.data.info.count);
    } catch (err) {
      setError("Error fetching data");
      console.log(err);
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
    setCurrentPage(event.page + 1); // Set current page for pagination
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
        activeFilterCount={activeFilterCount} // Pass active filter count directly
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
