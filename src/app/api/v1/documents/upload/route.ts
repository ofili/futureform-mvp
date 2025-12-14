
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { documentService } from '@/services/documents/document.service';
import { storageService, STORAGE_BUCKETS } from '@/lib/supabase/storage';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const entityId = formData.get('entityId') as string;
        const entityType = formData.get('entityType') as string;

        if (!file || !entityId || !entityType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }


        // Upload to Supabase Storage
        const path = `${entityType}/${entityId}/${Date.now()}-${file.name}`;
        const publicUrl = await storageService.uploadFile(STORAGE_BUCKETS.DOCUMENTS, path, file);

        if (!publicUrl) {
            return NextResponse.json(
                { error: 'Failed to upload file to storage' },
                { status: 500 }
            );
        }

        const document = await documentService.createDocument({
            name: file.name,
            type: file.type,
            size: file.size,
            url: publicUrl,
            entityType,
            entityId,
            userId: session.user.id,
        });

        return NextResponse.json(document);
    } catch (error: any) {
        console.error('Upload error:', error);

        // Return specific error message if bucket is missing
        if (error.message?.includes('Bucket not found')) {
            return NextResponse.json(
                { error: 'Storage bucket "project-documents" not found. Please create it in Supabase Dashboard.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Failed to upload document' },
            { status: 500 }
        );
    }
}
