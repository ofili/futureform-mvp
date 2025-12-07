import { ReactNode } from 'react';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';

export const metadata = {
  title: 'Products | Gitance',
  description: 'Explore Gitance products for partner intelligence, deployment insights, and trust signals.',
};

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-midnight">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}