import { TrustEvidenceWeight, TrustRoleCriticality } from '@prisma/client';

// Re-export Prisma enums for use in other files
export { TrustEvidenceWeight, TrustRoleCriticality };

// ============================================================================
// TRUST LAYER TYPES
// ============================================================================

export interface TrustLayer {
    id: string;
    layerId: string;
    name: string;
    description: string | null;
    baselineWeight: number;
    totalQuestions: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface TrustLayerWithSubDimensions extends TrustLayer {
    subDimensions: TrustSubDimension[];
}

export interface TrustLayerWithQuestions extends TrustLayerWithSubDimensions {
    subDimensions: TrustSubDimensionWithQuestions[];
}

// ============================================================================
// SUB-DIMENSION TYPES
// ============================================================================

export interface TrustSubDimension {
    id: string;
    dimensionId: string;
    name: string;
    weight: number;
    layerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TrustSubDimensionWithQuestions extends TrustSubDimension {
    questions: TrustQuestion[];
}

// Evidence Types
export interface Evidence {
    id: string;
    assessmentId: string;
    questionId: string | null;
    responseId: string | null;
    fileName: string;
    fileType: string;
    fileSize: number;
    storageUrl: string;
    storageKey: string;
    uploadedById: string;
    uploadedAt: Date | string;
    validationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';
    validatedById?: string | null;
    validatedAt?: Date | string | null;
    validationNotes?: string | null;
    processingStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    documentType?: string | null;
    extractedText?: string | null;
    extractedData?: any;
    qualityScore?: number | null;
    processingError?: string | null;
}

export interface UploadEvidenceDto {
    file: File;
    assessmentId: string;
    questionId: string;
    respondentId?: string;
}

export type EvidenceValidationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';
export type ProcessingStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

// ============================================================================
// QUESTION TYPES
// ============================================================================

export interface TrustQuestion {
    id: string;
    questionId: string;
    text: string;
    subDimensionId: string;
    stakeholderTypes: string[];
    evidenceRequired: string;
    evidenceWeight: TrustEvidenceWeight;
    weightInLayer: number;
    scoringLogic: any;
    redFlags: any[];
    contextModifiers: any | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface TrustQuestionWithSubDimension extends TrustQuestion {
    subDimension: TrustSubDimension;
}

// ============================================================================
// PARTNER TYPE TYPES
// ============================================================================

export interface TrustPartnerType {
    id: string;
    name: string;
    description: string | null;
    layerWeights: any;
    createdAt: Date;
    updatedAt: Date;
}

export interface TrustPartnerTypeWithRoles extends TrustPartnerType {
    requiredRoles: TrustRequiredRole[];
}

export interface TrustRequiredRole {
    id: string;
    name: string;
    layerCoverage: string[];
    criticality: TrustRoleCriticality;
    assessmentFocus: string;
    partnerTypeId: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// LAYER WEIGHTS TYPES
// ============================================================================

export interface LayerWeights {
    [layerId: string]: number;
}

export interface TrustSectorWeight {
    id: string;
    sector: string;
    layerWeights: any;
    rationale: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// VETO CRITERIA TYPES
// ============================================================================

export interface TrustVetoCriterion {
    id: string;
    name: string;
    condition: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    message: string;
    overridesScore: boolean;
    sector: string | null;
    partnerType: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// QUERY FILTER TYPES
// ============================================================================

export interface QuestionFilters {
    partnerTypeId?: string;
    layerId?: string;
    stakeholderType?: string;
    evidenceWeight?: TrustEvidenceWeight;
}

export interface PartnerTypeFilters {
    name?: string;
}

// ============================================================================
// SERVICE RESPONSE TYPES
// ============================================================================

export interface GetQuestionsResponse {
    questions: TrustQuestion[];
    total: number;
}

export interface GetLayersResponse {
    layers: TrustLayerWithSubDimensions[];
    total: number;
}

export interface GetPartnerTypesResponse {
    partnerTypes: TrustPartnerType[];
    total: number;
}
