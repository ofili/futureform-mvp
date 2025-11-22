'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, TrendingUp, Target } from 'lucide-react';

export function AnalyticsTabs() {
    const [activeTab, setActiveTab] = useState('realtime');

    return (
        <Card>
            <CardContent className="pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="realtime">Real-Time Signals</TabsTrigger>
                        <TabsTrigger value="trends">Trends</TabsTrigger>
                        <TabsTrigger value="matrix">Performance Matrix</TabsTrigger>
                    </TabsList>

                    <TabsContent value="realtime" className="space-y-4">
                        <div className="text-center py-12 text-gray-500">
                            <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p>Real-time monitoring dashboard</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="trends" className="space-y-4">
                        <div className="text-center py-12 text-gray-500">
                            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p>Historical trend analysis</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="matrix" className="space-y-4">
                        <div className="text-center py-12 text-gray-500">
                            <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p>Partner performance comparison</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
