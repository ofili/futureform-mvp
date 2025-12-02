// Organization Service
// Handles organization and member management

import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { OrganizationRole, Prisma } from '@prisma/client';

export interface CreateOrganizationInput {
    name: string;
    description?: string;
    sector?: string;
    region?: string;
    country?: string;
    size?: string;
    website?: string;
}

export interface UpdateOrganizationInput {
    name?: string;
    description?: string;
    sector?: string;
    region?: string;
    country?: string;
    size?: string;
    website?: string;
}

export interface InviteMemberInput {
    email: string;
    role: OrganizationRole;
    firstName?: string;
    lastName?: string;
}

export class OrganizationService {
    /**
     * Get organization by ID with authorization
     */
    async getById(id: string, userId: string) {
        logger.info('Fetching organization', {
            service: 'OrganizationService',
            method: 'getById',
            organizationId: id,
            userId,
        });

        const organization = await prisma.organization.findUnique({
            where: { id },
            include: {
                members: {
                    where: { deletedAt: null },
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        projects: true,
                        assessments: true
                    }
                }
            }
        });

        if (!organization) {
            throw new Error('Organization not found');
        }

        // Authorization check
        const member = organization.members.find(m => m.userId === userId);
        if (!member) {
            throw new Error('Unauthorized access to organization');
        }

        return this.transformOrganization(organization);
    }

    /**
     * List user's organizations
     */
    async listUserOrganizations(userId: string) {
        logger.info('Listing user organizations', {
            service: 'OrganizationService',
            method: 'listUserOrganizations',
            userId,
        });

        const memberships = await prisma.organizationMember.findMany({
            where: { userId, deletedAt: null },
            include: {
                organization: {
                    include: {
                        _count: {
                            select: {
                                projects: true,
                                assessments: true,
                                members: true
                            }
                        }
                    }
                }
            }
        });

        return memberships.map(m => ({
            ...this.transformOrganization(m.organization),
            userRole: m.role,
            joinedAt: m.createdAt.toISOString()
        }));
    }

    /**
     * Create new organization
     */
    async create(data: CreateOrganizationInput, userId: string) {
        logger.info('Creating organization', {
            service: 'OrganizationService',
            method: 'create',
            userId,
        });

        const organization = await prisma.organization.create({
            data: {
                name: data.name,
                description: data.description,
                sector: data.sector,
                region: data.region,
                country: data.country,
                size: data.size,
                website: data.website,
                members: {
                    create: {
                        userId,
                        role: OrganizationRole.ADMIN,
                    }
                }
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            }
        });

        return this.transformOrganization(organization);
    }

    /**
     * Update organization
     */
    async update(id: string, data: UpdateOrganizationInput, userId: string) {
        logger.info('Updating organization', {
            service: 'OrganizationService',
            method: 'update',
            organizationId: id,
            userId,
        });

        // Verify admin access
        await this.verifyAdminAccess(id, userId);

        const organization = await prisma.organization.update({
            where: { id },
            data,
            include: {
                members: {
                    where: { deletedAt: null },
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            }
        });

        return this.transformOrganization(organization);
    }

    /**
     * Invite member to organization
     */
    async inviteMember(organizationId: string, data: InviteMemberInput, invitedBy: string) {
        logger.info('Inviting member', {
            service: 'OrganizationService',
            method: 'inviteMember',
            organizationId,
            email: data.email,
            invitedBy,
        });

        // Verify admin access
        await this.verifyAdminAccess(organizationId, invitedBy);

        // Check if user exists
        let user = await prisma.user.findUnique({
            where: { email: data.email }
        });

        // If user doesn't exist, create invitation
        if (!user) {
            // TODO: Create invitation record and send email
            throw new Error('User invitation system not yet implemented');
        }

        // Check if already a member
        const existingMember = await prisma.organizationMember.findFirst({
            where: {
                organizationId,
                userId: user.id,
                deletedAt: null
            }
        });

        if (existingMember) {
            throw new Error('User is already a member of this organization');
        }

        // Add as member
        const member = await prisma.organizationMember.create({
            data: {
                organizationId,
                userId: user.id,
                role: data.role,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        return member;
    }

    /**
     * Remove member from organization
     */
    async removeMember(organizationId: string, userId: string, removedBy: string) {
        logger.info('Removing member', {
            service: 'OrganizationService',
            method: 'removeMember',
            organizationId,
            userId,
            removedBy,
        });

        // Verify admin access
        await this.verifyAdminAccess(organizationId, removedBy);

        // Can't remove yourself if you're the last admin
        const admins = await prisma.organizationMember.count({
            where: {
                organizationId,
                role: OrganizationRole.ADMIN,
                deletedAt: null
            }
        });

        const removingMember = await prisma.organizationMember.findFirst({
            where: {
                organizationId,
                userId,
                deletedAt: null
            }
        });

        if (removingMember?.role === OrganizationRole.ADMIN && admins === 1) {
            throw new Error('Cannot remove the last admin from the organization');
        }

        await prisma.organizationMember.updateMany({
            where: {
                organizationId,
                userId,
                deletedAt: null
            },
            data: {
                deletedAt: new Date()
            }
        });

        return { success: true };
    }

    /**
     * Update member role
     */
    async updateMemberRole(
        organizationId: string,
        userId: string,
        newRole: OrganizationRole,
        updatedBy: string
    ) {
        logger.info('Updating member role', {
            service: 'OrganizationService',
            method: 'updateMemberRole',
            organizationId,
            userId,
            newRole,
            updatedBy,
        });

        // Verify admin access
        await this.verifyAdminAccess(organizationId, updatedBy);

        const member = await prisma.organizationMember.findFirst({
            where: {
                organizationId,
                userId,
                deletedAt: null
            }
        });

        if (!member) {
            throw new Error('Member not found');
        }

        const updated = await prisma.organizationMember.update({
            where: { id: member.id },
            data: { role: newRole },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        return updated;
    }

    /**
     * Verify user has admin access to organization
     */
    private async verifyAdminAccess(organizationId: string, userId: string) {
        const member = await prisma.organizationMember.findFirst({
            where: {
                organizationId,
                userId,
                deletedAt: null
            }
        });

        if (!member) {
            throw new Error('Not a member of this organization');
        }

        if (member.role !== OrganizationRole.ADMIN) {
            throw new Error('Admin access required');
        }

        return member;
    }

    /**
     * Transform organization for client
     */
    private transformOrganization(organization: any) {
        return {
            id: organization.id,
            name: organization.name,
            description: organization.description,
            sector: organization.sector,
            region: organization.region,
            country: organization.country,
            size: organization.size,
            website: organization.website,
            members: organization.members?.map((m: any) => ({
                id: m.id,
                userId: m.userId,
                role: m.role,
                user: m.user,
                joinedAt: m.createdAt?.toISOString()
            })),
            projectCount: organization._count?.projects,
            assessmentCount: organization._count?.assessments,
            memberCount: organization._count?.members,
            createdAt: organization.createdAt?.toISOString(),
            updatedAt: organization.updatedAt?.toISOString(),
        };
    }
}

// Export singleton instance
export const organizationService = new OrganizationService();
