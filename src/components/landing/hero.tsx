import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
    return (
        <section className="bg-white min-h-[75vh] flex items-center py-16 md:py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Due Diligence Fails.
                            <br />
                            <span className="text-blue-600">We Fix It.</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            FutureForm quantifies organizational trust before partnerships fail — helping DFIs, investors, and governments prevent the billion-dollar failures traditional due diligence misses.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                                <Link href="/auth/register">Run Free Assessment</Link>
                            </Button>
                            <Button className="border border-gray-300 bg-white hover:bg-gray-50 h-11 px-8 text-gray-700" asChild>
                                <Link href="/framework">See How It Works</Link>
                            </Button>
                        </div>
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-500 font-semibold">
                                VALIDATED ACROSS 200+ DEPLOYMENTS IN 35 EMERGING MARKETS
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                R² = 0.76 correlation | 82% predictive accuracy
                            </p>
                        </div>
                    </div>

                    {/* Trust Network Visualization */}
                    <div className="hidden lg:block relative">
                        <div className="w-full h-96 relative">
                            {/* Network Nodes */}
                            <div className="absolute top-8 left-8 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                            <div className="absolute top-16 right-12 w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="absolute top-32 left-16 w-3 h-3 bg-red-400 rounded-full opacity-60"></div>
                            <div className="absolute top-48 right-8 w-4 h-4 bg-blue-500 rounded-full"></div>
                            <div className="absolute bottom-24 left-12 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <div className="absolute bottom-16 right-16 w-3 h-3 bg-red-400 rounded-full opacity-60"></div>
                            <div className="absolute top-24 left-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
                            <div className="absolute bottom-32 left-1/3 w-3 h-3 bg-yellow-500 rounded-full"></div>

                            {/* Connection Lines */}
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 384">
                                {/* Strong connections */}
                                <line x1="32" y1="32" x2="200" y2="96" stroke="#3B82F6" strokeWidth="2" className="animate-pulse" />
                                <line x1="200" y1="96" x2="320" y2="192" stroke="#10B981" strokeWidth="2" />
                                <line x1="48" y1="288" x2="200" y2="96" stroke="#3B82F6" strokeWidth="2" />

                                {/* Weak/broken connections */}
                                <line x1="64" y1="128" x2="133" y2="224" stroke="#EF4444" strokeWidth="1" strokeDasharray="4,4" className="opacity-40" />
                                <line x1="320" y1="192" x2="256" y2="256" stroke="#EF4444" strokeWidth="1" strokeDasharray="4,4" className="opacity-40" />
                                <line x1="133" y1="224" x2="256" y2="256" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2,2" className="opacity-60" />
                            </svg>

                            {/* Floating elements */}
                            <div className="absolute top-4 right-4 text-xs text-gray-400 bg-white px-2 py-1 rounded shadow-sm">
                                Trust Score: 73
                            </div>
                            <div className="absolute bottom-8 left-4 text-xs text-red-500 bg-white px-2 py-1 rounded shadow-sm">
                                Risk Detected
                            </div>
                            <div className="absolute top-1/2 right-1/4 text-xs text-green-600 bg-white px-2 py-1 rounded shadow-sm">
                                Validated
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
