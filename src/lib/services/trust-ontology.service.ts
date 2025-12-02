import prisma from '../prisma';
import type {
    TrustLayer,
    TrustLayerWithSubDimensions,
    TrustLayerWithQuestions,
    TrustQuestion,
    TrustQuestionWithSubDimension,
    TrustPartnerType,
    TrustPartnerTypeWithRoles,
    TrustRequiredRole,
    LayerWeights,
    TrustSectorWeight,
    TrustVetoCriterion,
    QuestionFilters,
    GetQuestionsResponse,
    GetLayersResponse,
    GetPartnerTypesResponse,
} from '@/types/trust';

/**
 * Trust Ontology Service
 * 
 * Core service for managing and querying trust intelligence ontology data.
 * Provides methods to retrieve trust layers, questions, partner types, and weights.
 */
export class TrustOntologyService {
    /**
     * Get all trust layers with their sub-dimensions
     */
    async getAllLayers(): Promise<GetLayersResponse> {
        const layers = await prisma.trustLayer.findMany({
            include: {
                subDimensions: {
                    orderBy: { dimensionId: 'asc' },
                },
            },
            orderBy: { layerId: 'asc' },
        });

        return {
            layers: layers as TrustLayerWithSubDimensions[],
            total: layers.length,
        };
    }

    /**
     * Get a specific layer by ID with all questions
     */
    async getLayerById(layerId: string): Promise<TrustLayerWithQuestions | null> {
        const layer = await prisma.trustLayer.findUnique({
            where: { layerId },
            include: {
                subDimensions: {
                    include: {
                        questions: {
                            orderBy: { questionId: 'asc' },
                        },
                    },
                    orderBy: { dimensionId: 'asc' },
                },
            },
        });

        return layer as TrustLayerWithQuestions | null;
    }

    /**
     * Get all questions with optional filters
     */
    async getQuestions(filters?: QuestionFilters): Promise<GetQuestionsResponse> {
        const where: any = {};

        // Filter by partner type
        if (filters?.partnerTypeId) {
            where.partnerTypes = {
                some: {
                    partnerTypeId: filters.partnerTypeId,
                },
            };
        }

        // Filter by layer
        if (filters?.layerId) {
            where.subDimension = {
                layer: {
                    layerId: filters.layerId,
                },
            };
        }

        // Filter by stakeholder type
        if (filters?.stakeholderType) {
            where.stakeholderTypes = {
                has: filters.stakeholderType,
            };
        }

        // Filter by evidence weight
        if (filters?.evidenceWeight) {
            where.evidenceWeight = filters.evidenceWeight;
        }

        const questions = await prisma.trustQuestion.findMany({
            where,
            include: {
                subDimension: true,
            },
            orderBy: { questionId: 'asc' },
        });

        return {
            questions: questions as TrustQuestionWithSubDimension[],
            total: questions.length,
        };
    }

    /**
     * Get questions for a specific partner type
     */
    async getQuestionsForPartnerType(partnerTypeId: string): Promise<TrustQuestion[]> {
        const partnerTypeQuestions = await prisma.trustPartnerTypeQuestion.findMany({
            where: { partnerTypeId },
            include: {
                question: {
                    include: {
                        subDimension: true,
                    },
                },
            },
            orderBy: {
                question: {
                    questionId: 'asc',
                },
            },
        });

        return partnerTypeQuestions.map((ptq) => ptq.question) as TrustQuestion[];
    }

    /**
     * Get a specific question by ID
     */
    async getQuestionById(questionId: string): Promise<TrustQuestionWithSubDimension | null> {
        const question = await prisma.trustQuestion.findUnique({
            where: { questionId },
            include: {
                subDimension: true,
            },
        });

        return question as TrustQuestionWithSubDimension | null;
    }

    /**
     * Get all partner types
     */
    async getPartnerTypes(): Promise<GetPartnerTypesResponse> {
        const partnerTypes = await prisma.trustPartnerType.findMany({
            orderBy: { name: 'asc' },
        });

        return {
            partnerTypes: partnerTypes as TrustPartnerType[],
            total: partnerTypes.length,
        };
    }

    /**
     * Get a specific partner type by ID with required roles
     */
    async getPartnerTypeById(id: string): Promise<TrustPartnerTypeWithRoles | null> {
        const partnerType = await prisma.trustPartnerType.findUnique({
            where: { id },
            include: {
                requiredRoles: {
                    orderBy: { name: 'asc' },
                },
            },
        });

        return partnerType as TrustPartnerTypeWithRoles | null;
    }

    /**
     * Get required roles for a partner type
     */
    async getRequiredRoles(partnerTypeId: string): Promise<TrustRequiredRole[]> {
        const roles = await prisma.trustRequiredRole.findMany({
            where: { partnerTypeId },
            orderBy: { name: 'asc' },
        });

        return roles as TrustRequiredRole[];
    }

    /**
     * Get layer weights (baseline or sector-specific)
     */
    async getLayerWeights(sector?: string): Promise<LayerWeights> {
        // If sector is specified, try to get sector-specific weights
        if (sector) {
            const sectorWeight = await prisma.trustSectorWeight.findUnique({
                where: { sector },
            });

            if (sectorWeight) {
                return sectorWeight.layerWeights as LayerWeights;
            }
        }

        // Fall back to baseline weights
        const layers = await prisma.trustLayer.findMany({
            select: {
                layerId: true,
                baselineWeight: true,
            },
        });

        const weights: LayerWeights = {};
        layers.forEach((layer) => {
            weights[layer.layerId] = layer.baselineWeight;
        });

        return weights;
    }

    /**
     * Get all sector weights
     */
    async getAllSectorWeights(): Promise<TrustSectorWeight[]> {
        const sectorWeights = await prisma.trustSectorWeight.findMany({
            orderBy: { sector: 'asc' },
        });

        return sectorWeights as TrustSectorWeight[];
    }

    /**
     * Get veto criteria (optionally filtered by sector and partner type)
     */
    async getVetoCriteria(sector?: string, partnerType?: string): Promise<TrustVetoCriterion[]> {
        const where: any = {
            isActive: true,
        };

        // Filter by sector (null means applies to all sectors)
        if (sector) {
            where.OR = [{ sector }, { sector: null }];
        }

        // Filter by partner type (null means applies to all partner types)
        if (partnerType) {
            if (where.OR) {
                where.AND = [
                    { OR: where.OR },
                    { OR: [{ partnerType }, { partnerType: null }] },
                ];
                delete where.OR;
            } else {
                where.OR = [{ partnerType }, { partnerType: null }];
            }
        }

        const vetoCriteria = await prisma.trustVetoCriterion.findMany({
            where,
            orderBy: [{ severity: 'desc' }, { name: 'asc' }],
        });

        return vetoCriteria as TrustVetoCriterion[];
    }

    /**
     * Get statistics about the trust ontology
     */
    async getOntologyStats() {
        const [layerCount, questionCount, partnerTypeCount, sectorWeightCount] = await Promise.all([
            prisma.trustLayer.count(),
            prisma.trustQuestion.count(),
            prisma.trustPartnerType.count(),
            prisma.trustSectorWeight.count(),
        ]);

        return {
            layers: layerCount,
            questions: questionCount,
            partnerTypes: partnerTypeCount,
            sectorWeights: sectorWeightCount,
        };
    }
}

// Export singleton instance
export const trustOntologyService = new TrustOntologyService();
