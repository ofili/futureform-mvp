
import Link from 'next/link';

export function DecisionGuide() {
    return (
        <section className="py-24 bg-midnight">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-12">Which Service Do You Need?</h2>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                    <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
                        <h3 className="text-xl font-bold text-white mb-4">Use Self-Service AI Assessment When:</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>✓ Deployment value &lt;$10M</li>
                            <li>✓ Fast decision timeline (days)</li>
                            <li>✓ Standard vendor vetting</li>
                            <li>✓ Portfolio baseline assessment</li>
                        </ul>
                    </div>

                    <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
                        <h3 className="text-xl font-bold text-purple-400 mb-4">Request Expert Intent Analysis When:</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>✓ Deployment value &gt;$10M</li>
                            <li>✓ Critical infrastructure or strategic importance</li>
                            <li>✓ Previous vendor failures</li>
                            <li>✓ AI assessment flags high risk</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12">
                    <p className="text-gray-400 mb-4">Not sure?</p>
                    <Link href="/contact" className="text-white underline hover:text-cyan-400 transition-colors">Schedule 15-min consultation</Link>
                </div>
            </div>
        </section>
    );
}
