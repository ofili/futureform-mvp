'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import AssessmentBasicsStep from '@/components/assessments/wizard/assessment-basics-step';
import QuestionSelectionStep from '@/components/assessments/wizard/question-selection-step';
import RoleMappingStep from '@/components/assessments/wizard/role-mapping-step';
import InviteRespondentsStep from '@/components/assessments/wizard/invite-respondents-step';
import ReviewStep from '@/components/assessments/wizard/review-step';

interface AssessmentWizardProps {
    projectId?: string; // Made optional
    templateId?: string;
}


export interface WizardData {
    // Project Selection (if not passed as prop)
    selectedProjectId?: string;

    // Step 1: Basics
    type: string;
    templateId?: string;
    typeSubcategory?: string;
    depth: 'quick' | 'standard' | 'deep';
    sector: string;
    deadline: Date | null;
    partnerAdminEmail: string;
    partnerAliasId?: string;
    partnerGlobalId?: string;
    trustPartnerTypeId?: string;

    // Step 2: Questions (from AI)
    selectedQuestions: any[];

    // Step 3: Role Mapping
    questionRoleMapping: Record<string, { roleId: string; seniority: string; evidenceRequirements: string[] }>;

    // Step 4: Partners
    partners: Array<{
        partnerAliasId: string;
        partnerGlobalId?: string;
        // partnerName is not needed for logic, just UI, but good to keep if shared. 
        // InvitePartnersStep uses { partnerAliasId, partnerName, adminName, adminEmail, notes }
        partnerName: string;
        adminName: string;
        adminEmail: string;
        notes?: string;
    }>;
}

const STEPS = [
    { id: 1, name: 'Assessment Basics', description: 'Context' },
    { id: 2, name: 'Invite Partners', description: 'Add partner organizations' },
    { id: 3, name: 'Review & Send', description: 'Finalize and send' },
];

export default function AssessmentWizard({ projectId: initialProjectId, templateId }: AssessmentWizardProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Use internal state for projectId if not passed as prop
    const [internalProjectId, setInternalProjectId] = useState<string | undefined>(initialProjectId);

    const [wizardData, setWizardData] = useState<WizardData>({
        selectedProjectId: initialProjectId,
        type: templateId || '',
        templateId: templateId,
        typeSubcategory: '',
        depth: 'deep', // Default to deep
        sector: '',
        deadline: null,
        partnerAdminEmail: '',
        partnerAliasId: undefined,
        partnerGlobalId: undefined,
        trustPartnerTypeId: undefined,
        selectedQuestions: [],
        questionRoleMapping: {},
        partners: [],
    });

    // The effective projectId is either from prop or internal state
    const projectId = internalProjectId || wizardData.selectedProjectId;

    const updateWizardData = (data: Partial<WizardData>) => {
        setWizardData((prev) => ({ ...prev, ...data }));
    };

    const handleNext = async () => {
        if (currentStep === 1) {
            // After step 1, call AI to AUTO-SELECT questions and roles
            await fetchAIQuestions();
        }

        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const fetchAIQuestions = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/v1/projects/${projectId}/assessments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: wizardData.type,
                    depth: 'deep', // Force deep
                    sector: wizardData.sector,
                    deadline: wizardData.deadline,
                    partnerAdminEmail: wizardData.partnerAdminEmail,
                    partnerAliasId: wizardData.partnerAliasId,
                    partnerGlobalId: wizardData.partnerGlobalId,
                    trustPartnerTypeId: wizardData.trustPartnerTypeId,
                }),
            });

            if (!response.ok) throw new Error('Failed to create assessment');

            const data = await response.json();
            updateWizardData({
                selectedQuestions: data.assessment.questions,
                // data.assessment.questions should come with roles assigned by backend
            });
        } catch (error) {
            console.error('Error fetching AI questions:', error);
            toast.error('Failed to generate questions. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinish = async () => {
        setIsLoading(true);
        try {
            // Send invitations to partners
            const assessmentId = wizardData.selectedQuestions[0]?.assessmentId;

            if (!assessmentId) {
                throw new Error('Assessment ID not found');
            }

            const response = await fetch(`/api/v1/assessments/${assessmentId}/partners`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    partners: wizardData.partners,
                }),
            });

            if (!response.ok) throw new Error('Failed to send partner invitations');

            // Redirect to project page
            router.push(`/projects/${projectId}`);
        } catch (error) {
            console.error('Error finishing wizard:', error);
            toast.error('Failed to complete assessment creation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const progress = (currentStep / STEPS.length) * 100;

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <AssessmentBasicsStep
                        data={wizardData}
                        onUpdate={updateWizardData}
                    />
                );
            case 2:
                return (
                    <InviteRespondentsStep
                        data={wizardData}
                        onUpdate={updateWizardData}
                    />
                );
            case 3:
                return (
                    <ReviewStep
                        data={wizardData}
                        projectId={projectId}
                    />
                );
            default:
                return null;
        }
    };


    const canProceed = () => {
        switch (currentStep) {
            case 1:
                // Removed wizardData.trustPartnerTypeId from validation as it's inferred or hidden
                return wizardData.type && wizardData.sector; // Depth is defaulted
            case 2:
                return wizardData.partners.length > 0;
            default:
                return true;
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Create New Assessment</h1>
                <p className="text-muted-foreground">
                    Follow the steps below to create a comprehensive assessment with AI-selected questions
                </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    {STEPS.map((step) => (
                        <div
                            key={step.id}
                            className={`flex-1 text-center ${step.id === currentStep
                                ? 'text-primary font-semibold'
                                : step.id < currentStep
                                    ? 'text-green-600'
                                    : 'text-muted-foreground'
                                }`}
                        >
                            <div className="flex items-center justify-center mb-1">
                                {step.id < currentStep ? (
                                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                                        <Check className="w-5 h-5 text-white" />
                                    </div>
                                ) : (
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${step.id === currentStep
                                            ? 'bg-primary text-white'
                                            : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {step.id}
                                    </div>
                                )}
                            </div>
                            <div className="text-sm font-medium">{step.name}</div>
                            <div className="text-xs text-muted-foreground hidden sm:block">
                                {step.description}
                            </div>
                        </div>
                    ))}
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Step Content */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
                </CardHeader>
                <CardContent>{renderStep()}</CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1 || isLoading}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                {currentStep < STEPS.length ? (
                    <Button
                        onClick={handleNext}
                        disabled={!canProceed() || isLoading}
                    >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleFinish}
                        disabled={!canProceed() || isLoading}
                    >
                        <Check className="w-4 h-4 mr-2" />
                        Create Assessment
                    </Button>
                )}
            </div>
        </div>
    );
}
