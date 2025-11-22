import { generateUnsubscribeUrl } from '@/lib/jwt'

// Email service configuration
// Note: Install Resend with: npm install resend
// import { Resend } from 'resend'
// export const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Send assessment invitation email
 */
export async function sendAssessmentInvitation({
  to,
  partnerName,
  projectName,
  assessmentToken,
  inviterUserId,
  inviterName
}: {
  to: string
  partnerName: string
  projectName: string
  assessmentToken: string
  inviterUserId: string
  inviterName: string
}) {
  const assessmentUrl = `${process.env.NEXTAUTH_URL}/assessment/${assessmentToken}`

  try {
    // TODO: Uncomment when Resend is installed
    // await resend.emails.send({
    //   from: 'FutureForm <noreply@futureform.africa>',
    //   to,
    //   subject: `You've been invited to complete a Trust Assessment for ${projectName}`,
    //   html: getAssessmentInvitationTemplate({
    //     partnerName,
    //     inviterName,
    //     projectName,
    //     assessmentUrl,
    //     inviterUserId,
    //     to
    //   })
    // })

    console.log('Assessment invitation email would be sent to:', to)
  } catch (error) {
    console.error('Assessment invitation email error:', error)
    throw error
  }
}

/**
 * Send team invitation email
 */
export async function sendTeamInvitation({
  to,
  inviterName,
  inviterUserId,
  projectName,
  role,
  invitationToken,
  personalMessage
}: {
  to: string
  inviterName: string
  inviterUserId: string
  projectName: string
  role: string
  invitationToken: string
  personalMessage?: string
}) {
  const acceptUrl = `${process.env.NEXTAUTH_URL}/api/team/accept?token=${invitationToken}`

  try {
    // TODO: Uncomment when Resend is installed
    // await resend.emails.send({
    //   from: 'FutureForm <noreply@futureform.africa>',
    //   to,
    //   subject: `${inviterName} invited you to collaborate on FutureForm`,
    //   html: getTeamInvitationTemplate({
    //     inviterName,
    //     projectName,
    //     role,
    //     acceptUrl,
    //     personalMessage,
    //     inviterUserId,
    //     to
    //   })
    // })

    console.log('Team invitation email would be sent to:', to)
  } catch (error) {
    console.error('Team invitation email error:', error)
    throw error
  }
}

/**
 * Email footer with unsubscribe link
 */
function getEmailFooter(userId: string, notificationType: string, email: string) {
  const unsubscribeUrl = generateUnsubscribeUrl(userId, notificationType, email)

  return `
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280; text-align: center;">
        You're receiving this email because you're a member of FutureForm.<br>
        <a href="${unsubscribeUrl}" style="color: #6b7280;">Unsubscribe from ${notificationType} notifications</a> | 
        <a href="${process.env.NEXTAUTH_URL}/settings/notifications" style="color: #6b7280;">Manage all notifications</a>
      </p>
    </div>
  `
}

function getAssessmentInvitationTemplate(data: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Trust Assessment Invitation</h2>
      <p>Dear ${data.partnerName},</p>
      <p>You have been invited by <strong>${data.inviterName}</strong> to complete a Trust Assessment for the project:</p>
      <p><strong>${data.projectName}</strong></p>
      <p>This assessment helps build transparency and trust between partners.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.assessmentUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Start Assessment
        </a>
      </div>
      <p>The assessment takes approximately 60-90 minutes to complete.</p>
      ${getEmailFooter(data.inviterUserId, 'assessment_invitations', data.to)}
    </div>
  `
}

function getTeamInvitationTemplate(data: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>You've been invited to collaborate</h2>
      <p>Hi there,</p>
      <p><strong>${data.inviterName}</strong> has invited you to join the project team for:</p>
      <div style="background: #f8f9fa; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0;">
        <h3 style="margin: 0 0 8px 0;">${data.projectName}</h3>
        <p style="margin: 0; color: #6b7280;">
          <strong>Your role:</strong> ${data.role.replace('_', ' ')}
        </p>
      </div>
      ${data.personalMessage ? `
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-style: italic;">"${data.personalMessage}"</p>
        </div>
      ` : ''}
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.acceptUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
          Accept Invitation
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">
        This invitation will expire in 7 days.
      </p>
      ${getEmailFooter(data.inviterUserId, 'team_invitations', data.to)}
    </div>
  `
}
/**
 * Send verification email
 */
export async function sendVerificationEmail(to: string, token: string) {
  // Placeholder for verification email
  console.log('Verification email would be sent to:', to, 'with token:', token);
}

/**
 * Send invite email (alias for team invitation)
 */
export const sendInviteEmail = sendTeamInvitation;

/**
 * Send added to project email
 */
export async function sendAddedToProjectEmail(to: string, projectName: string) {
  console.log('Added to project email would be sent to:', to, 'for project:', projectName);
}

/**
 * Generic send email function
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    // TODO: Uncomment when Resend is installed
    // await resend.emails.send({
    //   from: 'FutureForm <noreply@futureform.africa>',
    //   to,
    //   subject,
    //   html
    // })

    console.log('Email would be sent to:', to, 'with subject:', subject);
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}
