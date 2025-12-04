import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { projectService } from '@/services/projects/project.service';
import { logger } from '@/lib/logger';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        try {
            const project = await projectService.getById(id, session.user.id);
            return NextResponse.json({ project }, { status: 200 });
        } catch (error: any) {
            if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
            if (error.message.includes('not found')) {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            throw error;
        }
    } catch (error) {
        logger.error('Error fetching project', error as Error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        try {
            const project = await projectService.update(id, body, session.user.id);
            return NextResponse.json({ project }, { status: 200 });
        } catch (error: any) {
            if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
            if (error.message.includes('not found')) {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            throw error;
        }
    } catch (error) {
        logger.error('Error updating project', error as Error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        try {
            await projectService.delete(id, session.user.id);
            return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
        } catch (error: any) {
            if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
            if (error.message.includes('not found')) {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            throw error;
        }
    } catch (error) {
        logger.error('Error deleting project', error as Error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
