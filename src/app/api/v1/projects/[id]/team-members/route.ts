import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { sendInviteEmail, sendAddedToProjectEmail } from '@/lib/email';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;

    if (!projectId) {
      return NextResponse.json({ message: 'Invalid projectId' }, { status: 400 });
    }

    const members = await prisma.projectTeamMember.findMany({
      where: { projectId, removedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        invitedByUser: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });

    return NextResponse.json(members);
  } catch (error: any) {
    console.error('team-members error', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;
    const body = await request.json();
    const { email, role = 'EDITOR', domainAccess = [] } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    // search for existing user by email
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      // Auto-accept existing user
      const tm = await prisma.projectTeamMember.create({
        data: {
          projectId: project.id,
          userId: existingUser.id,
          invitedBy: session.user.id,
          role,
          domainAccess,
          invitationToken: uuidv4(),
          invitationStatus: 'ACCEPTED',
          invitationAcceptedAt: new Date(),
        },
        include: { user: true, invitedByUser: true },
      });

      // notify
      try {
        await sendAddedToProjectEmail(existingUser.email, project.name);
      } catch (e) {
        console.warn('sendAddedToProjectEmail failed', e);
      }

      return NextResponse.json({ teamMember: tm, autoAccepted: true }, { status: 201 });
    } else {
      // create pending invite without userId
      const token = uuidv4();
      const tm = await prisma.projectTeamMember.create({
        data: {
          projectId: project.id,
          invitedBy: session.user.id,
          role,
          domainAccess,
          invitationToken: token,
          invitationStatus: 'PENDING',
          invitationSentAt: new Date(),
        },
      });

      const inviteUrl = `${process.env.FRONTEND_URL}/auth/setup?token=${token}&projectId=${project.id}`;
      try {
        await sendInviteEmail(email);
      } catch (e) {
        console.warn('sendInviteEmail failed', e);
      }

      return NextResponse.json({ teamMember: tm, autoAccepted: false }, { status: 201 });
    }
  } catch (error: any) {
    console.error('team-members error', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
