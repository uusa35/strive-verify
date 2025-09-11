import Backend from '@/actions/App/Http/Controllers/Backend';
import AppLayout from '@/layouts/app-layout';
import { appName } from '@/lib/constants';
import { home } from '@/routes/backend';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head } from '@inertiajs/react';

export default function ({ element }: SharedData) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'لوحة التحكم',
            href: home().url,
        },
        {
            title: 'قائمة الشهادات',
            href: Backend.CertificateController.index({ query: { participant_id: element.participant_id } }).url,
        },
        {
            title: 'صفحة الشهادة',
            href: Backend.CertificateController.show(element.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${appName} - إصدار الشهادات`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <h1>إصدار شهادة</h1>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl md:min-h-min dark:border-sidebar-border">
                    <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                        <main className="flex w-full max-w-[800px] flex-col lg:max-w-5xl lg:flex-row">
                            <div className="flex-1 bg-white p-4 leading-loose shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-br-none lg:p-10 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                                <h1 className="mb-1 text-xl font-medium">
                                    يشهد معهد سترايف التعليمي بأن الشهادة التالية معتمدة وتحتوي على معلومات صحيحة ومسجلة لدينا{' '}
                                </h1>
                                {element.reference && (
                                    <div className="text-md flex flex-col items-start justify-start gap-y-2 border-b border-gray-200 py-4">
                                        <div>رقم المرجع</div>
                                        <div>{element?.reference}</div>
                                    </div>
                                )}
                                {element.participant && (
                                    <div className="text-md flex flex-col items-start justify-start gap-y-2 border-b border-gray-200 py-4">
                                        <div>تم إصدار الشهادة لـ</div>
                                        <div>{element?.participant.name}</div>
                                    </div>
                                )}
                                {element.title && (
                                    <div className="text-md flex flex-col items-start justify-start gap-y-2 border-b border-gray-200 py-4">
                                        <div className="w-1/3">اسم الشهادة</div>
                                        <div>{element?.title}</div>
                                    </div>
                                )}
                                {element.content && (
                                    <div className="text-md flex flex-col items-start justify-start gap-y-2 border-b border-gray-200 py-4">
                                        <div className="">وصف الشهادة</div>
                                        <div
                                            dangerouslySetInnerHTML={{ __html: element.content }}
                                            className="flex h-auto w-full flex-col items-start justify-start text-balance"
                                        />
                                    </div>
                                )}

                                <ul className="mt-8 flex flex-row items-center justify-center gap-3 text-sm leading-normal">
                                    <li>
                                        {element.path && (
                                            <a
                                                download
                                                href={element.path}
                                                target="_blank"
                                                className="md:text-md inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                            >
                                                الشهادة
                                            </a>
                                        )}
                                    </li>
                                    {element.image && element.image.length > 10 && (
                                        <li>
                                            <a
                                                download
                                                href={element.large}
                                                target="_blank"
                                                className="md:text-md inline-block rounded-sm border border-gray-100 bg-gray-600 px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                            >
                                                الصورة
                                            </a>
                                        </li>
                                    )}
                                    {element.qr && element.qr.length > 10 && (
                                        <li>
                                            <a
                                                download
                                                href={element.qr}
                                                target="_blank"
                                                className="md:text-md inline-block rounded-sm border border-teal-100 bg-teal-700 px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                            >
                                                الكيوار
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden bg-white lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] dark:bg-[#1D0002]">
                                <div className="mt-[5%] flex h-full items-start justify-center">
                                    {/* {qr && (
                                        <div dangerouslySetInnerHTML={{ __html: qr }} className="flex h-auto w-full items-center justify-center" />
                                    )} */}
                                    <img src={element.qr} className="h-90 w-90 object-contain" />
                                </div>
                                <div className="absolute inset-0 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]" />
                            </div>
                        </main>
                    </div>
                    {/* <div className="hidden h-14.5 lg:block">
                        <a href={`data:image/svg+xml;charset=utf-8,${qr}`} download="qr.jpeg">
                            تحميل صورة الكيو ار
                        </a>
                    </div> */}
                </div>
            </div>
        </AppLayout>
    );
}
