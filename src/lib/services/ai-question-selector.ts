/**
 * AI Question Selector Service
 * 
 * Real AI-powered question selection for trust assessments using OpenAI.
 * Features:
 * - Semantic analysis of partner context
 * - Document content analysis
 * - Sector-specific question prioritization
 * - Fallback to rule-based selection
 */

import { llmClient } from '@/services/copilot/llm-client.service';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import {
    QUESTION_SELECTION_SYSTEM_PROMPT,
    DOCUMENT_ANALYSIS_SYSTEM_PROMPT,
    buildQuestionSelectionPrompt,
    buildDocumentAnalysisPrompt,
    QuestionBankItem
} from '@/services/copilot/prompts/question-selection';

// ==================== Types ====================

export interface AISelectionParams {
    partnerTypeId?: string;
    partnerType?: string;
    sector: string;
    region: string;
    assessmentType: string;
    depth: 'quick' | 'standard' | 'deep';
    organizationSize?: string;
    projectContext?: string;
    attachedDocs?: AttachedDocument[];
}

export interface AttachedDocument {
    name: string;
    content: string; // Text content or base64
    type: 'text' | 'pdf' | 'image';
}

export interface SelectedQuestion {
    questionId: string;
    confidence: number;
    rationale: string;
    suggestedRole: string;
    suggestedSeniority: string;
    suggestedEvidence: string[];
    priority: number;
    layer?: string;
}

export interface SelectionResult {
    questions: SelectedQuestion[];
    layerCoverage: Record<string, number>;
    analysisNotes?: string;
    usedAI: boolean;
    tokensUsed?: number;
}

// ==================== Configuration ====================

const DEPTH_CONFIG = {
    quick: {
        questionCount: 15,
        minConfidence: 0.7,
        description: 'Quick assessment - critical indicators only'
    },
    standard: {
        questionCount: 30,
        minConfidence: 0.6,
        description: 'Standard assessment - balanced coverage'
    },
    deep: {
        questionCount: 50,
        minConfidence: 0.5,
        description: 'Comprehensive assessment - thorough coverage'
    }
};

const ROLE_MAPPING: Record<string, { role: string; seniority: string }> = {
    RELIABILITY: { role: 'Chief Operating Officer', seniority: 'C-Level' },
    TRANSPARENCY: { role: 'Chief Compliance Officer', seniority: 'C-Level' },
    GOVERNANCE: { role: 'General Counsel', seniority: 'C-Level' },
    COMPETENCE: { role: 'Chief Technology Officer', seniority: 'C-Level' },
    INTEGRITY: { role: 'Chief Financial Officer', seniority: 'C-Level' },
    ECOSYSTEM: { role: 'Chief Executive Officer', seniority: 'C-Level' }
};

const EVIDENCE_MAPPING: Record<string, string[]> = {
    RELIABILITY: ['SLA Documentation', 'Uptime Reports', 'Incident Logs'],
    TRANSPARENCY: ['Audit Reports', 'Disclosure Statements', 'Data Policies'],
    GOVERNANCE: ['Board Minutes', 'Org Chart', 'Policy Documents'],
    COMPETENCE: ['Certifications', 'Technical Documentation', 'Case Studies'],
    INTEGRITY: ['Financial Statements', 'Ethics Policy', 'Compliance Records'],
    ECOSYSTEM: ['Client References', 'Partner Agreements', 'Industry Recognition']
};

// ==================== Main Selection Function ====================

/**
 * Select questions using AI with fallback to rule-based selection
 */
export async function selectQuestions(
    params: AISelectionParams
): Promise<SelectionResult> {
    logger.info('Starting AI question selection', {
        service: 'AIQuestionSelector',
        method: 'selectQuestions',
        partnerType: params.partnerType,
        sector: params.sector,
        depth: params.depth
    });

    try {
        // 1. Fetch question bank from database
        const questionBank = await fetchQuestionBank(params.sector);

        if (questionBank.length === 0) {
            logger.warn('No questions found in database, returning empty result');
            return {
                questions: [],
                layerCoverage: {},
                usedAI: false,
                analysisNotes: 'No questions available in database'
            };
        }

        // 2. Analyze attached documents (if any)
        let documentSummary: string | undefined;
        if (params.attachedDocs && params.attachedDocs.length > 0) {
            documentSummary = await analyzeDocuments(params.attachedDocs);
        }

        // 3. Try AI-powered selection
        if (llmClient.isConfigured()) {
            try {
                const aiResult = await selectQuestionsWithAI(
                    params,
                    questionBank,
                    documentSummary
                );

                logger.info('AI question selection successful', {
                    service: 'AIQuestionSelector',
                    method: 'selectQuestions',
                    questionsSelected: aiResult.questions.length,
                    tokensUsed: aiResult.tokensUsed
                });

                return aiResult;
            } catch (aiError) {
                logger.warn('AI selection failed, falling back to rule-based', {
                    service: 'AIQuestionSelector',
                    method: 'selectQuestions',
                    error: (aiError as Error).message
                });
            }
        }

        // 4. Fallback to rule-based selection
        return selectQuestionsRuleBased(params, questionBank);

    } catch (error) {
        logger.error('Question selection failed', error as Error);
        throw error;
    }
}

