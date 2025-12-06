// Notification Service
// Handles user notifications

import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export interface CreateNotificationInput {
    userId: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    metadata?: any;
}

export class NotificationService {
    /**
     * Create notification
     */
    async create(data: CreateNotificationInput) {
        logger.info('Creating notification', {
            service: 'NotificationService',
            method: 'create',
            userId: data.userId,
            type: data.type,
        });

        const notification = await prisma.notification.create({
            data: {
                userId: data.userId,
                type: data.type,
                title: data.title,
                message: data.message,
                actionUrl: data.link,
                // metadata: data.metadata, // Metadata not supported in Notification model
                read: false,
            }
        });

        return notification;
    }

    /**
     * Get user notifications
     */
    async getUserNotifications(userId: string, unreadOnly = false) {
        const notifications = await prisma.notification.findMany({
            where: {
                userId,
                ...(unreadOnly && { read: false })
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return notifications;
    }

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId: string, userId: string) {
        const notification = await prisma.notification.findFirst({
            where: { id: notificationId, userId }
        });

        if (!notification) {
            throw new Error('Notification not found');
        }

        return await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true }
        });
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(userId: string) {
        await prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true }
        });

        return { success: true };
    }

    /**
     * Delete notification
     */
    async delete(notificationId: string, userId: string) {
        const notification = await prisma.notification.findFirst({
            where: { id: notificationId, userId }
        });

        if (!notification) {
            throw new Error('Notification not found');
        }

        await prisma.notification.delete({
            where: { id: notificationId }
        });

        return { success: true };
    }

    /**
     * Get unread count
     */
    async getUnreadCount(userId: string) {
        const count = await prisma.notification.count({
            where: { userId, read: false }
        });

        return { count };
    }
}

// Export singleton instance
export const notificationService = new NotificationService();
