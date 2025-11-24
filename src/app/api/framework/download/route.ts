import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import prisma from '@/lib/prisma';

/**
 * GET /api/framework/download?token=...
 * Serves the Trust Framework PDF file and tracks download.
 */
export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    try {
        // Track the download in the database
        const lead = await prisma.marketingLead.findUnique({
            where: { downloadToken: token }
        });

        if (lead && !lead.tokenUsed) {
            // Mark token as used
            await prisma.marketingLead.update({
                where: { downloadToken: token },
                data: {
                    tokenUsed: true,
                    tokenUsedAt: new Date()
                }
            });

            console.log('Framework downloaded by lead:', {
                id: lead.id,
                email: lead.email,
                organization: lead.organization
            });
        }

        // Serve the PDF file
        const filePath = path.resolve(process.cwd(), 'public', 'downloads', 'FutureForm-Trust-Framework.pdf');
        const fileStat = await fs.promises.stat(filePath);
        const fileStream = fs.createReadStream(filePath);

        return new NextResponse(fileStream as any, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Length': fileStat.size.toString(),
                'Content-Disposition': 'attachment; filename="FutureForm-Trust-Framework.pdf"',
            },
        });
    } catch (error) {
        console.error('Error serving framework download:', error);
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
}
