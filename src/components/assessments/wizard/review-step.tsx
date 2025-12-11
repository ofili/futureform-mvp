'use client';

import { WizardData } from './assessment-wizard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Users, FileText, Calendar, Mail } from 'lucide-react';

interface ReviewStepProps {
    data: WizardData;
    projectId?: string;
}

export default function ReviewStep({ data, projectId }: ReviewStepProps) {
    const ASSESSMENT_TYPE_LABELS: Record<string, string> = {
        due_diligence: 'Due Diligence',
        procurement: 'Procurement',
        partnership: 'Partnership Evaluation',
        compliance: 'Compliance Check',
        risk_assessment: 'Risk Assessment',
    };

    const DEPTH_LABELS = {
        quick: 'Quick (15 questions, ~30 min)',
        standard: 'Standard (30 questions, ~1 hour)',
        deep: 'Deep (50 questions, ~2 hours)',
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold">Review Assessment</h3>
            </div>

            <p className="text-sm text-muted-foreground">
                Review your assessment configuration before sending invitations to respondents.
            </p>

            {/* Assessment Details */}
            <Card className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Assessment Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-muted-foreground">Type:</span>
                        <div className="font-medium mt-1">
                            {ASSESSMENT_TYPE_LABELS[data.type] || data.type}
                        </div>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Depth:</span>
                        <div className="font-medium mt-1">{DEPTH_LABELS[data.depth]}</div>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Sector:</span>
                        <div className="font-medium mt-1">{data.sector}</div>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Deadline:</span>
                        <div className="font-medium mt-1">
                            {data.deadline
                                ? new Date(data.deadline).toLocaleDateString()
                                : 'No deadline'}
                        </div>
                    </div>
                    {data.partnerAdminEmail && (
                        <div className="col-span-2">
                            <span className="text-muted-foreground">Partner Admin:</span>
                            <div className="font-medium mt-1 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {data.partnerAdminEmail}
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Questions Summary */}
            <Card className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Questions ({data.selectedQuestions.length})
                </h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {data.selectedQuestions.slice(0, 5).map((question, index) => (
                        <div key={question.id} className="text-sm">
                            <span className="text-muted-foreground mr-2">Q{index + 1}:</span>
                            <span>{question.question.text}</span>
                        </div>
                    ))}
                    {data.selectedQuestions.length > 5 && (
                        <div className="text-sm text-muted-foreground italic">
                            ... and {data.selectedQuestions.length - 5} more questions
                        </div>
                    )}
                </div>
            </Card>

            {/* Partners Summary */}
            <Card className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Partners ({data.partners.length})
                </h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {data.partners.map((partner, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded"
                        >
                            <div>
                                <div className="font-medium">{partner.partnerName}</div>
                                <div className="text-muted-foreground text-xs">
                                    Admin: {partner.adminName} ({partner.adminEmail})
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Next Steps Info */}
            <Card className="p-4 bg-primary/5 border-primary/20">
                <h4 className="font-medium mb-2">What happens next?</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        <span>
                            Invitation emails will be sent to {data.partners.length}{' '}
                            partner admins
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        <span>
                            Partner admins will assign respondents to specific roles
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        <span>
                            Each respondent will see only their assigned questions based on their
                            role
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        <span>
                            You can track progress and verify evidence from the assessment dashboard
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        <span>
                            The assessment will be available in your project overview
                        </span>
                    </li>
                </ul>
            </Card>
        </div>
    );
}
