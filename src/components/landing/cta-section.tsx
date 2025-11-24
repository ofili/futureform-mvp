import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTASection() {
    const options = [
        {
            title: 'Download the Framework (Free)',
            description: 'Get the complete Trust Diagnostic Toolkit™ — all 30 questions, evidence requirements, validation protocols, and scoring methodology.',
            perfectFor: [
                'Building internal assessment capacity',
                'Understanding the methodology',
                'Evaluating fit before platform trial'
            ],
            details: {
                time: 'Immediate download',
                format: 'PDF (35 pages)'
            },
            cta: 'Download Framework PDF →',
            ctaClass: 'bg-gray-600 hover:bg-gray-700'
        },
        {
            title: 'Run an Assessment',
            description: 'Use our platform to complete a full diagnostic with AI-assisted validation and professional Trust Profile™ generation.',
            perfectFor: [
                'Due diligence on specific partners',
                'Pre-investment assessment',
                'Partnership risk audit'
            ],
            details: {
                time: '60-90 minutes to complete',
                delivery: '48 hours to Trust Profile'
            },
            cta: 'Launch Assessment →',
            ctaClass: 'bg-blue-600 hover:bg-blue-700',
            featured: true,
            href: '/auth/register'
        },
        {
            title: 'Book a Consultation (Free)',
            description: '45-minute framework walkthrough with our team. Review your use case, see platform demo, discuss enterprise options.',
            perfectFor: [
                'Portfolio-wide programs',
                'Multi-diagnostic needs',
                'White-label partnerships'
            ],
            details: {
                time: '45-minute video call',
                calendar: 'Book directly'
            },
            cta: 'Schedule Consultation →',
            ctaClass: 'text-blue-600 border-blue-600 hover:bg-blue-50',
            ctaVariant: 'outline' as const
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                        Ready to See What Due Diligence Misses?
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`rounded-lg p-8 flex flex-col h-full ${option.featured
                                ? 'bg-blue-50 border-2 border-blue-600'
                                : 'bg-gray-50'
                                }`}
                        >
                            <div className="flex-grow">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    {option.title}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {option.description}
                                </p>
                                <div className="space-y-2 text-sm text-gray-600 mb-6">
                                    <p><strong>Perfect for:</strong></p>
                                    {option.perfectFor.map((item, idx) => (
                                        <p key={idx}>• {item}</p>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500">
                                    {Object.entries(option.details).map(([key, value], idx) => (
                                        <span key={idx}>
                                            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                                            {idx < Object.entries(option.details).length - 1 && <br />}
                                        </span>
                                    ))}
                                </p>
                            </div>
                            <div className="mt-8">
                                {option.href ? (
                                    <Link href={option.href}>
                                        <Button className={`w-full ${option.ctaClass}`}>
                                            {option.cta}
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button
                                        variant={option.ctaVariant || 'default'}
                                        className={`w-full ${option.ctaClass}`}
                                    >
                                        {option.cta}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-600">
                        Have questions? <strong className="text-gray-900">Email us:</strong> hello@futureform.africa
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        <strong>Response time:</strong> &lt;24 hours for all inquiries
                    </p>
                </div>
            </div>
        </section>
    );
}
