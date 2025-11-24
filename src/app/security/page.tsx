import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Data Security</h1>
        <p className="text-gray-600 mb-8">How we protect your sensitive assessment data</p>

        <div className="bg-white rounded-lg p-8 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Encryption</h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Data in Transit:</strong> All data transmission uses TLS 1.3 encryption</p>
              <p><strong>Data at Rest:</strong> AES-256 encryption for all stored data</p>
              <p><strong>Database:</strong> Encrypted PostgreSQL with field-level encryption for sensitive data</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Access Controls</h2>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>Multi-factor authentication required for all accounts</li>
              <li>Role-based access control with principle of least privilege</li>
              <li>Regular access reviews and automated deprovisioning</li>
              <li>API rate limiting and request validation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Infrastructure Security</h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Cloud Provider:</strong> AWS with SOC 2 Type II compliance</p>
              <p><strong>Network:</strong> VPC isolation, WAF protection, DDoS mitigation</p>
              <p><strong>Monitoring:</strong> 24/7 security monitoring and incident response</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Handling</h2>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>Assessment data is isolated by organization</li>
              <li>Automated backups with encryption</li>
              <li>Data retention policies aligned with legal requirements</li>
              <li>Secure data deletion upon request</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Compliance</h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Standards:</strong> ISO 27001, SOC 2 Type II</p>
              <p><strong>Regulations:</strong> GDPR, CCPA compliance</p>
              <p><strong>Audits:</strong> Annual third-party security assessments</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Incident Response</h2>
            <p className="text-gray-700">
              We maintain a comprehensive incident response plan with defined procedures for
              detection, containment, and recovery. Security incidents are reported within 24 hours.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Security Contact</h2>
            <p className="text-gray-700">
              Report security issues to: <strong>security@futureform.africa</strong>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}