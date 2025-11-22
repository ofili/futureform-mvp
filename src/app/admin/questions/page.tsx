'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Question {
    id: string;
    domain: string;
    text: string;
    category: string;
    weight: number;
    order: number;
}

export default function QuestionsManagementPage() {
    const queryClient = useQueryClient();

    const { data: questions, isLoading } = useQuery<Question[]>({
        queryKey: ['admin-questions'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/questions');
            if (!response.ok) throw new Error('Failed to fetch questions');
            return response.json();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/v1/admin/questions/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete question');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Question deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
        },
        onError: () => {
            toast.error('Failed to delete question');
        }
    });

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this question?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Question Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage assessment questions, domains, and weighting
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/questions/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Question
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Questions</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Loading questions...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Order</TableHead>
                                    <TableHead>Domain</TableHead>
                                    <TableHead className="w-[40%]">Question Text</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Weight</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {questions?.map((question) => (
                                    <TableRow key={question.id}>
                                        <TableCell className="font-medium">{question.order}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{question.domain}</Badge>
                                        </TableCell>
                                        <TableCell className="truncate max-w-[300px]" title={question.text}>
                                            {question.text}
                                        </TableCell>
                                        <TableCell>{question.category}</TableCell>
                                        <TableCell>{question.weight}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/questions/${question.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(question.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
