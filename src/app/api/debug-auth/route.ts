import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
    try {
        const secret = process.env.JWT_SECRET;
        const secretStatus = secret ? `Defined (length: ${secret.length})` : 'Undefined';

        // Try to sign
        let token = '';
        let signError = null;
        try {
            token = jwt.sign({ test: 'data' }, secret || 'default_secret');
        } catch (e: any) {
            signError = e.message;
        }

        // Try to verify
        let verifyResult = null;
        let verifyError = null;
        try {
            verifyResult = jwt.verify(token, secret || 'default_secret');
        } catch (e: any) {
            verifyError = e.message;
        }

        return NextResponse.json({
            secretStatus,
            tokenGenerated: !!token,
            signError,
            verifyResult,
            verifyError,
            envCheck: {
                NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Defined' : 'Undefined',
                JWT_SECRET: process.env.JWT_SECRET ? 'Defined' : 'Undefined'
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
