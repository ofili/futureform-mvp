'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface EntityIdDisplayProps {
    entityType: string;
    entityId: string;
    showLabel?: boolean;
    size?: 'sm' | 'md';
}

/**
 * Reusable component to display entity IDs with copy functionality
 * Used for support ticket references
 */
export function EntityIdDisplay({
    entityType,
    entityId,
    showLabel = true,
    size = 'sm',
}: EntityIdDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(entityId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shortId = entityId.slice(0, 8);
    const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

    return (
        <div className={`inline-flex items-center gap-1.5 ${textSize}`}>
            {showLabel && (
                <span className="text-muted-foreground">{entityType} ID:</span>
            )}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-auto py-0.5 px-1.5 font-mono ${textSize} text-muted-foreground hover:text-foreground gap-1`}
                            onClick={handleCopy}
                        >
                            <span className="select-all">{shortId}...</span>
                            {copied ? (
                                <Check className="w-3 h-3 text-green-600" />
                            ) : (
                                <Copy className="w-3 h-3" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="font-mono text-xs">
                        <p className="mb-1">Full ID: {entityId}</p>
                        <p className="text-muted-foreground">Click to copy</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}

/**
 * Compact version for inline use in tables or cards
 */
export function EntityIdBadge({ entityId }: { entityId: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(entityId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-muted/50 hover:bg-muted rounded text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {entityId.slice(0, 8)}
                        {copied ? (
                            <Check className="w-3 h-3 text-green-600" />
                        ) : (
                            <Copy className="w-2.5 h-2.5" />
                        )}
                    </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-mono text-xs">
                    {entityId}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
