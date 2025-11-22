'use client';

import { useState, Suspense } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, History, AlertCircle, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSearchParams } from 'next/navigation';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { RequestPurchaseModal } from '@/components/dashboard/request-purchase-modal';

interface PricingTier {
    id: string;
    name: string;
    displayName: string;
    priceUSD: number | null;
    pricePeriod: string | null;
    creditsIncluded: number;
    bestFor: string | null;
    description: string | null;
    isActive: boolean;
    displayOrder: number;
    features: { id: string; feature: string; displayOrder: number }[];
    cta: string;
    ctaVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

function CreditsPageContent() {
    const user = useAuthStore((s) => s.user);
    const searchParams = useSearchParams();
    const success = searchParams.get('success');
    const [requestModalOpen, setRequestModalOpen] = useState(false);
    const [selectedTierForRequest, setSelectedTierForRequest] = useState('');

    const { data: creditBalance } = useQuery({
        queryKey: ['credit-balance'],
        queryFn: async () => {
            const response = await fetch('/api/v1/billing/credits');
            if (!response.ok) throw new Error('Failed to fetch credits');
            return response.json();
        }
    });

    const { data: pricingTiers = [], isLoading: tiersLoading } = useQuery<PricingTier[]>({
        queryKey: ['pricing-tiers'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/tiers');
            if (!response.ok) throw new Error('Failed to fetch tiers');
            const tiers = await response.json();
            return tiers.filter((t: PricingTier) => t.isActive);
        }
    });


    const { data: billingHistory } = useQuery({
        queryKey: ['billing-history'],
        queryFn: async () => {
            const response = await fetch('/api/v1/billing/history');
            if (!response.ok) throw new Error('Failed to fetch history');
            return response.json();
        }
    });

    const checkoutMutation = useMutation({
        mutationFn: async (credits: number) => {
            const response = await fetch('/api/v1/billing/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credits })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Checkout failed');
            }
            return response.json();
        },
        onSuccess: (data) => {
            if (data.url) {
                window.location.href = data.url;
            }
        },
        onError: (error) => {
            alert(error.message);
        }
    });

    // Check if user has permission to buy credits/manage plan
    // Allowed: CREDIT_MANAGER, ADMIN (Org or Global), OWNER
    const canManageCredits = user?.role === 'ADMIN' || ['CREDIT_MANAGER', 'ADMIN', 'OWNER'].includes(user?.organizationRole || '');

    const handleCtaClick = (tier: PricingTier) => {
        if (tier.name === 'Framework Access') {
            // Logic for downloading framework (e.g., redirect to a file or open a modal)
            alert('Download Framework logic to be implemented');
            return;
        }

        if (!canManageCredits) {
            setSelectedTierForRequest(tier.name);
            setRequestModalOpen(true);
            return;
        }

        if (tier.name === 'Guided Assessment') {
            checkoutMutation.mutate(tier.creditsIncluded);
        } else if (tier.name === 'Enterprise Program') {
            // Logic for contacting sales
            window.location.href = 'mailto:sales@futureform.com';
        }
    };

    // Determine current tier name safely
    const currentTierName = user?.tier || 'Framework Access';

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Assessment Credits & Plans</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your subscription and purchase assessment credits.
                    </p>
                </div>
                {creditBalance && (
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
                            <span className="font-bold text-2xl text-primary">{creditBalance.balance}</span>
                            <span className="text-sm font-medium text-muted-foreground">Credits Available</span>
                        </div>
                    </div>
                )}
            </div>

            {success && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                        Your credits have been successfully added to your account.
                    </AlertDescription>
                </Alert>
            )}

            {/* Pricing Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingTiers.map((tier) => {
                    const isCurrentPlan = currentTierName === tier.name;
                    // Restrict access for non-free tiers if user is not authorized
                    const isRestricted = tier.name !== 'Framework Access' && !canManageCredits;

                    return (
                        <Card
                            key={tier.id}
                            className={`flex flex-col ${isCurrentPlan
                                    ? 'border-primary border-2 shadow-lg relative'
                                    : tier.name === 'Guided Assessment'
                                        ? 'border-primary/50 shadow-md'
                                        : ''
                                } ${tier.name === 'Guided Assessment' && !isCurrentPlan ? 'scale-105' : ''}`}
                        >
                            {isCurrentPlan && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                                    Current Plan
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle>{tier.displayName}</CardTitle>
                                <CardDescription>{tier.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="text-3xl font-bold mb-4">
                                    {tier.priceUSD !== null ? `$${tier.priceUSD}` : 'Custom'}
                                    {tier.pricePeriod && <span className="text-sm font-normal text-muted-foreground">/{tier.pricePeriod}</span>}
                                </div>
                                <ul className="space-y-2">
                                    {tier.features.sort((a, b) => a.displayOrder - b.displayOrder).map((f) => (
                                        <li key={f.id} className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">{f.feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    variant={isCurrentPlan ? "secondary" : tier.ctaVariant}
                                    onClick={() => handleCtaClick(tier)}
                                    disabled={(checkoutMutation.isPending && tier.name === 'Guided Assessment') || isCurrentPlan}
                                >
                                    {checkoutMutation.isPending && tier.name === 'Guided Assessment' ? 'Processing...' :
                                        isCurrentPlan ? 'Current Plan' :
                                            (isRestricted ? `Request ${tier.name}` : tier.cta)
                                    }
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {/* History Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="w-5 h-5" />
                        Transaction History
                    </CardTitle>
                    <CardDescription>
                        View your organization's credit purchases and usage.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {billingHistory?.payments?.length > 0 ? (
                        <div className="rounded-md border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3 text-right">Credits</th>
                                        <th className="px-4 py-3 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {billingHistory.payments.map((payment: any) => (
                                        <tr key={payment.id} className="hover:bg-muted/50">
                                            <td className="px-4 py-3">
                                                {new Date(payment.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 capitalize">{payment.type.toLowerCase()}</td>
                                            <td className="px-4 py-3">{payment.user}</td>
                                            <td className={`px-4 py-3 text-right font-medium ${payment.type === 'PURCHASE' ? 'text-green-600' : 'text-red-600'
                                                }`}>
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
                        <div className="text-center py-12 text-muted-foreground">
                            No transaction history found.
                        </div>
                    )}
                </CardContent>
            </Card>

            <RequestPurchaseModal
                isOpen={requestModalOpen}
                onClose={() => setRequestModalOpen(false)}
                tierName={selectedTierForRequest}
            />
        </div>
    );
}

export default function CreditsPage() {
    return (
        <Suspense fallback={
            <div className="space-y-8">
                <div className="text-center py-12 text-muted-foreground">
                    Loading...
                </div>
            </div>
        }>
            <DashboardLayout>
                <CreditsPageContent />
            </DashboardLayout>
        </Suspense>
    );
}
