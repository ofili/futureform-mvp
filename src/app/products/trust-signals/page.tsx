import { TrustSignalsHero } from '@/components/products/trust-signals/hero-section';
import { TrustSignalsFeatures } from '@/components/products/trust-signals/features-section';
import { TrustSignalsUseCases } from '@/components/products/trust-signals/use-cases-section';
import { TrustSignalsCTA } from '@/components/products/trust-signals/cta-section';

export const metadata = {
    title: 'Trust Signals | Gitance',
    description: 'Multi-layer trust scoring and evidence-based verification. Make informed partnership decisions.',
};

export default function TrustSignalsPage() {
    return (
        <>
            <TrustSignalsHero />
            <TrustSignalsFeatures />
            <TrustSignalsUseCases />
            <TrustSignalsCTA />
        </>
    );
}