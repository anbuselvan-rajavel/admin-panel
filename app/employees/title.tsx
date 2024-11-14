import React from 'react'
import TitleBarActions from '../components/TitleBarActions'

interface TitleProps{
    onFilter: (filterText: string) => void;
}

const Title: React.FC<TitleProps> = ({
    onFilter,
}) => {
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        onFilter(text);
    };
    const setVisibleRight = () => {};
    const activeFilterCount = 0;
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
                        searchPlaceholder='Search Employees...' />
                </div>
            </div>
            <hr className='my-5' />

        </div>
    )
}

export default Title