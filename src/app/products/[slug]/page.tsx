import { notFound } from 'next/navigation';
import { PRODUCTS, PRODUCT_SLUGS } from '@/lib/constants/products';
import { PartnerIntelligenceHero } from '@/components/products/partner-intelligence/hero-section';
import { PartnerIntelligenceFeatures } from '@/components/products/partner-intelligence/features-section';
import { PartnerIntelligenceUseCases } from '@/components/products/partner-intelligence/use-cases-section';
import { PartnerIntelligenceCTA } from '@/components/products/partner-intelligence/cta-section';
import { DeploymentInsightsHero } from '@/components/products/deployment-insights/hero-section';
import { DeploymentInsightsFeatures } from '@/components/products/deployment-insights/features-section';
import { DeploymentInsightsUseCases } from '@/components/products/deployment-insights/use-cases-section';
import { DeploymentInsightsCTA } from '@/components/products/deployment-insights/cta-section';
import { TrustSignalsHero } from '@/components/products/trust-signals/hero-section';
import { TrustSignalsFeatures } from '@/components/products/trust-signals/features-section';
import { TrustSignalsUseCases } from '@/components/products/trust-signals/use-cases-section';
import { TrustSignalsCTA } from '@/components/products/trust-signals/cta-section';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const productComponents: Record<string, React.ComponentType> = {
  'partner-intelligence': () => (
    <>
      <PartnerIntelligenceHero />
      <PartnerIntelligenceFeatures />
      <PartnerIntelligenceUseCases />
      <PartnerIntelligenceCTA />
    </>
  ),
  'deployment-insights': () => (
    <>
      <DeploymentInsightsHero />
      <DeploymentInsightsFeatures />
      <DeploymentInsightsUseCases />
      <DeploymentInsightsCTA />
    </>
  ),
  'trust-signals': () => (
    <>
      <TrustSignalsHero />
      <TrustSignalsFeatures />
      <TrustSignalsUseCases />
      <TrustSignalsCTA />
    </>
  )
};

export async function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({
    slug: slug
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = PRODUCTS[slug as keyof typeof PRODUCTS];

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist.'
    };
  }

  return {
    title: `${product.name} | Gitance`,
    description: product.longDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      type: 'website'
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = PRODUCTS[slug as keyof typeof PRODUCTS];

  if (!product) {
    notFound();
  }

  const Component = productComponents[product.slug];

  if (!Component) {
    notFound();
  }

  return <Component />;
}