// User Service
// Handles user profile and preferences

import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { randomUUID } from 'crypto';

export interface UpdateProfileInput {
    firstName?: string;
    lastName?: string;
    title?: string;
    department?: string;
    bio?: string;
}

export class UserService {
    /**
     * Get user profile
     */
    async getProfile(userId: string) {
        logger.info('Fetching user profile', {
            service: 'UserService',
            method: 'getProfile',
            userId,
        });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                jobTitle: true,
                department: true,
                // bio: true,
                role: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: string, data: UpdateProfileInput) {
        logger.info('Updating user profile', {
            service: 'UserService',
            method: 'updateProfile',
            userId,
        });

        const user = await prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                jobTitle: true,
                department: true,
                // bio: true,
                role: true,
                updatedAt: true,
            }
        });

        return user;
    }

    /**
     * Get user's organizations
     */
    async getOrganizations(userId: string) {
        const memberships = await prisma.organizationMember.findMany({
            where: { userId, deletedAt: null },
            include: {
                organization: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    }
                }
            }
        });

        return memberships.map(m => ({
            ...m.organization,
            role: m.role
            // joinedAt: m.createdAt.toISOString()
        }));
    }

    /**
     * Get user's projects
     */
    async getProjects(userId: string) {
        const orgs = await prisma.organizationMember.findMany({
            where: { userId, deletedAt: null },
            select: { organizationId: true }
        });

        const orgIds = orgs.map(o => o.organizationId);

        const projects = await prisma.project.findMany({
            where: {
                organizationId: { in: orgIds }
            },
            select: {
                id: true,
                name: true,
                description: true,
                status: true,
                createdAt: true,
                organization: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return projects;
    }

    /**
     * Get user dashboard stats
     */
    async getDashboardStats(userId: string) {
        const orgs = await prisma.organizationMember.findMany({
            where: { userId, deletedAt: null },
            select: { organizationId: true }
        });

        const orgIds = orgs.map(o => o.organizationId);

        const [projectCount, assessmentCount, organizationCount] = await Promise.all([
            prisma.project.count({
                where: {
                    organizationId: { in: orgIds }
                }
            }),
            prisma.assessment.count({
                where: {
                    project: {
                        organizationId: { in: orgIds }
                    }
                }
            }),
            orgs.length
        ]);

        return {
            projectCount,
            assessmentCount,
            organizationCount
        };
    }

    /**
     * Initiate password reset
     */
    async initiatePasswordReset(email: string): Promise<{ token: string; userConfig: { email: string } } | null> {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return null;
        }

        // Delete existing tokens
        await prisma.passwordResetToken.deleteMany({
            where: { userId: user.id },
        });

        const token = randomUUID();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt,
            },
        });

        return { token, userConfig: { email: user.email } };
    }

    /**
     * Complete password reset
     */
    async completePasswordReset(token: string, hashedPassword: string): Promise<boolean> {
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!resetToken) {
            throw new Error('Invalid or expired token');
        }

        if (resetToken.used) {
            throw new Error('This link has already been used');
        }

        if (resetToken.expiresAt < new Date()) {
            throw new Error('This link has expired');
        }

        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword },
            }),
            prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { used: true },
            }),
        ]);

        return true;
    }

    /**
     * Register new user and organization
     */
    async register(data: {
        email: string;
        passwordHash: string;
        user: { firstName: string; lastName: string; jobTitle?: string; department?: string };
        organization: {
            name: string;
            type?: string;
            sectorFocus?: string;
            region?: string;
            country?: string;
            relationshipStage?: string;
            source?: string;
            referralSource?: string;
            pilotAgreementSigned?: boolean;
            caseStudyApproval?: boolean;
        };
        plan: string;
        tierId?: string;
    }) {
        const { email, passwordHash, user, organization, tierId } = data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        // Create organization, user, and organization member in a transaction
        return await prisma.$transaction(async (tx) => {
            // Create organization
            const newOrg = await tx.organization.create({
                data: {
                    name: organization.name,
                    type: organization.type || 'Other',
                    sectorFocus: organization.sectorFocus,
                    region: organization.region || 'Global',
                    country: organization.country,
                    relationshipStage: organization.relationshipStage || 'Discovery',
                    source: organization.source,
                    referralSource: organization.referralSource,
                    pilotAgreementSigned: organization.pilotAgreementSigned || false,
                    caseStudyApproval: organization.caseStudyApproval || false,
                    tierId: tierId
                }
            });

            // Create user with USER role (global role)
            const newUser = await tx.user.create({
                data: {
                    email,
                    password: passwordHash,
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
    }
}

// Export singleton instance
export const userService = new UserService();

