import AdminLayout from '@/components/layouts/AdminLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Console | FutureForm',
    description: 'Administrative access and management',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <AdminLayout>{children}</AdminLayout>;
}
