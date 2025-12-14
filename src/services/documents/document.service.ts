import prisma from '@/lib/prisma';
import { Document } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export class DocumentService {
    async getDocumentsByEntity(entityType: string, entityId: string): Promise<Document[]> {
        if (entityType === 'project') {
            return prisma.document.findMany({
                where: { projectId: entityId },
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            });
        }
        // TODO: Handle other entity types if needed (e.g., assessment)
        return [];
    }

    async createDocument(data: {
        name: string;
        type: string;
        size: number;
        url: string;
        entityType: string;
        entityId: string;
        userId: string;
    }): Promise<Document> {
        const { entityType, entityId, ...rest } = data;

        if (entityType === 'project') {
            return prisma.document.create({
                data: {
                    ...rest,
                    projectId: entityId,
                },
            });
        }

        throw new Error('Unsupported entity type');
    }

    async deleteDocument(id: string): Promise<Document> {
        return prisma.document.delete({
            where: { id },
        });
    }
}

export const documentService = new DocumentService();
