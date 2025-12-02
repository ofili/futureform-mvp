import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { evidenceService } from '@/lib/services/evidence.service';

/**
 * POST /api/v1/evidence/upload
 * Upload evidence file for a question
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const assessmentId = formData.get('assessmentId') as string;
        const questionId = formData.get('questionId') as string;
        const respondentId = formData.get('respondentId') as string | null;

        if (!file || !assessmentId || !questionId) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const evidence = await evidenceService.uploadEvidence({
            file,
            assessmentId,
            questionId,
            respondentId: respondentId || undefined,
            uploadedById: session.user.id,
        });

        return NextResponse.json({
            success: true,
            data: {
                id: evidence.id,
                fileName: evidence.fileName,
                fileSize: evidence.fileSize,
                fileType: evidence.fileType,
                storageUrl: evidence.storageUrl,
                uploadedAt: evidence.uploadedAt,
            },
        });
    } catch (error) {
        console.error('Evidence upload error:', error);
        const message = error instanceof Error ? error.message : 'Failed to upload evidence';
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
