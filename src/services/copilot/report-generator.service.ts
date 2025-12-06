import { llmClient } from './llm-client.service';
import { summarizerService } from './summarizer.service';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import {
    DraftReport,
    ReportSection,
    Summary
} from './types';
import {
    RECOMMENDATIONS_SYSTEM_PROMPT,
    buildRecommendationsPrompt,
    RecommendationInput
} from './prompts/recommendations';

/**
 * Report Generator Service
 * Generates draft trust assessment reports with evidence citations
 */
class ReportGeneratorService {
    /**
     * Generate a complete draft report for an assessment
     */
    async generateDraft(assessmentId: string): Promise<DraftReport> {
        logger.info('Starting report generation', {
            service: 'ReportGeneratorService',
            method: 'generateDraft',
            assessmentId
        });

        // First, generate summary if not exists
        let summary: Summary;
        try {
            const existingSummary = await prisma.coPilotDraft.findFirst({
                where: { assessmentId, type: 'summary' }
            });

            if (existingSummary) {
                summary = existingSummary.content as unknown as Summary;
            } else {
                summary = await summarizerService.summarizeAssessment(assessmentId);
            }
        } catch (error) {
            logger.warn('Summary generation failed, creating minimal summary', {
                service: 'ReportGeneratorService',
                method: 'generateDraft',
                error: (error as Error).message
            });
            summary = this.createMinimalSummary();
        }

        let totalTokens = 0;

        // Generate sections
        const sections: ReportSection[] = [];

        // 1. Executive Summary Section
        sections.push({
            type: 'executive',
            content: summary.executive,
            confidence: summary.confidence,
            evidenceCitations: []
        });

        // 2. Strengths Section
        const strengthsSection = await this.generateStrengthsSection(summary);
        sections.push(strengthsSection);
        totalTokens += 500; // Estimate

        // 3. Weaknesses Section
        const weaknessesSection = await this.generateWeaknessesSection(summary);
        sections.push(weaknessesSection);
        totalTokens += 500;

        // 4. Red Flags Section (from contradictions and low scores)
        const redFlagsSection = this.generateRedFlagsSection(summary);
        sections.push(redFlagsSection);

        // 5. Recommendations Section
        const recommendationsSection = await this.generateRecommendationsSection(
            assessmentId,
            summary
        );
        sections.push(recommendationsSection);
        totalTokens += 800;

        const overallConfidence = sections.reduce((sum, s) => sum + s.confidence, 0) / sections.length;

        const report: DraftReport = {
            assessmentId,
            generatedAt: new Date(),
            sections,
            overallConfidence,
            tokensUsed: totalTokens
        };

        // Store in database
        await this.storeReport(assessmentId, report);

        logger.info('Report generation complete', {
            service: 'ReportGeneratorService',
            method: 'generateDraft',
            assessmentId,
            sectionCount: sections.length,
            tokensUsed: totalTokens
        });

        return report;
    }

