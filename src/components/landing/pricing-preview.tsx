
import Link from 'next/link';
import { Check } from 'lucide-react';

export function PricingPreview() {
    return (
        <section className="py-24 bg-gray-950 border-t border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Clear. Transparent. Institution-Ready.
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Choose the right level of intelligence for your deployment.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Starter */}
                    <div className="bg-gray-900/30 rounded-xl p-8 border border-gray-800">
                        <h3 className="text-xl font-semibold text-white mb-2">Starter</h3>
                        <div className="text-3xl font-bold text-white mb-4">$3,500<span className="text-sm font-normal text-gray-500">/assessment</span></div>
                        <ul className="space-y-3 mb-8 text-gray-400 text-sm">
                            <li className="flex items-center gap-2"><Check size={16} className="text-cyan-500" /> 10 respondent credits</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-cyan-500" /> Basic assessment templates</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-cyan-500" /> Standard email support</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-cyan-500" /> PDF reports</li>
                        </ul>
                        <Link href="/auth/register" className="block w-full text-center py-2.5 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition-colors">Start Assessment</Link>
                    </div>

                    {/* Professional */}
                    <div className="bg-gray-900/60 rounded-xl p-8 border border-cyan-500/30 relative">
                        <div className="absolute top-0 right-0 bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Professional</h3>
                        <div className="text-3xl font-bold text-white mb-4">$6,250<span className="text-sm font-normal text-gray-500">/assessment</span></div>
                        <ul className="space-y-3 mb-8 text-gray-400 text-sm">
                            <li className="flex items-center gap-2"><Check size={16} className="text-cyan-500" /> 25 respondent credits</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-cyan-500" /> Advanced templates</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-cyan-500" /> Priority support</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-cyan-500" /> Interactive dashboards</li>
                        </ul>
                        <Link href="/auth/register" className="block w-full text-center py-2.5 rounded-lg bg-cyan-500 text-white hover:bg-cyan-400 transition-colors font-bold">Start Assessment</Link>
                    </div>

                    {/* Expert Services */}
                    <div className="bg-gray-900/30 rounded-xl p-8 border border-purple-500/30">
                        <h3 className="text-xl font-semibold text-white mb-2">Intent Analysis</h3>
                        <div className="text-3xl font-bold text-white mb-4">$50k+<span className="text-sm font-normal text-gray-500">/engagement</span></div>
                        <ul className="space-y-3 mb-8 text-gray-400 text-sm">
                            <li className="flex items-center gap-2"><Check size={16} className="text-purple-500" /> Forensic investigation</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-purple-500" /> Full 7-layer diagnostic</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-purple-500" /> Audit-grade report</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-purple-500" /> 3-4 week timeline</li>
                        </ul>
                        <Link href="/contact" className="block w-full text-center py-2.5 rounded-lg border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-colors">Request Quote</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
