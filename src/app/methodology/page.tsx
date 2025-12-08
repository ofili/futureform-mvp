
import React from 'react';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';

export default function MethodologyPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Navbar />

            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-8">
                        Our Methodology
                    </h1>

                    <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">The Trust Assessment Framework</h2>
                            <p>
                                FutureForm's assessment methodology is built on years of research into partnership dynamics, risk factors, and success indicators. We combine quantitative metrics with qualitative insights to provide a comprehensive view of partnership potential.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Key Dimensions</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Strategic Alignment:</strong> Evaluating shared goals and mission compatibility.</li>
                                <li><strong>Operational Capability:</strong> Assessing execution capacity and resource availability.</li>
                                <li><strong>Governance & Compliance:</strong> Verifying legal, regulatory, and ethical standards.</li>
                                <li><strong>Financial Health:</strong> Analyzing stability and fiscal responsibility.</li>
                                <li><strong>Cultural Fit:</strong> Understanding organizational values and working styles.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Gitance Intelligence</h2>
                            <p>
                                Our proprietary AI engine, Gitance, analyzes assessment data to identify patterns, flag potential risks, and recommend mitigation strategies. It learns from outcomes to continuously improve its predictive accuracy.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
