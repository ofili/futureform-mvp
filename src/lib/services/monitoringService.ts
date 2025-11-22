
export type PartnerStatus = 'ACTIVE' | 'PROBATION' | 'AT_RISK';

export class MonitoringService {
    static determineStatus(trustScore: number, activeAlerts: number): PartnerStatus {
        if (activeAlerts > 3 || trustScore < 60) {
            return 'AT_RISK';
        }
        if (activeAlerts > 0 || trustScore < 75) {
            return 'PROBATION';
        }
        return 'ACTIVE';
    }

    static getStatusReason(trustScore: number, activeAlerts: number): string {
        if (activeAlerts > 3) return 'Excessive active alerts';
        if (trustScore < 60) return 'Critical trust score drop';
        if (activeAlerts > 0) return 'Unresolved alerts present';
        if (trustScore < 75) return 'Trust score below threshold';
        return 'All systems normal';
    }

    static calculateNextAssessmentDate(status: PartnerStatus, lastAssessmentDate: Date): Date {
        const nextDate = new Date(lastAssessmentDate);
        switch (status) {
            case 'AT_RISK':
                nextDate.setMonth(nextDate.getMonth() + 1); // Monthly
                break;
            case 'PROBATION':
                nextDate.setMonth(nextDate.getMonth() + 3); // Quarterly
                break;
            case 'ACTIVE':
                nextDate.setFullYear(nextDate.getFullYear() + 1); // Annually
                break;
        }
        return nextDate;
    }
}
