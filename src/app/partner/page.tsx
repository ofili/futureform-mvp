'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PartnerDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [aboutExpanded, setAboutExpanded] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    // Mock data - replace with real API calls
    const assessmentData = {
        projectName: 'Digital Meter Upgrade (Phase 2)',
        assessmentTitle: 'Trust Diagnostic – Vendor Evaluation',
        partnerOrg: 'PowerGrid Ltd.',
        dueDate: 'Jan 15, 2026',
        estimatedTime: '12 minutes',
        totalQuestions: 12,
        completedQuestions: 5,
        status: 'In Progress',
        lastSaved: 'Today at 11:42 AM',
        role: 'Finance Manager',
        domains: 'Integrity – Financial Controls',
    };

    const progress = Math.round((assessmentData.completedQuestions / assessmentData.totalQuestions) * 100);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* TOP NAVIGATION */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="text-xl font-semibold text-gray-900">FutureForm™</div>
                        <div className="flex items-center gap-4">
                            <Link href="/support" className="text-sm text-gray-600 hover:text-gray-900">
                                Help
                            </Link>
                            <button
                                onClick={() => router.push('/api/auth/signout')}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* PAGE HEADER */}
                <div className="mb-8 pb-6 border-b border-gray-200">
                    <div className="text-sm text-gray-600 space-y-1">
                        <div><span className="font-medium">Project:</span> {assessmentData.projectName}</div>
                        <div><span className="font-medium">Assessment:</span> {assessmentData.assessmentTitle}</div>
                        <div><span className="font-medium">Partner Organization:</span> {assessmentData.partnerOrg}</div>
                    </div>
                </div>

                {/* HERO SECTION */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        You've Been Invited to Contribute Your Expertise
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Your responses help evaluate the trustworthiness and readiness of this deployment.
                        Only questions assigned to your role will appear.
                    </p>
                    <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span><strong>Due Date:</strong> {assessmentData.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span><strong>Estimated Time:</strong> {assessmentData.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span><strong>Confidential & Secure</strong></span>
                        </div>
                    </div>
                </div>

                {/* PRIMARY ACTION MODULE */}
                <Card className="mb-8 border-2 border-blue-200 shadow-lg">
                    <CardHeader className="bg-blue-50">
                        <CardTitle className="text-xl">Your Assigned Tasks</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="mb-6">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>You have {assessmentData.totalQuestions} questions assigned</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        <Button className="w-full mb-4 h-12 text-lg" size="lg">
                            Continue Assessment
                        </Button>

                        <div className="flex justify-between text-sm text-gray-600 pt-4 border-t">
                            <span><strong>Status:</strong> {assessmentData.status}</span>
                            <span><strong>Last Saved:</strong> {assessmentData.lastSaved}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* ROLE CONTEXT MODULE */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Your Role in This Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div>
                                <span className="font-semibold text-gray-700">Role Assigned:</span>{' '}
                                <span className="text-gray-900">{assessmentData.role}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Domain(s):</span>{' '}
                                <span className="text-gray-900">{assessmentData.domains}</span>
                            </div>
                            <div className="pt-2 border-t">
                                <p className="text-sm font-semibold text-gray-700 mb-1">Why You Were Selected:</p>
                                <p className="text-sm text-gray-600">
                                    You provide domain expertise required to evaluate specific aspects of this deployment.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ABOUT THIS ASSESSMENT PANEL */}
                <Card className="mb-8">
                    <CardHeader
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setAboutExpanded(!aboutExpanded)}
                    >
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">About This Assessment</CardTitle>
                            <svg
                                className={`w-5 h-5 text-gray-500 transition-transform ${aboutExpanded ? 'rotate-90' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </CardHeader>
                    {aboutExpanded && (
                        <CardContent>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• What the Trust Diagnostic measures</li>
                                <li>• How your data is used</li>
                                <li>• Privacy & confidentiality note</li>
                                <li>• Why only certain questions are visible to you</li>
                            </ul>
                        </CardContent>
                    )}
                </Card>

                {/* VALUE DISCOVERY */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 mb-8 border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Trust Intelligence for High-Stakes Deployments
                    </h3>
                    <p className="text-gray-700 mb-4">
                        Organizations use FutureForm to anticipate deployment risks, strengthen vendor due diligence,
                        and improve cross-functional alignment.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 mb-4">
                        <li>• Understand your trust readiness</li>
                        <li>• Benchmark maturity across domains</li>
                        <li>• Reveal hidden adoption risks</li>
                    </ul>
                    <Link href="/about" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Learn more →
                    </Link>
                </div>

                {/* FOOTER */}
                <footer className="border-t border-gray-200 pt-8 mt-12">
                    <div className="text-center text-xs text-gray-500 space-y-2">
                        <p>© 2025 FutureForm™. All rights reserved.</p>
                        <p>
                            FutureForm Trust Diagnostic™, Trust Intelligence Engine™, and Role-Mapped Assessment Flow™
                            are proprietary tools.
                        </p>
                        <div className="flex justify-center gap-4 pt-2">
                            <Link href="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
                            <span>|</span>
                            <Link href="/terms" className="hover:text-gray-700">Terms</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
