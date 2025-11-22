'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import Logo from '@/components/Logo';
import { toast } from 'sonner';

interface FormOption {
    id: string;
    value: string;
    label: string;
    displayOrder: number;
}

function JoinPageContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        jobTitle: '',
        department: ''
    });

    const { data: invitation, isLoading, isError } = useQuery({
        queryKey: ['invitation', token],
        queryFn: async () => {
            if (!token) throw new Error('No token provided');
            const response = await fetch(`/api/v1/auth/join?token=${token}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Invalid invitation');
            }
            return response.json();
        },
        enabled: !!token,
        retry: false
    });

    const { data: departments = [] } = useQuery<FormOption[]>({
        queryKey: ['form-options', 'department'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/form-options?category=department');
            if (!response.ok) return [];
            return response.json();
        }
    });

    const joinMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/v1/auth/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    ...formData
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to join');
            }
            return response.json();
        },
        onSuccess: (data) => {
            toast.success('Account created successfully');
            // Redirect to login with email prefilled if possible, or just login
            router.push('/auth/login?email=' + encodeURIComponent(invitation.email));
        },
        onError: (error) => {
            toast.error('Failed to join', { description: error.message });
        }
    });

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center">
                        <p className="text-red-600">Invalid invitation link.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">Loading invitation...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center">
                        <p className="text-red-600">This invitation is invalid or has expired.</p>
                        <Button className="mt-4" onClick={() => router.push('/auth/login')}>
                            Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <Logo />
            </div>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Join {invitation.organizationName}</CardTitle>
                    <CardDescription>
                        Create your account to join the team.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        joinMutation.mutate();
                    }} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input value={invitation.email} disabled className="bg-muted" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First Name</label>
                                <Input
                                    required
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last Name</label>
                                <Input
                                    required
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Job Title</label>
                            <Input
                                required
                                value={formData.jobTitle}
                                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Department</label>
                            <NativeSelect
                                required
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.value}>{dept.label}</option>
                                ))}
                            </NativeSelect>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                type="password"
                                required
                                minLength={8}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Confirm Password</label>
                            <Input
                                type="password"
                                required
                                minLength={8}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>

                        {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <p className="text-sm text-red-600">Passwords do not match</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={joinMutation.isPending || formData.password !== formData.confirmPassword}
                        >
                            {joinMutation.isPending ? 'Creating Account...' : 'Join Organization'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function JoinPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">Loading...</div>
            </div>
        }>
            <JoinPageContent />
        </Suspense>
    );
}
