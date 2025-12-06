import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import {
    RedFlag,
    RiskAssessment,
    VetoCriteria,
    LayerScore
} from './types';

/**
 * Risk Flagger Service
 * Detects red flags and veto conditions using database-driven trust-framework rules
 */
class RiskFlaggerService {
    private vetoCriteriaCache: VetoCriteria[] | null = null;
    private cacheExpiry: number = 0;
    private CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    /**
     * Get veto criteria from database (with caching)
     */
    private async getVetoCriteria(): Promise<VetoCriteria[]> {
        const now = Date.now();

        // Return cached data if still valid
        if (this.vetoCriteriaCache && now < this.cacheExpiry) {
            return this.vetoCriteriaCache;
        }

        try {
            // Fetch active veto criteria from database
            const dbCriteria = await prisma.trustVetoCriterion.findMany({
                where: { isActive: true },
                orderBy: [{ severity: 'desc' }, { layer: 'asc' }],
            });

            // Map to internal format
            this.vetoCriteriaCache = dbCriteria.map(c => ({
                veto_id: c.vetoId,
                layer: c.layer,
                sub_dimension: c.subDimension || c.name,
                metric: c.vetoId.toLowerCase(),
                threshold: c.thresholdValue,
                threshold_description: c.thresholdDescription || '',
                rationale: c.description || '',
                action: c.action,
                severity: c.severity.toLowerCase()
            }));

            this.cacheExpiry = now + this.CACHE_TTL;

            logger.info('Loaded veto criteria from database', {
                service: 'RiskFlaggerService',
                method: 'getVetoCriteria',
                count: this.vetoCriteriaCache.length
            });

            return this.vetoCriteriaCache;
        } catch (error) {
            logger.error('Failed to load veto criteria from database, using fallback', error as Error, {
                service: 'RiskFlaggerService',
                method: 'getVetoCriteria'
            });

            // Fallback to basic criteria if database fails
            return this.getFallbackVetoCriteria();
        }
    }

    /**
     * Fallback veto criteria if database is unavailable
     */
    private getFallbackVetoCriteria(): VetoCriteria[] {
        return [
            {
                veto_id: "L1_Veto_Availability",
                layer: "L1",
                sub_dimension: "System Availability",
                metric: "system_availability",
                threshold: 2.0,
                threshold_description: "Score < 2.0",
                rationale: "Fundamental reliability too low",
                action: "DO NOT PROCEED",
                severity: "critical"
            },
            {
                veto_id: "L5_Veto_Financial",
                layer: "L5",
                sub_dimension: "Financial Stability",
                metric: "financial_stability",
                threshold: 2.5,
                threshold_description: "Score < 2.5",
                rationale: "Vendor survival uncertain",
                action: "DO NOT PROCEED",
                severity: "critical"
            }
        ];
    }

