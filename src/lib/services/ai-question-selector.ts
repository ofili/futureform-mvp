/**
 * AI Question Selector Service
 * 
 * This service provides AI-driven question selection for assessments.
 * Currently mocked - will be replaced with actual AI integration in Phase 2.
 */

export interface AISelectionParams {
    sector: string;
    region: string;
    assessmentType: string;
    depth: 'quick' | 'standard' | 'deep';
    organizationSize?: string;
    attachedDocs?: string[]; // URLs or content
}

export interface SelectedQuestion {
    questionId: string;
    confidence: number; // 0-1
    rationale: string;
    suggestedRole: string;
    suggestedSeniority: string;
    suggestedEvidence: string[];
}

/**
 * Depth configuration for question selection
 */
const DEPTH_CONFIG = {
    quick: {
        questionCount: 15,
        minConfidence: 0.7,
        prioritizeCoreQuestions: true,
    },
    standard: {
        questionCount: 30,
        minConfidence: 0.6,
        prioritizeCoreQuestions: false,
    },
    deep: {
        questionCount: 50,
        minConfidence: 0.5,
        prioritizeCoreQuestions: false,
    },
};

/**
 * Role suggestions based on question domain
 */
const DOMAIN_ROLE_MAPPING: Record<string, { role: string; seniority: string }> = {
    Integrity: { role: 'Chief Financial Officer (CFO)', seniority: 'C-Level' },
    Capability: { role: 'Chief Operating Officer (COO)', seniority: 'C-Level' },
    Impact: { role: 'Program Director', seniority: 'Director' },
};

/**
 * Evidence type suggestions based on question category
 */
const CATEGORY_EVIDENCE_MAPPING: Record<string, string[]> = {
    governance: ['Policy Document', 'Board Minutes', 'Organizational Chart'],
    financial: ['Financial Statement', 'Audit Report', 'Budget Document'],
    operations: ['Process Document', 'SOP', 'Quality Certificate'],
    impact: ['Impact Report', 'Case Study', 'Beneficiary Data'],
    hr: ['Employee Handbook', 'Training Records', 'HR Policy'],
    technology: ['System Documentation', 'Security Certificate', 'IT Policy'],
};

/**
 * Mock AI Question Selector
 * 
 * Selects questions based on sector, depth, and assessment type.
 * Uses a rule-based approach to simulate AI selection.
 * 
 * @param params - Selection parameters
 * @returns Promise<SelectedQuestion[]> - Array of selected questions with metadata
 */
export async function selectQuestions(
    params: AISelectionParams
): Promise<SelectedQuestion[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const config = DEPTH_CONFIG[params.depth];

    // In a real implementation, this would:
    // 1. Call an AI service (OpenAI, Claude, etc.)
    // 2. Analyze sector-specific requirements
    // 3. Consider attached documents
    // 4. Return personalized question selection

    // For now, return mock data
    const mockQuestions: SelectedQuestion[] = generateMockQuestions(
        config.questionCount,
        params
    );

    return mockQuestions;
}

/**
 * Generate mock questions for testing
 */
function generateMockQuestions(
    count: number,
    params: AISelectionParams
): SelectedQuestion[] {
    const questions: SelectedQuestion[] = [];
    const domains = ['Integrity', 'Capability', 'Impact'];
    const categories = Object.keys(CATEGORY_EVIDENCE_MAPPING);

    for (let i = 0; i < count; i++) {
        const domain = domains[i % domains.length];
        const category = categories[i % categories.length];
        const roleMapping = DOMAIN_ROLE_MAPPING[domain];

        questions.push({
            questionId: `question-${i + 1}`, // Will be replaced with actual question IDs from DB
            confidence: 0.7 + Math.random() * 0.3, // 0.7-1.0
            rationale: generateRationale(params, domain, category),
            suggestedRole: roleMapping.role,
            suggestedSeniority: roleMapping.seniority,
            suggestedEvidence: CATEGORY_EVIDENCE_MAPPING[category] || [],
        });
    }

    // Sort by confidence (highest first)
    return questions.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Generate rationale for question selection
 */
function generateRationale(
    params: AISelectionParams,
    domain: string,
    category: string
): string {
    const reasons = [
        `Critical for ${params.sector} sector organizations`,
        `Standard requirement for ${params.assessmentType} assessments`,
        `Relevant to ${params.region} regulatory context`,
        `Core ${domain} domain indicator`,
        `Essential ${category} assessment criteria`,
    ];

    return reasons[Math.floor(Math.random() * reasons.length)];
}

/**
 * Get role suggestion for a specific question
 * 
 * @param questionDomain - The domain of the question
 * @returns Role and seniority suggestion
 */
export function suggestRoleForQuestion(questionDomain: string): {
    role: string;
    seniority: string;
} {
    return (
        DOMAIN_ROLE_MAPPING[questionDomain] || {
            role: 'Chief Executive Officer (CEO)',
            seniority: 'C-Level',
        }
    );
}

/**
 * Get evidence suggestions for a question category
 * 
 * @param category - The question category
 * @returns Array of suggested evidence types
 */
export function suggestEvidenceForCategory(category: string): string[] {
    return CATEGORY_EVIDENCE_MAPPING[category] || ['Supporting Document'];
}
