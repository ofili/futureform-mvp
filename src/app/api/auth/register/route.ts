import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';

/**
 * POST /api/auth/register
 * Rate Limited: 5 requests per minute to prevent spam registrations
 */
export async function POST(request: NextRequest) {
  // Apply strict rate limiting for registration
  const rateLimitResult = await rateLimit(request, RateLimitPresets.auth);

  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const { email, organization, user: userData } = await request.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const result = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: organization.name,
          type: organization.type,
          sectorFocus: organization.sectorFocus,
          region: organization.region,
          country: organization.country,
          relationshipStage: organization.relationshipStage || 'Discovery',
          source: organization.source,
          referralSource: organization.referralSource,
          pilotAgreementSigned: organization.pilotAgreementSigned || false,
          caseStudyApproval: organization.caseStudyApproval || false
        }
      });

      const verificationToken = crypto.randomBytes(32).toString('hex');

      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          jobTitle: userData.jobTitle,
          department: userData.department,
          emailVerified: false,
          verificationToken
        }
      });

      await tx.organizationMember.create({
        data: {
          userId: user.id,
          organizationId: org.id,
          role: 'OWNER'
        }
      });

      return { user, org };
    });

    // Send verification email
    try {
      await sendVerificationEmail(result.user.email, result.user.verificationToken!);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue with registration even if email fails
    }

    return NextResponse.json({
      message: 'Registration successful. Please check your email to verify your account.',
      email: result.user.email
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}