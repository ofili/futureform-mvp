import prisma from '@/lib/prisma'

/**
 * Check if notification should be sent based on user preferences
 */
export async function shouldSendNotification(userId: string, notificationType: string): Promise<{
    send: boolean
    method: 'email' | 'digest' | 'none'
    timing: 'immediate' | 'daily' | 'weekly'
}> {
    const prefs = await prisma.userNotificationPreferences.findUnique({
        where: { userId }
    })

    if (!prefs) {
        return { send: true, method: 'email', timing: 'immediate' }
    }

    // Security alerts always sent
    if (notificationType === 'security_alert') {
        return { send: true, method: 'email', timing: 'immediate' }
    }

    // Check user preference
    const prefKey = `email${notificationType.charAt(0).toUpperCase() + notificationType.slice(1)}` as keyof typeof prefs

    if (!prefs[prefKey]) {
        return { send: false, method: 'none', timing: 'immediate' }
    }

    // Determine timing
    if (prefs.emailFrequency === 'REALTIME') {
        return { send: true, method: 'email', timing: 'immediate' }
    }

    if (prefs.emailFrequency === 'DAILY') {
        await queueNotificationForDigest(userId, notificationType, 'daily')
        return { send: true, method: 'digest', timing: 'daily' }
    }

    await queueNotificationForDigest(userId, notificationType, 'weekly')
    return { send: true, method: 'digest', timing: 'weekly' }
}

/**
 * Queue notification for digest
 */
async function queueNotificationForDigest(userId: string, notificationType: string, frequency: 'daily' | 'weekly') {
    const scheduledFor = calculateNextDigestTime(frequency)

    await prisma.notificationQueue.create({
        data: {
            userId,
            notificationType,
            notificationData: {},
            scheduledFor
        }
    })
}

/**
 * Calculate next digest time
 */
function calculateNextDigestTime(frequency: 'daily' | 'weekly'): Date {
    const now = new Date()

    if (frequency === 'daily') {
        const nextDigest = new Date(now)
        nextDigest.setHours(9, 0, 0, 0)
        if (nextDigest <= now) {
            nextDigest.setDate(nextDigest.getDate() + 1)
        }
        return nextDigest
    } else {
        const nextDigest = new Date(now)
        nextDigest.setHours(9, 0, 0, 0)
        const dayOfWeek = nextDigest.getDay()
        const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek
        nextDigest.setDate(nextDigest.getDate() + daysUntilMonday)
        return nextDigest
    }
}

/**
 * Send notification to user
 */
export async function sendNotification(userId: string, type: string, data: any) {
    const { send, method, timing } = await shouldSendNotification(userId, type)

    if (!send) {
        return
    }

    // Create in-app notification
    await prisma.notification.create({
        data: {
            userId,
            type,
            title: getNotificationTitle(type, data),
            message: getNotificationMessage(type, data),
            actionUrl: getNotificationActionUrl(type, data)
        }
    })

    // Send email if immediate
    if (method === 'email' && timing === 'immediate') {
        // TODO: Send email via email service
        console.log(`Email notification sent to user ${userId}: ${type}`)
    }
}

function getNotificationTitle(type: string, data: any): string {
    const titles: { [key: string]: string } = {
        'assessment_submitted': 'Assessment Submitted',
        'team_invitation': 'Team Invitation',
        'clarification_response': 'Clarification Response Received',
        'partner_started': 'Partner Started Assessment',
        'team_mention': 'You Were Mentioned',
        'deadline_reminder': 'Assessment Deadline Approaching',
        'credit_low': 'Low Credit Balance',
        'credit_expiring': 'Credits Expiring Soon',
        'profile_generated': 'Trust Profile Generated',
        'export_ready': 'Report Export Ready',
        'payment_success': 'Payment Confirmed',
        'payment_failed': 'Payment Failed'
    }
    return titles[type] || 'New Notification'
}

function getNotificationMessage(type: string, data: any): string {
    const messages: { [key: string]: (data: any) => string } = {
        'assessment_submitted': (d) => `${d.partnerName} has submitted their assessment`,
        'team_invitation': (d) => `You've been invited to join ${d.projectName}`,
        'credit_low': (d) => d.message || `You have ${d.remainingCredits} credits remaining`,
        'profile_generated': (d) => `Trust profile for ${d.partnerName} is ready`,
        'payment_success': (d) => `Payment of ${d.amount} ${d.currency} confirmed`
    }

    const messageFn = messages[type]
    return messageFn ? messageFn(data) : 'You have a new notification'
}

function getNotificationActionUrl(type: string, data: any): string | null {
    const urls: { [key: string]: (data: any) => string } = {
        'assessment_submitted': (d) => `/assessments/${d.assessmentId}`,
        'team_invitation': (d) => `/projects/${d.projectId}`,
        'profile_generated': (d) => `/assessments/${d.assessmentId}/profile`,
        'credit_low': () => '/settings/billing'
    }

    const urlFn = urls[type]
    return urlFn ? urlFn(data) : null
}
