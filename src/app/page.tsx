'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Download, Trash2, Upload } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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
    const handleSizeChange = (size: string) => {
        updateQueryParams({ size: size });
    };

    // Handle year filter change
    const handleYearChange = (year: string) => {
        updateQueryParams({ filterYear: year });
    };

    // Handle search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateQueryParams({ keySearch: event.target.value });
    };

    return (
        <div className='max-w-4xl mx-auto p-6 rounded-lg mt-10'>
            <h1 className='text-3xl font-bold text-gray-900 mb-6'>
                Search Page
            </h1>

            <ImportButton />

            <DialogDemo />

            {/* Search Input */}
            <SearchInput
                searchKey={searchKey}
                handleSearchChange={handleSearchChange}
            />

            {/* Year Filter */}
            <YearFilter
                filterYear={filterYear}
                handleYearChange={handleYearChange}
                yearOptions={yearOptions}
            />

            {/* Page Size Filter */}
            <PageSizeFilter
                size={size}
                handleSizeChange={handleSizeChange}
                sizeOptions={sizeOptions.map((option) => option.toString())} // Convert numbers to strings for consistency
            />

            {/* Pagination Controls */}
            <PaginationControls
                page={page}
                handlePageChange={handlePageChange}
                totalPages={Math.ceil(100 / parseInt(size, 10))} // Example total pages based on size
            />
        </div>
    );
}

interface SearchInputProps {
    searchKey: string;
    handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
    searchKey,
    handleSearchChange,
}) => {
    return (
        <div className='mb-4'>
            <label htmlFor='search' className='text-gray-700 font-semibold'>
                Search
            </label>

            {/* Search input field */}
            <Input
                id='search'
                type='text'
                value={searchKey}
                onChange={handleSearchChange} // Corrected for an input element
                placeholder='Search...'
                className='w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700'
            />
        </div>
    );
};

interface YearFilterProps {
    filterYear: string;
    handleYearChange: (value: string) => void;
    yearOptions: string[];
}

