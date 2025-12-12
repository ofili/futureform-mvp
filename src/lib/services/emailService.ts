import { getEmailService } from './email/email.factory';

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

/**
 * Legacy email function - now delegates to the email factory
 * This ensures all emails go through the configured provider (Mailtrap, Resend, etc.)
 */
export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
    const emailService = getEmailService();
    await emailService.sendEmail({ to, subject, html });
};
