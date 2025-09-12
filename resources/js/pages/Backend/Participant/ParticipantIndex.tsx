import Backend from '@/actions/App/Http/Controllers/Backend';
import { MainDataTable } from '@/components/MainDataTable';
import Pagination from '@/components/Pagination';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { appName } from '@/lib/constants';
import backend, { home as backendHome } from '@/routes/backend';
import { BreadcrumbItem, Participant, SharedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Delete, Edit2, LucideGraduationCap, MoreHorizontalIcon, PlusSquareIcon } from 'lucide-react';
import { useMemo } from 'react';
type Props = {
    links: [];
    data: Participant[];
};

export default function ({ elements }: SharedData) {
    console.log('elements', elements);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'لوحة التحكم',
            href: backendHome().url,
        },
    ];
    const columns: ColumnDef<Participant>[] = useMemo(
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
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            الاسم
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => {
                    return <div className="sm-text flex w-90 flex-col items-start justify-start gap-y-2 text-balance">{row.original.name}</div>;
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
                accessorKey: 'certificates_count',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            عدد الشهادات
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }: any) => {
                    return (
                        <div className="text-xxs flex size-10 items-center justify-center rounded-lg border bg-gray-200">
                            {row.original.certificates_count}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'active',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            حالة المشارك
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }: any) => {
                    return (
                        <Badge
                            variant="default"
                            className={`h-2 w-2 rounded-full p-0 ${row.original.active ? `bg-green-600` : `bg-red-600`}`}
                        ></Badge>
                    );
                },
            },
            {
                accessorKey: 'actions',
                header: () => <div className="!p-0 capitalize">المزيد</div>,
                enableColumnFilter: false,
                enableGlobalFilter: false,
                enableSorting: false,
                cell: ({ row }: any) => {
                    return (
                        <DropdownMenu dir="rtl">
                            <DropdownMenuTrigger>
                                <MoreHorizontalIcon className="text-gray-400" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem className="flex flex-row space-x-1">
                                    <Link className="flex flex-row space-x-1" href={backend.participant.edit(row.original.id).url}>
                                        <div>
                                            <Edit2 />
                                        </div>
                                        <div>تعديل البيانات</div>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link
                                        className="flex flex-row space-x-1"
                                        href={backend.certificate.index({ query: { participant_id: row.original?.id } }).url}
                                    >
                                        <div>
                                            <LucideGraduationCap />
                                        </div>
                                        <div>قائمة الشهادات</div>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link
                                        className="flex flex-row space-x-1"
                                        href={backend.certificate.create({ query: { participant_id: row.original?.id } }).url}
                                    >
                                        <div>
                                            <PlusSquareIcon />
                                        </div>
                                        <div>إنشاء شهادة جديدة</div>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                    <AlertDialogTrigger className="m-3 w-full hover:bg-gray-100">
                                        <div className="flex flex-row space-x-1">
                                            <div>
                                                <Delete className="text-red-700" />
                                            </div>
                                            <div>حذف</div>
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="text-start">
                                        <AlertDialogHeader className="text-start">
                                            <AlertDialogTitle className="text-start">تأكيد حذف المشارك ؟</AlertDialogTitle>
                                            <AlertDialogDescription className="text-start">
                                                يرجى العلم بأن هذا الحذف نهائي ولا يمكن الرجوع للاستعلام بعد الحذف سيتم حذف جميع الشهادات المتعلقة
                                                بهذا المشارك ولن تكون متاحة
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="text-start">
                                            <AlertDialogCancel>الغاء</AlertDialogCancel>
                                            <AlertDialogAction asChild className="flex flex-row space-x-1 bg-red-600 text-white">
                                                <Link href={Backend.ParticipantController.destroy(row.original.id).url} method="delete">
                                                    تأكيد
                                                </Link>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
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
                <div className="flex flex-row items-center justify-between gap-4">
                    <h1>قائمة المشاركين</h1>
                    <Button variant="outline" className="w-1/4" asChild>
                        <Link href={backend.participant.create().url}>إنشاء مشارك جديد</Link>
                    </Button>
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
