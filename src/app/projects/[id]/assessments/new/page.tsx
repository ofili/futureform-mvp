import AssessmentWizard from '@/components/assessments/wizard/assessment-wizard';

interface PageProps {
    params: {
        id: string;
    };
}

export default function NewAssessmentPage({ params }: PageProps) {
    return <AssessmentWizard projectId={params.id} />;
}
