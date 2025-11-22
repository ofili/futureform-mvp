import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberid: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId, memberid: memberId } = await params;

    if (!projectId || !memberId) {
      return NextResponse.json({ message: 'Invalid parameters' }, { status: 400 });
    }

    const updated = await prisma.projectTeamMember.updateMany({
      where: { id: memberId, projectId, removedAt: null },
      data: { removedAt: new Date() },
    });

    if (updated.count === 0) {
      return NextResponse.json({ message: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Member removed' });
  } catch (error: any) {
    console.error('remove member error', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
