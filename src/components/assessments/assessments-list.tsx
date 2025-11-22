import { AssessmentCard } from './assessment-card';

interface Assessment {
    id: string;
    projectName: string;
    partnerName: string;
    status: 'pending' | 'in_progress' | 'completed' | 'expired';
    trustScore?: number;
    createdAt: string;
    completedAt?: string;
    redFlags: number;
}

interface AssessmentsListProps {
    assessments: Assessment[];
}

export function AssessmentsList({ assessments }: AssessmentsListProps) {
    return (
        <div className="space-y-4">
            {assessments.map((assessment) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
            ))}
        </div>
    );
}
