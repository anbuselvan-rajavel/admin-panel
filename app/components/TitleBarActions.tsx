import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

interface TitleProps {
    handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setVisibleRight: (value: boolean) => void;
    activeFilterCount?: number;
}

const Title: React.FC<TitleProps> = ({ 
  handleFilterChange, 
  setVisibleRight, 
  activeFilterCount = 0 
}) => {
  return (
    <div className="flex items-center gap-4">
      <IconField iconPosition='left'>
        <InputIcon className="pi pi-search" />
        <InputText
          onChange={handleFilterChange}
          placeholder="Search Users..."
          className="pl-10 border-purple-500 border-2 rounded-md h-12 w-56 focus:outline-none focus:shadow-none"
        />
      </IconField >

      <Button
        icon="pi pi-filter"
        className="border-none bg-zinc-200 h-12 p-6 w-32 font-extralight hover:bg-zinc-300 relative"
        severity="secondary"
        label="Filters"
        onClick={() => setVisibleRight(true)}
      >
        <Badge
          value={activeFilterCount}
          severity={activeFilterCount > 0 ? 'danger' : 'secondary'}
          className="absolute top-4 right-2"
        />
      </Button>

      <Button
        icon="pi pi-plus"
        className="border-none bg-violet-400 h-12 p-5 text-slate-50"
        severity="help"
        label="Create"
      />
    </div>
  );
};

export default Title;