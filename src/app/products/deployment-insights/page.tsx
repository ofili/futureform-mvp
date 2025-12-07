import { DeploymentInsightsHero } from '@/components/products/deployment-insights/hero-section';
import { DeploymentInsightsFeatures } from '@/components/products/deployment-insights/features-section';
import { DeploymentInsightsUseCases } from '@/components/products/deployment-insights/use-cases-section';
import { DeploymentInsightsCTA } from '@/components/products/deployment-insights/cta-section';

export const metadata = {
  title: 'Deployment Insights | Gitance',
  description: 'Real-time deployment analytics and monitoring. Track integration status across 35 markets.',
};

export default function DeploymentInsightsPage() {
  return (
    <>
      <DeploymentInsightsHero />
      <DeploymentInsightsFeatures />
      <DeploymentInsightsUseCases />
      <DeploymentInsightsCTA />
    </>
  );
}