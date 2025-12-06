import { llmClient } from './llm-client.service';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import {
    Summary,
    LayerSummary,
    AssessmentResponse,
    EvidenceFact
} from './types';
import {
    EXECUTIVE_SUMMARY_SYSTEM_PROMPT,
    buildExecutiveSummaryPrompt
} from './prompts/executive-summary';
import {
    LAYER_ANALYSIS_SYSTEM_PROMPT,
    LAYER_NAMES,
    buildLayerAnalysisPrompt,
    buildContradictionAnalysisPrompt
} from './prompts/layer-analysis';

/**
 * Summarizer Service
 * Generates summaries of assessment responses grouped by trust layer
 */
class SummarizerService {
    /**
     * Generate a complete summary for an assessment
     */
    async summarizeAssessment(assessmentId: string): Promise<Summary> {
        logger.info('Starting assessment summarization', {
            service: 'SummarizerService',
            method: 'summarizeAssessment',
            assessmentId
        });

        // Fetch assessment data
        const assessment = await prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: {
                project: true,
                responses: true
            }
        });

        if (!assessment) {
            throw new Error(`Assessment ${assessmentId} not found`);
        }

        // Fetch evidence facts (using TrustEvidenceFile as source)
        const evidenceFiles = await prisma.trustEvidenceFile.findMany({
            where: { assessmentId },
            include: {
                question: {
                    include: {
                        subDimension: {
                            include: {
                                layer: true
                            }
                        }
                    }
                }
            }
        });

        // Map to EvidenceFact interface
        const evidenceFacts: EvidenceFact[] = evidenceFiles.map(file => ({
            id: file.id,
            sourceType: file.documentType || 'document',
            content: file.extractedText || `Evidence file: ${file.fileName}`,
            confidence: file.qualityScore ? file.qualityScore / 5 : 0.8,
            layer: file.question?.subDimension?.layerId || 'L1'
        }));

        // Get layer scores if available
        const layerScores = this.calculateLayerScores(assessment.responses);

        // Generate layer summaries in parallel
        const layerIds = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];
        const layerSummaries = await Promise.all(
            layerIds.map(layerId => this.summarizeLayer(
                layerId,
                assessment.responses,
                evidenceFacts,
                layerScores[layerId] || 3.0
            ))
        );

        // Generate executive summary
        const executive = await this.generateExecutiveSummary(
            assessment.project?.name || 'Unknown Project',
            assessment.responses[0]?.response || 'Unknown Partner',
            this.calculateOverallScore(layerScores),
            Object.entries(layerScores).map(([layer, score]) => ({ layer, score })),
            evidenceFacts.slice(0, 5).map(e => e.content)
        );

        // Analyze contradictions
        const contradictions = await this.analyzeContradictions(assessment.responses);

        // Extract key themes
        const keyThemes = this.extractThemes(layerSummaries);

        const summary: Summary = {
            executive,
            byLayer: layerSummaries,
            keyThemes,
            contradictions,
            confidence: this.calculateConfidence(evidenceFacts.length, assessment.responses.length)
        };

        // Store in database
        await this.storeSummary(assessmentId, summary);

        logger.info('Assessment summarization complete', {
            service: 'SummarizerService',
            method: 'summarizeAssessment',
            assessmentId,
            layerCount: layerSummaries.length
        });

        return summary;
    }

    /**
     * Generate summary for a single layer
     */
    private async summarizeLayer(
        layerId: string,
        responses: any[],
        evidenceFacts: any[],
        layerScore: number
    ): Promise<LayerSummary> {
        const layerResponses = responses
            .filter(r => r.questionId?.startsWith(layerId) || r.layer === layerId)
            .map(r => ({
                question: r.questionText || r.questionId,
                answer: r.response,
                likertScore: r.likertScore
            }));

        const layerEvidence = evidenceFacts
            .filter(e => e.layer === layerId)
            .map(e => ({
                source: e.sourceType,
                content: e.content
            }));

        // Use LLM if configured, otherwise use simple extraction
        let summaryText = '';
        let keyPoints: string[] = [];

        if (llmClient.isConfigured() && layerResponses.length > 0) {
            const prompt = buildLayerAnalysisPrompt({
                layerId,
                layerScore,
                responses: layerResponses,
                evidence: layerEvidence
            });

            try {
                const response = await llmClient.complete({
                    prompt,
                    systemPrompt: LAYER_ANALYSIS_SYSTEM_PROMPT,
                    maxTokens: 500,
                    temperature: 0.3
                });
                summaryText = response.content;
                keyPoints = this.extractKeyPoints(summaryText);
            } catch (error) {
                logger.warn('LLM layer analysis failed, using fallback', {
                    service: 'SummarizerService',
                    method: 'summarizeLayer',
                    layerId,
                    error: (error as Error).message
                });
                summaryText = this.generateFallbackSummary(layerId, layerScore, layerResponses);
                keyPoints = layerResponses.slice(0, 3).map(r => r.answer.substring(0, 100));
            }
        } else {
            summaryText = this.generateFallbackSummary(layerId, layerScore, layerResponses);
            keyPoints = layerResponses.slice(0, 3).map(r => r.answer.substring(0, 100));
        }

        return {
            layerId,
            layerName: LAYER_NAMES[layerId] || layerId,
            score: layerScore,
            summary: summaryText,
            keyPoints,
            evidenceCitations: layerEvidence.map(e => e.source)
        };
    }

    /**
     * Generate executive summary using LLM
     */
    private async generateExecutiveSummary(
        projectName: string,
        partnerName: string,
        overallScore: number,
        layerScores: { layer: string; score: number }[],
        keyEvidence: string[]
    ): Promise<string> {
        if (!llmClient.isConfigured()) {
            return this.generateFallbackExecutiveSummary(partnerName, overallScore, layerScores);
        }

        const prompt = buildExecutiveSummaryPrompt({
            projectName,
            partnerName,
            overallScore,
            layerScores,
            keyEvidence
        });

        try {
            const response = await llmClient.complete({
                prompt,
                systemPrompt: EXECUTIVE_SUMMARY_SYSTEM_PROMPT,
                maxTokens: 300,
                temperature: 0.3
            });
            return response.content;
        } catch (error) {
            logger.warn('LLM executive summary failed, using fallback', {
                service: 'SummarizerService',
                method: 'generateExecutiveSummary',
                error: (error as Error).message
            });
            return this.generateFallbackExecutiveSummary(partnerName, overallScore, layerScores);
        }
    }

    /**
     * Analyze contradictions between respondents
     */
    private async analyzeContradictions(responses: any[]): Promise<string[]> {
        // Group responses by question
        const byQuestion = new Map<string, any[]>();
        responses.forEach(r => {
            const key = r.questionId || r.questionText;
            if (!byQuestion.has(key)) {
                byQuestion.set(key, []);
            }
            byQuestion.get(key)!.push(r);
        });

        // Find questions with multiple respondents
        const multiRespondentQuestions = Array.from(byQuestion.entries())
            .filter(([_, resps]) => resps.length > 1);

        if (multiRespondentQuestions.length === 0) {
            return [];
        }

        if (!llmClient.isConfigured()) {
            return ['Unable to analyze contradictions - LLM not configured'];
        }

        const responsesForAnalysis = multiRespondentQuestions.flatMap(([question, resps]) =>
            resps.map(r => ({
                question,
                respondent: r.respondentRole || 'Unknown',
                answer: r.response
            }))
        );

        try {
            const prompt = buildContradictionAnalysisPrompt({ responses: responsesForAnalysis });
            const response = await llmClient.complete({
                prompt,
                systemPrompt: LAYER_ANALYSIS_SYSTEM_PROMPT,
                maxTokens: 500,
                temperature: 0.3
            });

            // Parse contradictions from response
            if (response.content.toLowerCase().includes('no significant contradictions')) {
                return [];
            }

            return response.content
                .split('\n')
                .filter(line => line.trim().length > 0)
                .slice(0, 5);
        } catch (error) {
            logger.warn('Contradiction analysis failed', {
                service: 'SummarizerService',
                method: 'analyzeContradictions',
                error: (error as Error).message
            });
            return [];
        }
    }

    /**
     * Calculate layer scores from responses
     */
    private calculateLayerScores(responses: any[]): Record<string, number> {
        const scores: Record<string, { sum: number; count: number }> = {};

        responses.forEach(r => {
            const layerId = r.layer || r.questionId?.substring(0, 2) || 'L1';
            if (!scores[layerId]) {
                scores[layerId] = { sum: 0, count: 0 };
            }
            if (r.likertScore) {
                scores[layerId].sum += r.likertScore;
                scores[layerId].count += 1;
            }
        });

        const result: Record<string, number> = {};
        Object.entries(scores).forEach(([layer, data]) => {
            result[layer] = data.count > 0 ? data.sum / data.count : 3.0;
        });

        return result;
    }

    /**
     * Calculate overall trust score
     */
    private calculateOverallScore(layerScores: Record<string, number>): number {
        const weights: Record<string, number> = {
            L1: 0.20, L2: 0.15, L3: 0.15, L4: 0.20, L5: 0.15, L6: 0.15
        };

        let weightedSum = 0;
        let totalWeight = 0;

        Object.entries(layerScores).forEach(([layer, score]) => {
            const weight = weights[layer] || 0.15;
            weightedSum += score * weight;
            totalWeight += weight;
        });

        return totalWeight > 0 ? weightedSum / totalWeight : 3.0;
    }

    /**
     * Calculate confidence based on evidence and response count
     */
    private calculateConfidence(evidenceCount: number, responseCount: number): number {
        // Base confidence on data availability
        const evidenceConfidence = Math.min(evidenceCount / 10, 1.0) * 0.5;
        const responseConfidence = Math.min(responseCount / 20, 1.0) * 0.5;
        return evidenceConfidence + responseConfidence;
    }

    /**
     * Extract key themes from layer summaries
     */
    private extractThemes(layerSummaries: LayerSummary[]): string[] {
        const allKeyPoints = layerSummaries.flatMap(ls => ls.keyPoints);
        // Return unique themes (simplified - in production would use NLP)
        // Return unique themes (simplified - in production would use NLP)
        return Array.from(new Set(allKeyPoints.slice(0, 5)));
    }

    /**
     * Extract key points from summary text
     */
    private extractKeyPoints(text: string): string[] {
        return text
            .split('.')
            .filter(s => s.trim().length > 20)
            .slice(0, 3)
            .map(s => s.trim());
    }

    /**
     * Generate fallback summary when LLM unavailable
     */
    private generateFallbackSummary(
        layerId: string,
        score: number,
        responses: { question: string; answer: string }[]
    ): string {
        const layerName = LAYER_NAMES[layerId] || layerId;
        const scoreDesc = score >= 4 ? 'strong' : score >= 3 ? 'adequate' : 'needs improvement';

        return `${layerName} assessment shows ${scoreDesc} performance with a score of ${score.toFixed(1)}/5.0. Based on ${responses.length} responses collected.`;
    }

    /**
     * Generate fallback executive summary
     */
    private generateFallbackExecutiveSummary(
        partnerName: string,
        overallScore: number,
        layerScores: { layer: string; score: number }[]
    ): string {
        const recommendation = overallScore >= 3.5 ? 'PROCEED' :
            overallScore >= 2.5 ? 'PROCEED WITH CAUTION' : 'DO NOT PROCEED';

        const strongest = layerScores.reduce((a, b) => a.score > b.score ? a : b);
        const weakest = layerScores.reduce((a, b) => a.score < b.score ? a : b);

        return `This partner achieves a Trust Score of ${overallScore.toFixed(1)}/5.0. Strongest performance in ${LAYER_NAMES[strongest.layer] || strongest.layer} (${strongest.score.toFixed(1)}/5.0). Primary concern in ${LAYER_NAMES[weakest.layer] || weakest.layer} (${weakest.score.toFixed(1)}/5.0). Recommendation: ${recommendation}.`;
    }

    /**
     * Store summary in database
     */
    private async storeSummary(assessmentId: string, summary: Summary): Promise<void> {
        await prisma.coPilotDraft.upsert({
            where: {
                id: `summary-${assessmentId}`
            },
            create: {
                id: `summary-${assessmentId}`,
                assessmentId,
                type: 'summary',
                content: summary as any,
                confidence: summary.confidence,
                generatedAt: new Date()
            },
            update: {
                content: summary as any,
                confidence: summary.confidence,
                generatedAt: new Date()
            }
        });
    }
}

export const summarizerService = new SummarizerService();
