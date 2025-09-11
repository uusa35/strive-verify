import Backend from '@/actions/App/Http/Controllers/Backend';
import Frontend from '@/actions/App/Http/Controllers/Frontend';
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
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { appName } from '@/lib/constants';
import backend, { home } from '@/routes/backend';
import { BreadcrumbItem, SharedData } from '@/types';
import { EyeIcon } from '@heroicons/react/24/outline';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Delete, Download, Edit2, LucideGraduationCap, MoreHorizontalIcon } from 'lucide-react';
import { useMemo } from 'react';

type Props = {
    id: string;
    name: string;
    date: string;
};

export default function ({ elements, query }: SharedData) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'لوحة التحكم',
            href: home().url,
        },
        {
            title: 'قائمة الشهادات',
            href: backend.certificate.index({ query: query ? { ...query } : {} }).url,
        },
    ];
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
                accessorKey: 'title',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            العنوان
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }: any) => {
                    return (
                        <div className="sm-text flex flex-col items-start justify-start gap-y-2 truncate">
                            <div>{row.original.title}</div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'path',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            محتوى الشهادة
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }: any) => {
                    return (
                        <div className="text-xxs flex flex-row items-start justify-start gap-4 truncate">
                            <Button asChild className="capitalize">
                                <Link
                                    href={Backend.CertificateController.show(row.original.id, { query: { slug: row.original.title } }).url}
                                    target="__blank"
                                >
                                    <EyeIcon />
                                </Link>
                            </Button>
                            <Button asChild className="capitalize">
                                <a href={row.original.path} download target="__blank">
                                    <Download />
                                </a>
                            </Button>
                        </div>
                    );
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
                                <DropdownMenuItem>
                                    <Link href={Backend.CertificateController.edit(element.id).url} className="flex flex-row space-x-1">
                                        <div>
                                            <Edit2 />
                                        </div>
                                        <div>تعديل البيانات</div>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href={Frontend.FrontendCertificateController.show(element.id).url} className="flex flex-row space-x-1">
                                        <div>
                                            <LucideGraduationCap />
                                        </div>
                                        <div>عرض كمستخدم خارجي </div>
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
                                            <AlertDialogTitle className="text-start">تأكيد حذف العنصر ؟</AlertDialogTitle>
                                            <AlertDialogDescription className="text-start">
                                                يرجى العلم بأن هذا الحذف نهائي ولا يمكن الرجوع للاستعلام بعد الحذف
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="text-start">
                                            <AlertDialogCancel>الغاء</AlertDialogCancel>
                                            <AlertDialogAction asChild className="flex flex-row space-x-1 bg-red-600 text-white">
                                                <Link href={Backend.CertificateController.destroy(element.id).url} method="delete">
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
            <Head title={`${appName} - قائمة الشهادات`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-row items-center justify-between gap-4">
                    <h1>قائمة الشهادات</h1>
                    {query?.participant_id && (
                        <Button variant="outline" className="w-1/4" asChild>
                            <Link href={backend.certificate.create({ query: { participant_id: query.participant_id } }).url}>إنشاء شهادة جديدة </Link>
                        </Button>
                    )}
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl md:min-h-min dark:border-sidebar-border">
                    {elements ? (
                        <>
                            <MainDataTable
                                columns={columns}
                                data={elements.data}
                                resetPath={backend.certificate.index().url}
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
