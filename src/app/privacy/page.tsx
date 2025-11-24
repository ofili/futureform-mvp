import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: December 20, 2024</p>

        <div className="bg-white rounded-lg p-8 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Account Information:</strong> Name, email address, organization details, and authentication credentials.</p>
              <p><strong>Assessment Data:</strong> Responses to trust framework questions, uploaded evidence, and generated reports.</p>
              <p><strong>Usage Data:</strong> Platform interactions, feature usage, and performance metrics.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>Provide and improve our trust assessment services</li>
              <li>Generate trust profiles and analytical reports</li>
              <li>Communicate about your account and assessments</li>
              <li>Ensure platform security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700">
              We implement industry-standard security measures including encryption at rest and in transit,
              access controls, and regular security audits to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sharing</h2>
            <p className="text-gray-700">
              We do not sell or share your personal data with third parties except as necessary to provide
              our services or as required by law. Assessment data remains confidential to your organization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>Access and review your personal data</li>
              <li>Request corrections to inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Export your assessment data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              For privacy-related questions, contact us at: <strong>privacy@futureform.africa</strong>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}