import AssessmentWizard from '@/components/assessments/wizard/assessment-wizard';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function NewAssessmentPage(props: PageProps) {
    const params = await props.params;
    return <AssessmentWizard projectId={params.id} />;
}
