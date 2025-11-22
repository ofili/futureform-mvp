import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Fix this route - trustScore field doesn't exist in Assessment model
  // Need to calculate from scores relation or update schema
  const stats = {
    totalProjects: 0,
    activeAssessments: 0,
    completedAssessments: 0,
    averageTrustScore: 0
  };

  return NextResponse.json({ success: true, data: stats });
}