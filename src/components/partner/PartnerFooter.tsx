import Link from 'next/link';

export default function PartnerFooter() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                        © 2025 FutureForm™. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-500 max-w-3xl mx-auto">
                        FutureForm Trust Diagnostic™, Trust Intelligence Engine™,
                        and Role-Mapped Assessment Flow™ are proprietary tools.
                    </p>
                    <div className="flex justify-center gap-6 text-sm">
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
