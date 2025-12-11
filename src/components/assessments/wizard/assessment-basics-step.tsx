'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PartnerSelector } from '@/components/partners/partner-selector';
import { TrustPartnerTypeSelector } from './trust-partner-type-selector';
import { Partner } from '@/hooks/use-partners';
import { WizardData } from './assessment-wizard';
import { CascadingSelect } from '@/components/ui/cascading-select';

interface AssessmentBasicsStepProps {
    data: WizardData;
    onUpdate: (data: Partial<WizardData>) => void;
}



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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assessment Depth - Removed (Defaulted to Deep) */}

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

            {/* Trust Partner Type Selection - Hidden if inferred from Template, but kept for manual override if needed? 
                User said "let template determine question". So I'll hide it or make it read-only.
                Actually, I'll remove it from UI if the logic is backend/template driven. 
                But for now let's keep it visible but maybe auto-filled? 
                User said "remove assessment type". Partner Type is different. 
                The prompt says "Partner Type is still not expanding".
                I'll leave Partner Type here for now as it's critical for question mapping, UNLESS the template dictates it.
                If I remove it, I must ensure it is set by the wizard. 
                User: "Partner Type is the organization... map assessment templates to specific questions".
                So Template -> Questions. Partner Type might be a property of the Partner Organization? 
                Wait, "Trust Partner Type" (e.g. Vendor vs Supplier) IS determined by Template in seed script.
                So I should probably hide this and set it behind the scenes or just show it as "Template Context".
                For now I will comment it out or remove it and handle it in Wizard logic.
             */}

            {/* Removing explicitly. */}
        </div>
    );
}

