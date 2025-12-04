'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, Building2, Globe, MapPin, Calendar, Users, Shield } from 'lucide-react';

interface Director {
    name: string;
    position?: string;
    appointmentDate?: string;
}

interface Partner {
    id: string;
    legalName: string;
    tradeName?: string;
    website?: string;
    country?: string;
    sector?: string;
    headquarters?: string;
    verification: string;
    cacNumber?: string;
    rcNumber?: string;
    cacVerifiedName?: string;
    cacVerifiedAt?: string;
    directors?: Director[];
    registeredAddress?: string;
    incorporationDate?: string;
    companyType?: string;
}

export default function PartnerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const assessmentId = params.id as string;

    const [partner, setPartner] = useState<Partner | null>(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPartner();
    }, [assessmentId]);

    const fetchPartner = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/v1/assessments/${assessmentId}/partner`);

            if (!response.ok) {
                throw new Error('Failed to fetch partner details');
            }

            const data = await response.json();
            setPartner(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCAC = async () => {
        if (!partner) return;

        try {
            setVerifying(true);
            setError(null);

            const response = await fetch(`/api/v1/partners/${partner.id}/verify-cac`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Verification failed');
            }

            const updatedPartner = await response.json();
            setPartner(updatedPartner);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setVerifying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading partner details...</p>
                </div>
            </div>
        );
    }

    if (error || !partner) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Partner</h2>
                    <p className="text-gray-600 mb-4">{error || 'Partner not found'}</p>
                    <button
                        onClick={() => router.back()}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const isVerified = partner.verification === 'VERIFIED';
    const directors = partner.directors as Director[] | undefined;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Assessment
                </button>

                {/* Main Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <Building2 className="h-8 w-8" />
                                    <h1 className="text-2xl font-bold">
                                        {partner.cacVerifiedName || partner.legalName}
                                    </h1>
                                </div>
                                {partner.tradeName && partner.tradeName !== partner.legalName && (
                                    <p className="text-blue-100 text-sm">Trading as: {partner.tradeName}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {isVerified ? (
                                    <div className="flex items-center gap-2 bg-green-500 px-3 py-1.5 rounded-full">
                                        <CheckCircle className="h-4 w-4" />
                                        <span className="text-sm font-medium">CAC Verified</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 bg-yellow-500 px-3 py-1.5 rounded-full">
                                        <Shield className="h-4 w-4" />
                                        <span className="text-sm font-medium">Unverified</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* CAC Information */}
                        {(partner.cacNumber || partner.rcNumber) && (
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Registration Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {partner.rcNumber && (
                                        <div>
                                            <p className="text-sm text-gray-500">RC Number</p>
                                            <p className="text-base font-medium text-gray-900">{partner.rcNumber}</p>
                                        </div>
                                    )}
                                    {partner.companyType && (
                                        <div>
                                            <p className="text-sm text-gray-500">Company Type</p>
                                            <p className="text-base font-medium text-gray-900">{partner.companyType}</p>
                                        </div>
                                    )}
                                    {partner.incorporationDate && (
                                        <div>
                                            <p className="text-sm text-gray-500">Incorporation Date</p>
                                            <p className="text-base font-medium text-gray-900">
                                                {new Date(partner.incorporationDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                    {partner.cacVerifiedAt && (
                                        <div>
                                            <p className="text-sm text-gray-500">Verified On</p>
                                            <p className="text-base font-medium text-gray-900">
                                                {new Date(partner.cacVerifiedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Company Directors */}
                        {directors && directors.length > 0 && (
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Company Directors
                                </h2>
                                <div className="space-y-3">
                                    {directors.map((director, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{director.name}</p>
                                                {director.position && (
                                                    <p className="text-sm text-gray-600">{director.position}</p>
                                                )}
                                                {director.appointmentDate && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Appointed: {new Date(director.appointmentDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Business Details */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {partner.website && (
                                    <div className="flex items-start gap-3">
                                        <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Website</p>
                                            <a
                                                href={partner.website.startsWith('http') ? partner.website : `https://${partner.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                {partner.website}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {partner.sector && (
                                    <div className="flex items-start gap-3">
                                        <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Sector</p>
                                            <p className="text-base font-medium text-gray-900">{partner.sector}</p>
                                        </div>
                                    </div>
                                )}
                                {partner.country && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Country</p>
                                            <p className="text-base font-medium text-gray-900">{partner.country}</p>
                                        </div>
                                    </div>
                                )}
                                {partner.registeredAddress && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Registered Address</p>
                                            <p className="text-base text-gray-900">{partner.registeredAddress}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Verification Action */}
                        {!isVerified && (partner.rcNumber || partner.cacNumber) && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-blue-900 mb-1">Verify with CAC</h3>
                                        <p className="text-sm text-blue-700 mb-3">
                                            Verify this company's details with the Corporate Affairs Commission to ensure accuracy.
                                        </p>
                                        <button
                                            onClick={handleVerifyCAC}
                                            disabled={verifying}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {verifying ? 'Verifying...' : 'Verify with CAC'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-800">{error}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