const YearFilter: React.FC<YearFilterProps> = ({
    filterYear,
    handleYearChange,
    yearOptions,
}) => {
    return (
        <div className='mb-4'>
            <label htmlFor='filterYear' className='text-gray-700 font-semibold'>
                Filter by Year
            </label>

            {/* Dropdown (select) for filtering by year */}
            <Select value={filterYear} onValueChange={handleYearChange}>
                <SelectTrigger className='w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
                    <SelectValue placeholder='Select Year' />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Years</SelectLabel>
                        {yearOptions.map((year) => (
                            <SelectItem key={year} value={year}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

interface PageSizeFilterProps {
    size: string;
    handleSizeChange: (value: string) => void;
    sizeOptions: string[];
}

const PageSizeFilter: React.FC<PageSizeFilterProps> = ({
    size,
    handleSizeChange,
    sizeOptions,
}) => {
    return (
        <div className='mb-4'>
            <label htmlFor='pageSize' className='text-gray-700 font-semibold'>
                Items per Page
            </label>

            {/* Dropdown (select) for page size */}
            <Select value={size} onValueChange={handleSizeChange}>
                <SelectTrigger className='w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
                    <SelectValue placeholder='Select Page Size' />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Page Sizes</SelectLabel>
                        {sizeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

interface PaginationControlsProps {
    page: number;
    handlePageChange: (newPage: number) => void;
    totalPages: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
    page,
    handlePageChange,
    totalPages,
}) => {
    return (
        <div className='mt-6'>
            {/* Shadcn Pagination component */}
            <Pagination>
                <PaginationContent className='flex items-center justify-center space-x-2'>
                    {/* Previous Button */}
                    <PaginationItem>
                        <PaginationPrevious
                            href='#'
                            onClick={(e) => {
                                e.preventDefault();
                                if (page > 1) handlePageChange(page - 1); // Prevent page change if on the first page
                            }}
                        />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {/* Generate Page Numbers */}
                    {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                    ).map((pageNumber) => (
                        <PaginationItem key={pageNumber}>
                            <PaginationLink
                                href='#'
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(pageNumber); // Set the page to the selected page number
                                }}
                                isActive={page === pageNumber}
                            >
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    {/* Ellipsis (if needed) */}
                    {totalPages > 5 && page < totalPages - 2 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    {/* Next Button */}
                    <PaginationItem>
                        <PaginationNext
                            href='#'
                            onClick={(e) => {
                                e.preventDefault();
                                if (page < totalPages)
                                    handlePageChange(page + 1); // Prevent page change if on the last page
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

const DialogDemo = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [isPendingClose, setIsPendingClose] = useState(false);
    const [alertAction, setAlertAction] = useState<
        'reset' | 'cancel' | 'submit' | null
    >(null);
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    // Close the main dialog
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setIsAlertDialogOpen(false);
        setAlertAction(null);
    };

    // Submit form data
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAlertAction('submit');
        setIsAlertDialogOpen(true); // Show confirmation dialog before submitting
    };

    // Handle Reset button click
    const handleReset = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent form reset if inside a form
        setAlertAction('reset');
        setIsAlertDialogOpen(true);
    };

    // Handle Cancel button click
    const handleCancel = (e: React.MouseEvent) => {
        e.preventDefault();
        setAlertAction('cancel');
        setIsAlertDialogOpen(true);
    };

    // Close the alert dialog (stay in the form dialog)
    const handleCancelAlert = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsAlertDialogOpen(false);
        setAlertAction(null);
    };

    // Confirm action in alert dialog
    const handleConfirmAlert = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (alertAction === 'reset') {
            // Reset the form
            if (formRef.current) {
                formRef.current.reset();
            }
            setIsAlertDialogOpen(false);
            setAlertAction(null);
        } else if (alertAction === 'cancel') {
            // Close the main dialog
            handleCloseDialog();
        } else if (alertAction === 'submit') {
            // Submit the form
            if (formRef.current) {
                const formData = new FormData(formRef.current);
                console.log('Form submitted:', Object.fromEntries(formData));
            }
            handleCloseDialog();
        }
    };

    const handleDialogTriggerClick = () => {
        // Only open the main dialog, no other side effects
        setIsDialogOpen(true);
    };

    const handleOnChangeDialog = (open: boolean) => {
        if (open) {
            setIsDialogOpen(true); // Open the main dialog
        } else {
            // When trying to close, show the confirmation dialog instead
            setAlertAction('cancel');
            setIsAlertDialogOpen(true);
        }
    };

    // Handle browser-level events (tab close, reload, navigation)
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isDialogOpen && !isAlertDialogOpen) {
                // Show custom dialog without triggering browser alert
                setAlertAction('cancel');
                setIsAlertDialogOpen(true);
                event.preventDefault(); // Attempt to delay unload (may not work reliably)
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDialogOpen, isAlertDialogOpen]);

    return (
        <div>
            {/* Main dialog */}
            <Dialog open={isDialogOpen} onOpenChange={handleOnChangeDialog}>
                <DialogTrigger asChild>
                    <Button
                        variant='outline'
                        onClick={handleDialogTriggerClick}
                    >
                        Edit Profile
                    </Button>
                </DialogTrigger>
                <DialogContent
                    className='sm:max-w-[425px]'
                    ref={dialogRef}
                    onInteractOutside={(e) => {
                        e.preventDefault();
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when
                            you're done.
                        </DialogDescription>
                        <form ref={formRef}>
                            {/* Example form fields */}
                            <input type='text' name='name' placeholder='Name' />
                            <input
                                type='email'
                                name='email'
                                placeholder='Email'
                            />
                        </form>
                    </DialogHeader>

                    <DialogFooter>
                        <Button type='reset' onClick={handleReset}>
                            Reset
                        </Button>
                        <Button type='reset' onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type='submit' onClick={handleSubmit}>
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation dialog */}
            <AlertDialog
                open={isAlertDialogOpen}
                onOpenChange={setIsAlertDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            If you continue, all your unsaved changes will be
                            lost.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelAlert}>
                            Cancel
                        </AlertDialogCancel>
                        {/* Stay in the form dialog */}
                        <AlertDialogAction onClick={handleConfirmAlert}>
                            Confirm
                        </AlertDialogAction>
                        {/* Close both dialogs */}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Submit confirmation dialog */}
            <AlertDialog
                open={isAlertDialogOpen && alertAction === 'submit'}
                onOpenChange={setIsAlertDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Submit Confirmation</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to submit the form?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelAlert}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmAlert}>
                            Submit
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

interface UploadedFile {
    name: string;
    size: number;
    file: File;
}

const ImportButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [dragActive, setDragActive] = useState(false);

    // Handle file drop
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFiles = (files: FileList) => {
        const newFiles = Array.from(files).map((file) => ({
            name: file.name,
            size: file.size,
            file: file,
        }));
        setUploadedFiles((prev) => [...prev, ...newFiles]);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const handleDownload = (file: UploadedFile) => {
        const url = URL.createObjectURL(file.file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleRemove = (fileName: string) => {
        setUploadedFiles((prev) =>
            prev.filter((file) => file.name !== fileName)
        );
    };

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button>Import</Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle>Import Files</DialogTitle>
                    </DialogHeader>

                    {/* Drop Zone */}
                    <div
                        className={`border-2 border-dashed rounded-md p-6 text-center ${
                            dragActive
                                ? 'border-primary bg-primary/10'
                                : 'border-gray-300'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className='space-y-2'>
                            <Upload className='mx-auto h-12 w-12 text-gray-400' />
                            <p className='text-sm text-gray-600'>
                                Drag and drop files here or click to upload
                            </p>
                            <Button asChild>
                                <label htmlFor='file-upload'>Upload File</label>
                            </Button>
                            <input
                                id='file-upload'
                                type='file'
                                className='hidden'
                                onChange={handleFileInput}
                                multiple
                            />
                        </div>
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                        <div className='mt-4 space-y-2'>
                            {uploadedFiles.map((file) => (
                                <div
                                    key={file.name}
                                    className='flex items-center justify-between p-2 bg-gray-50 rounded-md'
                                >
                                    <div className='flex-1 truncate'>
                                        <span className='text-sm'>
                                            {file.name}
                                        </span>
                                        <span className='text-xs text-gray-500 ml-2'>
                                            ({(file.size / 1024).toFixed(2)} KB)
                                        </span>
                                    </div>
                                    <div className='flex gap-2'>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => handleDownload(file)}
                                        >
                                            <Download className='h-4 w-4' />
                                        </Button>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={() =>
                                                handleRemove(file.name)
                                            }
                                        >
                                            <Trash2 className='h-4 w-4' />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
