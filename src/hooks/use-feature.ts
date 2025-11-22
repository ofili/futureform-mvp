import { useAuthStore } from '@/store/auth-store';

export const useFeature = (featureName: string) => {
    const user = useAuthStore((s) => s.user);

    // If no user or tier, assume no access (or default to free tier features if we had a map)
    if (!user || !user.tier) return false;

    // In a real app, we might fetch the features for the tier from the API or have a hardcoded map.
    // Since we seeded the tiers with features, we could ideally check against that.
    // However, the session only has the tier NAME.

    // For MVP, let's hardcode the feature mapping here based on the seed script.
    // This avoids an extra API call.

    const tierFeatures: Record<string, string[]> = {
        'Framework Access': [
            'question_bank',
            'scoring_methodology',
            'implementation_guide'
        ],
        'Guided Assessment': [
            'question_bank',
            'scoring_methodology',
            'implementation_guide',
            'assessment_portal',
            'automated_validation',
            'trust_profile_report',
            'risk_recommendations',
            'support_30_days'
        ],
        'Enterprise Program': [
            'question_bank',
            'scoring_methodology',
            'implementation_guide',
            'assessment_portal',
            'automated_validation',
            'trust_profile_report',
            'risk_recommendations',
            'support_30_days',
            'unlimited_assessments',
            'custom_question_sets',
            'comparative_analytics',
            'api_integration',
            'dedicated_success_manager'
        ]
    };

    const features = tierFeatures[user.tier] || [];
    return features.includes(featureName);
};