    /**
     * Regenerate report with analyst feedback
     */
    async regenerateWithFeedback(
        assessmentId: string,
        feedback: string
    ): Promise<DraftReport> {
        logger.info('Regenerating report with feedback', {
            service: 'ReportGeneratorService',
            method: 'regenerateWithFeedback',
            assessmentId,
            feedbackLength: feedback.length
        });

        // Get existing report
        const existing = await prisma.coPilotDraft.findFirst({
            where: { assessmentId, type: 'report' }
        });

        if (!existing) {
            throw new Error('No existing report to regenerate');
        }

        const existingReport = existing.content as unknown as DraftReport;

        // Use LLM to refine based on feedback
        if (llmClient.isConfigured()) {
            const prompt = `Based on this feedback, refine the following report sections:

FEEDBACK: ${feedback}

CURRENT REPORT:
${existingReport.sections.map(s => `[${s.type}]\n${s.content}`).join('\n\n')}

Provide refined content for each section that addresses the feedback.`;

            try {
                const response = await llmClient.complete({
                    prompt,
                    systemPrompt: 'You are refining a trust assessment report based on analyst feedback. Maintain professional tone and evidence-based claims.',
                    maxTokens: 2000,
                    temperature: 0.3
                });

                // Parse and update sections (simplified - in production would be more robust)
                const refinedContent = response.content;
                existingReport.sections.forEach(section => {
                    const regex = new RegExp(`\\[${section.type}\\]\\n([\\s\\S]*?)(?=\\[|$)`, 'i');
                    const match = refinedContent.match(regex);
                    if (match) {
                        section.content = match[1].trim();
                    }
                });

                existingReport.generatedAt = new Date();
                existingReport.tokensUsed += response.usage.totalTokens;

                await this.storeReport(assessmentId, existingReport);
            } catch (error) {
                logger.error('Report regeneration failed', error as Error, {
                    service: 'ReportGeneratorService',
                    method: 'regenerateWithFeedback',
                    assessmentId
                });
            }
        }

        return existingReport;
    }

    /**
     * Generate strengths section
     */
    private async generateStrengthsSection(summary: Summary): Promise<ReportSection> {
        // Find high-scoring layers
        const strongLayers = summary.byLayer
            .filter(l => l.score >= 3.5)
            .sort((a, b) => b.score - a.score);

        if (strongLayers.length === 0) {
            return {
                type: 'strengths',
                content: 'Assessment did not identify any areas of exceptional strength. All layers scored below 3.5/5.0.',
                confidence: 0.6,
                evidenceCitations: []
            };
        }

        const content = strongLayers
            .map(l => `${l.layerName} (${l.score.toFixed(1)}/5.0): ${l.summary}`)
            .join('\n\n');

        const citations = strongLayers.flatMap(l => l.evidenceCitations);

        return {
            type: 'strengths',
            content,
            confidence: summary.confidence,
            evidenceCitations: Array.from(new Set(citations))
        };
    }

    /**
     * Generate weaknesses section
     */
    private async generateWeaknessesSection(summary: Summary): Promise<ReportSection> {
        // Find low-scoring layers
        const weakLayers = summary.byLayer
            .filter(l => l.score < 3.5)
            .sort((a, b) => a.score - b.score);

        if (weakLayers.length === 0) {
            return {
                type: 'weaknesses',
                content: 'Assessment did not identify any significant weaknesses. All layers scored 3.5/5.0 or above.',
                confidence: 0.6,
                evidenceCitations: []
            };
        }

        const content = weakLayers
            .map(l => `${l.layerName} (${l.score.toFixed(1)}/5.0): ${l.summary}`)
            .join('\n\n');

        const citations = weakLayers.flatMap(l => l.evidenceCitations);

        return {
            type: 'weaknesses',
            content,
            confidence: summary.confidence,
            evidenceCitations: Array.from(new Set(citations))
        };
    }

    /**
     * Generate red flags section
     */
    private generateRedFlagsSection(summary: Summary): ReportSection {
        const redFlags: string[] = [];

        // Check for critical scores
        summary.byLayer.forEach(layer => {
            if (layer.score < 2.5) {
                redFlags.push(`🚨 CRITICAL: ${layer.layerName} scores ${layer.score.toFixed(1)}/5.0 - below minimum threshold`);
            }
        });

        // Add contradictions as flags
        if (summary.contradictions.length > 0) {
            redFlags.push(...summary.contradictions.map(c => `⚠️ CONTRADICTION: ${c}`));
        }

        if (redFlags.length === 0) {
            return {
                type: 'red_flags',
                content: 'No critical red flags identified in this assessment.',
                confidence: 0.8,
                evidenceCitations: []
            };
        }

        return {
            type: 'red_flags',
            content: redFlags.join('\n\n'),
            confidence: 0.9,
            evidenceCitations: []
        };
    }

