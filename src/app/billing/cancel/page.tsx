'use client';

import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentCancelPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <XCircle className="h-8 w-8 text-orange-600" />
                        <div>
                            <CardTitle>Payment Cancelled</CardTitle>
                            <CardDescription>You cancelled the payment process</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                        <p className="text-sm text-orange-800">
                            Your payment was not processed. No charges have been made to your account.
                        </p>
                    </div>

                    <div className="text-center text-sm text-gray-600">
                        <p>If you encountered any issues or need assistance, please contact our support team.</p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex-1"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Button>
                        <Button
                            onClick={() => router.push('/dashboard/credits')}
                            className="flex-1"
                        >
                            Dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
