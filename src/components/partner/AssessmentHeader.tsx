interface AssessmentHeaderProps {
    projectName: string;
    assessmentTitle: string;
    partnerOrgName: string;
}

export default function AssessmentHeader({
    projectName,
    assessmentTitle,
    partnerOrgName
}: AssessmentHeaderProps) {
    return (
        <div className="bg-gray-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="text-sm text-gray-600 space-y-1">
                    <div>
                        <span className="font-medium">Project:</span> {projectName}
                    </div>
                    <div>
                        <span className="font-medium">Assessment:</span> {assessmentTitle}
                    </div>
                    <div>
                        <span className="font-medium">Partner Organization:</span> {partnerOrgName}
                    </div>
                </div>
            </div>
        </div>
    );
}
