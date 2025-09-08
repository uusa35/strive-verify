import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { getImage } from '@/lib/constants';
import { login, logout, register } from '@/routes';
import { home as backendHome } from '@/routes/backend';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome() {
    const { auth, link } = usePage<SharedData>().props;
    const [qr, setQr] = useState<any>(null);
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <Head title="معهد سترايف">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <>
                                <Link
                                    href={backendHome()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    لوحة التحكم
                                </Link>
                                <Link href={logout()} as="button" onClick={handleLogout}>
                                    تسجيل الخروج
                                </Link>
                            </>
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
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="mb-1 text-xl font-medium">موقع سترايف التعليمي للتحقق من الشهادات المصدرة</h1>
                            <p className="mb-2 text-[#706f6c] dark:text-[#A1A09A]">
                                هذا الموقع مخصص للتأكد والتحقق من جميع الشهادات الصادرة من معهد سترايف التعليمي
                                <br />
                                يمكن التحقق عن صحة الشهادة عن طريق الكيو ار كود المطبوع على الشهادة الصادرة للتحقق من البيانات ومقارنتها
                            </p>

                            <ul className="flex gap-3 text-sm leading-normal">
                                <li>
                                    <a
                                        href="https://strivedu.com/ar"
                                        target="_self"
                                        className="inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                    >
                                        موقع المعهد الرئيسي
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden bg-white lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] dark:bg-[#1D0002]">
                            <div className="flex h-full items-center justify-center">
                                <img src={getImage('logo_english.jpg')} className="h-auto w-3/4 object-cover" />
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
