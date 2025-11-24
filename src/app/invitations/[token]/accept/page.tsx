import AcceptInvitation from '@/components/assessments/accept-invitation';

interface PageProps {
    params: Promise<{
        token: string;
    }>;
}

export default async function AcceptInvitationPage(props: PageProps) {
    const params = await props.params;
    return <AcceptInvitation token={params.token} />;
}
