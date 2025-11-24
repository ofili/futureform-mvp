import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Partner } from '@/hooks/use-partners';

const formSchema = z.object({
    legalName: z.string().min(2, 'Name must be at least 2 characters'),
    website: z.string().url().optional().or(z.literal('')),
    sector: z.string().optional(),
});

interface AddPartnerDialogProps {
    onPartnerCreated?: (partner: Partner) => void;
}

export function AddPartnerDialog({ onPartnerCreated }: AddPartnerDialogProps) {
    const [open, setOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedGlobalPartner, setSelectedGlobalPartner] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            legalName: '',
            website: '',
            sector: '',
        },
    });

    const handleSearch = async (query: string) => {
        if (query.length < 2) return;
        setIsSearching(true);
        try {
            const res = await fetch('/api/v1/partners/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            const data = await res.json();
            setSearchResults(data.matches || []);
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setIsSearching(false);
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const res = await fetch('/api/v1/partners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...values,
                    partnerGlobalId: selectedGlobalPartner,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to create partner');
            }

            const data = await res.json();
            const newPartner = data.partner;

            toast.success('Partner added successfully');
            queryClient.invalidateQueries({ queryKey: ['partners'] });

            onPartnerCreated?.(newPartner);
            setOpen(false);
            form.reset();
            setSelectedGlobalPartner(null);
            setSearchResults([]);
        } catch (error) {
            toast.error('Failed to add partner');
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start h-auto py-2 px-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Partner
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Partner</DialogTitle>
                    <DialogDescription>
                        Search for an existing global partner or create a new one.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="legalName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Partner Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                placeholder="Acme Corp"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    handleSearch(e.target.value);
                                                    setSelectedGlobalPartner(null); // Reset selection on type
                                                }}
                                            />
                                            {isSearching && (
                                                <div className="absolute right-2 top-2.5">
                                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>

                                    {/* Search Results Dropdown */}
                                    {searchResults.length > 0 && !selectedGlobalPartner && (
                                        <div className="border rounded-md mt-2 max-h-[150px] overflow-y-auto bg-popover text-popover-foreground shadow-md">
                                            <div className="p-2 text-xs text-muted-foreground font-medium">Suggested Global Partners</div>
                                            {searchResults.map((match) => (
                                                <div
                                                    key={match.id}
                                                    className="px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer flex justify-between items-center"
                                                    onClick={() => {
                                                        form.setValue('legalName', match.legalName);
                                                        form.setValue('website', match.website || '');
                                                        form.setValue('sector', match.sector || '');
                                                        setSelectedGlobalPartner(match.id);
                                                        setSearchResults([]); // Hide results
                                                    }}
                                                >
                                                    <span>{match.legalName}</span>
                                                    {match.verification === 'VERIFIED' && (
                                                        <span className="text-[10px] bg-green-100 text-green-800 px-1 rounded">Verified</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="https://example.com" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="sector"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sector</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Technology" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Partner
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
