import InputError from '@/components/input-error';
import { TextEditor } from '@/components/TextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { appName } from '@/lib/constants';
import backend from '@/routes/backend';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Download, LoaderCircle, UploadIcon } from 'lucide-react';
import { ChangeEvent, FormEventHandler } from 'react';

interface FormProps {
    title: string;
    content: boolean;
    path: string;
    image: string;
}
export default function () {
    const { errors, query } = usePage().props;
    const { data, setData, put, processing }: any = useForm({
        title: '',
        content: '',
        path: '',
        image: '',
        participant_id: query.participant_id,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: backend.home().url,
        },
        {
            title: 'قائمة الشهادات',
            href: backend.certificate.index().url,
        },

        {
            title: 'إنشاء شهادة',
            href: backend.certificate.create().url,
        },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
        setData((values: any) => ({
            ...values,
            [e.target.id]: e.target.value,
        }));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        router.post(
            backend.certificate.store().url,
            {
                _method: 'post',
                ...data,
            },
            {
                forceFormData: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${appName} - إنشاء شهادة `} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <h1>إنشاء شهادة </h1>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl md:min-h-min dark:border-sidebar-border">
                    <form onSubmit={submit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="title" aria-required className="required">
                                    عنوان الشهادة
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    defaultValue={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    name="title"
                                    placeholder="Full name"
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>
                            {/* content */}
                            <div className="col-span-full">
                                <Label htmlFor="title" aria-required className="required">
                                    محتوى الشهادة
                                </Label>
                                <TextEditor name="content" setData={setData} data={data} defaultValue={data.content} />
                                <InputError message={errors.content} className="mt-2" />
                            </div>
                            {/* file */}
                            <div className="col-span-full mb-2">
                                <div className="flex h-24 w-full flex-col items-center justify-center rounded-2xl border border-gray-200 bg-transparent">
                                    <Label
                                        htmlFor="file"
                                        aria-required
                                        className="relative top-4 z-0 flex w-full flex-1 flex-col items-center justify-center gap-y-4"
                                    >
                                        <Download />
                                        <div className="normal-text text-theme-700">{data.file ? data.file.name : 'اضغط لتحميل الشهادة'}</div>
                                    </Label>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            e.target.files ? setData('path', e.target.files[0]) : null;
                                        }}
                                        required
                                        type="file"
                                        name="path"
                                        id="file"
                                        accept="application/pdf"
                                        autoComplete="pdf_file"
                                        className="h-20 border-none bg-transparent !text-white opacity-0 shadow-none placeholder:text-white focus:border-none focus:ring-0"
                                    />
                                </div>
                                <InputError message={errors.path} className="mt-2" />
                            </div>
                            {/* image */}
                            <div className="col-span-full mb-2">
                                <label className="required">Image</label>
                                <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-gray-200 bg-transparent">
                                    <Label
                                        htmlFor="file"
                                        className="relative top-4 z-0 flex w-full flex-1 flex-row items-center justify-between px-3"
                                    >
                                        <div className="normal-text text-prime-700">click here to upload</div>
                                        <UploadIcon className="size-8 text-gray-400" />
                                    </Label>
                                    <Input
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            e.target.files ? setData('image', e.target.files[0]) : null;
                                        }}
                                        type="file"
                                        name="image"
                                        id="image"
                                        accept="image/jpg, image/jpeg , image/png"
                                        className="border-none bg-transparent !text-white opacity-0 shadow-none placeholder:text-white focus:border-none focus:ring-0"
                                    />
                                </div>
                                <InputError message={errors.image} className="mt-2" />
                            </div>
                            {/* reference */}
                            <div className="grid gap-2">
                                <Label htmlFor="reference">المرجع</Label>
                                <Input
                                    id="reference"
                                    type="text"
                                    autoFocus
                                    tabIndex={1}
                                    defaultValue={data.reference}
                                    onChange={(e) => setData('reference', e.target.value)}
                                    autoComplete="reference"
                                    name="reference"
                                    placeholder="reference"
                                />
                                <InputError message={errors.reference} className="mt-2" />
                            </div>
                            {/* status */}
                            <div className="col-span-1">
                                <Label htmlFor="title">الحالة</Label>
                                <div className="flex w-60 flex-row gap-4 py-4">
                                    <input
                                        id="active"
                                        name="active"
                                        type="radio"
                                        value={1}
                                        onChange={handleChange}
                                        defaultChecked={data.active}
                                        className="text-theme-700 border-theme-300 rounded-full border bg-white"
                                    />
                                    <span>مفعل</span>
                                    <input
                                        id="active"
                                        name="active"
                                        type="radio"
                                        value={0}
                                        onChange={handleChange}
                                        defaultChecked={!data.active}
                                        className="text-theme-700 border-theme-300 rounded-full border bg-white"
                                    />
                                    <span>غير مفعل</span>
                                </div>
                                <InputError message={errors.active} className="mt-2" />
                            </div>
                            <Button type="submit" className="col-span-full mt-2 w-1/5" tabIndex={5}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                حفظ
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
