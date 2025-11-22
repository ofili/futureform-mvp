'use client';

import React from 'react';
import { ChevronDown, Mail, FileText, Check } from 'lucide-react';

type Props = {
    id: string;
    title: string;
    body: string;
    createdAt: string;
    read: boolean;
    type?: 'message' | 'document' | 'system';
    onOpenChange?: (open: boolean) => void;
};

export default function NotificationAccordion({
    id,
    title,
    body,
    createdAt,
    read,
    type = 'system',
    onOpenChange,
}: Props) {
    const [open, setOpen] = React.useState(false);

    const icon =
        type === 'message' ? <Mail className="h-4 w-4" /> :
            type === 'document' ? <FileText className="h-4 w-4" /> :
                <Check className="h-4 w-4" />;

    const toggle = () => {
        const next = !open;
        setOpen(next);
        onOpenChange?.(next);
    };

    return (
        <div className={`rounded-md border ${open ? 'bg-gray-50' : 'bg-white'}`}>
            <button
                type="button"
                onClick={toggle}
                className="w-full flex items-center justify-between px-4 py-3"
            >
                <div className="flex items-center gap-3">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full border ${read ? 'opacity-60' : 'border-blue-500 text-blue-600'}`}>
                        {icon}
                    </div>
                    <div className="text-left">
                        <div className={`text-sm font-medium ${read ? 'text-gray-600' : 'text-gray-900'}`}>{title}</div>
                        <div className="text-xs text-gray-500">{new Date(createdAt).toLocaleString()}</div>
                    </div>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="px-4 pb-4 text-sm text-gray-700">
                    {body}
                </div>
            )}
        </div>
    );
}