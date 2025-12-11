export interface EmailPayload {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

export interface IEmailService {
    sendEmail(payload: EmailPayload): Promise<void>;
}
