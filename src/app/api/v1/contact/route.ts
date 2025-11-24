import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { name, email, company, message, program, orgType, region, scale } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
        }

        // 1. Save to Database
        const contact = await prisma.contactRequest.create({
            data: {
                name,
                email,
                company: company ?? null,
                // Note: We might want to store program/orgType/etc in the DB too if the model supports it, 
                // but for now we just ensure they are in the email. 
                // If the model doesn't have these fields yet, we can store them in the message or a JSON field if available.
                // Checking schema, ContactRequest only has name, email, company, message, status.
                // So we will append the extra info to the message stored in DB or just rely on email.
                // Let's append to the message stored in DB for completeness.
                message: `[Program: ${program}] ${message}`
            },
        });

        // 2. Fetch Recipient Email from Form Options
        const recipientOption = await prisma.formOption.findFirst({
            where: {
                category: 'CONTACT_CONFIG',
                label: 'Recipient Email'
            }
        });

        const recipientEmail = recipientOption?.value || process.env.CONTACT_EMAIL_RECIPIENT || 'admin@futureform.org'; // Fallback

        // 3. Send Email via Nodemailer
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.SMTP_FROM || '"FutureForm Contact" <no-reply@futureform.org>',
                to: recipientEmail,
                subject: `New Contact Request: ${name} (${program || 'General'})`,
                html: `
                    <h2>New Contact Request</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Company:</strong> ${company || 'N/A'}</p>
                    <p><strong>Program Interest:</strong> ${program || 'General'}</p>
                    ${program === 'government' ? `
                        <p><strong>Organization Type:</strong> ${orgType || 'N/A'}</p>
                        <p><strong>Region:</strong> ${region || 'N/A'}</p>
                        <p><strong>Scale:</strong> ${scale || 'N/A'}</p>
                    ` : ''}
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                `,
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${recipientEmail} for contact request ${contact.id}`);
        } else {
            console.warn('SMTP configuration missing. Email not sent.');
        }

        return NextResponse.json({ success: true, contactId: contact.id }, { status: 201 });
    } catch (error: any) {
        console.error('Contact request error:', error);
        return NextResponse.json({ error: 'Failed to create contact request.', details: error.message }, { status: 500 });
    }
}
