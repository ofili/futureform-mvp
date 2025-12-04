import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { billingService } from '@/services/billing/billing.service';
import { logger } from '@/lib/logger';
import { z } from 'zod';

// Schema for upserting exchange rate
const upsertRateSchema = z.object({
    fromCurrency: z.string().min(3).max(3).toUpperCase(),
    toCurrency: z.string().min(3).max(3).toUpperCase(),
    rate: z.number().positive(),
});

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const rates = await billingService.getExchangeRates();

        return NextResponse.json({ data: rates });
    } catch (error: any) {
        logger.error('Failed to fetch exchange rates', error, {
            service: 'ExchangeRatesAPI',
            method: 'GET',
        });
        return NextResponse.json(
            { error: 'Failed to fetch exchange rates' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validation = upsertRateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid request data', details: validation.error.errors },
                { status: 400 }
            );
        }

        const { fromCurrency, toCurrency, rate } = validation.data;

        const result = await billingService.upsertExchangeRate(
            fromCurrency,
            toCurrency,
            rate,
            session.user.id
        );

        return NextResponse.json({ data: result });
    } catch (error: any) {
        logger.error('Failed to upsert exchange rate', error, {
            service: 'ExchangeRatesAPI',
            method: 'POST',
        });
        return NextResponse.json(
            { error: 'Failed to upsert exchange rate' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await billingService.deleteExchangeRate(id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        logger.error('Failed to delete exchange rate', error, {
            service: 'ExchangeRatesAPI',
            method: 'DELETE',
        });
        return NextResponse.json(
            { error: 'Failed to delete exchange rate' },
            { status: 500 }
        );
    }
}
