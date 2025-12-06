import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTASection() {
    return (
        <section className="py-20 bg-blue-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    Stop betting on luck.
                </h2>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                    Deploy capital with the confidence of structured intelligence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold h-12 px-8">
                        Start Your Assessment
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8">
                        Talk to Sales
                    </Button>
                </div>
            </div>
        </section>
    );
}
