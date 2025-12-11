import { IEmailService } from './types';
import { ResendService } from './resend.service';
import { MailerSendService } from './mailerSend.service';
import { logger } from '@/lib/logger';

export const getEmailService = (): IEmailService => {
    const provider = process.env.EMAIL_PROVIDER || 'resend';

    if (provider === 'mailersend') {
        // Check if key exists, if not warn but still return (or fall back)
        if (!process.env.MAILERSEND_API_KEY) {
            logger.warn('EMAIL_PROVIDER is mailersend but MAILERSEND_API_KEY is missing. Emails may fail.');
        }
        return new MailerSendService();
    }

    // Default to Resend
    return new ResendService();
};
