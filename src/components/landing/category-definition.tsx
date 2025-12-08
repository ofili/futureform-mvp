import React from 'react';
import { AlignCenter } from 'lucide-react';

export function CategoryDefinition() {
    return (
        <section className="bg-gray-950 py-24 relative overflow-hidden border-t border-gray-800/50">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl opacity-50"></div>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="inline-flex items-center space-x-2 mb-8 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5">
                    <AlignCenter size={14} className="text-purple-400" />
                    <span className="text-purple-300 text-xs font-semibold uppercase tracking-wider">The Trust Gap</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 leading-tight">
                    The World Has Cyber Intelligence, Financial Intelligence, and Threat Intelligence.
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                         Emerging Markets Need Trust Intelligence.
                    </span>
                </h2>

                <div className="grid md:grid-cols-2 gap-12 items-center text-left max-w-3xl mx-auto">
                    <div className="prose prose-invert">
                        <p className="text-xl text-gray-300 leading-relaxed font-light">
                            In high-variance environments, vendors can look credible on paper and still fail in execution.
                        </p>
                        <p className="text-white text-lg font-medium mt-4">
                            Gitance closes that gap.
                        </p>
                    </div>
                    <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm">
                        <p className="text-gray-400 text-lg mb-4 italic">
                            We combine AI scoring, behavioral forensics, and market intelligence to answer the question traditional due diligence can't:
                        </p>
                        <div className="space-y-2">
                             <div className="flex items-center gap-3">
                                <span className="text-gray-500">Not just</span>
                                <span className="text-white font-mono bg-gray-800 px-2 py-1 rounded">"Can they deliver?"</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <span className="text-gray-400 font-bold">But</span>
                                <span className="text-gray-400 font-mono bg-cyan-950/30 border border-cyan-500/30 px-2 py-1 rounded">"Will they deliver?"</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
