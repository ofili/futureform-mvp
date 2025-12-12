import { MailtrapClient } from 'mailtrap';
import { IEmailService, EmailPayload } from './types';
import { logger } from '@/lib/logger';

/**
 * Mailtrap Email Service using the official Mailtrap SDK
 * Uses API token authentication (no username/password needed)
 */
export class MailtrapService implements IEmailService {
    private client: MailtrapClient;
    private sandbox: boolean;
    private inboxId?: number;

    constructor() {
        const token = process.env.MAILTRAP_API_TOKEN;
        this.sandbox = process.env.MAILTRAP_SANDBOX === 'true';
        this.inboxId = process.env.MAILTRAP_INBOX_ID ? parseInt(process.env.MAILTRAP_INBOX_ID, 10) : undefined;

        if (!token) {
            logger.warn('MAILTRAP_API_TOKEN is not set. Emails may fail.', {
                service: 'MailtrapService',
                method: 'constructor',
            });
        }

        this.client = new MailtrapClient({
            token: token || '',
        });
    }

    async sendEmail({ to, subject, html, from }: EmailPayload): Promise<void> {
        const fromAddress = from || 'hello@demomailtrap.co';

        try {
            if (this.sandbox && this.inboxId) {
                // Sandbox/Testing mode - sends to Mailtrap inbox for preview
                await this.client.testing.send({
                    inboxId: this.inboxId,
                    from: { email: fromAddress, name: 'Gitance' },
                    to: [{ email: to }],
                    subject,
                    html,
                });
            } else {
                // Production/Sending mode
                await this.client.send({
                    from: { email: fromAddress, name: 'Gitance' },
                    to: [{ email: to }],
                    subject,
                    html,
                });
            }

            logger.info(`Email sent via Mailtrap to ${to}`, {
                service: 'MailtrapService',
                method: 'sendEmail',
                sandbox: this.sandbox,
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
