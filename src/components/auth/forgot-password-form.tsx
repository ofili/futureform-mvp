'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AuthCard } from './auth-card';

export function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const resetMutation = useMutation({
        mutationFn: async (email: string) => {
            const response = await fetch('/api/v1/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (!response.ok) throw new Error('Failed to send reset email');
            return response.json();
        },
        onSuccess: () => setSent(true)
    });

    if (sent) {
        return (
            <AuthCard title="Check Your Email">
                <div className="text-center space-y-4">
                    <Mail className="w-12 h-12 mx-auto text-green-600" />
                    <p className="text-muted-foreground">
                        We've sent a password reset link to {email}
                    </p>
                    <Link href="/auth/login">
                        <Button variant="outline" className="w-full">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </Button>
                    </Link>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard title="Reset Password">
            <form onSubmit={(e) => {
                e.preventDefault();
                resetMutation.mutate(email);
            }} className="space-y-4">
                <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    className="w-full"
                    disabled={resetMutation.isPending}
                >
                    {resetMutation.isPending ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <Link href="/auth/login">
                    <Button variant="ghost" className="w-full">
                        Back to Login
                    </Button>
                </Link>
            </form>
        </AuthCard>
    );
}
