// Payment verification endpoint
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { paymentService } from '@/services/payments/payment.service';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { transactionRef } = body;

    // Validate input
    if (!transactionRef) {
      return NextResponse.json(
        { error: 'Transaction reference is required' },
        { status: 400 }
      );
    }

    // Delegate to service layer
    const result = await paymentService.verifyPayment(session.user.id, transactionRef);

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Payment verification failed', error as Error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to verify payment';
    const statusCode = errorMessage.includes('Unauthorized') ? 403 : 
                       errorMessage.includes('not found') ? 404 : 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
