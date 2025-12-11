'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface FormOption {
    id: string;
    value: string;
    label: string;
    displayOrder: number;
    parentId?: string | null;
    children?: FormOption[];
}

interface CascadingSelectProps {
    category: string;
    label: string;
    value: string;
    subValue?: string;
    onChange: (value: string, subValue?: string) => void;
    required?: boolean;
    disabled?: boolean;
}

export function CascadingSelect({
    category,
    label,
    value,
    subValue,
    onChange,
    required = false,
    disabled = false,
}: CascadingSelectProps) {
    const [selectedParent, setSelectedParent] = useState<string>(value || '');
    const [selectedChild, setSelectedChild] = useState<string>(subValue || '');

    // Normalize category to lowercase for API (database stores as lowercase)
    const normalizedCategory = category.toLowerCase();

    // Fetch parent options
    const { data: parentOptions = [] } = useQuery<FormOption[]>({
        queryKey: ['form-options', normalizedCategory, 'parent'],
        queryFn: async () => {
            const res = await fetch(`/api/v1/admin/form-options?category=${normalizedCategory}&parentId=null`);
            if (!res.ok) return [];
            return res.json();
        },
    });

    // Fetch child options based on selected parent
    const { data: childOptions = [] } = useQuery<FormOption[]>({
        queryKey: ['form-options', `${normalizedCategory}_sub`, selectedParent],
        queryFn: async () => {
            if (!selectedParent) return [];
            const parent = parentOptions.find(p => p.value === selectedParent);
            if (!parent) return [];
            const res = await fetch(`/api/v1/admin/form-options?category=${normalizedCategory}_sub&parentId=${parent.id}`);
            if (!res.ok) return [];
            return res.json();
        },
        enabled: !!selectedParent,
    });

    // Update parent when value prop changes
    useEffect(() => {
        if (value && value !== selectedParent) {
            setSelectedParent(value);
        }
    }, [value]);

    // Update child when subValue prop changes
    useEffect(() => {
        if (subValue && subValue !== selectedChild) {
            setSelectedChild(subValue);
        }
    }, [subValue]);

    const handleParentChange = (newValue: string) => {
        setSelectedParent(newValue);
        setSelectedChild(''); // Reset child selection
        onChange(newValue, '');
    };

    const handleChildChange = (newValue: string) => {
        setSelectedChild(newValue);
        onChange(selectedParent, newValue);
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor={`${category}-parent`}>
                    {label} {required && <span className="text-red-500">*</span>}
                </Label>
                <Select
                    value={selectedParent}
                    onValueChange={handleParentChange}
                    disabled={disabled}
                    required={required}
                >
                    <SelectTrigger id={`${category}-parent`}>
                        <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {parentOptions.map((option) => (
                            <SelectItem key={option.id} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedParent && childOptions.length > 0 && (
                <div>
                    <Label htmlFor={`${category}-child`}>
                        Specific Type {required && <span className="text-red-500">*</span>}
                    </Label>
                    <Select
                        value={selectedChild}
                        onValueChange={handleChildChange}
                        disabled={disabled}
                    >
                        <SelectTrigger id={`${category}-child`}>
                            <SelectValue placeholder="Select specific type" />
                        </SelectTrigger>
                        <SelectContent>
                            {childOptions.map((option) => (
                                <SelectItem key={option.id} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
}
