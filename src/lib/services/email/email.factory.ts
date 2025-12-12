import { IEmailService } from './types';
import { ResendService } from './resend.service';
import { MailerSendService } from './mailerSend.service';
import { MailtrapService } from './mailtrap.service';
import { logger } from '@/lib/logger';

export const getEmailService = (): IEmailService => {
    const provider = process.env.EMAIL_PROVIDER || 'resend';

    if (provider === 'mailtrap') {
        if (!process.env.MAILTRAP_API_TOKEN) {
            logger.warn('EMAIL_PROVIDER is mailtrap but MAILTRAP_API_TOKEN is missing. Emails may fail.', {
                service: 'EmailFactory',
                method: 'getEmailService',
            });
        }
        return new MailtrapService();
    }

    if (provider === 'mailersend') {
        if (!process.env.MAILERSEND_API_KEY) {
            logger.warn('EMAIL_PROVIDER is mailersend but MAILERSEND_API_KEY is missing. Emails may fail.', {
                service: 'EmailFactory',
                method: 'getEmailService',
            });
        }
        return new MailerSendService();
    }

    // Default to Resend
    return new ResendService();
};
