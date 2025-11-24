import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const searchSchema = z.object({
    query: z.string().min(2),
    sector: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validation = searchSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors }, { status: 400 });
        }

        const { query, sector } = validation.data;

        // Search global partners
        // In a real app, this would use full-text search or a dedicated search service (Algolia, Elasticsearch)
        // For MVP, we'll use Prisma's contains
        const matches = await prisma.partner.findMany({
            where: {
                OR: [
                    { legalName: { contains: query, mode: 'insensitive' } },
                    { website: { contains: query, mode: 'insensitive' } },
                ],
                ...(sector ? { sector: { equals: sector, mode: 'insensitive' } } : {}),
            },
            take: 5,
            select: {
                id: true,
                legalName: true,
                website: true,
                sector: true,
                country: true,
                verification: true,
                // Don't expose usageCount or metadata publicly
            }
        });

        return NextResponse.json({ matches });

    } catch (error) {
        console.error('Error searching partners:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
