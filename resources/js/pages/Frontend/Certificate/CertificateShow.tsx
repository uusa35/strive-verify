import Frontend from '@/actions/App/Http/Controllers/Frontend';
import { appName, baseUrl } from '@/lib/constants';
import { login, register } from '@/routes';
import { home as backendHome } from '@/routes/backend';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function () {
    const { auth, query, element }: any = usePage().props;
    const [qr, setQr] = useState<any>(null);

    useEffect(() => {
        if (element) {
            getQr();
        }
    }, []);

    const getQr = async () =>
        await axios
            .get('/api/qr', {
                params: {
                    link: baseUrl + Frontend.FrontendCertificateController.show(element.id, { query: { slug: element.title } }).url,
                },
            })
            .then((r) => {
                setQr(r.data);
            });

    return (
        <>
            <Head title={`${element?.title ?? ''} - ${appName}`}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user && auth.user.id == '1' ? (
                            <Link
                                href={backendHome()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    دخول الحساب
                                </Link>
                                <Link
                                    href={register()}
                                    className="!hidden inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[800px] flex-col-reverse lg:max-w-4xl lg:flex-row">
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
                                    <div>
                                        <div
                                            dangerouslySetInnerHTML={{ __html: element.content }}
                                            className="flex h-auto w-full items-center justify-center"
                                        />
                                    </div>
                                </div>
                            )}

                            <ul className="mt-8 flex gap-3 text-sm leading-normal">
                                <li>
                                    <a
                                        href={element.path}
                                        target="_self"
                                        className="inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                    >
                                        تحميل الشهادة
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden bg-white lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] dark:bg-[#1D0002]">
                            <div className="mt-[5%] flex h-full items-start justify-center">
                                {qr && <div dangerouslySetInnerHTML={{ __html: qr }} className="flex h-auto w-full items-center justify-center" />}
                            </div>
                            <div className="absolute inset-0 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]" />
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
