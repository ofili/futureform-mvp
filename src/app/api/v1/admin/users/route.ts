import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');

    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role && role !== 'all') {
      where.role = role.toUpperCase();
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        organizations: {
          where: { deletedAt: null },
          include: {
            organization: {
              select: {
                id: true,
                name: true
              }
            }
          },
          take: 1
        },
        assessments: {
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform data to match frontend expectations
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role.toLowerCase(),
      organizationName: user.organizations[0]?.organization.name || 'No Organization',
      status: 'active', // Default to active since we don't have status field
      lastLogin: user.updatedAt.toISOString(),
      createdAt: user.createdAt.toISOString(),
      assessmentCount: user.assessments.length
    }));

    return NextResponse.json({ success: true, data: transformedUsers });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}