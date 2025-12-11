'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
    Users, Zap, CreditCard, ChevronRight, Check, Loader2,
    ShoppingCart, Plus, Minus, Shield, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

interface CreditPackage {
    id: string;
    name: string;
    displayName: string;
    type: 'RC_ONLY' | 'EC_ONLY' | 'COMBINED';
    rcAmount?: number;
    ecAmount?: number;
    totalPrice: number;
    description?: string;
    popular?: boolean;
}

function CheckoutContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [creditType, setCreditType] = useState<'RC' | 'EC'>(
        searchParams.get('type') === 'EC' ? 'EC' : 'RC'
    );
    const [packages, setPackages] = useState<CreditPackage[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    const [customAmount, setCustomAmount] = useState<number>(10);
    const [useCustom, setUseCustom] = useState(false);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Pricing per credit (could be fetched from API)
    const rcPricePerCredit = 350; // $350 per RC
    const ecPricePerCredit = 50;  // $50 per EC

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/v1/billing/packages');
                if (res.ok) {
                    const data = await res.json();
                    // Filter packages based on credit type
                    const filtered = data.filter((pkg: CreditPackage) => {
                        if (creditType === 'RC') return pkg.type === 'RC_ONLY' || pkg.type === 'COMBINED';
                        return pkg.type === 'EC_ONLY' || pkg.type === 'COMBINED';
                    });
                    setPackages(filtered);
                    if (filtered.length > 0 && !useCustom) {
                        setSelectedPackage(filtered[0].id);
                    }
                }
            } catch (error) {
                console.error('Error fetching packages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, [creditType, useCustom]);

    const getSelectedTotal = () => {
        if (useCustom) {
            return customAmount * (creditType === 'RC' ? rcPricePerCredit : ecPricePerCredit);
        }
        const pkg = packages.find(p => p.id === selectedPackage);
        return pkg?.totalPrice || 0;
    };

    const getSelectedCredits = () => {
        if (useCustom) return customAmount;
        const pkg = packages.find(p => p.id === selectedPackage);
        return creditType === 'RC' ? (pkg?.rcAmount || 0) : (pkg?.ecAmount || 0);
    };

    const handleCheckout = async () => {
        if (!session?.user?.organizationId) {
            toast({
                title: 'Error',
                description: 'Organization required to purchase credits',
                variant: 'destructive',
            });
            return;
        }

        setProcessing(true);
        try {
            const payload = useCustom
                ? {
                    type: creditType,
                    amount: customAmount,
                    organizationId: session.user.organizationId
                }
                : {
                    packageId: selectedPackage,
                    organizationId: session.user.organizationId
                };

            const res = await fetch('/api/v1/billing/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Checkout failed');

            const data = await res.json();

            if (data.checkoutUrl) {
                // Redirect to payment provider
                window.location.href = data.checkoutUrl;
            } else {
                toast({
                    title: 'Success',
                    description: 'Credits purchased successfully!',
                });
                router.push('/dashboard/credits');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast({
                title: 'Error',
                description: 'Failed to process checkout. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setProcessing(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (status === 'unauthenticated') {
        router.push('/login?callbackUrl=/dashboard/credits/checkout');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
            <div className="p-6 space-y-6 max-w-5xl mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1 text-sm text-gray-500">
                    <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/dashboard/credits" className="hover:text-gray-700">Credits</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900 font-medium">Purchase</span>
                </nav>

                {/* Header */}
                <div className="bg-white rounded-xl border shadow-sm p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <ShoppingCart className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Purchase Credits</h1>
                            <p className="text-gray-500">Select credit type and quantity to continue</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left: Selection */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Credit Type Selection */}
                        <div className="bg-white rounded-xl border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Select Credit Type</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => { setCreditType('RC'); setUseCustom(false); }}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${creditType === 'RC'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`p-2 rounded-lg ${creditType === 'RC' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                            <Users className={`w-5 h-5 ${creditType === 'RC' ? 'text-blue-600' : 'text-gray-500'}`} />
                                        </div>
                                        <span className="font-semibold text-gray-900">Respondent Credits (RC)</span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Invite partners to assessments. 1 RC = 1 respondent invite.
                                    </p>
                                </button>

                                <button
                                    onClick={() => { setCreditType('EC'); setUseCustom(false); }}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${creditType === 'EC'
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`p-2 rounded-lg ${creditType === 'EC' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                                            <Zap className={`w-5 h-5 ${creditType === 'EC' ? 'text-purple-600' : 'text-gray-500'}`} />
                                        </div>
                                        <span className="font-semibold text-gray-900">Evidence Credits (EC)</span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Process evidence submissions. Costs vary by evidence type.
                                    </p>
                                </button>
                            </div>
                        </div>

                        {/* Package Selection */}
                        <div className="bg-white rounded-xl border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Select Package</h2>

                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {packages.map((pkg) => (
                                        <button
                                            key={pkg.id}
                                            onClick={() => { setSelectedPackage(pkg.id); setUseCustom(false); }}
                                            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${selectedPackage === pkg.id && !useCustom
                                                ? creditType === 'RC' ? 'border-blue-500 bg-blue-50/50' : 'border-purple-500 bg-purple-50/50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPackage === pkg.id && !useCustom
                                                    ? creditType === 'RC' ? 'border-blue-500 bg-blue-500' : 'border-purple-500 bg-purple-500'
                                                    : 'border-gray-300'
                                                    }`}>
                                                    {selectedPackage === pkg.id && !useCustom && (
                                                        <Check className="w-3 h-3 text-white" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{pkg.displayName}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {creditType === 'RC' ? pkg.rcAmount : pkg.ecAmount} credits
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">${(pkg.totalPrice || 0).toLocaleString()}</p>
                                                {pkg.popular && (
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                        Popular
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    ))}

                                    {/* Custom Amount */}
                                    <div
                                        className={`p-4 rounded-xl border-2 transition-all ${useCustom
                                            ? creditType === 'RC' ? 'border-blue-500 bg-blue-50/50' : 'border-purple-500 bg-purple-50/50'
                                            : 'border-gray-200'
                                            }`}
                                    >
                                        <button
                                            onClick={() => { setUseCustom(true); setSelectedPackage(null); }}
                                            className="w-full flex items-center gap-4 text-left"
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${useCustom
                                                ? creditType === 'RC' ? 'border-blue-500 bg-blue-500' : 'border-purple-500 bg-purple-500'
                                                : 'border-gray-300'
                                                }`}>
                                                {useCustom && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <p className="font-medium text-gray-900">Custom Amount</p>
                                        </button>

                                        {useCustom && (
                                            <div className="mt-4 flex items-center gap-4 pl-9">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setCustomAmount(Math.max(1, customAmount - 5))}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={customAmount}
                                                    onChange={(e) => setCustomAmount(Math.max(1, parseInt(e.target.value) || 1))}
                                                    className="w-24 text-center"
                                                    min={1}
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setCustomAmount(customAmount + 5)}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                                <span className="text-gray-500">
                                                    = ${(customAmount * (creditType === 'RC' ? rcPricePerCredit : ecPricePerCredit)).toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border shadow-sm p-6 sticky top-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-4 pb-4 border-b">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Credit Type</span>
                                    <span className="font-medium">
                                        {creditType === 'RC' ? 'Respondent Credits' : 'Evidence Credits'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Quantity</span>
                                    <span className="font-medium">{getSelectedCredits()} {creditType}</span>
                                </div>
                            </div>

                            <div className="py-4 border-b">
                                <div className="flex justify-between text-lg">
                                    <span className="font-semibold text-gray-900">Total</span>
                                    <span className="font-bold text-gray-900">
                                        ${getSelectedTotal().toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <Button
                                    onClick={handleCheckout}
                                    disabled={processing || (!selectedPackage && !useCustom)}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    size="lg"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            Proceed to Payment
                                        </>
                                    )}
                                </Button>

                                <Link href="/dashboard/credits">
                                    <Button variant="ghost" className="w-full">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Credits
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-6 pt-4 border-t">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Shield className="w-4 h-4" />
                                    <span>Secure payment via Flutterwave</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            }>
                <CheckoutContent />
            </Suspense>
        </DashboardLayout>
    );
}
