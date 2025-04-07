'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
    const pathname = usePathname(); // Get the current pathname
    const searchParams = useSearchParams(); // Get the search params (like `page` and `size`)
    const router = useRouter(); // For programmatic navigation

    // Assuming you have a starter year and want to generate the year list dynamically
    const starterYear = 2020;
    const currentYear = new Date().getFullYear(); // Get the current year

    // Generate an array of years from starterYear to currentYear
    const yearOptions = Array.from(
        { length: currentYear - starterYear + 1 },
        (_, index) => (starterYear + index).toString()
    );

    const sizeOptions = [10, 20, 50]; // Options for items per page

    const page = parseInt(searchParams.get('page') || '1', 10); // Parse page number for calculations
    const size = searchParams.get('size') || '10';
    const filterYear = searchParams.get('filterYear') || currentYear.toString();
    const searchKey = searchParams.get('keySearch') || '';

    const fetchData = async () => {
        console.log(
            `Fetching data for page: ${page}, size: ${size}, year: ${filterYear}, search: ${searchKey}`
        );
    };

    useEffect(() => {
        fetchData();
    }, [page, size, filterYear, searchKey]); // Fetch new products when params change

    // Navigate to a new page with updated query params
    const updateQueryParams = (newParams: {
        page?: number;
        size?: string;
        filterYear?: string;
        keySearch?: string;
    }) => {
        const updatedSearchParams = new URLSearchParams(
            searchParams.toString()
        );

        if (newParams.page !== undefined)
            updatedSearchParams.set('page', newParams.page.toString());
        if (newParams.size !== undefined)
            updatedSearchParams.set('size', newParams.size);
        if (newParams.filterYear !== undefined)
            updatedSearchParams.set('filterYear', newParams.filterYear);
        if (newParams.keySearch !== undefined)
            updatedSearchParams.set('keySearch', newParams.keySearch);

        // Update the URL with new parameters
        router.push(`${pathname}?${updatedSearchParams.toString()}`);
    };

    // Handle pagination
    const handlePageChange = (newPage: number) => {
        updateQueryParams({ page: newPage });
    };

    // Handle items per page
    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        updateQueryParams({ size: event.target.value });
    };

    // Handle year filter change
    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        updateQueryParams({ filterYear: event.target.value });
    };

    // Handle search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateQueryParams({ keySearch: event.target.value });
    };

    return (
        <div className='max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10'>
            <h1 className='text-3xl font-bold text-gray-900 mb-6'>
                Search Page
            </h1>
            {/* Search Input */}
            <div className='mb-4'>
                <input
                    type='text'
                    value={searchKey}
                    onChange={handleSearchChange} // Corrected for an input element
                    placeholder='Search...'
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700'
                />
            </div>
            {/* Year Filter */}
            <div className='mb-4'>
                <label
                    htmlFor='filterYear'
                    className='text-gray-700 font-semibold'
                >
                    Filter by Year
                </label>
                {/* Dropdown (select) for filtering by year */}
                <select
                    id='filterYear'
                    value={filterYear}
                    onChange={handleYearChange} // Handle change for dropdown
                    className='text-gray-700 w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                    <option value=''>Select Year</option>
                    {yearOptions.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            {/* Page Size Filter */}
            <div className='mb-4'>
                <label
                    htmlFor='pageSize'
                    className='text-gray-700 font-semibold'
                >
                    Items per Page
                </label>
                <select
                    id='pageSize'
                    value={size}
                    onChange={handleSizeChange}
                    className='text-gray-700 w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                    {sizeOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            {/* Pagination Controls */}
            <div className='flex items-center justify-between mt-6'>
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className='px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300'
                >
                    Previous
                </button>
                <span className='text-gray-700'>Page {page}</span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    className='px-4 py-2 bg-blue-500 text-white rounded-md'
                >
                    Next
                </button>
            </div>
        </div>
    );
}
