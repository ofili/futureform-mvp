// src/services/invitations/invitation.service.ts
import prisma from '@/lib/prisma';
import { rcService } from '@/services/credits/rc.service';
import { InsufficientCreditsError, CreditExpiredError } from '@/lib/errors/credit-errors';

export interface AcceptInvitationInput {
	token: string;
	password?: string;
	linkedInUrl?: string; // [NEW] For respondents
	userDetails?: {
		firstName: string;
		lastName: string;
		jobTitle?: string;
		department?: string;
	};
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
				type?: string;
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
		// 1. AssessmentRespondent
		const respondent = await prisma.assessmentRespondent.findUnique({
			where: { invitationToken: token },
			include: {
				assessmentPartner: {
					include: { assessment: { include: { project: { select: { name: true, description: true } } } } }
				}
			}
		});
		if (respondent) {
			// Check expiry?
			return {
				...respondent,
				assessment: respondent.assessmentPartner.assessment,
				role: { name: respondent.role },
				isRespondent: true
			};
		}

		// 2. AssessmentPartner
		const partner = await prisma.assessmentPartner.findUnique({
			where: { invitationToken: token },
			include: { assessment: { include: { project: { select: { name: true, description: true } } } } }
		});
		if (partner) {
			return {
				...partner,
				email: partner.adminEmail,
				name: partner.adminName,
				role: { name: 'Partner Admin' },
				isPartnerAdmin: true
			};
		}

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
		const { token, password, linkedInUrl } = input;

		// 0. Try finding AssessmentPartner (Partner Admin Flow)
		const partner = await prisma.assessmentPartner.findUnique({
			where: { invitationToken: token },
			include: { assessment: { include: { project: true } } }
		});

		if (partner) {
			if (partner.invitationStatus === 'ACCEPTED') throw new Error('ALREADY_ACCEPTED');

			if (!partner.adminEmail) throw new Error('PARTNER_EMAIL_MISSING');
			if (!partner.adminName) throw new Error('PARTNER_NAME_MISSING');

			let user = await prisma.user.findUnique({ where: { email: partner.adminEmail } });
			if (!user) {
				if (!password) throw new Error('PASSWORD_REQUIRED');
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const bcrypt = require('bcryptjs');
				const hashedPassword = await bcrypt.hash(password, 10);

				user = await prisma.user.create({
					data: {
						email: partner.adminEmail,
						password: hashedPassword,
						firstName: partner.adminName.split(' ')[0] || 'Admin',
						lastName: partner.adminName.split(' ').slice(1).join(' ') || '',
						role: 'USER', // Eventually maybe PARTNER_ADMIN
						verified: true,
						emailVerified: true
					}
				});
			}

			await prisma.assessmentPartner.update({
				where: { id: partner.id },
				data: { invitationStatus: 'ACCEPTED', status: 'ACTIVE' }
			});

			return {
				user,
				assessment: {
					id: partner.assessment.id,
					title: partner.assessment.project.name,
					projectName: partner.assessment.project.name,
					deadline: null,
					questions: []
				}
			};
		}

		// 1. Try finding AssessmentRespondent (NEW Flow)
		const respondent = await prisma.assessmentRespondent.findUnique({
			where: { invitationToken: token },
			include: {
				assessmentPartner: {
					include: {
						assessment: {
							include: {
								project: { include: { organization: true } },
								assessmentQuestions: {
									include: { question: true, role: true }
								}
							}
						},
						partner: true,
						partnerAlias: true,
					}
				}
			}
		});

		if (respondent) {
			if (respondent.invitationStatus === 'REGISTERED' || respondent.invitationStatus === 'ACCEPTED') {
				throw new Error('ALREADY_ACCEPTED');
			}

			if (!linkedInUrl) throw new Error('LINKEDIN_REQUIRED');

			let user = await prisma.user.findUnique({ where: { email: respondent.email } });
			if (!user) {
				if (!password) throw new Error('PASSWORD_REQUIRED');
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const bcrypt = require('bcryptjs');
				const hashedPassword = await bcrypt.hash(password, 10);

				user = await prisma.user.create({
					data: {
						email: respondent.email,
						password: hashedPassword,
						firstName: respondent.name.split(' ')[0],
						lastName: respondent.name.split(' ').slice(1).join(' ') || '',
						role: 'USER',
						verified: true,
					}
				});
			}

			await prisma.assessmentRespondent.update({
				where: { id: respondent.id },
				data: {
					userId: user.id,
					invitationStatus: 'REGISTERED',
					linkedInUrl: linkedInUrl,
				}
			});

			const questions = respondent.assessmentPartner.assessment.assessmentQuestions.map(q => ({
				id: q.id,
				assignedRoleId: q.assignedRoleId,
				question: { id: q.questionId, text: q.question.text, type: (q.question as any).type || 'LIKERT' },
				role: q.role ? { id: q.role.id, name: q.role.name } : null
			}));

			return {
				user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
				assessment: {
					id: respondent.assessmentPartner.assessment.id,
					title: (respondent.assessmentPartner.assessment as any).title || 'Assessment',
					projectName: respondent.assessmentPartner.assessment.project.name,
					deadline: respondent.assessmentPartner.assessment.deadline,
					questions: questions
				}
			};
		}

		// 2. Find invitation (OLD Flow)
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

			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const bcrypt = require('bcryptjs');
			const hashedPassword = await bcrypt.hash(password, 10);

			user = await prisma.user.create({
				data: {
					email: invitation.email,
					password: hashedPassword,
					firstName: input.userDetails?.firstName || invitation.name?.split(' ')[0] || 'User',
					lastName: input.userDetails?.lastName || invitation.name?.split(' ').slice(1).join(' ') || '',
					jobTitle: input.userDetails?.jobTitle,
					department: input.userDetails?.department,
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
				// @ts-ignore - Assuming title exists or defaulting
				title: (invitation.assessment as any).title || (invitation.assessment as any).name || 'Assessment',
				projectName: invitation.assessment.project.name,
				deadline: invitation.assessment.deadline,
				// @ts-ignore
				questions: assessmentQuestions.map(q => ({
					...q,
					question: {
						...q.question,
						type: (q.question as any).type || 'LIKERT'
					}
				})),
			}
		};
	}
}

export const invitationService = new InvitationService();
