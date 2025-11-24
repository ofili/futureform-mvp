'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table';
import InviteMemberModal from '@/components/projects/InviteTeamMemberModal';
import { toast } from 'sonner';
import { Trash2, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProjectTeamMembers({ projectId }: { projectId: string }) {
    const queryClient = useQueryClient();
    const [showInvite, setShowInvite] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<any>(null);

    const { data: members = [], isLoading } = useQuery({
        queryKey: ['project', projectId, 'team-members'],
        queryFn: async () => {
            const res = await fetch(`/api/v1/projects/${projectId}/team-members`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (!res.ok) throw new Error('Failed to load team members');
            return res.json();
        }
    });

    const removeMutation = useMutation({
        mutationFn: async (memberId: string) => {
            const res = await fetch(`/api/v1/projects/${projectId}/team-members/${memberId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            if (!res.ok) throw new Error('Failed to remove member');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project', projectId, 'team-members'] });
            toast.success('Member removed');
        },
        onError: () => toast.error('Failed to remove member'),
    });

    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <CardTitle>Team Members ({members.length})</CardTitle>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="default" onClick={() => setShowInvite(true)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite Member
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <THead>
                            <TR>
                                <TH>Email</TH>
                                <TH>Role</TH>
                                <TH>Status</TH>
                                <TH>Invited By</TH>
                                <TH>Invited At</TH>
                                <TH>Accepted At</TH>
                                <TH className="text-right">Actions</TH>
                            </TR>
                        </THead>
                        <TBody>
                            {isLoading ? (
                                <TR><TD colSpan={7}>Loading...</TD></TR>
                            ) : members.length === 0 ? (
                                <TR><TD colSpan={7} className="text-center py-6">No team members yet</TD></TR>
                            ) : (
                                members.map((m: any) => (
                                    <TR key={m.id}>
                                        <TD>
                                            {m.user?.email ?? (m.invitationToken ? `${m.invitationToken.slice(0, 8)} (invited)` : '—')}
                                        </TD>
                                        <TD>{m.role}</TD>
                                        <TD>
                                            <Badge variant={m.invitationStatus === 'ACCEPTED' ? 'default' : 'outline'}>
                                                {m.invitationStatus}
                                            </Badge>
                                        </TD>
                                        <TD>{m.invitedByUser?.email ?? m.invitedBy}</TD>
                                        <TD>{m.invitationSentAt ? new Date(m.invitationSentAt).toLocaleString() : '-'}</TD>
                                        <TD>{m.invitationAcceptedAt ? new Date(m.invitationAcceptedAt).toLocaleString() : '-'}</TD>
                                        <TD className="text-right">
                                            <Button variant="destructive" size="sm" onClick={() => {
                                                setMemberToRemove(m);
                                                setDeleteModalOpen(true);
                                            }}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TD>
                                    </TR>
                                ))
                            )}
                        </TBody>
                    </Table>
                </div>
            </CardContent>

            {showInvite && (
                <InviteMemberModal
                    projectId={projectId}
                    onClose={() => {
                        setShowInvite(false);
                        queryClient.invalidateQueries({ queryKey: ['project', projectId, 'team-members'] });
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Team Member</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove this member from the project?
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteModalOpen(false)}
                            disabled={removeMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                                if (memberToRemove) {
                                    removeMutation.mutate(memberToRemove.id);
                                    setDeleteModalOpen(false);
                                    setMemberToRemove(null);
                                }
                            }}
                            disabled={removeMutation.isPending}
                        >
                            {removeMutation.isPending ? 'Removing...' : 'Remove'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
