import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const tiers = await prisma.subscriptionTier.findMany({
            include: {
                features: {
                    orderBy: { displayOrder: 'asc' }
                }
            },
            orderBy: { displayOrder: 'asc' }
        });

        const transformedTiers = tiers.map(tier => ({
            ...tier,
            priceUSD: tier.priceUSD ? Number(tier.priceUSD) : null
        }));

        return NextResponse.json(transformedTiers);
    } catch (error) {
        console.error('Get tiers error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { features, ...tierData } = body;

        const tier = await prisma.subscriptionTier.create({
            data: {
                ...tierData,
                features: {
                    create: features?.map((feature: string, index: number) => ({
                        feature,
                        displayOrder: index
                    })) || []
                }
            },
            include: {
                features: true
            }
        });

        return NextResponse.json({
            ...tier,
            priceUSD: tier.priceUSD ? Number(tier.priceUSD) : null
        });
    } catch (error) {
        console.error('Create tier error:', error);
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
        const { id, features, ...tierData } = body;

        if (!id) {
            return NextResponse.json({ error: 'Tier ID required' }, { status: 400 });
        }

        // Update tier
        await prisma.subscriptionTier.update({
            where: { id },
            data: tierData
        });

        // Update features if provided
        if (features) {
            // Delete existing features
            await prisma.tierFeature.deleteMany({
                where: { tierId: id }
            });

            // Create new features
            await prisma.tierFeature.createMany({
                data: features.map((feature: string, index: number) => ({
                    tierId: id,
                    feature,
                    displayOrder: index
                }))
            });
        }

        const updatedTier = await prisma.subscriptionTier.findUnique({
            where: { id },
            include: {
                features: {
                    orderBy: { displayOrder: 'asc' }
                }
            }
        });

        if (!updatedTier) {
            return NextResponse.json({ error: 'Tier not found' }, { status: 404 });
        }

        return NextResponse.json({
            ...updatedTier,
            priceUSD: updatedTier.priceUSD ? Number(updatedTier.priceUSD) : null
        });
    } catch (error) {
        console.error('Update tier error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Tier ID required' }, { status: 400 });
        }

        // Check if tier is in use
        const orgCount = await prisma.organization.count({
            where: { tierId: id }
        });

        if (orgCount > 0) {
            return NextResponse.json({
                error: `Cannot delete tier. ${orgCount} organization(s) are using this tier.`
            }, { status: 400 });
        }

        await prisma.subscriptionTier.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete tier error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
