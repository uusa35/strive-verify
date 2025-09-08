import { Link, usePage } from '@inertiajs/react';
import { has, isEmpty, isNull, map, omit } from 'lodash';

type Props = {
    links: any;
};

export default function ({ links }: Props): React.ReactNode {
    const { query }: any = usePage().props;
    const queryString = new URLSearchParams(omit(query, 'page')).toString();

    function getClassName(active: boolean) {
        if (active) {
            return 'mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-theme-200 focus:border-primary focus:text-primary bg-theme-600 text-black hover:text-gray-900 capitalize';
        } else {
            return 'mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-theme-light hover:text-gray-900 focus:border-primary focus:text-primary capitalize';
        }
    }

    return (
        <>
            {!isEmpty(links) && (
                <div className="my-6 rounded-md">
                    <div className="flex flex-wrap items-center justify-center gap-x-2 px-2 py-4">
                        {links &&
                            map(links, (link: any, i) =>
                                has(link, 'url') && isNull(link.url) ? (
                                    <div key={i} className="mr-1 mb-1 rounded border px-4 py-3 text-sm leading-4 text-gray-400 capitalize">
                                        {link.label == 'Next &raquo;' ? 'التالي' : link.label == '&laquo; Previous' ? 'السابق' : link.label}
                                    </div>
                                ) : (
                                    <Link preserveScroll key={i} className={getClassName(link.active)} href={`${link.url}&${queryString ?? ''}`}>
                                        {link.label == 'Next &raquo;' ? 'التالي' : link.label == '&laquo; Previous' ? 'السابق' : link.label}
                                    </Link>
                                ),
                            )}
                    </div>
                </div>
            )}
        </>
    );
}
