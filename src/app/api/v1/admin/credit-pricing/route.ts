import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const packages = await prisma.creditPricing.findMany({
            orderBy: { displayOrder: 'asc' }
        });

        const transformedPackages = packages.map(pkg => ({
            ...pkg,
            priceUSD: Number(pkg.priceUSD)
        }));

        return NextResponse.json(transformedPackages);
    } catch (error) {
        console.error('Get credit pricing error:', error);
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
        const pkg = await prisma.creditPricing.create({
            data: body
        });

        return NextResponse.json({
            ...pkg,
            priceUSD: Number(pkg.priceUSD)
        });
    } catch (error) {
        console.error('Create credit pricing error:', error);
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
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json({ error: 'Package ID required' }, { status: 400 });
        }

        const pkg = await prisma.creditPricing.update({
            where: { id },
            data
        });

        return NextResponse.json({
            ...pkg,
            priceUSD: Number(pkg.priceUSD)
        });
    } catch (error) {
        console.error('Update credit pricing error:', error);
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
            return NextResponse.json({ error: 'Package ID required' }, { status: 400 });
        }

        await prisma.creditPricing.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete credit pricing error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
