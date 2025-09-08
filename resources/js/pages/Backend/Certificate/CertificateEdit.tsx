import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { appName } from '@/lib/constants';
import backend from '@/routes/backend';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

interface FormProps {
    title: string;
    content: boolean;
    path: string;
    image: string;
}
export default function ({ types, element }: SharedData) {
    const { errors } = usePage().props;
    const { data, setData, put, processing }: any = useForm({
        title: element.title,
        content: element.content,
        path: element.path,
        image: element.image,
        participant_id: element.participant_id,
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
            backend.certificate.create().url,
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
                                <Label htmlFor="name" aria-required className="required">
                                    الاسم بالكامل
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    defaultValue={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    name="name"
                                    placeholder="Full name"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>
                            <div className="grid gap-2">
                                {/* // type */}
                                <Label htmlFor="type" aria-required>
                                    الشهادة
                                </Label>
                                <Select dir="rtl" name="type" defaultValue={data.type} onValueChange={(e: any) => setData('type', e)}>
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="نوع الشهادة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {types &&
                                            types?.map((t: any, i: number) => (
                                                <SelectItem value={t} key={i}>
                                                    {t}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.type} className="mt-2" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="title">اللقب</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    autoFocus
                                    tabIndex={1}
                                    defaultValue={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    autoComplete="title"
                                    name="title"
                                    placeholder="title"
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>
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