    /**
     * Generate recommendations section
     */
    private async generateRecommendationsSection(
        assessmentId: string,
        summary: Summary
    ): Promise<ReportSection> {
        // Build layer gaps for recommendations
        const layerGaps: RecommendationInput[] = summary.byLayer
            .filter(l => l.score < 4.0)
            .map(l => ({
                layerId: l.layerId,
                layerName: l.layerName,
                score: l.score,
                gaps: l.keyPoints.filter(kp =>
                    kp.toLowerCase().includes('gap') ||
                    kp.toLowerCase().includes('weak') ||
                    kp.toLowerCase().includes('concern') ||
                    kp.toLowerCase().includes('lack')
                )
            }));

        const overallScore = summary.byLayer.reduce((sum, l) => sum + l.score, 0) / summary.byLayer.length;

        if (!llmClient.isConfigured() || layerGaps.every(lg => lg.gaps.length === 0)) {
            return {
                type: 'recommendations',
                content: this.generateFallbackRecommendations(layerGaps, overallScore),
                confidence: 0.5,
                evidenceCitations: []
            };
        }

        const prompt = buildRecommendationsPrompt({
            projectName: 'Assessment',
            partnerName: 'Partner',
            overallScore,
            layerGaps
        });

        try {
            const response = await llmClient.complete({
                prompt,
                systemPrompt: RECOMMENDATIONS_SYSTEM_PROMPT,
                maxTokens: 1000,
                temperature: 0.3
            });

            return {
                type: 'recommendations',
                content: response.content,
                confidence: 0.7,
                evidenceCitations: []
            };
        } catch (error) {
            logger.warn('Recommendations generation failed', {
                service: 'ReportGeneratorService',
                method: 'generateRecommendationsSection',
                error: (error as Error).message
            });

            return {
                type: 'recommendations',
                content: this.generateFallbackRecommendations(layerGaps, overallScore),
                confidence: 0.5,
                evidenceCitations: []
            };
        }
    }

    /**
     * Generate fallback recommendations
     */
    private generateFallbackRecommendations(
        layerGaps: RecommendationInput[],
        overallScore: number
    ): string {
        const recommendations: string[] = [];

        // Sort by score (lowest first)
        const sortedGaps = [...layerGaps].sort((a, b) => a.score - b.score);

        sortedGaps.slice(0, 3).forEach((lg, idx) => {
            recommendations.push(
                `${idx + 1}. [PRIORITY: ${lg.score < 2.5 ? 'HIGH' : 'MEDIUM'}] Improve ${lg.layerName}\n` +
                `   Current Score: ${lg.score.toFixed(1)}/5.0\n` +
                `   Action: Conduct detailed review and develop remediation plan for ${lg.layerName} layer.\n` +
                `   Timeline: ${lg.score < 2.5 ? 'Immediate (0-30 days)' : '30-90 days'}`
            );
        });

        if (recommendations.length === 0) {
            return 'No specific recommendations required. Partner demonstrates adequate performance across all trust layers.';
        }

        return recommendations.join('\n\n');
    }

    /**
     * Create minimal summary when generation fails
     */
    private createMinimalSummary(): Summary {
        return {
            executive: 'Unable to generate executive summary. Please review assessment data manually.',
            byLayer: [],
            keyThemes: [],
            contradictions: [],
            confidence: 0
        };
    }

    /**
     * Store report in database
     */
    private async storeReport(assessmentId: string, report: DraftReport): Promise<void> {
        await prisma.coPilotDraft.upsert({
            where: {
                id: `report-${assessmentId}`
            },
            create: {
                id: `report-${assessmentId}`,
                assessmentId,
                type: 'report',
                content: report as any,
                confidence: report.overallConfidence,
                tokensUsed: report.tokensUsed,
                generatedAt: new Date()
            },
            update: {
                content: report as any,
                confidence: report.overallConfidence,
                tokensUsed: report.tokensUsed,
                generatedAt: new Date()
            }
        });
    }
}

export const reportGeneratorService = new ReportGeneratorService();
