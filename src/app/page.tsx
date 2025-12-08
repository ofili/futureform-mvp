import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { CategoryDefinition } from '@/components/landing/category-definition';
import { ProductSuite } from '@/components/landing/product-suite';
import { FeatureTaxonomy } from '@/components/landing/feature-taxonomy';
import { DifferentiationSection } from '@/components/landing/differentiation-section';
import { PricingPreview } from '@/components/landing/pricing-preview';
import { DecisionGuide } from '@/components/landing/decision-guide';
import { CTASection } from '@/components/landing/cta-section';
import { Footer } from '@/components/landing/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-midnight font-sans">
      <Navbar />
      <Hero />
      <CategoryDefinition />
      <ProductSuite />
      <FeatureTaxonomy />
      <DifferentiationSection />
      <PricingPreview />
      <DecisionGuide />
      <CTASection />
      <Footer />
    </div>
  );
}