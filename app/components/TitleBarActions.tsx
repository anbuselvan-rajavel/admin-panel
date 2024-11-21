import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dialog } from 'primereact/dialog';

interface TitleBarActionsProps {
  handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setVisibleRight: (value: boolean) => void;
  activeFilterCount?: number;
  searchPlaceholder?: string;
  roles?: string[];  // Add roles here
  companies?: string[];  // Add companies here
  FormComponent: React.FC<any>;  // Accept the form component as a prop
  onCreate: (data: any) => void;
}

const TitleBarActions: React.FC<TitleBarActionsProps> = ({
  handleFilterChange,
  setVisibleRight,
  activeFilterCount = 0,
  searchPlaceholder = "Search...",
  FormComponent,
  onCreate,
  roles,
  companies,
}) => {
  const [visible, setVisible] = useState(false);

  const headerElement = (
    <div className="text-center">
      <span className="font-bold white-space-nowrap">Create New</span>
    </div>
  );

  const handleSubmit = (data: any) => {
    onCreate(data); // Pass form data to onCreate
    setVisible(false); // Close dialog after submitting
  };

  return (
    <div className="flex items-center gap-4">
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          onChange={handleFilterChange}
          placeholder={searchPlaceholder}
          className="pl-10 border-purple-500 border-2 rounded-md h-12 w-56 focus:outline-none focus:shadow-none"
        />
      </IconField>

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
        onClick={() => setVisible(true)} // Open the Create Form Dialog
      />
      <Dialog
        visible={visible}
        modal
        header={headerElement}
        style={{ width: '50rem' }}
        onHide={() => setVisible(false)}
      >
        {/* Pass the form component to render */}
        <FormComponent  
        onSubmit={handleSubmit} 
        resetForm={() => setVisible(false)} 
        errors={null}
        roles={roles}  // Ensure these are passed
        companies={companies}  // Ensure these are passed
        />
      </Dialog>
    </div>
  );
};

export default TitleBarActions;