    /**
     * Analyze risks for an assessment
     */
    async analyzeRisks(assessmentId: string): Promise<RiskAssessment> {
        logger.info('Starting risk analysis', {
            service: 'RiskFlaggerService',
            method: 'analyzeRisks',
            assessmentId
        });

        // Fetch assessment data
        const assessment = await prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: {
                responses: true
            }
        });

        if (!assessment) {
            throw new Error(`Assessment ${assessmentId} not found`);
        }

        // Fetch evidence
        const evidenceFacts = await prisma.evidenceFact.findMany({
            where: { assessmentId }
        });

        // Calculate layer scores
        const layerScores = this.calculateLayerScores(assessment.responses);

        // Collect all red flags
        const redFlags: RedFlag[] = [];

        // 1. Check veto criteria (async loaded from database)
        const vetoCriteria = await this.getVetoCriteria();
        const vetoFlags = this.checkVetoCriteria(layerScores, evidenceFacts, vetoCriteria);
        redFlags.push(...vetoFlags);

        // 2. Check for low scores
        const scoreFlags = this.checkLowScores(layerScores);
        redFlags.push(...scoreFlags);

        // 3. Check for evidence gaps
        const gapFlags = this.checkEvidenceGaps(layerScores, evidenceFacts);
        redFlags.push(...gapFlags);

        // 4. Check for compounding issues (interdependencies)
        const compoundFlags = this.checkCompoundingIssues(layerScores);
        redFlags.push(...compoundFlags);

        // Determine if any veto is triggered
        const vetoTriggered = redFlags.some(rf => rf.vetoTrigger);
        const vetoReasons = redFlags
            .filter(rf => rf.vetoTrigger)
            .map(rf => rf.message);

        // Calculate overall risk level
        const overallRiskLevel = this.calculateOverallRisk(redFlags);

        const riskAssessment: RiskAssessment = {
            assessmentId,
            redFlags,
            overallRiskLevel,
            vetoTriggered,
            vetoReason: vetoReasons.length > 0 ? vetoReasons.join('; ') : undefined,
            analysisTimestamp: new Date()
        };

        // Store in database
        await this.storeRiskAssessment(assessmentId, riskAssessment);

        logger.info('Risk analysis complete', {
            service: 'RiskFlaggerService',
            method: 'analyzeRisks',
            assessmentId,
            flagCount: redFlags.length,
            vetoTriggered,
            overallRisk: overallRiskLevel
        });

        return riskAssessment;
    }

    /**
     * Check veto criteria from trust-framework config
     */
    private checkVetoCriteria(
        layerScores: Record<string, number>,
        evidenceFacts: any[],
        vetoCriteria: VetoCriteria[]
    ): RedFlag[] {
        const flags: RedFlag[] = [];

        for (const criteria of vetoCriteria) {
            let triggered = false;
            const layerId = criteria.layer;
            const score = layerScores[layerId];

            // Check threshold-based criteria
            if (criteria.threshold !== null && score !== undefined) {
                // Convert threshold from 1-5 scale percentage to score
                // threshold is like 2.0 (40%) or 2.5 (50%)
                if (score < criteria.threshold) {
                    triggered = true;
                }
            }

            // Check condition-based criteria (e.g., specific evidence missing)
            if (criteria.metric === 'catastrophic_failure_any_stress' ||
                criteria.metric === 'ethical_violation_critical') {
                // These require specific evidence - check evidence facts
                const hasEvidence = evidenceFacts.some(ef =>
                    ef.sourceType === 'stress_test' && ef.content?.includes('catastrophic') ||
                    ef.sourceType === 'ethics' && ef.content?.includes('violation')
                );
                if (hasEvidence) {
                    triggered = true;
                }
            }

            if (triggered) {
                flags.push({
                    id: criteria.veto_id,
                    severity: 'critical',
                    category: criteria.sub_dimension,
                    layer: criteria.layer,
                    subDimension: criteria.sub_dimension,
                    message: criteria.rationale,
                    recommendation: criteria.action,
                    evidence: [],
                    confidence: 0.95,
                    vetoTrigger: true
                });
            }
        }

        return flags;
    }

    /**
     * Check for low layer scores
     */
    private checkLowScores(layerScores: Record<string, number>): RedFlag[] {
        const flags: RedFlag[] = [];

        const layerNames: Record<string, string> = {
            L1: 'Reliability',
            L2: 'Transparency',
            L3: 'Governance',
            L4: 'Competence',
            L5: 'Integrity',
            L6: 'Ecosystem'
        };

        for (const [layerId, score] of Object.entries(layerScores)) {
            // Critical: score below 2.0
            if (score < 2.0) {
                flags.push({
                    id: `low_score_${layerId}_critical`,
                    severity: 'critical',
                    category: 'Performance',
                    layer: layerId,
                    message: `${layerNames[layerId] || layerId} scores critically low at ${score.toFixed(1)}/5.0`,
                    recommendation: 'Immediate remediation required before proceeding',
                    evidence: [],
                    confidence: 0.9,
                    vetoTrigger: score < 1.5 // Auto-veto only if extremely low
                });
            }
            // High risk: score below 2.5
            else if (score < 2.5) {
                flags.push({
                    id: `low_score_${layerId}_high`,
                    severity: 'high',
                    category: 'Performance',
                    layer: layerId,
                    message: `${layerNames[layerId] || layerId} scores below acceptable threshold at ${score.toFixed(1)}/5.0`,
                    recommendation: 'Develop remediation plan before deployment',
                    evidence: [],
                    confidence: 0.85,
                    vetoTrigger: false
                });
            }
            // Medium risk: score below 3.0
            else if (score < 3.0) {
                flags.push({
                    id: `low_score_${layerId}_medium`,
                    severity: 'medium',
                    category: 'Performance',
                    layer: layerId,
                    message: `${layerNames[layerId] || layerId} shows room for improvement at ${score.toFixed(1)}/5.0`,
                    recommendation: 'Monitor and address gaps in follow-up assessment',
                    evidence: [],
                    confidence: 0.8,
                    vetoTrigger: false
                });
            }
        }

        return flags;
    }

    /**
     * Check for evidence gaps
     */
    private checkEvidenceGaps(
        layerScores: Record<string, number>,
        evidenceFacts: any[]
    ): RedFlag[] {
        const flags: RedFlag[] = [];

        // Check evidence coverage by layer
        const evidenceByLayer = new Map<string, number>();
        evidenceFacts.forEach(ef => {
            const layer = ef.layer || 'unknown';
            evidenceByLayer.set(layer, (evidenceByLayer.get(layer) || 0) + 1);
        });

        for (const layerId of Object.keys(layerScores)) {
            const evidenceCount = evidenceByLayer.get(layerId) || 0;

            if (evidenceCount === 0) {
                flags.push({
                    id: `evidence_gap_${layerId}`,
                    severity: 'medium',
                    category: 'Evidence',
                    layer: layerId,
                    message: `No supporting evidence collected for ${layerId}`,
                    recommendation: 'Request additional documentation to support assessment',
                    evidence: [],
                    confidence: 0.7,
                    vetoTrigger: false
                });
            } else if (evidenceCount < 3) {
                flags.push({
                    id: `evidence_limited_${layerId}`,
                    severity: 'low',
                    category: 'Evidence',
                    layer: layerId,
                    message: `Limited evidence (${evidenceCount} pieces) for ${layerId}`,
                    recommendation: 'Consider requesting additional supporting documentation',
                    evidence: [],
                    confidence: 0.6,
                    vetoTrigger: false
                });
            }
        }

        return flags;
    }

    /**
     * Check for compounding issues (layer interdependencies)
     */
    private checkCompoundingIssues(layerScores: Record<string, number>): RedFlag[] {
        const flags: RedFlag[] = [];

        // Technical + Competence compound (from layer-interdependencies.json)
        if ((layerScores['L1'] || 5) < 3.0 && (layerScores['L4'] || 5) < 3.0) {
            flags.push({
                id: 'compound_technical_competence',
                severity: 'high',
                category: 'Interdependency',
                layer: 'L1+L4',
                message: 'Technical reliability and organizational competence gaps compound each other',
                recommendation: 'Address both before deployment - unreliable technology + unprepared users = high failure risk',
                evidence: [],
                confidence: 0.85,
                vetoTrigger: false
            });
        }

        // Governance + Integrity compound
        if ((layerScores['L3'] || 5) < 3.0 && (layerScores['L5'] || 5) < 3.0) {
            flags.push({
                id: 'compound_governance_integrity',
                severity: 'high',
                category: 'Interdependency',
                layer: 'L3+L5',
                message: 'Weak governance and integrity concerns amplify recourse risk',
                recommendation: 'Strengthen contractual protections and vendor due diligence',
                evidence: [],
                confidence: 0.85,
                vetoTrigger: false
            });
        }

        // Transparency + Ecosystem compound
        if ((layerScores['L2'] || 5) < 3.0 && (layerScores['L6'] || 5) < 3.0) {
            flags.push({
                id: 'compound_transparency_ecosystem',
                severity: 'medium',
                category: 'Interdependency',
                layer: 'L2+L6',
                message: 'Low transparency combined with ecosystem concerns reduces stakeholder trust',
                recommendation: 'Improve communication strategy and stakeholder engagement',
                evidence: [],
                confidence: 0.75,
                vetoTrigger: false
            });
        }

        return flags;
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

        // Ensure all 6 layers have scores
        for (const layer of ['L1', 'L2', 'L3', 'L4', 'L5', 'L6']) {
            if (!(layer in result)) {
                result[layer] = 3.0; // Default to neutral
            }
        }

        return result;
    }

    /**
     * Calculate overall risk level from flags
     */
    private calculateOverallRisk(flags: RedFlag[]): 'low' | 'medium' | 'high' | 'critical' {
        const criticalCount = flags.filter(f => f.severity === 'critical').length;
        const highCount = flags.filter(f => f.severity === 'high').length;
        const mediumCount = flags.filter(f => f.severity === 'medium').length;

        if (criticalCount > 0 || flags.some(f => f.vetoTrigger)) {
            return 'critical';
        }
        if (highCount >= 2) {
            return 'high';
        }
        if (highCount >= 1 || mediumCount >= 3) {
            return 'medium';
        }
        return 'low';
    }

    /**
     * Store risk assessment in database
     */
    private async storeRiskAssessment(
        assessmentId: string,
        riskAssessment: RiskAssessment
    ): Promise<void> {
        await prisma.coPilotDraft.upsert({
            where: {
                id: `risk-${assessmentId}`
            },
            create: {
                id: `risk-${assessmentId}`,
                assessmentId,
                type: 'risk_analysis',
                content: riskAssessment as any,
                confidence: riskAssessment.vetoTriggered ? 0.95 : 0.8,
                generatedAt: new Date()
            },
            update: {
                content: riskAssessment as any,
                confidence: riskAssessment.vetoTriggered ? 0.95 : 0.8,
                generatedAt: new Date()
            }
        });
    }
}

export const riskFlaggerService = new RiskFlaggerService();
