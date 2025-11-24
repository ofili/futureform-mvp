import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { ProblemSection } from '@/components/landing/problem-section';
import { TrustFramework } from '@/components/landing/trust-framework';
import { HowItWorks } from '@/components/landing/how-it-works';
import { ProofPoints } from '@/components/landing/proof-points';
import { SampleQuestions } from '@/components/landing/sample-questions';
import { AudienceSection } from '@/components/landing/audience-section';
import { FrameworkOrigin } from '@/components/landing/framework-origin';
import { Pricing } from '@/components/landing/pricing';
import { CTASection } from '@/components/landing/cta-section';
import { Footer } from '@/components/landing/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <ProblemSection />
      <TrustFramework />
      <HowItWorks />
      <ProofPoints />
      <SampleQuestions />
      <AudienceSection />
      <FrameworkOrigin />
      {/* <Pricing /> */}
      <CTASection />
      <Footer />
    </div>
  );
}