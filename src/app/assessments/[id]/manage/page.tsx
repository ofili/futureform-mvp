import PartnerAdminDashboard from '@/components/assessments/partner-admin-dashboard';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ManageAssessmentPage(props: PageProps) {
    const params = await props.params;
    return <PartnerAdminDashboard assessmentId={params.id} />;
}
