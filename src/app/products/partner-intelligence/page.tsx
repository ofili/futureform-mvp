import { PartnerIntelligenceHero } from '@/components/products/partner-intelligence/hero-section';
import { PartnerIntelligenceFeatures } from '@/components/products/partner-intelligence/features-section';
import { PartnerIntelligenceUseCases } from '@/components/products/partner-intelligence/use-cases-section';
import { PartnerIntelligenceCTA } from '@/components/products/partner-intelligence/cta-section';

export const metadata = {
  title: 'Partner Intelligence | Gitance',
  description: 'AI-powered insights for strategic partnerships. Evaluate partners across 6 trust layers with sector-specific assessments.',
};

export default function PartnerIntelligencePage() {
  return (
    <>
      <PartnerIntelligenceHero />
      <PartnerIntelligenceFeatures />
      <PartnerIntelligenceUseCases />
      <PartnerIntelligenceCTA />
    </>
  );
}