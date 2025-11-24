import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: December 20, 2024</p>

        <div className="bg-white rounded-lg p-8 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
            <p className="text-gray-700">
              FutureForm provides trust intelligence assessment services through our platform,
              including The Five-Layer Trust Framework™ and related analytical tools.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Responsibilities</h2>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>Provide accurate and truthful information in assessments</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the platform in compliance with applicable laws</li>
              <li>Respect intellectual property rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Terms</h2>
            <div className="space-y-4 text-gray-700">
              <p>Assessment fees are due upon completion of the assessment process.</p>
              <p>Enterprise subscriptions are billed according to agreed terms.</p>
              <p>Refunds are available within 30 days for unused assessments.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700">
              The Five-Layer Trust Framework™, assessment methodology, and platform technology
              are proprietary to FutureForm Ltd. Users retain ownership of their submitted data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700">
              FutureForm provides assessment tools and analysis. Users are responsible for
              their own business decisions based on assessment results.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700">
              Either party may terminate service with 30 days notice. Data export is available
              for 90 days after termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-700">
              For terms-related questions, contact: <strong>legal@futureform.africa</strong>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}