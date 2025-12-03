// src/app/api/v1/invitations/[token]/accept/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { invitationService } from '@/services/invitations/invitation.service';

/**
 * POST /api/v1/invitations/[token]/accept
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();
    const { password } = body;

    const result = await invitationService.acceptInvitation({ token, password });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    const message = error.message || 'INTERNAL_ERROR';

    switch (message) {
      case 'INVALID_INVITATION':
        return NextResponse.json({ error: 'Invalid invitation token' }, { status: 404 });
      case 'INVITATION_EXPIRED':
        return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
      case 'ALREADY_ACCEPTED':
        return NextResponse.json({ error: 'Invitation already accepted' }, { status: 400 });
      case 'PASSWORD_REQUIRED':
        return NextResponse.json({ error: 'Password required for new users' }, { status: 400 });
      case 'ORGANIZATION_NOT_FOUND':
        return NextResponse.json({ error: 'Organization not found' }, { status: 400 });
      case 'INSUFFICIENT_CREDITS':
        return NextResponse.json(
          {
            error: 'The organization has insufficient respondent credits.',
            code: 'INSUFFICIENT_CREDITS',
          },
          { status: 402 }
        );
      case 'CREDITS_EXPIRED':
        return NextResponse.json(
          {
            error: 'Respondent credits have expired.',
            code: 'CREDITS_EXPIRED',
          },
          { status: 403 }
        );
      default:
        console.error('Error accepting invitation:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
}

/**
 * GET /api/v1/invitations/[token]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const invitation = await invitationService.getInvitation(token);
    return NextResponse.json({ invitation }, { status: 200 });
  } catch (error: any) {
    if (error.message === 'INVALID_INVITATION') {
      return NextResponse.json({ error: 'Invalid invitation token' }, { status: 404 });
    }
    if (error.message === 'INVITATION_EXPIRED') {
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
    }
    console.error('Error fetching invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
