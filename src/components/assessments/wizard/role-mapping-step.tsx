'use client';

import { useEffect, useState } from 'react';
import { WizardData } from './assessment-wizard';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface RoleMappingStepProps {
    data: WizardData;
    onUpdate: (data: Partial<WizardData>) => void;
}

const SENIORITY_LEVELS = ['Junior', 'Senior', 'Manager', 'Director', 'C-Level'];

const EVIDENCE_TYPES = [
    'Policy Document',
    'Financial Statement',
    'Audit Report',
    'Board Minutes',
    'Organizational Chart',
    'Process Document',
    'Impact Report',
    'Certificate',
    'Training Records',
    'Other Document',
];

export default function RoleMappingStep({
    data,
    onUpdate,
}: RoleMappingStepProps) {
    const [roles, setRoles] = useState<any[]>([]);
    const [mapping, setMapping] = useState(data.questionRoleMapping);

    useEffect(() => {
        // Fetch available roles
        fetch('/api/v1/roles')
            .then((res) => res.json())
            .then((data) => setRoles(data.roles || []))
            .catch((err) => console.error('Error fetching roles:', err));
    }, []);

    useEffect(() => {
        // Initialize mapping with AI suggestions
        if (Object.keys(mapping).length === 0 && data.selectedQuestions.length > 0) {
            const initialMapping: any = {};
            data.selectedQuestions.forEach((q) => {
                initialMapping[q.id] = {
                    roleId: q.assignedRoleId || '',
                    seniority: q.assignedSeniority || 'Manager',
                    evidenceRequirements: q.evidenceRequirements || [],
                };
            });
            setMapping(initialMapping);
            onUpdate({ questionRoleMapping: initialMapping });
        }
    }, [data.selectedQuestions]);

    const updateMapping = (questionId: string, updates: any) => {
        const newMapping = {
            ...mapping,
            [questionId]: {
                ...mapping[questionId],
                ...updates,
            },
        };
        setMapping(newMapping);
        onUpdate({ questionRoleMapping: newMapping });
    };

    const toggleEvidence = (questionId: string, evidence: string) => {
        const current = mapping[questionId]?.evidenceRequirements || [];
        const updated = current.includes(evidence)
            ? current.filter((e: string) => e !== evidence)
            : [...current, evidence];

        updateMapping(questionId, { evidenceRequirements: updated });
    };

    return (
        <div className="space-y-4">
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Assign Roles & Evidence</h3>
                <p className="text-sm text-muted-foreground">
                    Assign organizational roles to each question and specify required evidence types.
                    AI suggestions are pre-filled but can be customized.
                </p>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {data.selectedQuestions.map((question, index) => (
                    <Card key={question.id} className="p-4">
                        <div className="space-y-4">
                            {/* Question */}
                            <div>
                                <span className="text-sm font-medium text-muted-foreground mr-2">
                                    Q{index + 1}
                                </span>
                                <span className="font-medium">{question.question.text}</span>
                                <Badge variant="outline" className="ml-2">
                                    {question.question.domain}
                                </Badge>
                            </div>

                            {/* Role Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Assigned Role</Label>
                                    <Select
                                        value={mapping[question.id]?.roleId || ''}
                                        onValueChange={(value) =>
                                            updateMapping(question.id, { roleId: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role.id} value={role.id}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Seniority Level</Label>
                                    <Select
                                        value={mapping[question.id]?.seniority || 'Manager'}
                                        onValueChange={(value) =>
                                            updateMapping(question.id, { seniority: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SENIORITY_LEVELS.map((level) => (
                                                <SelectItem key={level} value={level}>
                                                    {level}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Evidence Requirements */}
                            <div className="space-y-2">
                                <Label>Required Evidence Types</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {EVIDENCE_TYPES.map((evidence) => (
                                        <div key={evidence} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`${question.id}-${evidence}`}
                                                checked={mapping[question.id]?.evidenceRequirements?.includes(
                                                    evidence
                                                )}
                                                onCheckedChange={() => toggleEvidence(question.id, evidence)}
                                            />
                                            <label
                                                htmlFor={`${question.id}-${evidence}`}
                                                className="text-sm cursor-pointer"
                                            >
                                                {evidence}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
