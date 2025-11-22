'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth-store';
import { InviteMembersModal } from '@/components/dashboard/invite-members-modal';
import { MoreHorizontal, Trash2, UserCog, Mail } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

interface Member {
    id: string;
    memberId: string;
    name: string;
    email: string;
    role: string;
    jobTitle: string;
    department: string;
    joinedAt: string;
}

export default function TeamPage() {
    const user = useAuthStore((s) => s.user);
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: members, isLoading } = useQuery({
        queryKey: ['organization-members'],
        queryFn: async () => {
            const response = await fetch('/api/v1/organization/members');
            if (!response.ok) throw new Error('Failed to fetch members');
            return response.json() as Promise<Member[]>;
        }
    });

    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, role }: { userId: string, role: string }) => {
            const response = await fetch('/api/v1/organization/members', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update role');
            }
            return response.json();
        },
        onSuccess: () => {
            toast.success('Member role updated');
            queryClient.invalidateQueries({ queryKey: ['organization-members'] });
        },
        onError: (error) => {
            toast.error('Failed to update role', { description: error.message });
        }
    });

    const removeMemberMutation = useMutation({
        mutationFn: async (userId: string) => {
            const response = await fetch(`/api/v1/organization/members?userId=${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to remove member');
            }
            return response.json();
        },
        onSuccess: () => {
            toast.success('Member removed');
            queryClient.invalidateQueries({ queryKey: ['organization-members'] });
        },
        onError: (error) => {
            toast.error('Failed to remove member', { description: error.message });
        }
    });

    const canManageTeam = user?.role === 'ADMIN' || ['ADMIN', 'OWNER'].includes(user?.organizationRole || '');

    const handleRemoveMember = (member: Member) => {
        if (confirm(`Are you sure you want to remove ${member.name} from the organization?`)) {
            removeMemberMutation.mutate(member.id);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage your organization's members and their roles.
                        </p>
                    </div>
                    {canManageTeam && (
                        <Button onClick={() => setInviteModalOpen(true)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Invite Members
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>
                            A list of all users in your organization.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8">Loading members...</div>
                        ) : (
                            <div className="rounded-md border">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                                        <tr>
                                            <th className="px-4 py-3">Name</th>
                                            <th className="px-4 py-3">Role</th>
                                            <th className="px-4 py-3">Department</th>
                                            <th className="px-4 py-3">Joined</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {members?.map((member) => (
                                            <tr key={member.id} className="hover:bg-muted/50">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={`https://avatar.vercel.sh/${member.email}`} />
                                                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{member.name}</div>
                                                            <div className="text-xs text-muted-foreground">{member.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline" className="capitalize">
                                                        {member.role.replace('_', ' ').toLowerCase()}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {member.department || '-'}
                                                    {member.jobTitle && <span className="text-muted-foreground ml-1">({member.jobTitle})</span>}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {new Date(member.joinedAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {canManageTeam && member.id !== user?.id && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuSub>
                                                                    <DropdownMenuSubTrigger>
                                                                        <UserCog className="mr-2 h-4 w-4" />
                                                                        Change Role
                                                                    </DropdownMenuSubTrigger>
                                                                    <DropdownMenuSubContent>
                                                                        <DropdownMenuRadioGroup
                                                                            value={member.role}
                                                                            onValueChange={(role) => updateRoleMutation.mutate({ userId: member.id, role })}
                                                                        >
                                                                            <DropdownMenuRadioItem value="MEMBER">Member</DropdownMenuRadioItem>
                                                                            <DropdownMenuRadioItem value="ADMIN">Admin</DropdownMenuRadioItem>
                                                                            <DropdownMenuRadioItem value="CREDIT_MANAGER">Credit Manager</DropdownMenuRadioItem>
                                                                            <DropdownMenuRadioItem value="REVIEWER">Reviewer</DropdownMenuRadioItem>
                                                                            <DropdownMenuRadioItem value="DOMAIN_EXPERT">Domain Expert</DropdownMenuRadioItem>
                                                                            <DropdownMenuRadioItem value="OBSERVER">Observer</DropdownMenuRadioItem>
                                                                            <DropdownMenuRadioItem value="PROJECT_ADMIN">Project Admin</DropdownMenuRadioItem>
                                                                        </DropdownMenuRadioGroup>
                                                                    </DropdownMenuSubContent>
                                                                </DropdownMenuSub>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="text-red-600"
                                                                    onClick={() => handleRemoveMember(member)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Remove Member
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <InviteMembersModal
                    isOpen={inviteModalOpen}
                    onClose={() => setInviteModalOpen(false)}
                />
            </div>
        </DashboardLayout>
    );
}
