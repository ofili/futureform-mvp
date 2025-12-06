import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldCheck, Globe, Users, TrendingUp } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-blue-900 text-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Redefining Trust in Emerging Markets
                    </h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        We are the trust intelligence company preventing billion-dollar technology failures through rigorous, evidence-based diagnostics.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                To bridge the trust gap that stalls progress. We believe that technology can transform emerging markets, but only if it is built on a foundation of verified trust.
                            </p>
                            <p className="text-lg text-gray-600">
                                Too many projects fail not because of bad technology, but because of hidden deficits in governance, competence, or ecosystem alignment. We exist to make those deficits visible before they become disasters.
                            </p>
                        </div>
                        <div className="bg-blue-50 p-8 rounded-2xl">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">200+ Deployments Analyzed</h3>
                                        <p className="text-gray-600 text-sm">From Lagos to Nairobi to Kigali.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <ShieldCheck className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Six-Layer Framework™</h3>
                                        <p className="text-gray-600 text-sm">Our proprietary methodology for assessing readiness.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <Globe className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Pan-African Focus</h3>
                                        <p className="text-gray-600 text-sm">Deeply rooted in the context of emerging economies.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>
                    <div className="space-y-6 text-lg text-gray-600">
                        <p>
                            Gitance was born from a decade of frustration. We watched as well-intentioned development projects and ambitious tech deployments crumbled, wasting billions of dollars and eroding public trust.
                        </p>
                        <p>
                            The problem wasn't the software. It was the "soft" infrastructure—the governance, the operational capacity, the vendor integrity—that no one was measuring effectively.
                        </p>
                        <p>
                            We spent years deconstructing these failures to build the <strong>Trust Diagnostic Toolkit™</strong>. We moved beyond "gut feel" due diligence to create a scientific, data-driven approach to measuring deployment readiness.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Evidence Over Optimism</h3>
                            <p className="text-gray-600">
                                We don't rely on promises. We look for proof. Our diagnostics are rigorous, objective, and sometimes uncomfortable—because that's what safety requires.
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Globe className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Context is King</h3>
                            <p className="text-gray-600">
                                What works in Silicon Valley doesn't always work in Sub-Saharan Africa. We design for the reality of the environment, not the ideal.
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Partnership, Not Policing</h3>
                            <p className="text-gray-600">
                                We aren't here to kill projects. We're here to save them. We identify gaps so they can be fixed before deployment, not after failure.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Build on Solid Ground?</h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join the organizations using Gitance to de-risk their most critical technology investments.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/register">
                            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                Start Your Assessment
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-blue-700 hover:text-white">
                                Contact Sales
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
