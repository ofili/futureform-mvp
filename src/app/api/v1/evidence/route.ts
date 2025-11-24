import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

/**
 * POST /api/v1/evidence/upload
 * 
 * Upload evidence file for an assessment response
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const responseId = formData.get('responseId') as string;

        if (!file || !responseId) {
            return NextResponse.json(
                { error: 'File and responseId are required' },
                { status: 400 }
            );
        }

        // Verify response exists and user has access
        const response = await prisma.assessmentResponse.findUnique({
            where: { id: responseId },
            include: {
                assessment: {
                    include: {
                        invitations: true,
                    },
                },
            },
        });

        if (!response) {
            return NextResponse.json(
                { error: 'Response not found' },
                { status: 404 }
            );
        }

        // Check if user is the respondent or has access to the assessment
        const hasAccess =
            response.userId === session.user.id ||
            response.assessment.invitations.some(
                (inv) => inv.email === session.user.email && inv.status === 'ACCEPTED'
            );

        if (!hasAccess) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${timestamp}_${sanitizedFileName}`;

        // Save file to uploads directory
        // In production, this should upload to S3 or similar cloud storage
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'evidence');
        const filePath = path.join(uploadsDir, fileName);

        // Ensure directory exists
        const fs = require('fs');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        await writeFile(filePath, buffer);

        // Create evidence record
        const evidence = await prisma.evidence.create({
            data: {
                responseId,
                fileName: file.name,
                fileUrl: `/uploads/evidence/${fileName}`,
                fileType: file.type,
                fileSize: file.size,
                uploadedBy: session.user.id,
                verificationStatus: 'PENDING',
            },
            include: {
                uploader: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return NextResponse.json({ evidence }, { status: 201 });
    } catch (error) {
        console.error('Error uploading evidence:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/v1/evidence
 * 
 * Get evidence files for a response
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const responseId = searchParams.get('responseId');

        if (!responseId) {
            return NextResponse.json(
                { error: 'responseId is required' },
                { status: 400 }
            );
        }

        // Verify response exists and user has access
        const response = await prisma.assessmentResponse.findUnique({
            where: { id: responseId },
            include: {
                assessment: {
                    include: {
                        invitations: true,
                        project: {
                            include: {
                                organization: {
                                    include: { members: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!response) {
            return NextResponse.json(
                { error: 'Response not found' },
                { status: 404 }
            );
        }

        // Check if user has access
        const hasAccess =
            (response.userId === session.user.id ||
                response.assessment.invitations.some(
                    (inv) => inv.email === session.user.email && inv.status === 'ACCEPTED'
                )) ||
            (response.assessment.project.organization?.members.some(
                (member) => member.userId === session.user.id
            ) ?? false);

        if (!hasAccess) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get evidence files
        const evidence = await prisma.evidence.findMany({
            where: { responseId },
            include: {
                uploader: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                verifier: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { uploadedAt: 'desc' },
        });

        return NextResponse.json({ evidence }, { status: 200 });
    } catch (error) {
        console.error('Error fetching evidence:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
