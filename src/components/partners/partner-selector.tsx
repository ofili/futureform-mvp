import { useState } from 'react';
import { Check, ChevronsUpDown, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { usePartners, Partner } from '@/hooks/use-partners';
import { AddPartnerDialog } from './add-partner-dialog';

interface PartnerSelectorProps {
    value?: string; // Partner Alias ID
    onChange: (value: string) => void;
    onPartnerSelect?: (partner: Partner) => void;
}

export function PartnerSelector({ value, onChange, onPartnerSelect }: PartnerSelectorProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { data: partners, isLoading } = usePartners();

    const selectedPartner = partners?.find((p) => p.id === value);

    const filteredPartners = partners?.filter((partner) =>
        partner.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (partner: Partner) => {
        onChange(partner.id);
        onPartnerSelect?.(partner);
        setOpen(false);
    };

    return (
        <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selectedPartner ? selectedPartner.displayName : "Select partner..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden">
                    <DialogHeader className="px-4 py-3 border-b">
                        <DialogTitle>Select Partner</DialogTitle>
                    </DialogHeader>

                    <div className="p-2 border-b">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search partners..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 border-none focus-visible:ring-0"
                            />
                        </div>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto p-1">
                        {isLoading ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
                        ) : filteredPartners?.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No partner found.
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {filteredPartners?.map((partner) => (
                                    <div
                                        key={partner.id}
                                        className={cn(
                                            "flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground",
                                            value === partner.id && "bg-accent text-accent-foreground"
                                        )}
                                        onClick={() => handleSelect(partner)}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium">{partner.displayName}</span>
                                            {partner.cachedSector && (
                                                <span className="text-xs text-muted-foreground">{partner.cachedSector}</span>
                                            )}
                                        </div>
                                        {value === partner.id && <Check className="h-4 w-4" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-2 border-t bg-muted/50">
                        <AddPartnerDialog onPartnerCreated={(newPartner) => handleSelect(newPartner)} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
