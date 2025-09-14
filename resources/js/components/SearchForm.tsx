import TextInput from '@/components/TextInput';
import { Button } from '@/components/ui/button';
import { ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    baseUrl: string;
}

export default function ({ baseUrl }: Props) {
    const { query }: any = usePage().props;
    const [search, setSearch] = useState(query?.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            baseUrl,
            { search, page: query.page ?? '1' },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <form className={'flex flex-row gap-3'} onSubmit={handleSearch}>
            <div className="-sm relative mt-2 w-[300px]">
                <div className="pointer-events-none absolute inset-y-0 flex items-center ltr:left-0 ltr:pl-3 rtl:right-0 rtl:pr-3">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <TextInput
                    name={'search'}
                    placeholder={'البحث'}
                    value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                    className="block h-12 w-full bg-gray-50 ps-10 sm:text-sm sm:leading-6"
                />
            </div>
            <Button type="submit" className="mt-2 h-12">
                <MagnifyingGlassIcon />
            </Button>
            <Link
                preserveScroll
                className="mt-2 flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-400 hover:border-red-50 hover:bg-red-300 hover:text-white"
                href={`${baseUrl}${query?.participant_id ? `?participant_id=${query.participant_id}` : ''}`}
            >
                <ArrowPathIcon className="h-6 w-6" />
            </Link>
        </form>
    );
}
