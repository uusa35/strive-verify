import { MainDataTable } from '@/components/MainDataTable';
import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { appName } from '@/lib/constants';
import backend, { home as backendHome } from '@/routes/backend';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Delete, Edit2, LucideGraduationCap, MoreHorizontalIcon } from 'lucide-react';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: backendHome().url,
    },
];
type Props = {
    id: string;
    name: string;
    date: string;
};

export default function ({ elements }: SharedData) {
    console.log('elements', elements?.links);
    const columns: ColumnDef<Props>[] = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            المسلسل
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => {
                    return (
                        <div className="flex flex-row items-center justify-start">
                            <div className="text-xxs truncate">{row.original.id}</div>
                            <div></div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'name',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            الاسم
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }: any) => {
                    return (
                        <div className="sm-text flex flex-col items-start justify-start gap-y-2 truncate">
                            <div>{row.original.name}</div>
                        </div>
                    );
                },
            },

            {
                accessorKey: 'type',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            نوع المشارك
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }: any) => {
                    return <div className="text-xxs truncate">{row.original.type}</div>;
                },
            },

            {
                accessorKey: 'actions',
                header: () => <div className="!p-0 capitalize">المزيد</div>,
                enableColumnFilter: false,
                enableGlobalFilter: false,
                enableSorting: false,
                cell: ({ row }) => {
                    const element: any = row.original;
                    return (
                        <DropdownMenu dir="rtl">
                            <DropdownMenuTrigger>
                                <MoreHorizontalIcon className="text-gray-400" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem className="flex flex-row space-x-1">
                                    <div>
                                        <Edit2 />
                                    </div>
                                    <div>تعديل البيانات</div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="flex flex-row space-x-1">
                                    <div>
                                        <LucideGraduationCap />
                                    </div>
                                    <div>قائمة الشهادات</div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="flex flex-row space-x-1">
                                    <div>
                                        <Delete className="text-red-700" />
                                    </div>
                                    <div>حذف</div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${appName} - قائمة المشاركين`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <h1>قائمة المشاركين</h1>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl md:min-h-min dark:border-sidebar-border">
                    {elements ? (
                        <>
                            <MainDataTable
                                columns={columns}
                                data={elements.data}
                                resetPath={backend.participant.index().url}
                                showDataTablePagination={false}
                                showSearch={true}
                            />
                            <Pagination links={elements?.links} />
                        </>
                    ) : (
                        <div>No Data</div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
