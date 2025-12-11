import nodemailer from 'nodemailer';
import { IEmailService, EmailPayload } from './types';
import { logger } from '@/lib/logger';

/**
 * Mailtrap Email Service for Development/Testing
 * Uses SMTP transport with Mailtrap credentials
 */
export class MailtrapService implements IEmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        const host = process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io';
        const port = parseInt(process.env.MAILTRAP_PORT || '2525', 10);
        const user = process.env.MAILTRAP_USER;
        const pass = process.env.MAILTRAP_PASS;

        if (!user || !pass) {
            logger.warn('MAILTRAP_USER or MAILTRAP_PASS is not set. Emails may fail.', {
                service: 'MailtrapService',
                method: 'constructor',
            });
        }

        this.transporter = nodemailer.createTransport({
            host,
            port,
            auth: {
                user: user || '',
                pass: pass || '',
            },
        });
    }

    async sendEmail({ to, subject, html, from }: EmailPayload): Promise<void> {
        const fromAddress = from || 'hello@demomailtrap.co';

        try {
            const info = await this.transporter.sendMail({
                from: `"FutureForm" <${fromAddress}>`,
                to,
                subject,
                html,
            });

            logger.info(`Email sent via Mailtrap to ${to}`, {
                service: 'MailtrapService',
                method: 'sendEmail',
                messageId: info.messageId,
            });
        } catch (error) {
            logger.error('Failed to send email via Mailtrap', error as Error, {
                service: 'MailtrapService',
                method: 'sendEmail',
            });
            throw error;
        }
    }
}
