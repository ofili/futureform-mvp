import PartnerAdminDashboard from '@/components/assessments/partner-admin-dashboard';

interface PageProps {
    params: {
        id: string;
    };
}

export default function ManageAssessmentPage({ params }: PageProps) {
    return <PartnerAdminDashboard assessmentId={params.id} />;
}
