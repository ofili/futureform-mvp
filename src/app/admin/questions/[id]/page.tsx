'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface QuestionFormData {
    domain: string;
    text: string;
    helpText: string;
    title: string;
    category: string;
    weight: number;
    order: number;
}

export default function QuestionFormPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isNew = id === 'new';
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<QuestionFormData>({
        domain: '',
        text: '',
        helpText: '',
        title: '',
        category: '',
        weight: 1.0,
        order: 0,
    });

    // Fetch question data if editing
    const { data: question, isLoading } = useQuery({
        queryKey: ['admin-question', id],
        queryFn: async () => {
            if (isNew) return null;
            const response = await fetch(`/api/v1/admin/questions`);
            if (!response.ok) throw new Error('Failed to fetch questions');
            const questions = await response.json();
            return questions.find((q: any) => q.id === id);
        },
        enabled: !isNew,
    });

    useEffect(() => {
        if (question) {
            setFormData({
                domain: question.domain,
                text: question.text,
                helpText: question.helpText || '',
                title: question.title || '',
                category: question.category,
                weight: question.weight,
                order: question.order,
            });
        }
    }, [question]);

    const mutation = useMutation({
        mutationFn: async (data: QuestionFormData) => {
            const url = isNew ? '/api/v1/admin/questions' : `/api/v1/admin/questions/${id}`;
            const method = isNew ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save question');
            }
            return response.json();
        },
        onSuccess: () => {
            toast.success(`Question ${isNew ? 'created' : 'updated'} successfully`);
            queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
            router.push('/admin/questions');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="text-center py-8">Loading...</div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/questions">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isNew ? 'New Question' : 'Edit Question'}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {isNew ? 'Add a new question to the assessment' : 'Update existing question details'}
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Question Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="domain">Domain *</Label>
                                <Input
                                    id="domain"
                                    value={formData.domain}
                                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                    placeholder="e.g., Strategy"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="e.g., Alignment"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="text">Question Text *</Label>
                            <Textarea
                                id="text"
                                value={formData.text}
                                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                placeholder="The main question text..."
                                required
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="helpText">Help Text</Label>
                            <Textarea
                                id="helpText"
                                value={formData.helpText}
                                onChange={(e) => setFormData({ ...formData, helpText: e.target.value })}
                                placeholder="Additional context or instructions..."
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Short Title (Optional)</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Internal reference title"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weight">Weight</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.1"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="order">Display Order</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Link href="/admin/questions">
                                <Button type="button" variant="outline">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? 'Saving...' : 'Save Question'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
