'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import PartnerNavbar from '@/components/partner/PartnerNavbar';
import PartnerFooter from '@/components/partner/PartnerFooter';
import AssessmentHeader from '@/components/partner/AssessmentHeader';
import HeroSection from '@/components/partner/HeroSection';
import PrimaryActionModule from '@/components/partner/PrimaryActionModule';
import RoleContextModule from '@/components/partner/RoleContextModule';
import AboutAssessmentPanel from '@/components/partner/AboutAssessmentPanel';
import ValueDiscoverySection from '@/components/partner/ValueDiscoverySection';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface PartnerAssessmentData {
    project: {
        name: string;
        description: string;
    };
    assessment: {
        id: string;
        title: string;
        dueDate?: Date;
        estimatedDuration: number;
        status: string;
    };
    partnerOrg: {
        name: string;
    };
    userRole: {
        role: string;
        domains: string[];
        whySelected: string;
    };
    progress: {
        total: number;
        answered: number;
        percentage: number;
        lastSaved: Date | null;
    };
}

import { useParams } from 'next/navigation';

export default function PartnerAssessmentPage() {
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    const { data, isLoading, error } = useQuery<PartnerAssessmentData>({
        queryKey: ['partner-assessment', token],
        queryFn: async () => {
            const response = await fetch(`/api/v1/partner/assessment/${token}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to load assessment');
            }
            return response.json();
        },
    });

    const handleContinue = () => {
        router.push(`/partner/assessment/${token}/questions`);
    };

    const handleHelp = () => {
        // TODO: Implement help modal or redirect
        console.log('Help clicked');
    };

    const handleLogout = () => {
        // TODO: Implement logout logic
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <PartnerNavbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading assessment...</p>
                    </div>
                </div>
                <PartnerFooter />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col">
                <PartnerNavbar />
                <div className="flex-1 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full">
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                                <h2 className="text-xl font-semibold text-gray-900">Assessment Not Found</h2>
                                <p className="text-gray-600">
                                    {error instanceof Error ? error.message : 'The assessment link may be invalid or expired.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <PartnerFooter />
            </div>
        );
    }

    const status = data.progress.answered === 0
        ? 'NOT_STARTED'
        : data.progress.answered === data.progress.total
            ? 'COMPLETED'
            : 'IN_PROGRESS';

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <PartnerNavbar onHelp={handleHelp} onLogout={handleLogout} />

            <AssessmentHeader
                projectName={data.project.name}
                assessmentTitle={data.assessment.title}
                partnerOrgName={data.partnerOrg.name}
            />

            <HeroSection
                dueDate={data.assessment.dueDate}
                estimatedTime={data.assessment.estimatedDuration}
            />

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                <PrimaryActionModule
                    totalQuestions={data.progress.total}
                    answeredQuestions={data.progress.answered}
                    status={status}
                    lastSaved={data.progress.lastSaved}
                    onContinue={handleContinue}
                />

                <RoleContextModule
                    role={data.userRole.role}
                    domains={data.userRole.domains}
                    whySelected={data.userRole.whySelected}
                />

                <AboutAssessmentPanel />

                <ValueDiscoverySection />
            </main>

            <PartnerFooter />
        </div>
    );
}
