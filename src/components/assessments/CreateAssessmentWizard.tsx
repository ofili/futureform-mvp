'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserPlus, Mail, Building2, Send, Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { RespondentPricingCalculator } from '@/components/pricing/RespondentPricingCalculator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PartnerSelector } from '@/components/partners/partner-selector';
import { Partner } from '@/hooks/use-partners';

interface CreateAssessmentWizardProps {
    projectId: string;
    onClose: () => void;
}

export default function CreateAssessmentWizard({ projectId, onClose }: CreateAssessmentWizardProps) {
    const [step, setStep] = useState<'INVITE' | 'UPGRADE'>('INVITE');
    const [formData, setFormData] = useState({
        partnerName: '',
        partnerEmail: '',
        partnerAliasId: undefined as string | undefined,
        method: 'SELF_ASSESS'
    });
    const [sending, setSending] = useState(false);
    const [upgradeReason, setUpgradeReason] = useState<string | null>(null);

    // Fetch pricing tiers for the calculator
    const { data: pricingTiers = [] } = useQuery({
        queryKey: ['pricing-tiers'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/tiers');
            if (!response.ok) throw new Error('Failed to fetch tiers');
            const tiers = await response.json();
            return tiers.filter((t: any) => t.isActive);
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
            toast.error(error.message);
        }
    });

    const handleInvite = async () => {
        if (!formData.partnerAliasId && !formData.partnerName) return toast.error('Partner is required');
        if (formData.method === 'SELF_ASSESS' && !formData.partnerEmail) return toast.error('Email is required for self-assessment');

        setSending(true);
        try {
            const res = await fetch('/api/v1/assessments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    projectId,
                    ...formData
                })
            });

            if (res.status === 402) {
                const json = await res.json();
                setUpgradeReason(json.error || 'Insufficient credits');
                setStep('UPGRADE');
                return;
            }

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || 'Failed to invite partner');
            }

            toast.success('Partner invited successfully! 🎉');
            onClose();
            window.location.reload();
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Failed to invite partner');
        } finally {
            setSending(false);
        }
    };

    const handleSelectTier = (tier: any, count: number, cost: number) => {
        // For now, we just use the creditsIncluded from the tier or calculate based on count if it's a respondent bundle
        // Assuming 'credits' endpoint expects number of credits to buy.
        // If the tier is a subscription, checkout logic might be different (subscription mode).
        // But for MVP credit model:
        // If tier has creditsIncluded, use that.

        // Simplified logic: Just buy the credits needed for the tier/bundle.
        // If it's a bundle, we might need to calculate credits.
        // Let's assume 1 credit = 1 assessment for now, or whatever the system uses.
        // The PricingCalculator returns 'cost'.

        // If we are buying a "Plan", we might be starting a subscription.
        // If we are buying "Credits", it's one-off.

        // For this wizard, let's assume we are buying the credits included in the tier.
        if (tier.creditsIncluded > 0) {
            checkoutMutation.mutate(tier.creditsIncluded);
        } else {
            // Fallback or handle custom logic
            toast.error("Please contact sales for this plan.");
        }
    };

    return (
        <Dialog open onOpenChange={() => onClose()}>
            <DialogContent className={`sm:max-w-[${step === 'UPGRADE' ? '900px' : '540px'}] transition-all duration-300`}>
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step === 'UPGRADE' ? 'bg-yellow-100' : 'bg-primary/10'}`}>
                            {step === 'UPGRADE' ? <CreditCard className="h-5 w-5 text-yellow-600" /> : <UserPlus className="h-5 w-5 text-primary" />}
                        </div>
                        <div>
                            <DialogTitle className="text-xl">
                                {step === 'UPGRADE' ? 'Add Credits to Continue' : 'Invite Partner to Assess'}
                            </DialogTitle>
                            <DialogDescription className="text-sm mt-1">
                                {step === 'UPGRADE'
                                    ? 'You need additional credits to invite more partners.'
                                    : 'Add a partner organization to your trust assessment'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {step === 'INVITE' && (
                    <div className="px-6 space-y-5 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                Partner Organization
                            </Label>
                            <PartnerSelector
                                value={formData.partnerAliasId}
                                onChange={(aliasId) => setFormData(prev => ({ ...prev, partnerAliasId: aliasId }))}
                                onPartnerSelect={(partner) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        partnerName: partner.displayName,
                                        partnerAliasId: partner.id
                                    }));
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="method" className="text-sm font-medium">
                                Assessment Method
                            </Label>
                            <select
                                id="method"
                                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.method}
                                onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
                            >
                                <option value="SELF_ASSESS">🤝 Invite Partner to Self-Assess (Collaborative)</option>
                                <option value="INDEPENDENT">📋 Assess Independently (Internal Review)</option>
                            </select>
                            <p className="text-xs text-muted-foreground">
                                {formData.method === 'SELF_ASSESS'
                                    ? 'Partner will receive an invitation to complete the assessment themselves'
                                    : 'You will assess the partner internally without their direct input'}
                            </p>
                        </div>

                        {formData.method === 'SELF_ASSESS' && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    Partner Contact Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="contact@partner.com"
                                    value={formData.partnerEmail}
                                    onChange={(e) => setFormData(prev => ({ ...prev, partnerEmail: e.target.value }))}
                                    className="h-11"
                                />
                                <div className="flex items-start gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3 border border-blue-200 dark:border-blue-900">
                                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        They will receive an email with a secure link to complete the trust assessment
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 'UPGRADE' && (
                    <div className="px-6 space-y-6 py-4">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Insufficient Credits</AlertTitle>
                            <AlertDescription>
                                {upgradeReason || 'You do not have enough credits to perform this action.'}
                            </AlertDescription>
                        </Alert>

                        <RespondentPricingCalculator />
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose} disabled={sending} className="h-11">
                        Cancel
                    </Button>
                    {step === 'INVITE' && (
                        <Button onClick={handleInvite} disabled={sending} className="h-11 min-w-[140px]">
                            {sending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Invitation
                                </>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
