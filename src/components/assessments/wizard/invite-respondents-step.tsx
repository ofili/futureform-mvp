
import { useState } from 'react';
import { toast } from 'sonner';
import { Upload, Plus, Trash2, Building2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { PartnerSelector } from '@/components/partners/partner-selector';
import { Partner } from '@/hooks/use-partners';

interface PartnerInvitation {
    partnerAliasId: string;
    partnerGlobalId?: string;
    partnerName: string; // Display only
    adminName: string;
    adminEmail: string;
    notes?: string;
}

interface InvitePartnersStepProps {
    data: {
        partners: PartnerInvitation[];
    };
    onUpdate: (data: { partners: PartnerInvitation[] }) => void;
}

export default function InviteRespondentsStep({
    data,
    onUpdate,
}: InvitePartnersStepProps) {
    const [newPartner, setNewPartner] = useState<Partial<PartnerInvitation>>({
        partnerAliasId: '',
        partnerName: '',
        adminName: '',
        adminEmail: '',
        notes: '',
    });

    const addPartner = () => {
        if (!newPartner.partnerAliasId || !newPartner.adminEmail || !newPartner.adminName) {
            toast.error('Partner, Admin Name, and Email are required');
            return;
        }

        onUpdate({
            partners: [...(data.partners || []), newPartner as PartnerInvitation],
        });

        setNewPartner({
            partnerAliasId: '',
            partnerName: '',
            adminName: '',
            adminEmail: '',
            notes: '',
        });
    };

    const removePartner = (index: number) => {
        onUpdate({
            partners: (data.partners || []).filter((_, i) => i !== index),
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">Invite Partners</h3>
                <p className="text-sm text-muted-foreground">
                    Add partner organizations to this assessment. We will send an invitation to the Partner Admin you specify below.
                </p>
            </div>

            {/* Add Partner Form */}
            <Card className="p-4">
                <h4 className="font-medium mb-4">Add Partner Organization</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                        <Label>Partner Organization *</Label>
                        <PartnerSelector
                            value={newPartner.partnerAliasId}
                            onChange={(value) => setNewPartner({ ...newPartner, partnerAliasId: value })}
                            onPartnerSelect={(partner: Partner) => {
                                // Get primary contact if available
                                const primaryContact = partner.partner.contacts?.[0];
                                setNewPartner({
                                    ...newPartner,
                                    partnerAliasId: partner.id,
                                    partnerGlobalId: partner.partner.id,
                                    partnerName: partner.displayName,
                                    adminName: primaryContact?.name || '',
                                    adminEmail: primaryContact?.email || '',
                                });
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="adminName">Partner Admin Name *</Label>
                        <Input
                            id="adminName"
                            placeholder="Jane Doe"
                            value={newPartner.adminName}
                            onChange={(e) =>
                                setNewPartner({ ...newPartner, adminName: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="adminEmail">Partner Admin Email *</Label>
                        <Input
                            id="adminEmail"
                            type="email"
                            placeholder="admin@partner.org"
                            value={newPartner.adminEmail}
                            onChange={(e) =>
                                setNewPartner({ ...newPartner, adminEmail: e.target.value })
                            }
                        />
                    </div>

                    <div className="col-span-2 space-y-2">
                        <Label htmlFor="notes">Invitation Message (Optional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Message to include in the invitation email..."
                            value={newPartner.notes}
                            onChange={(e) =>
                                setNewPartner({ ...newPartner, notes: e.target.value })
                            }
                            rows={2}
                        />
                    </div>
                </div>

                <Button onClick={addPartner} className="mt-4 w-full" disabled={!newPartner.partnerAliasId}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Partner
                </Button>
            </Card>

            {/* Partners List */}
            {data.partners && data.partners.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-medium">
                        Invited Partners ({data.partners.length})
                    </h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {data.partners.map((partner, index) => (
                            <Card key={index} className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Building2 className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-lg">{partner.partnerName}</div>
                                            <div className="text-sm text-muted-foreground">
                                                Admin: {partner.adminName} ({partner.adminEmail})
                                            </div>
                                            {partner.notes && (
                                                <p className="text-xs text-muted-foreground mt-1 italic">
                                                    "{partner.notes}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removePartner(index)}
                                    >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

