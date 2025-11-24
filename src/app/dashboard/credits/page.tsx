'use client';

import { useState, Suspense } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, History, CreditCard, ShieldCheck, Users } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PricingTier {
    id: string;
    name: string;
    displayName: string;
    priceUSD: number | null;
    pricePeriod: string | null;
    creditsIncluded: number;
    description: string | null;
    features: { id: string; feature: string; displayOrder: number }[];
}

interface CreditPackage {
    id: string;
    packageName: string;
    type: string;
    creditAmount: number;
    priceUSD: number;
}

function BillingPageContent() {
    const user = useAuthStore((s) => s.user);
    const searchParams = useSearchParams();
    const success = searchParams.get('success');

    // Fetch Current Tier Info
    const { data: tiers } = useQuery<PricingTier[]>({
        queryKey: ['billing-tiers'],
        queryFn: async () => {
            const res = await fetch('/api/v1/billing/tiers');
            if (!res.ok) throw new Error('Failed to fetch tiers');
            return res.json();
        }
    });

    // Fetch Credit Packages
    const { data: packages } = useQuery<CreditPackage[]>({
        queryKey: ['billing-packages'],
        queryFn: async () => {
            const res = await fetch('/api/v1/billing/packages');
            if (!res.ok) throw new Error('Failed to fetch packages');
            return res.json();
        }
    });

    // Fetch Credit Balance
    const { data: creditBalance } = useQuery({
        queryKey: ['credit-balance'],
        queryFn: async () => {
            const res = await fetch('/api/v1/billing/credits');
            if (!res.ok) throw new Error('Failed to fetch credits');
            return res.json();
        }
    });

    // Fetch History
    const { data: history } = useQuery({
        queryKey: ['billing-history'],
        queryFn: async () => {
            const res = await fetch('/api/v1/billing/history');
            if (!res.ok) throw new Error('Failed to fetch history');
            return res.json();
        }
    });

    const checkoutMutation = useMutation({
        mutationFn: async (payload: { credits?: number; tierId?: string }) => {
            const res = await fetch('/api/v1/billing/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Checkout failed');
            }
            return res.json();
        },
        onSuccess: (data) => {
            if (data.url) {
                // toast.loading('Redirecting to payment gateway...'); // Assuming toast is available or just let it redirect
                window.location.href = data.url;
            }
        },
        onError: (err) => alert(err.message) // Could use toast.error here if available
    });

    // Determine current tier
    // Note: In a real app, we'd match user.tierId to tiers list.
    // For MVP, we use name matching or default to Free.
    const currentTierName = user?.tier || 'Free';
    const currentTier = tiers?.find(t => t.name === currentTierName) || tiers?.find(t => t.name === 'Free');

    const canPurchase = user?.role === 'ADMIN' || ['OWNER', 'ADMIN', 'CREDIT_MANAGER'].includes(user?.organizationRole || '');

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your subscription and respondent credits.
                    </p>
                </div>
                {creditBalance && (
                    <div className="flex flex-col items-end bg-white p-4 rounded-lg border shadow-sm">
                        <span className="text-sm text-muted-foreground">Available Credits</span>
                        <span className="text-3xl font-bold text-blue-600">{creditBalance.balance}</span>
                    </div>
                )}
            </div>

            {success && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Credits successfully added to your account.</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Current Plan Card */}
                <Card className="flex flex-col h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-blue-600" />
                            Current Plan
                        </CardTitle>
                        <CardDescription>Your organization's subscription tier.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold">{currentTier?.displayName || 'Free'}</h3>
                                <p className="text-muted-foreground">{currentTier?.description}</p>
                            </div>
                            <Badge variant="secondary" className="text-sm">Active</Badge>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium text-sm text-gray-900">Included Features:</p>
                            <ul className="space-y-1">
                                {currentTier?.features.map(f => (
                                    <li key={f.id} className="flex items-center gap-2 text-sm text-gray-600">
                                        <Check className="h-4 w-4 text-green-500" />
                                        {f.feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t p-4 flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">
                            Need more features?
                        </p>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">Upgrade Plan</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Upgrade your Plan</DialogTitle>
                                    <DialogDescription>
                                        Choose a plan that fits your needs.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    {tiers?.filter(t => t.name !== currentTierName).map(tier => (
                                        <div key={tier.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                            <div>
                                                <h4 className="font-semibold">{tier.displayName}</h4>
                                                <p className="text-sm text-muted-foreground">{tier.description}</p>
                                                <p className="text-sm font-medium mt-1">
                                                    {tier.priceUSD ? `$${tier.priceUSD}/${tier.pricePeriod}` : 'Contact Sales'}
                                                </p>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    if (tier.priceUSD) {
                                                        checkoutMutation.mutate({ tierId: tier.id });
                                                    } else {
                                                        window.location.href = '/contact?subject=Enterprise%20Plan';
                                                    }
                                                }}
                                                disabled={checkoutMutation.isPending}
                                            >
                                                {tier.priceUSD ? 'Upgrade' : 'Contact'}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </Card>

                {/* Purchase Credits Card */}
                <Card className="flex flex-col h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            Purchase Respondent Bundles
                        </CardTitle>
                        <CardDescription>Add more respondents to your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="space-y-4">
                            {packages?.filter(p => p.type === 'RESPONDENT_BUNDLE').map(pkg => (
                                <div key={pkg.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div>
                                        <p className="font-medium">{pkg.packageName}</p>
                                        <p className="text-sm text-muted-foreground">{pkg.creditAmount} Respondents</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold">${pkg.priceUSD}</span>
                                        <Button
                                            size="sm"
                                            onClick={() => checkoutMutation.mutate({ credits: pkg.creditAmount })}
                                            disabled={!canPurchase || checkoutMutation.isPending}
                                        >
                                            {checkoutMutation.isPending ? '...' : 'Buy'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {(!packages || packages.length === 0) && (
                                <p className="text-sm text-muted-foreground text-center py-4">No bundles available.</p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t p-4">
                        <p className="text-xs text-muted-foreground">
                            {!canPurchase ? "You need Admin or Owner permissions to purchase credits." : "Purchases are processed securely via Stripe."}
                        </p>
                    </CardFooter>
                </Card>
            </div>

            {/* Transaction History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Transaction History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {history?.payments?.length > 0 ? (
                        <div className="rounded-md border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3 text-right">Amount</th>
                                        <th className="px-4 py-3 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {history.payments.map((payment: any) => (
                                        <tr key={payment.id} className="hover:bg-muted/50">
                                            <td className="px-4 py-3">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 capitalize">{payment.type.toLowerCase()}</td>
                                            <td className="px-4 py-3">{payment.user}</td>
                                            <td className={`px-4 py-3 text-right font-medium ${payment.type === 'PURCHASE' ? 'text-green-600' : 'text-red-600'}`}>
                                                {payment.type === 'PURCHASE' ? '+' : '-'}{payment.amount}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    {payment.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">No transaction history found.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function BillingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardLayout>
                <BillingPageContent />
            </DashboardLayout>
        </Suspense>
    );
}
