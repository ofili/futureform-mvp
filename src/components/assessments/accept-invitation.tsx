'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface AcceptInvitationProps {
    token: string;
}

export default function AcceptInvitation({ token }: AcceptInvitationProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [invitation, setInvitation] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isAccepting, setIsAccepting] = useState(false);

    useEffect(() => {
        fetchInvitation();
    }, [token]);

    const fetchInvitation = async () => {
        try {
            const response = await fetch(`/api/v1/invitations/${token}`);

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Invalid invitation');
            }

            const data = await response.json();
            setInvitation(data.invitation);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccept = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsAccepting(true);
        setError(null);

        try {
            const response = await fetch(`/api/v1/invitations/${token}/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to accept invitation');
            }

            const data = await response.json();

            // Redirect to respondent workspace
            router.push(`/assessments/${data.assessment.id}/respond`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsAccepting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground">Loading invitation...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error && !invitation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center py-8">
                            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Invalid Invitation</h3>
                            <p className="text-muted-foreground text-center">{error}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (invitation?.status === 'ACCEPTED') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center py-8">
                            <CheckCircle2 className="w-12 h-12 text-green-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Already Accepted</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                This invitation has already been accepted.
                            </p>
                            <Button onClick={() => router.push('/login')}>
                                Go to Login
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Assessment Invitation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Invitation Details */}
                    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                        <div>
                            <span className="text-sm text-muted-foreground">Project:</span>
                            <div className="font-medium">{invitation?.project.name}</div>
                        </div>
                        {invitation?.project.description && (
                            <div>
                                <span className="text-sm text-muted-foreground">Description:</span>
                                <div className="text-sm">{invitation.project.description}</div>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Your Email:</span>
                                <div className="font-medium">{invitation?.email}</div>
                            </div>
                            {invitation?.role && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Role:</span>
                                    <div className="font-medium">{invitation.role.name}</div>
                                </div>
                            )}
                            {invitation?.seniority && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Seniority:</span>
                                    <div className="font-medium">{invitation.seniority}</div>
                                </div>
                            )}
                            {invitation?.expiresAt && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Expires:</span>
                                    <div className="font-medium">
                                        {new Date(invitation.expiresAt).toLocaleDateString()}
                                    </div>
                                </div>
                            )}
                        </div>
                        {invitation?.notes && (
                            <div>
                                <span className="text-sm text-muted-foreground">Notes:</span>
                                <div className="text-sm bg-background p-3 rounded mt-1">
                                    {invitation.notes}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Password Setup */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Create Your Account</h3>
                            <p className="text-sm text-muted-foreground">
                                Set a password to access your assessment workspace
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password (min. 8 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="bg-destructive/10 text-destructive p-3 rounded text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            onClick={handleAccept}
                            disabled={!password || !confirmPassword || isAccepting}
                            className="flex-1"
                        >
                            {isAccepting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Accepting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Accept & Continue
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
