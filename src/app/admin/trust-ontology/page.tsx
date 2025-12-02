'use client';

import React, { useEffect } from 'react';
import { useTrustOntology } from '@/hooks/use-trust-ontology';
import { TrustLayerCard } from '@/components/admin/trust/TrustLayerCard';
import { QuestionList } from '@/components/admin/trust/QuestionList';
import { PartnerTypeCard } from '@/components/admin/trust/PartnerTypeCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Database, Shield, Users } from 'lucide-react';

export default function TrustOntologyPage() {
    const {
        layers,
        questions,
        partnerTypes,
        isLoading,
        error,
        fetchLayers,
        fetchQuestions,
        fetchPartnerTypes
    } = useTrustOntology();

    useEffect(() => {
        fetchLayers();
        fetchQuestions();
        fetchPartnerTypes();
    }, [fetchLayers, fetchQuestions, fetchPartnerTypes]);

    if (isLoading && layers.length === 0) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading trust ontology data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Breadcrumbs
                items={[
                    { label: 'Trust Ontology', current: true }
                ]}
            />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Trust Ontology</h1>
                    <p className="text-muted-foreground mt-2">
                        View and manage trust layers, questions, and partner configurations
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Layers</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{layers.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Across {layers.reduce((acc, l) => acc + l.subDimensions.length, 0)} sub-dimensions
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{questions.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Active in question bank
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Partner Types</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{partnerTypes.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Configured with roles
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="layers" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="layers">Trust Layers</TabsTrigger>
                    <TabsTrigger value="questions">Question Bank</TabsTrigger>
                    <TabsTrigger value="partners">Partner Types</TabsTrigger>
                </TabsList>

                <TabsContent value="layers" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {layers.map((layer) => (
                            <TrustLayerCard key={layer.id} layer={layer} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="questions">
                    <QuestionList questions={questions} />
                </TabsContent>

                <TabsContent value="partners">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {partnerTypes.map((pt) => (
                            <PartnerTypeCard key={pt.id} partnerType={pt as any} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
