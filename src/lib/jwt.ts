import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-fallback-secret-change-in-production'

export interface UnsubscribeTokenPayload {
    userId: string
    notificationType: string
    email: string
}

export function generateUnsubscribeToken(payload: UnsubscribeTokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '30d'
    })
}

export function verifyUnsubscribeToken(token: string): UnsubscribeTokenPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as UnsubscribeTokenPayload
        return decoded
    } catch (error) {
        console.error('JWT verification error:', error)
        return null
    }
}

export function generateUnsubscribeUrl(userId: string, notificationType: string, email: string): string {
    const token = generateUnsubscribeToken({ userId, notificationType, email })
    return `${process.env.NEXTAUTH_URL}/api/notifications/unsubscribe/${token}`
}

export function generateOrganizationInvitationUrl(invitationToken: string): string {
    return `${process.env.NEXTAUTH_URL}/api/organization/accept-invitation?token=${invitationToken}`
}

export function generateAssessmentUrl(assessmentToken: string): string {
    return `${process.env.NEXTAUTH_URL}/assessment/${assessmentToken}`
}
