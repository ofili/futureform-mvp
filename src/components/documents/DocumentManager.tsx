'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EntityIdBadge } from '@/components/ui/entity-id-display';
import { Upload, File, Download, Eye, Trash2, FileText, Image, Archive, HardDrive } from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  version: number;
  tags: string[];
}

interface StorageInfo {
  used: number;
  limit: number;
  count: number;
}

interface DocumentManagerProps {
  entityId: string;
  entityType: 'project' | 'assessment';
}

export default function DocumentManager({ entityId, entityType }: DocumentManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ['documents', entityType, entityId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/documents?entityType=${entityType}&entityId=${entityId}`, {
        credentials: 'include'
      });
      if (!response.ok) return [];
      return response.json();
    }
  });

  // Mock storage info - in production this would come from API
  const storageInfo: StorageInfo = {
    used: documents.reduce((sum, doc) => sum + doc.size, 0),
    limit: 100 * 1024 * 1024, // 100MB default tier limit
    count: documents.length
  };

  const uploadMutation = useMutation({
    mutationFn: async ({ file, entityId, entityType }: { file: File; entityId: string; entityType: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityId', entityId);
      formData.append('entityType', entityType);

      const response = await fetch(`/api/v1/documents/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
      setUploading(false);
      setUploadProgress(0);
      toast.success('Document uploaded successfully');
    },
    onError: () => {
      toast.error('Failed to upload document');
      setUploading(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(`/api/v1/documents/${documentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Delete failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
      toast.success('Document deleted successfully');
      setDeleteConfirmOpen(false);
      setDocumentToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete document');
    }
  });

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    for (const file of Array.from(files)) {
      try {
        await uploadMutation.mutateAsync({ file, entityId, entityType });
        setUploadProgress(prev => prev + (100 / files.length));
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDeleteClick = (doc: Document) => {
    setDocumentToDelete(doc);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      deleteMutation.mutate(documentToDelete.id);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-5 h-5 text-yellow-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const storagePercentage = (storageInfo.used / storageInfo.limit) * 100;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Documents ({storageInfo.count})
            </span>
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button size="sm" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </span>
              </Button>
            </label>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Storage Stats */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm">
                <HardDrive className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Storage</span>
              </div>
              <span className="text-sm font-medium">
                {formatFileSize(storageInfo.used)} / {formatFileSize(storageInfo.limit)}
              </span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {(100 - storagePercentage).toFixed(0)}% remaining
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF, images, documents, and archives up to 10MB
            </p>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading files...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Documents List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">Loading documents...</div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No documents uploaded yet</p>
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(doc.type)}
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(doc.size)}</span>
                        <span>•</span>
                        <span>v{doc.version}</span>
                        <span>•</span>
                        <span>by {doc.uploadedBy}</span>
                        <span>•</span>
                        <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <EntityIdBadge entityId={doc.id} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteClick(doc)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Document"
        description={`Are you sure you want to delete "${documentToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}