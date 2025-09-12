import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    elements?: { data: any, links: any },
    element?: any;
    [key: string]: any;
}

export interface User {
    id: number | string;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}


export interface Participant {
    id: number;
    name: string;
    title?: string;
    email?: string;
    civil_id?: string;
    active?: boolean;
    [key: string]: unknown;
}
export interface Certificate {
    id: number;
    name: string;
    reference: string;
    path: URL;
    image: string;
    participant_id: string | number;
    participant?: Participant[]
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
