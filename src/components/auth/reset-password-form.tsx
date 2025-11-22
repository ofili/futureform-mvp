'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle } from 'lucide-react';
import { AuthCard } from './auth-card';

export function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            router.push('/auth/login');
        }
    }, [token, router]);

    const resetMutation = useMutation({
        mutationFn: async ({ password, token }: { password: string; token: string }) => {
            const response = await fetch('/api/v1/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, token })
            });
            if (!response.ok) throw new Error('Failed to reset password');
            return response.json();
        },
        onSuccess: () => setSuccess(true)
    });

    if (success) {
        return (
            <AuthCard title="Password Reset Successful">
                <div className="text-center space-y-4">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-600" />
                    <Button onClick={() => router.push('/auth/login')} className="w-full">
                        Continue to Login
                    </Button>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard title="Set New Password">
            <form onSubmit={(e) => {
                e.preventDefault();
                if (password !== confirmPassword) return;
                resetMutation.mutate({ password, token: token! });
            }} className="space-y-4">
                <Input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                />
                <Input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                {password !== confirmPassword && confirmPassword && (
                    <p className="text-sm text-red-600">Passwords don't match</p>
                )}
                <Button
                    type="submit"
                    className="w-full"
                    disabled={resetMutation.isPending || password !== confirmPassword}
                >
                    {resetMutation.isPending ? 'Resetting...' : 'Reset Password'}
                </Button>
            </form>
        </AuthCard>
    );
}
