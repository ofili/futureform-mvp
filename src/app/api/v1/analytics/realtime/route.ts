import { NextResponse } from 'next/server';

export async function GET() {
  const realtimeData = {
    activeUsers: 24,
    ongoingAssessments: 5,
    systemLoad: 67,
    responseTime: 245
  };

  return NextResponse.json({ success: true, data: realtimeData });
}