'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
    Loader2,
    Users,
    FileText,
    CheckCircle2,
    XCircle,
    Clock,
    Mail,
    Download,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CoPilotPanel } from '@/components/copilot/CoPilotPanel';


interface PartnerAdminDashboardProps {
    assessmentId: string;
}

export default function PartnerAdminDashboard({
    assessmentId,
}: PartnerAdminDashboardProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [assessment, setAssessment] = useState<any>(null);
    const [invitations, setInvitations] = useState<any[]>([]);
    const [responses, setResponses] = useState<any[]>([]);
    const [evidence, setEvidence] = useState<any[]>([]);
    const [selectedEvidence, setSelectedEvidence] = useState<any>(null);
    const [verificationNotes, setVerificationNotes] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, [assessmentId]);

    const fetchDashboardData = async () => {
        try {
            // Fetch assessment details
            const assessmentRes = await fetch(`/api/v1/assessments/${assessmentId}`);
            const assessmentData = await assessmentRes.json();
            setAssessment(assessmentData.assessment);

            // Fetch invitations
            const invitationsRes = await fetch(
                `/api/v1/assessments/${assessmentId}/invitations`
            );
            const invitationsData = await invitationsRes.json();
            setInvitations(invitationsData.invitations);

            // Fetch all responses
            const responsesRes = await fetch(
                `/api/v1/assessments/${assessmentId}/responses`
            );
            const responsesData = await responsesRes.json();
            setResponses(responsesData.responses);

            // Fetch all evidence
            const evidenceRes = await fetch(
                `/api/v1/assessments/${assessmentId}/evidence`
            );
            const evidenceData = await evidenceRes.json();
            setEvidence(evidenceData.evidence);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyEvidence = async (evidenceId: string, status: string) => {
        try {
            const response = await fetch(`/api/v1/evidence/${evidenceId}/verify`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    notes: verificationNotes,
                }),
            });

            if (!response.ok) throw new Error('Failed to verify evidence');

            // Refresh data
            await fetchDashboardData();
            setSelectedEvidence(null);
            setVerificationNotes('');
            alert(`Evidence ${status.toLowerCase()} successfully`);
        } catch (error) {
            console.error('Error verifying evidence:', error);
            alert('Failed to verify evidence');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    const completedResponses = responses.filter((r) => r.status === 'SUBMITTED').length;
    const totalQuestions = assessment?.assessmentQuestions?.length || 0;
    const progress = totalQuestions > 0 ? (completedResponses / totalQuestions) * 100 : 0;

    const pendingEvidence = evidence.filter((e) => e.verificationStatus === 'PENDING');
    const acceptedInvitations = invitations.filter((i) => i.status === 'ACCEPTED');

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Assessment Dashboard</h1>
                <p className="text-muted-foreground">{assessment?.project?.name}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Respondents</p>
                                <p className="text-2xl font-bold">
                                    {acceptedInvitations.length}/{invitations.length}
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Responses</p>
                                <p className="text-2xl font-bold">
                                    {completedResponses}/{totalQuestions}
                                </p>
                            </div>
                            <FileText className="w-8 h-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending Evidence</p>
                                <p className="text-2xl font-bold">{pendingEvidence.length}</p>
                            </div>
                            <Clock className="w-8 h-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Progress</p>
                                <p className="text-2xl font-bold">{Math.round(progress)}%</p>
                            </div>
                            <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* AI Co-Pilot Panel */}
            <div className="mb-8">
                <CoPilotPanel 
                    assessmentId={assessmentId} 
                    assessmentName={assessment?.project?.name}
                />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="invitations" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="invitations">Invitations</TabsTrigger>
                    <TabsTrigger value="responses">Responses</TabsTrigger>
                    <TabsTrigger value="evidence">Evidence</TabsTrigger>
                </TabsList>

                {/* Invitations Tab */}
                <TabsContent value="invitations" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Respondent Invitations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {invitations.map((invitation) => (
                                    <div
                                        key={invitation.id}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium">{invitation.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {invitation.email}
                                            </div>
                                            {invitation.role && (
                                                <Badge variant="outline" className="mt-2">
                                                    {invitation.role.name}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge
                                                variant={
                                                    invitation.status === 'ACCEPTED'
                                                        ? 'default'
                                                        : invitation.status === 'PENDING'
                                                            ? 'secondary'
                                                            : 'destructive'
                                                }
                                            >
                                                {invitation.status}
                                            </Badge>
                                            {invitation.status === 'PENDING' && (
                                                <Button variant="outline" size="sm">
                                                    <Mail className="w-4 h-4 mr-2" />
                                                    Resend
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Responses Tab */}
                <TabsContent value="responses" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Assessment Responses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {responses.map((response) => (
                                    <div key={response.id} className="border rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="font-medium">{response.question.text}</div>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    Answered by: {response.user?.firstName}{' '}
                                                    {response.user?.lastName}
                                                </div>
                                            </div>
                                            <Badge
                                                variant={
                                                    response.status === 'SUBMITTED' ? 'default' : 'secondary'
                                                }
                                            >
                                                {response.status}
                                            </Badge>
                                        </div>
                                        <div className="bg-muted/50 p-3 rounded mt-3">
                                            <p className="text-sm">{response.answer}</p>
                                        </div>
                                        {response.evidenceUploads?.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-sm font-medium mb-2">Evidence:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {response.evidenceUploads.map((ev: any) => (
                                                        <Badge key={ev.id} variant="outline">
                                                            {ev.fileName}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Evidence Tab */}
                <TabsContent value="evidence" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Evidence List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Evidence Files</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                    {evidence.map((ev) => (
                                        <div
                                            key={ev.id}
                                            className={`p-3 border rounded cursor-pointer hover:bg-muted/50 ${selectedEvidence?.id === ev.id ? 'bg-muted' : ''
                                                }`}
                                            onClick={() => setSelectedEvidence(ev)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="font-medium text-sm">{ev.fileName}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Uploaded by: {ev.uploader?.firstName}{' '}
                                                        {ev.uploader?.lastName}
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant={
                                                        ev.verificationStatus === 'APPROVED'
                                                            ? 'default'
                                                            : ev.verificationStatus === 'REJECTED'
                                                                ? 'destructive'
                                                                : 'secondary'
                                                    }
                                                    className="text-xs"
                                                >
                                                    {ev.verificationStatus}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Evidence Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Evidence Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {selectedEvidence ? (
                                    <div className="space-y-4">
                                        <div>
                                            <Label>File Name</Label>
                                            <p className="text-sm mt-1">{selectedEvidence.fileName}</p>
                                        </div>

                                        <div>
                                            <Label>Uploaded By</Label>
                                            <p className="text-sm mt-1">
                                                {selectedEvidence.uploader?.firstName}{' '}
                                                {selectedEvidence.uploader?.lastName} (
                                                {selectedEvidence.uploader?.email})
                                            </p>
                                        </div>

                                        <div>
                                            <Label>Upload Date</Label>
                                            <p className="text-sm mt-1">
                                                {new Date(selectedEvidence.uploadedAt).toLocaleString()}
                                            </p>
                                        </div>

                                        <div>
                                            <Label>Status</Label>
                                            <div className="mt-1">
                                                <Badge
                                                    variant={
                                                        selectedEvidence.verificationStatus === 'APPROVED'
                                                            ? 'default'
                                                            : selectedEvidence.verificationStatus === 'REJECTED'
                                                                ? 'destructive'
                                                                : 'secondary'
                                                    }
                                                >
                                                    {selectedEvidence.verificationStatus}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div>
                                            <Button variant="outline" className="w-full" asChild>
                                                <a
                                                    href={selectedEvidence.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download File
                                                </a>
                                            </Button>
                                        </div>

                                        {selectedEvidence.verificationStatus === 'PENDING' && (
                                            <>
                                                <div className="space-y-2">
                                                    <Label htmlFor="notes">Verification Notes</Label>
                                                    <Textarea
                                                        id="notes"
                                                        placeholder="Add notes about this evidence..."
                                                        value={verificationNotes}
                                                        onChange={(e) => setVerificationNotes(e.target.value)}
                                                        rows={3}
                                                    />
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() =>
                                                            handleVerifyEvidence(selectedEvidence.id, 'APPROVED')
                                                        }
                                                        className="flex-1"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        onClick={() =>
                                                            handleVerifyEvidence(selectedEvidence.id, 'REJECTED')
                                                        }
                                                        variant="destructive"
                                                        className="flex-1"
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </>
                                        )}

                                        {selectedEvidence.verificationNotes && (
                                            <div>
                                                <Label>Verification Notes</Label>
                                                <p className="text-sm mt-1 bg-muted p-3 rounded">
                                                    {selectedEvidence.verificationNotes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        Select an evidence file to view details
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
