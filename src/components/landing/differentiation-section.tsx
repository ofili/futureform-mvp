import Link from 'next/link';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export function DifferentiationSection() {
    return (
        <section className="py-24 bg-midnight relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center space-x-2 mb-6 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5">
                            <AlertTriangle size={14} className="text-red-400" />
                            <span className="text-red-300 text-xs font-semibold uppercase tracking-wider">The Intent Problem</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                            34% of Deployment Failures Occur Despite Passing Technical Due Diligence.
                        </h2>
                        <div className="prose prose-invert">
                            <p className="text-xl text-gray-300 mb-6">
                                The issue wasn't capability. <strong className="text-white">It was intent.</strong>
                            </p>
                            <p className="text-gray-400 mb-6">
                                Vendors can have world-class technology, strong financials, and impressive references—and still treat your deployment as a side project or a quick revenue grab.
                            </p>
                            <div className="bg-gray-900/80 p-6 rounded-lg border-l-4 border-cyan-500">
                                <p className="text-white font-medium italic">
                                    "Intent is the multiplier behind all other trust layers. Without it, everything else collapses."
                                </p>
                            </div>
                            <div className="mt-8">
                                <Link href="/resources/intent-problem" className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center group">
                                    Read: The Intent Problem <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-2xl blur-2xl"></div>
                        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                                    <span className="text-gray-400">Vendor Capability</span>
                                    <span className="text-green-400 font-mono">HIGH</span>
                                </div>
                                <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                                    <span className="text-gray-400">Technical Fit</span>
                                    <span className="text-green-400 font-mono">HIGH</span>
                                </div>
                                <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                                    <span className="text-gray-400">Financial Health</span>
                                    <span className="text-green-400 font-mono">STRONG</span>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-white font-bold">Deploy Outcome</span>
                                    <span className="text-red-500 font-bold font-mono">FAILED</span>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mt-4 text-center">
                                    <span className="text-red-400 text-sm font-semibold">CAUSE: LOW STRATEGIC INTENT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
