
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { documentService } from '@/services/documents/document.service';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const entityType = searchParams.get('entityType');
        const entityId = searchParams.get('entityId');

        if (!entityType || !entityId) {
            return NextResponse.json({ error: 'Missing entityType or entityId' }, { status: 400 });
        }

        const documents = await documentService.getDocumentsByEntity(entityType, entityId);

        return NextResponse.json(documents);
    } catch (error) {
        console.error('Fetch documents error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch documents' },
            { status: 500 }
        );
    }
}
