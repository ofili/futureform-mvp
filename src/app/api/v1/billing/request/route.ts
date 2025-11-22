import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/services/emailService';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email || !session?.user?.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { tierName, note } = body;

        if (!tierName) {
            return NextResponse.json({ error: 'Tier name is required' }, { status: 400 });
        }

        // Find admins for the organization
        const orgMembers = await prisma.organizationMember.findMany({
            where: {
                organizationId: session.user.organizationId,
                role: {
                    in: ['ADMIN', 'OWNER']
                },
                deletedAt: null
            },
            include: {
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        const admins = orgMembers.map(member => ({
            email: member.user.email,
            name: `${member.user.firstName} ${member.user.lastName}`.trim()
        }));

        if (admins.length === 0) {
            return NextResponse.json({ error: 'No administrators found to notify' }, { status: 404 });
        }

        // Send email to each admin
        const emailPromises = admins.map(admin => {
            if (!admin.email) return Promise.resolve();

            return sendEmail({
                to: admin.email,
                subject: `Purchase Request: ${tierName}`,
                html: `
                    <h2>Purchase Request</h2>
                    <p>User <strong>${session.user.name || session.user.email}</strong> has requested to upgrade/purchase: <strong>${tierName}</strong>.</p>
                    ${note ? `<p><strong>Note:</strong> ${note}</p>` : ''}
                    <p>Please log in to the dashboard to review and process this request.</p>
                `
            });
        });

        await Promise.all(emailPromises);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Request purchase error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
