// src/services/invitations/invitation.service.ts
import prisma from '@/lib/prisma';
import { rcService } from '@/services/credits/rc.service';
import { InsufficientCreditsError, CreditExpiredError } from '@/lib/errors/credit-errors';

export interface AcceptInvitationInput {
  token: string;
  password?: string;
}

export interface AcceptInvitationResult {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  assessment: {
    id: string;
    title: string;
    projectName: string;
    deadline: Date | null;
    questions: Array<{
      id: string;
      assignedRoleId: string | null;
      question: {
        id: string;
        text: string;
        type: string;
        // Add other question fields as needed
      };
      role: {
        id: string;
        name: string;
      } | null;
    }>;
  };
}

export class InvitationService {
  /**
   * Get invitation details for preview
   */
  async getInvitation(token: string) {
    const invitation = await prisma.assessmentInvitation.findUnique({
      where: { token },
      include: {
        assessment: {
          include: {
            project: { select: { name: true, description: true } },
          },
        },
        role: true,
      },
    });

    if (!invitation) {
      throw new Error('INVALID_INVITATION');
    }

    if (new Date() > invitation.expiresAt) {
      throw new Error('INVITATION_EXPIRED');
    }

    return invitation;
  }

  /**
   * Accept an invitation, create user if needed, and consume respondent credit
   */
  async acceptInvitation(input: AcceptInvitationInput): Promise<AcceptInvitationResult> {
    const { token, password } = input;

    // 1. Find invitation
    const invitation = await prisma.assessmentInvitation.findUnique({
      where: { token },
      include: {
        assessment: {
          include: {
            project: {
              include: { organization: true },
            },
          },
        },
        role: true,
      },
    });

    if (!invitation) {
      throw new Error('INVALID_INVITATION');
    }

    if (new Date() > invitation.expiresAt) {
      throw new Error('INVITATION_EXPIRED');
    }

    if (invitation.status === 'ACCEPTED') {
      throw new Error('ALREADY_ACCEPTED');
    }

    const organizationId = invitation.assessment.project.organizationId;
    if (!organizationId) {
      throw new Error('ORGANIZATION_NOT_FOUND');
    }

    // 2. Find or create user
    let user = await prisma.user.findUnique({
      where: { email: invitation.email },
    });

    if (!user) {
      if (!password) {
        throw new Error('PASSWORD_REQUIRED');
      }

      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);

      user = await prisma.user.create({
         data: {
          email: invitation.email,
          password: hashedPassword,
          firstName: invitation.name?.split(' ')[0] || 'User',
          lastName: invitation.name?.split(' ').slice(1).join(' ') || '',
          role: 'USER',
          verified: true,
          emailVerified: true,
        },
      });
    }

    // 3. Consume respondent credit (on acceptance)
    try {
      await rcService.consumeRC(
        organizationId,
        invitation.assessmentId,
        invitation.id,
        `Invitation accepted by ${invitation.email}`
      );
    } catch (error) {
      if (error instanceof InsufficientCreditsError) {
        throw new Error('INSUFFICIENT_CREDITS');
      }
      if (error instanceof CreditExpiredError) {
        throw new Error('CREDITS_EXPIRED');
      }
      throw error;
    }

    // 4. Update invitation to accepted
    await prisma.assessmentInvitation.update({
      where: { id: invitation.id },
       data: {
        userId: user.id,
        status: 'ACCEPTED',
        acceptedAt: new Date(),
      },
    });

    // 5. Load assigned questions
    const assessmentQuestions = await prisma.assessmentQuestion.findMany({
      where: {
        assessmentId: invitation.assessmentId,
        OR: [
          { assignedRoleId: null },
          { assignedRoleId: invitation.roleId },
        ],
      },
      include: {
        question: true,
        role: true,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      assessment: {
        id: invitation.assessment.id,
        title: invitation.assessment.name,
        projectName: invitation.assessment.project.name,
        deadline: invitation.assessment.deadline,
        questions: assessmentQuestions,
      },
    };
  }
}

export const invitationService = new InvitationService();
