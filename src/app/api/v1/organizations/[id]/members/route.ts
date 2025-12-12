
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { organizationService } from '@/services/organizations/organization.service';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const members = await organizationService.getMembers(id, session.user.id);
        return NextResponse.json(members);
    } catch (error: any) {
        console.error('Error fetching members:', error);
        if (error.message.includes('Unauthorized')) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }
        return NextResponse.json(
            { message: 'Internal Server Error', error: error.message },
            { status: 500 }
        );
    }
}
