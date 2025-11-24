import RespondentWorkspace from '@/components/assessments/respondent-workspace';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function RespondPage(props: PageProps) {
    const params = await props.params;
    return <RespondentWorkspace assessmentId={params.id} />;
}
