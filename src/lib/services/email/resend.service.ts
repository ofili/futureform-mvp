import { Resend } from 'resend';
import { IEmailService, EmailPayload } from './types';
import { logger } from '@/lib/logger';

export class ResendService implements IEmailService {
    private resend: Resend;

    constructor() {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            logger.warn('RESEND_API_KEY is not set');
        }
        this.resend = new Resend(apiKey);
    }

    async sendEmail({ to, subject, html, from }: EmailPayload): Promise<void> {
        const fromAddress = from || 'FutureForm <noreply@futureform.com>';

        try {
            await this.resend.emails.send({
                from: fromAddress,
                to,
                subject,
                html,
            });
            logger.info(`Email sent via Resend to ${to}`);
        } catch (error) {
            logger.error('Failed to send email via Resend', error as Error);
            throw error;
        }
    }
}
