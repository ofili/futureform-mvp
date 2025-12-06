import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { ProductSuite } from '@/components/landing/product-suite';
import { FeatureTaxonomy } from '@/components/landing/feature-taxonomy';
import { AudienceSection } from '@/components/landing/audience-section';
import { DifferentiationSection } from '@/components/landing/differentiation-section';
import { CTASection } from '@/components/landing/cta-section';
import { Footer } from '@/components/landing/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <Hero />
      <ProductSuite />
      <FeatureTaxonomy />
      <AudienceSection />
      <DifferentiationSection />
      <CTASection />
      <Footer />
    </div>
  );
}