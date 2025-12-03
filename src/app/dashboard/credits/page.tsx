'use client';

import { useSession } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RCDashboard } from '@/components/credits/rc-dashboard';
import { ECDashboard } from '@/components/credits/ec-dashboard';
import { PaymentHistory } from '@/components/billing/PaymentHistory';
import { Loader2 } from 'lucide-react';

export default function CreditsPage() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!session?.user?.organizationId) {
        return (
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Organization Required</CardTitle>
                        <CardDescription>
                            You need to belong to an organization to view credits.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Credits & Billing</h1>
                    <p className="text-muted-foreground">
                        Manage your Respondent and Evidence credits
                    </p>
                </div>
            </div>

            <Tabs defaultValue="rc" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="rc">Respondent Credits (RC)</TabsTrigger>
                    <TabsTrigger value="ec">Evidence Credits (EC)</TabsTrigger>
                    <TabsTrigger value="history">Payment History</TabsTrigger>
                </TabsList>

                <TabsContent value="rc" className="space-y-4">
                    <div className="grid gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">About Respondent Credits</h3>
                            <p className="text-sm text-blue-700 dark:text-blue-400">
                                RCs are used to invite respondents to take assessments. 1 RC = 1 Respondent Invite.
                                Credits never expire as long as your account is active.
                            </p>
                        </div>
                        <RCDashboard organizationId={session.user.organizationId} />
                    </div>
                </TabsContent>

                <TabsContent value="ec" className="space-y-4">
                    <div className="grid gap-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                            <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-1">About Evidence Credits</h3>
                            <p className="text-sm text-purple-700 dark:text-purple-400">
                                ECs are used for processing evidence (AE, VE, DSE). Costs vary by evidence type and complexity.
                                Enable auto-reload to ensure uninterrupted evidence processing.
                            </p>
                        </div>
                        <ECDashboard organizationId={session.user.organizationId} />
                    </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    <PaymentHistory organizationId={session.user.organizationId} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
