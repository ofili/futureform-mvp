'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { WizardData } from './assessment-wizard';

interface AssessmentBasicsStepProps {
    data: WizardData;
    onUpdate: (data: Partial<WizardData>) => void;
}

const ASSESSMENT_TYPES = [
    { value: 'due_diligence', label: 'Due Diligence' },
    { value: 'procurement', label: 'Procurement' },
    { value: 'partnership', label: 'Partnership Evaluation' },
    { value: 'compliance', label: 'Compliance Check' },
    { value: 'risk_assessment', label: 'Risk Assessment' },
];

const SECTORS = [
    'Agriculture',
    'Education',
    'Energy',
    'Environment',
    'Finance',
    'Healthcare',
    'Technology',
    'Water & Sanitation',
    'Other',
];

export default function AssessmentBasicsStep({
    data,
    onUpdate,
}: AssessmentBasicsStepProps) {
    return (
        <div className="space-y-6">
            {/* Assessment Type */}
            <div className="space-y-2">
                <Label htmlFor="type">Assessment Type *</Label>
                <Select
                    value={data.type}
                    onValueChange={(value) => onUpdate({ type: value })}
                >
                    <SelectTrigger id="type">
                        <SelectValue placeholder="Select assessment type" />
                    </SelectTrigger>
                    <SelectContent>
                        {ASSESSMENT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                    The type of assessment determines which questions are prioritized
                </p>
            </div>

            {/* Assessment Depth */}
            <div className="space-y-2">
                <Label htmlFor="depth">Assessment Depth *</Label>
                <Select
                    value={data.depth}
                    onValueChange={(value: any) => onUpdate({ depth: value })}
                >
                    <SelectTrigger id="depth">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="quick">
                            <div>
                                <div className="font-medium">Quick (15 questions)</div>
                                <div className="text-xs text-muted-foreground">~30 minutes</div>
                            </div>
                        </SelectItem>
                        <SelectItem value="standard">
                            <div>
                                <div className="font-medium">Standard (30 questions)</div>
                                <div className="text-xs text-muted-foreground">~1 hour</div>
                            </div>
                        </SelectItem>
                        <SelectItem value="deep">
                            <div>
                                <div className="font-medium">Deep (50 questions)</div>
                                <div className="text-xs text-muted-foreground">~2 hours</div>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Sector */}
            <div className="space-y-2">
                <Label htmlFor="sector">Primary Sector *</Label>
                <Select
                    value={data.sector}
                    onValueChange={(value) => onUpdate({ sector: value })}
                >
                    <SelectTrigger id="sector">
                        <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                        {SECTORS.map((sector) => (
                            <SelectItem key={sector} value={sector}>
                                {sector}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
                <Label htmlFor="deadline">Deadline (Optional)</Label>
                <Input
                    id="deadline"
                    type="date"
                    value={data.deadline ? data.deadline.toISOString().split('T')[0] : ''}
                    onChange={(e) =>
                        onUpdate({ deadline: e.target.value ? new Date(e.target.value) : null })
                    }
                />
                <p className="text-sm text-muted-foreground">
                    When should respondents complete the assessment?
                </p>
            </div>

            {/* Partner Admin Email */}
            <div className="space-y-2">
                <Label htmlFor="partnerAdminEmail">Partner Admin Email (Optional)</Label>
                <Input
                    id="partnerAdminEmail"
                    type="email"
                    placeholder="admin@partner.org"
                    value={data.partnerAdminEmail}
                    onChange={(e) => onUpdate({ partnerAdminEmail: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                    Primary contact who can manage respondents and verify evidence
                </p>
            </div>
        </div>
    );
}
