'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image as ImageIcon, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileValidator } from '@/lib/validation/file-validator';
import { EVIDENCE_CONSTRAINTS } from '@/lib/constants/evidence-constraints';

interface EvidenceUploadProps {
    assessmentId: string;
    questionId: string;
    onUploadComplete: (evidence: any) => void;
    maxFiles?: number;
    disabled?: boolean;
}

export function EvidenceUpload({
    assessmentId,
    questionId,
    onUploadComplete,
    maxFiles = EVIDENCE_CONSTRAINTS.MAX_FILES_PER_QUESTION,
    disabled = false,
}: EvidenceUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setError(null);

        // Validate each file
        const validFiles: File[] = [];
        for (const file of acceptedFiles) {
            const validation = FileValidator.validateFile(file);
            if (!validation.valid) {
                setError(validation.error || 'Invalid file');
                return;
            }
            validFiles.push(file);
        }

        setSelectedFiles(prev => [...prev, ...validFiles].slice(0, maxFiles));
    }, [maxFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        disabled: uploading || disabled,
        maxFiles,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'text/csv': ['.csv'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/gif': ['.gif'],
            'image/webp': ['.webp'],
            'text/plain': ['.txt'],
        },
    });

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadFiles = async () => {
        if (selectedFiles.length === 0) return;

        setUploading(true);
        setError(null);
        setUploadProgress(0);

        try {
            const totalFiles = selectedFiles.length;

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const formData = new FormData();
                formData.append('file', file);
                formData.append('assessmentId', assessmentId);
                formData.append('questionId', questionId);

                const response = await fetch('/api/v1/evidence/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Upload failed');
                }

                const data = await response.json();
                onUploadComplete(data.data);

                setUploadProgress(((i + 1) / totalFiles) * 100);
            }

            setSelectedFiles([]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
        if (file.type === 'application/pdf') return <FileText className="h-4 w-4" />;
        return <File className="h-4 w-4" />;
    };

    return (
        <div className="space-y-4">
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 hover:border-primary/50'
                    } ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                    {isDragActive
                        ? 'Drop files here...'
                        : 'Drag & drop files here, or click to select'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Max {FileValidator.formatFileSize(EVIDENCE_CONSTRAINTS.MAX_FILE_SIZE)} per file •{' '}
                    {maxFiles} files max
                </p>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Files ({selectedFiles.length})</p>
                    {selectedFiles.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                        >
                            <div className="flex items-center gap-2">
                                {getFileIcon(file)}
                                <div>
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {FileValidator.formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                disabled={uploading}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Progress */}
            {uploading && (
                <div className="space-y-2">
                    <Progress value={uploadProgress} />
                    <p className="text-sm text-center text-gray-600">
                        Uploading... {Math.round(uploadProgress)}%
                    </p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Upload Button */}
            {selectedFiles.length > 0 && !uploading && (
                <Button onClick={uploadFiles} className="w-full" disabled={disabled}>
                    Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'File' : 'Files'}
                </Button>
            )}
        </div>
    );
}
