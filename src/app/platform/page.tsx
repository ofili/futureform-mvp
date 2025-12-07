import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { PlatformHero } from '@/components/products/platform/hero-section';
import { PlatformArchitecture } from '@/components/products/platform/architecture-section';
import { PlatformCapabilities } from '@/components/products/platform/capabilities-section';
import { PlatformCTA } from '@/components/products/platform/cta-section';

export const metadata = {
    title: 'Gitance Engine | Gitance',
    description: 'Core platform infrastructure. AI-powered trust intelligence engine for global partnerships.',
};

export default function PlatformPage() {
    return (
        <div className="min-h-screen bg-midnight">
            <Navbar />
            <main>
                <PlatformHero />
                <PlatformArchitecture />
                <PlatformCapabilities />
                <PlatformCTA />
            </main>
            <Footer />
        </div>
    );
}