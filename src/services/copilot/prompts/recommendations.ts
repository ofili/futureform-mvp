// Recommendations prompt template

export const RECOMMENDATIONS_SYSTEM_PROMPT = `You are a Trust Assessment Analyst specializing in remediation planning.
Your role is to generate prioritized, actionable recommendations for addressing trust gaps.

CRITICAL RULES:
1. Recommendations must be specific and actionable
2. Include cost estimates and timelines where possible
3. Prioritize by impact and feasibility
4. Link recommendations to identified gaps
5. Maximum 3-5 recommendations per assessment`;

export interface RecommendationInput {
    layerId: string;
    layerName: string;
    score: number;
    gaps: string[];
}

export function buildRecommendationsPrompt(data: {
    projectName: string;
    partnerName: string;
    overallScore: number;
    layerGaps: RecommendationInput[];
    context?: string;
}): string {
    const gapsText = data.layerGaps
        .filter(lg => lg.gaps.length > 0)
        .map(lg => `${lg.layerId} - ${lg.layerName} (${lg.score.toFixed(1)}/5.0):\n${lg.gaps.map(g => `  - ${g}`).join('\n')}`)
        .join('\n\n');

    return `Generate prioritized remediation recommendations for this assessment:

PROJECT: ${data.projectName}
PARTNER: ${data.partnerName}
OVERALL SCORE: ${data.overallScore.toFixed(2)}/5.0
${data.context ? `CONTEXT: ${data.context}` : ''}

IDENTIFIED GAPS BY LAYER:
${gapsText || 'No significant gaps identified'}

Generate 3-5 prioritized recommendations in this format:

1. [PRIORITY: HIGH/MEDIUM/LOW] [Title]
   Gap Addressed: [Which layer gap this addresses]
   Action: [Specific action to take]
   Estimated Cost: [Cost range if applicable]
   Timeline: [Implementation timeline]
   Expected Impact: [How this improves trust score]

Focus on highest-impact recommendations that address the most critical gaps first.`;
}

// Remediation cost reference from trust-framework
export const REMEDIATION_COSTS: Record<string, { min: number; max: number }> = {
    // Layer 1 - Reliability
    'ups_power_conditioning': { min: 50000, max: 200000 },
    'generator_backup': { min: 100000, max: 500000 },
    'connectivity_redundancy': { min: 30000, max: 150000 },
    'environmental_controls': { min: 75000, max: 300000 },
    'offline_capability': { min: 100000, max: 400000 },
    'redundancy_failover': { min: 200000, max: 1000000 },
    'graceful_degradation': { min: 75000, max: 250000 },
    'monitoring_alerts': { min: 30000, max: 100000 },
    'local_spare_parts': { min: 75000, max: 300000 },
    'stress_testing_pilot': { min: 50000, max: 150000 },
    'fmea_analysis': { min: 20000, max: 50000 },
    'local_technical_training': { min: 50000, max: 150000 },

    // Layer 2 - Transparency
    'xai_implementation': { min: 75000, max: 200000 },
    'explanation_ui': { min: 50000, max: 150000 },
    'model_documentation': { min: 20000, max: 50000 },
    'audit_trail': { min: 40000, max: 120000 },
    'data_inventory': { min: 50000, max: 150000 },
    'privacy_impact_assessment': { min: 30000, max: 80000 },
    'dsar_portal': { min: 40000, max: 100000 },
    'cross_border_compliance': { min: 50000, max: 200000 },
    'status_dashboard': { min: 30000, max: 80000 },
    'documentation_overhaul': { min: 40000, max: 120000 },
    'crisis_communication_training': { min: 20000, max: 50000 },

    // Layer 3 - Governance
    'sla_renegotiation': { min: 20000, max: 75000 },
    'contract_restructuring': { min: 30000, max: 100000 },
    'compliance_gap_assessment': { min: 25000, max: 75000 },
    'iso_certification': { min: 50000, max: 150000 },
    'independent_monitoring': { min: 40000, max: 120000 },
    'change_management_process': { min: 30000, max: 80000 },

    // Layer 4 - Competence
    'training_needs_assessment': { min: 15000, max: 40000 },
    'training_program_development': { min: 50000, max: 150000 },
    'train_the_trainer': { min: 30000, max: 80000 },
    'elearning_platform': { min: 50000, max: 200000 },
    'knowledge_base_implementation': { min: 40000, max: 120000 },
    'sop_development': { min: 25000, max: 75000 },
    'local_team_hiring': { min: 100000, max: 500000 },

    // Layer 5 - Integrity
    'financial_due_diligence': { min: 25000, max: 75000 },
    'reference_check_program': { min: 15000, max: 40000 },
    'background_investigation': { min: 10000, max: 30000 },
    'source_code_escrow': { min: 10000, max: 25000 },
    'exit_plan_development': { min: 20000, max: 50000 },

    // Layer 6 - Ecosystem
    'backup_power_systems': { min: 50000, max: 500000 },
    'offline_first_redesign': { min: 100000, max: 400000 },
    'regulatory_engagement': { min: 50000, max: 200000 },
    'stakeholder_mapping': { min: 25000, max: 75000 },
    'community_engagement_program': { min: 50000, max: 200000 },
    'trust_building_campaign': { min: 75000, max: 300000 }
};
