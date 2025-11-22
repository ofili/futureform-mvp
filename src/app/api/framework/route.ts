import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { name, email, organization, sector, region, country } = await request.json();

    const download = await prisma.frameworkDownload.create({
      data: {
        name,
        email,
        organization,
        sector,
        region,
        country
      }
    });

    return NextResponse.json({ 
      message: 'Framework download recorded',
      downloadId: download.id 
    }, { status: 201 });
  } catch (error) {
    console.error('Framework download error:', error);
    return NextResponse.json({ error: 'Failed to record download' }, { status: 500 });
  }
}