import AppLayout from '@/layouts/app-layout';
import { appName } from '@/lib/constants';
import backend from '@/routes/backend';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head } from '@inertiajs/react';
export default function ({ query }: SharedData) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'لوحة التحكم',
            href: backend.home().url,
        },
        {
            title: 'قائمة الشهادات',
            href: backend.certificate.index({ query: query ? { ...query } : {} }).url,
        },
        {
            title: 'إنشاء شهادة',
            href: backend.certificate.create().url,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${appName} - إنشاء شهادة `} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <h1>إنشاء شهادة جديدة</h1>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl md:min-h-min dark:border-sidebar-border"></div>
            </div>
        </AppLayout>
    );
}
