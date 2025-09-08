import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getImage, isLocal, toEn } from '@/lib/constants';
import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { toNumber } from 'lodash';
import { ArrowLeftIcon } from 'lucide-react';
import { useState } from 'react';
import TextInput from './TextInput';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    resetPath?: string;
    showDataTablePagination?: boolean;
    invisible?: { [key: string]: boolean };
    showSearch?: boolean;
}

export function MainDataTable<TData, TValue>({
    columns,
    data,
    resetPath,
    invisible = { desription: false },
    showDataTablePagination = true,
    showSearch = true,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(invisible);
    const [gFilter, setGlobalFilter] = useState<string>('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 12,
    });

    const table = useReactTable({
        data,
        columns,
        initialState: {
            columnVisibility,
        },
        enableHiding: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            globalFilter: gFilter,
            pagination,
            columnVisibility,
        },
        debugTable: isLocal,
        debugHeaders: isLocal,
        debugColumns: isLocal,
        enableColumnResizing: true,
    });

    return (
        <div className="flex w-full flex-col gap-y-6">
            <div className="flex w-full items-center justify-start gap-x-3">
                {showSearch && (
                    <>
                        <div className="-sm relative mt-2 w-[300px]">
                            <div className="pointer-events-none absolute inset-y-0 flex items-center ltr:left-0 ltr:pl-3 rtl:right-0 rtl:pr-3">
                                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                            </div>
                            <TextInput
                                placeholder={`البحث`}
                                value={gFilter}
                                onChange={(e: any) => setGlobalFilter(toEn(e.target.value))}
                                className="block h-12 w-full bg-gray-50 ps-10 sm:text-sm sm:leading-6"
                            />
                        </div>
                        {resetPath ? (
                            <Link
                                preserveScroll
                                className="mt-2 flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-400 hover:border-red-50 hover:bg-red-300 hover:text-white"
                                href={resetPath}
                            >
                                <ArrowPathIcon className="h-6 w-6" />
                            </Link>
                        ) : null}
                    </>
                )}
            </div>
            <div className="!min-h-[500px] !rounded-xl border border-gray-200">
                <Table className={'!rounded-t-xl'}>
                    <TableHeader className={'!rounded-t-xl border-b border-b-gray-300 !bg-gray-100 py-4'}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={`h-14 first:!rounded-tr-xl last:!rounded-tl-xl ltr:text-left rtl:text-right`}
                                        >
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="h-14 ps-4">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className=" ">
                                <TableCell colSpan={columns.length} className="mx-auto h-full w-100 self-center">
                                    <img src={getImage('no_results.png')} className="mx-auto h-auto w-100 object-cover" />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* pagination */}
            {showDataTablePagination && (
                <div className="flex items-center justify-end gap-x-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <div className="flex flex-row items-center justify-center gap-x-2 capitalize">
                            <ChevronLeftIcon className="h-4 w-4 rtl:rotate-180" />
                        </div>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <div className="flex flex-row items-center justify-center gap-x-2 capitalize">
                            <div>
                                <ArrowLeftIcon className="h-3 w-3 rtl:rotate-180" />
                            </div>
                            <div>السابق</div>
                        </div>
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-lg">
                        {`${toNumber(table.options?.state?.pagination?.pageIndex) + 1} / ${table.getPageCount()}`}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="rounded-lg">
                        <div className="flex flex-row items-center justify-center gap-x-2 capitalize">
                            <div>التالي</div>
                            <div>
                                <ArrowLeftIcon className="h-3 w-3 ltr:rotate-180" />
                            </div>
                        </div>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <div className="flex flex-row items-center justify-center gap-x-2 capitalize">
                            <ChevronRightIcon className="h-4 w-4 rtl:rotate-180" />
                        </div>
                    </Button>
                </div>
            )}
        </div>
    );
}