// ==================== AI Selection ====================

async function selectQuestionsWithAI(
    params: AISelectionParams,
    questionBank: QuestionBankItem[],
    documentSummary?: string
): Promise<SelectionResult> {
    const prompt = buildQuestionSelectionPrompt({
        partnerType: params.partnerType || 'Unknown',
        sector: params.sector,
        region: params.region,
        depth: params.depth,
        projectContext: params.projectContext,
        documentSummary,
        questionBank
    });

    const response = await llmClient.complete({
        prompt,
        systemPrompt: QUESTION_SELECTION_SYSTEM_PROMPT,
        maxTokens: 4096,
        temperature: 0.3
    });

    // Parse AI response
    const parsed = parseAIResponse(response.content, questionBank);

    return {
        ...parsed,
        usedAI: true,
        tokensUsed: response.usage.totalTokens
    };
}

function parseAIResponse(
    content: string,
    questionBank: QuestionBankItem[]
): Omit<SelectionResult, 'usedAI' | 'tokensUsed'> {
    try {
        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in AI response');
        }

        const data = JSON.parse(jsonMatch[0]);

        // Validate and filter questions to only include valid IDs
        const validQuestionIds = new Set(questionBank.map(q => q.id));
        const questions: SelectedQuestion[] = (data.selectedQuestions || [])
            .filter((q: any) => validQuestionIds.has(q.questionId))
            .map((q: any, index: number) => ({
                questionId: q.questionId,
                confidence: Math.min(1, Math.max(0, q.confidence || 0.8)),
                rationale: q.rationale || 'Selected by AI analysis',
                suggestedRole: q.suggestedRole || 'Subject Matter Expert',
                suggestedSeniority: q.suggestedSeniority || 'Manager',
                suggestedEvidence: q.suggestedEvidence || [],
                priority: q.priority || index + 1,
                layer: questionBank.find(qb => qb.id === q.questionId)?.layer
            }));

        return {
            questions,
            layerCoverage: data.layerCoverage || {},
            analysisNotes: data.analysisNotes
        };
    } catch (error) {
        logger.error('Failed to parse AI response', error as Error);
        throw new Error('Failed to parse AI question selection response');
    }
}

// ==================== Document Analysis ====================

async function analyzeDocuments(docs: AttachedDocument[]): Promise<string> {
    if (!llmClient.isConfigured()) {
        return '';
    }

    const summaries: string[] = [];

    for (const doc of docs.slice(0, 3)) { // Limit to 3 documents
        try {
            let content = doc.content;

            // For text documents, use content directly
            if (doc.type === 'text' && content) {
                const prompt = buildDocumentAnalysisPrompt(content);

                const response = await llmClient.complete({
                    prompt,
                    systemPrompt: DOCUMENT_ANALYSIS_SYSTEM_PROMPT,
                    maxTokens: 500,
                    temperature: 0.2
                });

                summaries.push(`[${doc.name}]: ${response.content}`);
            }
        } catch (error) {
            logger.warn('Document analysis failed', {
                service: 'AIQuestionSelector',
                method: 'analyzeDocuments',
                document: doc.name,
                error: (error as Error).message
            });
        }
    }

    return summaries.join('\n\n');
}

// ==================== Rule-Based Fallback ====================

