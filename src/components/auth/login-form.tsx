'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { toast } from 'sonner';

export function LoginFormContent() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });
            if (result?.error) {
                toast.error('Invalid credentials');
                setIsLoading(false);
                return;
            }

            // Fetch the session to check user role
            const response = await fetch('/api/auth/session');
            const session = await response.json();

            // Redirect based on role
            let defaultRedirect = '/dashboard';
            if (session?.user?.role === 'ADMIN') {
                defaultRedirect = '/admin';
            } else if (session?.user?.role === 'PARTNER') {
                defaultRedirect = '/partner';
            }

            const redirect = searchParams.get('redirect') || defaultRedirect;

            router.push(redirect);
            router.refresh();
        } catch (error) {
            toast.error('Login failed');
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
            />
            <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-center space-y-2">
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline block">
                    Forgot your password?
                </Link>
                <Link href="/auth/register" className="text-sm text-blue-600 hover:underline block">
                    Don't have an account? Sign up
                </Link>
            </div>
        </form>
    );
}

export default function LoginForm() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center">Loading...</div></div>}>
            <LoginFormContent />
        </Suspense>
    );
}
