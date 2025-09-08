import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { first, values } from 'lodash';
import { useEffect, type PropsWithChildren } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster, toast } from 'sonner';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { flash, errors }: any = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash?.success);
        } else if (flash?.error) {
            toast.error(flash?.error);
        } else if (errors && errors.length > 0) {
            toast.error(first(values(errors)));
        }
    }, [flash, errors?.length]);

    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent>{children}</AppContent>
            <Toaster position="top-center" richColors dir="rtl" />
        </AppShell>
    );
}
