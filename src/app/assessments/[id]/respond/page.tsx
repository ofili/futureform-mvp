import RespondentWorkspace from '@/components/assessments/respondent-workspace';

interface PageProps {
    params: {
        id: string;
    };
}

export default function RespondPage({ params }: PageProps) {
    return <RespondentWorkspace assessmentId={params.id} />;
}
