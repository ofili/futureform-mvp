import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';

interface Props {
    children: React.ReactNode;
}

export default function DashboardLayoutWrapper({ children }: Props) {
    return (
        <DashboardLayout>
            <div className="container mx-auto px-6 py-8 max-w-7xl">{children}</div>
        </DashboardLayout>
    );
}
