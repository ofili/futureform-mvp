import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const configs = await prisma.platformConfig.findMany({
            orderBy: [
                { category: 'asc' },
                { key: 'asc' }
            ]
        });

        // Group by category
        const grouped = configs.reduce((acc, config) => {
            if (!acc[config.category]) {
                acc[config.category] = [];
            }
            acc[config.category].push(config);
            return acc;
        }, {} as Record<string, typeof configs>);

        return NextResponse.json(grouped);
    } catch (error) {
        console.error('Get system settings error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { key, value } = body;

        if (!key) {
            return NextResponse.json({ error: 'Config key required' }, { status: 400 });
        }

        const config = await prisma.platformConfig.update({
            where: { key },
            data: {
                value,
                updatedBy: session.user.id
            }
        });

        return NextResponse.json(config);
    } catch (error) {
        console.error('Update system setting error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { action } = await req.json();

        if (action === 'seed') {
            const defaults = [
                {
                    key: 'general.system_name',
                    value: 'FutureForm',
                    category: 'general',
                    description: 'The name of the platform displayed in emails and titles.'
                },
                {
                    key: 'general.support_email',
                    value: 'support@futureform.africa',
                    category: 'general',
                    description: 'Primary contact email for support inquiries.'
                },
                {
                    key: 'email.from_name',
                    value: 'FutureForm',
                    category: 'email',
                    description: 'Sender name for system emails.'
                },
                {
                    key: 'email.from_address',
                    value: 'noreply@futureform.africa',
                    category: 'email',
                    description: 'Sender email address for system emails.'
                },
                {
                    key: 'features.maintenance_mode',
                    value: false,
                    category: 'features',
                    description: 'If true, prevents non-admin users from accessing the platform.'
                },
                {
                    key: 'features.registration_enabled',
                    value: true,
                    category: 'features',
                    description: 'If false, disables new user registration.'
                }
            ];

            const results = [];
            for (const def of defaults) {
                const existing = await prisma.platformConfig.findUnique({
                    where: { key: def.key }
                });

                if (!existing) {
                    const created = await prisma.platformConfig.create({
                        data: {
                            key: def.key,
                            value: def.value,
                            category: def.category,
                            description: def.description
                        }
                    });
                    results.push(created);
                }
            }

            return NextResponse.json({ success: true, seeded: results.length });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Seed system settings error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
