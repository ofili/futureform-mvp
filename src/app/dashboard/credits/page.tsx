'use client';

import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/shared/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RCDashboard } from '@/components/credits/rc-dashboard';
import { ECDashboard } from '@/components/credits/ec-dashboard';
import { PaymentHistory } from '@/components/billing/PaymentHistory';
import { Button } from '@/components/ui/button';
import { Loader2, Users, Zap, History, CreditCard, ChevronRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CreditsPage() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            </DashboardLayout>
        );
    }

    if (!session?.user?.organizationId) {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
                    <div className="p-6">
                        <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
                            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Organization Required</h3>
                            <p className="text-gray-500">You need to belong to an organization to view credits.</p>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
                <div className="p-6 space-y-6">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1 text-sm text-gray-500">
                        <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-900 font-medium">Credits & Billing</span>
                    </nav>

                    {/* Header */}
                    <div className="bg-white rounded-xl border shadow-sm p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <CreditCard className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900">Credits & Billing</h1>
                                    <p className="text-gray-500">Manage your Respondent and Evidence credits</p>
                                </div>
                            </div>
                            <Link href="/dashboard/credits/checkout">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Purchase Credits
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="rc" className="space-y-6">
                        <div className="bg-white rounded-xl border shadow-sm p-2">
                            <TabsList className="grid w-full grid-cols-3 bg-gray-100/50">
                                <TabsTrigger value="rc" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    <Users className="w-4 h-4" />
                                    <span className="hidden sm:inline">Respondent Credits</span>
                                    <span className="sm:hidden">RC</span>
                                </TabsTrigger>
                                <TabsTrigger value="ec" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    <Zap className="w-4 h-4" />
                                    <span className="hidden sm:inline">Evidence Credits</span>
                                    <span className="sm:hidden">EC</span>
                                </TabsTrigger>
                                <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    <History className="w-4 h-4" />
                                    <span className="hidden sm:inline">Payment History</span>
                                    <span className="sm:hidden">History</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="rc" className="space-y-4">
                            <div className="bg-white rounded-xl border shadow-sm p-6">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                                    <h3 className="font-semibold text-blue-800 mb-1">About Respondent Credits</h3>
                                    <p className="text-sm text-blue-700">
                                        RCs are used to invite respondents to take assessments. 1 RC = 1 Respondent Invite.
                                        Credits never expire as long as your account is active.
                                    </p>
                                </div>
                                <RCDashboard organizationId={session.user.organizationId} />
                            </div>
                        </TabsContent>

                        <TabsContent value="ec" className="space-y-4">
                            <div className="bg-white rounded-xl border shadow-sm p-6">
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-6">
                                    <h3 className="font-semibold text-purple-800 mb-1">About Evidence Credits</h3>
                                    <p className="text-sm text-purple-700">
                                        ECs are used for processing evidence (AE, VE, DSE). Costs vary by evidence type and complexity.
                                        Enable auto-reload to ensure uninterrupted evidence processing.
                                    </p>
                                </div>
                                <ECDashboard organizationId={session.user.organizationId} />
                            </div>
                        </TabsContent>

                        <TabsContent value="history" className="space-y-4">
                            <div className="bg-white rounded-xl border shadow-sm p-6">
                                <PaymentHistory organizationId={session.user.organizationId} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </DashboardLayout>
    );
}
