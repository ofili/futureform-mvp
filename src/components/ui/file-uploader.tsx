'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
    onUploadComplete: (files: { name: string; url: string; type: string; size: number }[]) => void;
    existingFiles?: { name: string; url: string; type: string; size: number }[];
    maxFiles?: number;
}

export default function FileUploader({ onUploadComplete, existingFiles = [], maxFiles = 10 }: FileUploaderProps) {
    const [uploadedFiles, setUploadedFiles] = useState(existingFiles);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
            setError(`You can only upload up to ${maxFiles} files.`);
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setError(null);

        const newFiles: { name: string; url: string; type: string; size: number }[] = [];

        try {
            // Upload files sequentially for now to track progress simply
            for (let i = 0; i < acceptedFiles.length; i++) {
                const file = acceptedFiles[i];
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Failed to upload ${file.name}`);
                }

                const data = await response.json();
                newFiles.push(data);
                setUploadProgress(((i + 1) / acceptedFiles.length) * 100);
            }

            const updatedFiles = [...uploadedFiles, ...newFiles];
            setUploadedFiles(updatedFiles);
            onUploadComplete(updatedFiles);
        } catch (err) {
            console.error(err);
            setError('Failed to upload one or more files. Please try again.');
        } finally {
            setUploading(false);
        }
    }, [uploadedFiles, maxFiles, onUploadComplete]);

    const removeFile = (index: number) => {
        const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(updatedFiles);
        onUploadComplete(updatedFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: maxFiles - uploadedFiles.length,
        disabled: uploading || uploadedFiles.length >= maxFiles,
    });

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                    isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                    (uploading || uploadedFiles.length >= maxFiles) && "opacity-50 cursor-not-allowed"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    {isDragActive ? (
                        <p className="text-sm font-medium">Drop the files here...</p>
                    ) : (
                        <>
                            <p className="text-sm font-medium">Drag & drop evidence files here, or click to select</p>
                            <p className="text-xs text-muted-foreground">
                                Supports PDF, DOCX, PNG, JPG (Max {maxFiles} files)
                            </p>
                        </>
                    )}
                </div>
            </div>

            {uploading && (
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span>Uploading...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Attached Evidence ({uploadedFiles.length})</h4>
                    <div className="grid gap-2">
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md border">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <FileText className="w-4 h-4 flex-shrink-0 text-primary" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-red-600"
                                    onClick={() => removeFile(index)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
