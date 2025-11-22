'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

import { MessageCircle, Send, Reply, AtSign, MoreHorizontal } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  mentions: string[];
  replies: Comment[];
  resolved: boolean;
}

interface CommentSystemProps {
  entityId: string;
  entityType: 'project' | 'assessment' | 'response';
}

export default function CommentSystem({ entityId, entityType }: CommentSystemProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ['comments', entityType, entityId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/comments/${entityType}/${entityId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.json();
    }
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/v1/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          entityId,
          entityType,
          content,
          mentions: extractMentions(content)
        })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', entityType, entityId] });
      setNewComment('');
    }
  });

  const addReplyMutation = useMutation({
    mutationFn: async ({ parentId, content }: { parentId: string; content: string }) => {
      const response = await fetch(`/api/v1/comments/${parentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content,
          mentions: extractMentions(content)
        })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', entityType, entityId] });
      setReplyingTo(null);
      setReplyContent('');
    }
  });

  const extractMentions = (content: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  const formatContent = (content: string) => {
    return content.replace(/@(\w+)/g, '<span class="text-blue-600 font-medium">@$1</span>');
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 border-l-2 border-muted pl-4' : ''}`}>
      <div className="flex items-start space-x-3 p-4 border rounded-lg bg-card">
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
          {comment.authorName.charAt(0)}
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">{comment.authorName}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
              {comment.resolved && (
                <Badge className="text-xs bg-green-100 text-green-800">Resolved</Badge>
              )}
            </div>
            <Button className="h-8 px-2 bg-transparent hover:bg-gray-100">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          
          <div 
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: formatContent(comment.content) }}
          />
          
          {comment.mentions.length > 0 && (
            <div className="flex items-center space-x-1">
              <AtSign className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Mentioned: {comment.mentions.join(', ')}
              </span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setReplyingTo(comment.id)}
              className="h-7 px-2 text-xs bg-transparent hover:bg-gray-100"
            >
              <Reply className="w-3 h-3 mr-1" />
              Reply
            </Button>
          </div>
        </div>
      </div>
      
      {/* Reply Form */}
      {replyingTo === comment.id && (
        <div className="ml-8 mt-2">
          <div className="flex space-x-2">
            <Textarea
              placeholder="Write a reply... Use @username to mention someone"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={2}
              className="flex-1"
            />
            <div className="flex flex-col space-y-1">
              <Button
                onClick={() => addReplyMutation.mutate({ parentId: comment.id, content: replyContent })}
                disabled={!replyContent.trim() || addReplyMutation.isPending}
                className="h-8 px-3 text-sm"
              >
                <Send className="w-3 h-3" />
              </Button>
              <Button
                onClick={() => setReplyingTo(null)}
                className="h-8 px-3 text-sm bg-transparent hover:bg-gray-100"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Replies */}
      {comment.replies?.map(reply => renderComment(reply, true))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New Comment Form */}
        <div className="flex space-x-2">
          <Textarea
            placeholder="Add a comment... Use @username to mention team members"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="flex-1"
          />
          <Button
            onClick={() => addCommentMutation.mutate(newComment)}
            disabled={!newComment.trim() || addCommentMutation.isPending}
            className="h-8 px-3 text-sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Comments List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No comments yet. Start the conversation!</p>
            </div>
          ) : (
            comments.map(comment => renderComment(comment))
          )}
        </div>
      </CardContent>
    </Card>
  );
}