import Link from 'next/link';

export function Footer() {
    const footerSections = [
        {
            title: 'Platform',
            links: [
                { label: 'ASSESS Partners', href: '/auth/register' },
                { label: 'MONITOR Deployments', href: '/contact' },
                { label: 'VERIFY Intent', href: '/expert-analysis' },
                { label: 'Methodology', href: '/methodology' }
            ]
        },
        {
            title: 'Solutions',
            links: [
                { label: 'For Investors', href: '/solutions/investors' },
                { label: 'For Governments', href: '/solutions/governments' },
                { label: 'For Development Finance', href: '/solutions/development-finance' },
                { label: 'For Enterprises', href: '/solutions/enterprises' }
            ]
        },
        {
            title: 'Company',
            links: [
                { label: 'About', href: '/about' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Contact', href: '/contact' },
                { label: 'Login', href: '/auth/login' }
            ]
        }
    ];

    const legalLinks = [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Data Security', href: '/security' }
    ];

    return (
        <footer className="bg-gray-900 text-white py-16 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-5 gap-8 mb-12">
                    {/* Company Info */}
                    <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold mb-4">Gitance</h3>
                        <p className="text-gray-400 mb-2">
                            Trust Intelligence for Emerging Markets
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                            Predict vendor reliability and deployment outcomes before you commit capital.
                        </p>
                        <div className="space-y-2">
                            <p className="text-gray-400 text-sm">
                                <strong className="text-white">Email:</strong> hello@gitance.com
                            </p>
                            <p className="text-gray-400 text-sm">
                                <strong className="text-white">Headquarters:</strong> Lagos, Nigeria
                            </p>
                            <p className="text-gray-400 text-sm">
                                <strong className="text-white">Presence:</strong> Nairobi • Kigali • Accra
                            </p>
                        </div>
                    </div>

                    {/* Footer Sections */}
                    {footerSections.map((section, index) => (
                        <div key={index}>
                            <h4 className="font-semibold mb-4">{section.title}</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link href={link.href} className="hover:text-white transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-gray-400 text-sm">
                                © 2025 Gitance Ltd. All rights reserved.
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                                DTRI™ and the 7-Layer Trust Diagnostic are trademarks of Gitance Ltd.
                            </p>
                        </div>
                        <div className="flex gap-6 text-sm text-gray-400">
                            {legalLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="hover:text-white transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
