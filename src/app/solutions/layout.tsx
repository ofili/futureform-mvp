import { ReactNode } from 'react';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';

export const metadata = {
    title: 'Solutions | Gitance',
    description: 'Industry-specific trust intelligence solutions for investors, governments, development finance, and enterprises.',
};

export default function SolutionsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-midnight">
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
