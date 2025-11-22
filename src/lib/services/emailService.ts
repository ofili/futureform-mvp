import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
    // In development, if no SMTP credentials, log the email
    if (!process.env.SMTP_HOST) {
        console.log('---------------------------------------------------');
        console.log(`[DEV EMAIL] To: ${to}`);
        console.log(`[DEV EMAIL] Subject: ${subject}`);
        console.log(`[DEV EMAIL] Body: ${html}`);
        console.log('---------------------------------------------------');
        return;
    }

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"FutureForm" <noreply@futureform.com>',
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};
