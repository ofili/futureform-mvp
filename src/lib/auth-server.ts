import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

export interface AuthPayload {
    id: string;
    email: string;
    role?: string;
}

export function verifyToken(token: string): AuthPayload | null {
    try {
        return jwt.verify(token, SECRET) as AuthPayload;
    } catch (err) {
        return null;
    }
}