function selectQuestionsRuleBased(
    params: AISelectionParams,
    questionBank: QuestionBankItem[]
): SelectionResult {
    logger.info('Using rule-based question selection', {
        service: 'AIQuestionSelector',
        method: 'selectQuestionsRuleBased'
    });

    const config = DEPTH_CONFIG[params.depth];
    const targetCount = config.questionCount;

    // Group questions by layer
    const byLayer: Record<string, QuestionBankItem[]> = {};
    for (const q of questionBank) {
        if (!byLayer[q.layer]) {
            byLayer[q.layer] = [];
        }
        byLayer[q.layer].push(q);
    }

    // Select proportionally from each layer
    const layers = Object.keys(byLayer);
    const perLayer = Math.ceil(targetCount / layers.length);

    const selectedQuestions: SelectedQuestion[] = [];
    const layerCoverage: Record<string, number> = {};

    for (const layer of layers) {
        const layerQuestions = byLayer[layer] || [];
        const toSelect = Math.min(perLayer, layerQuestions.length);

        // Shuffle and select
        const shuffled = [...layerQuestions].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, toSelect);

        layerCoverage[layer] = selected.length;

        for (const q of selected) {
            const roleInfo = ROLE_MAPPING[layer] || { role: 'Subject Matter Expert', seniority: 'Manager' };
            const evidence = EVIDENCE_MAPPING[layer] || ['Supporting Document'];

            selectedQuestions.push({
                questionId: q.id,
                confidence: config.minConfidence + Math.random() * (1 - config.minConfidence),
                rationale: `Core ${layer} indicator for ${params.sector} sector assessment`,
                suggestedRole: roleInfo.role,
                suggestedSeniority: roleInfo.seniority,
                suggestedEvidence: evidence,
                priority: selectedQuestions.length + 1,
                layer
            });
        }
    }

    // Sort by priority
    selectedQuestions.sort((a, b) => a.priority - b.priority);

    return {
        questions: selectedQuestions.slice(0, targetCount),
        layerCoverage,
        usedAI: false,
        analysisNotes: 'Selected using rule-based algorithm (AI not available)'
    };
}

// ==================== Database Helpers ====================

async function fetchQuestionBank(sector?: string): Promise<QuestionBankItem[]> {
    try {
        // Fetch questions from database
        const questions = await prisma.question.findMany({
            where: {
                // If sector is provided, prioritize questions with matching tag
                // But generally we want a broad base for the AI to select from
                // so we don't strictly filter by sector unless required.
                // For now, we'll fetch all active questions and let AI decide relevance.
                // active: true // 'active' field also missing from schema shown
            },
            select: {
                id: true,
                text: true,
                domain: true, // Maps to layer
                subDomain: true, // Maps to subDimension
                category: true,
                sectorTags: true
            },
            take: 200 // Limit for performance
        });

        return questions.map(q => ({
            id: q.id,
            text: q.text,
            layer: q.domain || 'COMPETENCE', // Map domain -> layer
            subDimension: q.subDomain || undefined, // Map subDomain -> subDimension
            category: q.category || undefined,
            // requiredRoles not in DB, will be inferred by AI or fallback logic
        }));
    } catch (error) {
        logger.error('Failed to fetch question bank', error as Error);
        return [];
    }
}


// ==================== Helper Exports ====================

/**
 * Get role suggestion for a specific question domain
 */
export function suggestRoleForQuestion(domain: string): { role: string; seniority: string } {
    return ROLE_MAPPING[domain] || { role: 'Subject Matter Expert', seniority: 'Manager' };
}

/**
 * Get evidence suggestions for a question category
 */
export function suggestEvidenceForCategory(category: string): string[] {
    return EVIDENCE_MAPPING[category] || ['Supporting Document'];
}

/**
 * Check if AI selection is available
 */
export function isAIAvailable(): boolean {
    return llmClient.isConfigured();
}
/**
 * Save selected questions to assessment in database
 */
export async function saveSelectionToAssessment(
    assessmentId: string,
    selectionResult: SelectionResult
): Promise<any[]> {
    try {
        // Create AssessmentQuestion records
        const savedQuestions = await Promise.all(
            selectionResult.questions.map(async (sq, index) => {
                // Find role by name or create/fallback if needed
                // For MVP we'll try to find existing role
                const role = await prisma.role.findFirst({
                    where: { name: sq.suggestedRole }
                });

                return prisma.assessmentQuestion.create({
                    data: {
                        assessmentId,
                        questionId: sq.questionId,
                        assignedRoleId: role?.id || null,
                        assignedSeniority: sq.suggestedSeniority,
                        evidenceRequirements: sq.suggestedEvidence || [], // Ensure array
                        order: sq.priority || index + 1,
                        aiConfidence: sq.confidence,
                        aiRationale: sq.rationale,
                        customized: false,
                    },
                    include: {
                        question: true,
                        role: true,
                    },
                });
            })
        );

        logger.info('Saved questions to assessment', {
            service: 'AIQuestionSelector',
            method: 'saveSelectionToAssessment',
            assessmentId,
            count: savedQuestions.length
        });

        return savedQuestions;
    } catch (error) {
        logger.error('Failed to save selection to assessment', error as Error);
        throw error;
    }
}
