import { useState } from 'react';
import { toast } from 'sonner';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Invitation {
    email: string;
    name: string;
    roleId: string;
    seniority: string;
    notes?: string;
}

interface InviteRespondentsStepProps {
    data: {
        invitations: Invitation[];
    };
    onUpdate: (data: { invitations: Invitation[] }) => void;
}

export default function InviteRespondentsStep({
    data,
    onUpdate,
}: InviteRespondentsStepProps) {
    const [roles, setRoles] = useState<any[]>([]);
    const [newInvitation, setNewInvitation] = useState({
        email: '',
        name: '',
        roleId: '',
        seniority: 'Manager',
        notes: '',
    });

    // Fetch roles on mount
    useState(() => {
        fetch('/api/v1/roles')
            .then((res) => res.json())
            .then((data) => setRoles(data.roles || []))
            .catch((err) => console.error('Error fetching roles:', err));
    });

    const addInvitation = () => {
        if (!newInvitation.email || !newInvitation.name) {
            toast.error('Email and name are required');
            return;
        }

        onUpdate({
            invitations: [...data.invitations, newInvitation],
        });

        setNewInvitation({
            email: '',
            name: '',
            roleId: '',
            seniority: 'Manager',
            notes: '',
        });
    };

    const removeInvitation = (index: number) => {
        onUpdate({
            invitations: data.invitations.filter((_, i) => i !== index),
        });
    };

    const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n').slice(1); // Skip header
            const newInvitations = lines
                .filter((line) => line.trim())
                .map((line) => {
                    const [email, name, roleId, seniority, notes] = line.split(',');
                    return {
                        email: email?.trim() || '',
                        name: name?.trim() || '',
                        roleId: roleId?.trim() || '',
                        seniority: seniority?.trim() || 'Manager',
                        notes: notes?.trim() || '',
                    };
                })
                .filter((inv) => inv.email && inv.name);

            onUpdate({
                invitations: [...data.invitations, ...newInvitations],
            });
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">Invite Respondents</h3>
                <p className="text-sm text-muted-foreground">
                    Add team members who will complete the assessment. Each respondent will receive
                    an email invitation with their assigned questions.
                </p>
            </div>

            {/* CSV Upload */}
            <Card className="p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium mb-1">Bulk Upload</h4>
                        <p className="text-sm text-muted-foreground">
                            Upload a CSV file with columns: email, name, roleId, seniority, notes
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <label className="cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload CSV
                            <input
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={handleCSVUpload}
                            />
                        </label>
                    </Button>
                </div>
            </Card>

            {/* Manual Entry */}
            <Card className="p-4">
                <h4 className="font-medium mb-4">Add Respondent</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="respondent@partner.org"
                            value={newInvitation.email}
                            onChange={(e) =>
                                setNewInvitation({ ...newInvitation, email: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={newInvitation.name}
                            onChange={(e) =>
                                setNewInvitation({ ...newInvitation, name: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="roleId">Role</Label>
                        <Select
                            value={newInvitation.roleId}
                            onValueChange={(value) =>
                                setNewInvitation({ ...newInvitation, roleId: value })
                            }
                        >
                            <SelectTrigger id="roleId">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="seniority">Seniority</Label>
                        <Select
                            value={newInvitation.seniority}
                            onValueChange={(value) =>
                                setNewInvitation({ ...newInvitation, seniority: value })
                            }
                        >
                            <SelectTrigger id="seniority">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Junior">Junior</SelectItem>
                                <SelectItem value="Senior">Senior</SelectItem>
                                <SelectItem value="Manager">Manager</SelectItem>
                                <SelectItem value="Director">Director</SelectItem>
                                <SelectItem value="C-Level">C-Level</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="col-span-2 space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Any special instructions for this respondent..."
                            value={newInvitation.notes}
                            onChange={(e) =>
                                setNewInvitation({ ...newInvitation, notes: e.target.value })
                            }
                            rows={2}
                        />
                    </div>
                </div>

                <Button onClick={addInvitation} className="mt-4 w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Respondent
                </Button>
            </Card>

            {/* Invitations List */}
            {data.invitations.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-medium">
                        Respondents ({data.invitations.length})
                    </h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {data.invitations.map((invitation, index) => (
                            <Card key={index} className="p-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="font-medium">{invitation.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {invitation.email}
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            {invitation.roleId && (
                                                <Badge variant="outline" className="text-xs">
                                                    {roles.find((r) => r.id === invitation.roleId)?.name ||
                                                        'Role'}
                                                </Badge>
                                            )}
                                            <Badge variant="outline" className="text-xs">
                                                {invitation.seniority}
                                            </Badge>
                                        </div>
                                        {invitation.notes && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {invitation.notes}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeInvitation(index)}
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
