import React, { useState, useMemo } from 'react';
import { TrustQuestionWithSubDimension, TrustEvidenceWeight } from '@/types/trust';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuestionListProps {
    questions: TrustQuestionWithSubDimension[];
}

export function QuestionList({ questions }: QuestionListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [layerFilter, setLayerFilter] = useState<string>('all');
    const [weightFilter, setWeightFilter] = useState<string>('all');

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.questionId.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesLayer = layerFilter === 'all' || q.subDimension.layerId === layerFilter;

            const matchesWeight = weightFilter === 'all' || q.evidenceWeight === weightFilter;

            return matchesSearch && matchesLayer && matchesWeight;
        });
    }, [questions, searchQuery, layerFilter, weightFilter]);

    const getWeightColor = (weight: TrustEvidenceWeight) => {
        switch (weight) {
            case 'CRITICAL': return 'destructive';
            case 'HIGH': return 'default'; // Using default for high (usually primary color)
            case 'MEDIUM': return 'secondary';
            case 'LOW': return 'outline';
            default: return 'outline';
        }
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                    <span>Question Bank ({filteredQuestions.length})</span>
                </CardTitle>
                <div className="flex gap-2 mt-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Select value={layerFilter} onValueChange={setLayerFilter}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Layer" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Layers</SelectItem>
                            <SelectItem value="L1">L1 Reliability</SelectItem>
                            <SelectItem value="L2">L2 Transparency</SelectItem>
                            <SelectItem value="L3">L3 Governance</SelectItem>
                            <SelectItem value="L4">L4 Competence</SelectItem>
                            <SelectItem value="L5">L5 Integrity</SelectItem>
                            <SelectItem value="L6">L6 Ecosystem</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={weightFilter} onValueChange={setWeightFilter}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Weight" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Weights</SelectItem>
                            <SelectItem value="CRITICAL">Critical</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="LOW">Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-[600px] px-6 pb-6">
                    <div className="space-y-4">
                        {filteredQuestions.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                No questions found matching your filters.
                            </div>
                        ) : (
                            filteredQuestions.map((q) => (
                                <div key={q.id} className="border rounded-lg p-4 hover:bg-muted/20 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="font-mono">
                                                {q.questionId}
                                            </Badge>
                                            <Badge variant={getWeightColor(q.evidenceWeight) as any}>
                                                {q.evidenceWeight}
                                            </Badge>
                                        </div>
                                        <span className="text-xs text-muted-foreground font-medium">
                                            {q.subDimension.name}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium mb-3">{q.text}</p>

                                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                                        <div>
                                            <span className="font-semibold block mb-1">Stakeholders:</span>
                                            {q.stakeholderTypes.join(', ')}
                                        </div>
                                        <div>
                                            <span className="font-semibold block mb-1">Evidence:</span>
                                            {q.evidenceRequired}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
