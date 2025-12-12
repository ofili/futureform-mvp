// Test script to send an email via Mailtrap
// Run with: npx tsx scripts/test-email.ts

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(__dirname, '../.env.local') });

import { getEmailService } from '../src/lib/services/email/email.factory';

async function testEmail() {
    console.log('🚀 Testing Mailtrap email...');
    console.log(`EMAIL_PROVIDER: ${process.env.EMAIL_PROVIDER}`);

    const emailService = getEmailService();

    try {
        await emailService.sendEmail({
            to: 'myefex2@gmail.com',
            subject: 'FutureForm Test Email ✉️',
            html: `
                <h1>Hello from FutureForm!</h1>
                <p>This is a test email sent via Mailtrap.</p>
                <p>If you're seeing this, the email integration is working correctly! 🎉</p>
                <hr />
                <p style="color: #666; font-size: 12px;">Sent at: ${new Date().toISOString()}</p>
            `,
        });
        console.log('✅ Email sent successfully!');
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        process.exit(1);
    }
}

testEmail();
