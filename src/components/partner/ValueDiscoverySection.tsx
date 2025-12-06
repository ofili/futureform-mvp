import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Target, Shield } from 'lucide-react';

export default function ValueDiscoverySection() {
    return (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
                <div className="text-center space-y-6">
                    <h3 className="text-2xl font-semibold text-gray-900">
                        Trust Intelligence for High-Stakes Deployments
                    </h3>

                    <p className="text-gray-700 max-w-2xl mx-auto">
                        Organizations use Gitance to anticipate deployment risks, strengthen vendor due diligence,
                        and improve cross-functional alignment.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 pt-4">
                        <div className="flex flex-col items-center text-center space-y-2">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">Understand your trust readiness</p>
                        </div>

                        <div className="flex flex-col items-center text-center space-y-2">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                <Target className="w-6 h-6 text-indigo-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">Benchmark maturity across domains</p>
                        </div>

                        <div className="flex flex-col items-center text-center space-y-2">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-purple-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">Reveal hidden adoption risks</p>
                        </div>
                    </div>

                    <Link
                        href="/framework"
                        className="inline-block text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                        Learn more →
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
