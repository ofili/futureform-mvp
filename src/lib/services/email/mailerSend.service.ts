import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { IEmailService, EmailPayload } from './types';
import { logger } from '@/lib/logger';

export class MailerSendService implements IEmailService {
    private mailerSend: MailerSend;

    constructor() {
        const apiKey = process.env.MAILERSEND_API_KEY;
        if (!apiKey) {
            logger.warn('MAILERSEND_API_KEY is not set');
        }
        this.mailerSend = new MailerSend({
            apiKey: apiKey || '',
        });
    }

    async sendEmail({ to, subject, html, from }: EmailPayload): Promise<void> {
        const fromAddress = from || 'noreply@futureform.com';
        const fromName = 'FutureForm'; // Or parse from the string if needed

        // MailerSend expects distinct sender name/email and recipient objects
        const sentFrom = new Sender(fromAddress, fromName);
        const recipients = [new Recipient(to, to)];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject(subject)
            .setHtml(html);

        try {
            await this.mailerSend.email.send(emailParams);
            logger.info(`Email sent via MailerSend to ${to}`);
        } catch (error) {
            logger.error('Failed to send email via MailerSend', error as Error);
            throw error;
        }
    }
}
