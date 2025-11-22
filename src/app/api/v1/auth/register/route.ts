import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, organization, user } = body;

        if (!email || !organization || !user) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 12);

        // Get the Framework Access tier (default free tier)
        const defaultTier = await prisma.subscriptionTier.findFirst({
            where: { name: 'Framework Access' }
        });

        // Create organization, user, and organization member in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create organization
            const newOrg = await tx.organization.create({
                data: {
                    name: organization.name,
                    type: organization.type || 'Other',
                    sectorFocus: organization.sectorFocus,
                    region: organization.region,
                    country: organization.country,
                    relationshipStage: organization.relationshipStage || 'Discovery',
                    source: organization.source,
                    referralSource: organization.referralSource,
                    pilotAgreementSigned: organization.pilotAgreementSigned || false,
                    caseStudyApproval: organization.caseStudyApproval || false,
                    tierId: defaultTier?.id
                }
            });

            // Create user with USER role (global role)
            const newUser = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    jobTitle: user.jobTitle,
                    department: user.department,
                    role: 'USER', // Global role is USER
                    emailVerified: true // Auto-verify for now
                }
            });

            // Create organization member relationship
            await tx.organizationMember.create({
                data: {
                    userId: newUser.id,
                    organizationId: newOrg.id,
                    role: 'OWNER' // Creator is the owner in OrganizationMember
                }
            });

            return { user: newUser, organization: newOrg };
        });

        return NextResponse.json({
            message: 'Registration successful. Please log in.',
            userId: result.user.id
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
