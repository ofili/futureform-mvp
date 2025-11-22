import AcceptInvitation from '@/components/assessments/accept-invitation';

interface PageProps {
    params: {
        token: string;
    };
}

export default function AcceptInvitationPage({ params }: PageProps) {
    return <AcceptInvitation token={params.token} />;
}
