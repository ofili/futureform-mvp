'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
    UserPlus, Mail, Shield, MoreHorizontal, Users,
    Search, Check, Trash2, Edit2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import InviteOrganizationMemberModal from '@/components/team/InviteOrganizationMemberModal';
import { formatDistanceToNow } from 'date-fns';

interface TeamMember {
    id: string;
    userId: string;
    role: string;
    joinedAt: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        jobTitle?: string;
        department?: string;
    };
}

export default function TeamPage() {
    const { data: session } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const [showInviteModal, setShowInviteModal] = useState(false);

    const organizationId = session?.user?.organizationId;

    const { data: members = [], isLoading } = useQuery<TeamMember[]>({
        queryKey: ['organization-members', organizationId],
        queryFn: async () => {
            if (!organizationId) return [];
            const res = await fetch(`/api/v1/organizations/${organizationId}/members`);
            if (!res.ok) throw new Error('Failed to fetch members');
            return res.json();
        },
        enabled: !!organizationId
    });

    const filteredMembers = members.filter(m => {
        const fullName = `${m?.user?.firstName || ''} ${m?.user?.lastName || ''}`.trim().toLowerCase();
        const email = m?.user?.email?.toLowerCase() || '';
        return fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    });

    const stats = {
        total: members.length,
        admins: members.filter(m => m.role === 'ADMIN' || m.role === 'OWNER').length,
        members: members.filter(m => m.role === 'MEMBER').length,
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role.toUpperCase()) {
            case 'OWNER': return 'bg-purple-100 text-purple-700';
            case 'ADMIN': return 'bg-blue-100 text-blue-700';
            case 'MEMBER': return 'bg-green-100 text-green-700';
            case 'VIEWER': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex h-screen items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-slate-50/50">
                <div className="p-6 space-y-6">
                    {/* Page Header */}
                    <PageHeader
                        title="Team Management"
                        description="Manage your organization's team members and permissions"
                        breadcrumbs={[{ label: 'Team', href: '/team' }]}
                        searchPlaceholder="Search members..."
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        actions={
                            <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => setShowInviteModal(true)}
                                disabled={!organizationId}
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Invite Member
                            </Button>
                        }
                    />

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-sm text-gray-500">Total Members</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Shield className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
                                <p className="text-sm text-gray-500">Admins</p>
                            </div>
                        </div>
                    </div>

                    {/* Team Members List */}
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        {/* Table Header */}
                        <div className="px-6 py-4 border-b bg-gray-50/50 hidden md:grid md:grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                            <div className="col-span-5">Member</div>
                            <div className="col-span-3">Role</div>
                            <div className="col-span-2">Joined</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        {/* Team Members */}
                        <div className="divide-y">
                            {filteredMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="px-6 py-4 hover:bg-gray-50 transition-colors grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                                >
                                    {/* Member */}
                                    <div className="md:col-span-5 flex items-center gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user.email}`} />
                                            <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                                                {member.user.firstName?.[0]}{member.user.lastName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {member.user.firstName} {member.user.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500">{member.user.email}</p>
                                            {member.user.jobTitle && (
                                                <p className="text-xs text-gray-400 mt-0.5">{member.user.jobTitle}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Role */}
                                    <div className="md:col-span-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                                            <Shield className="w-3 h-3" />
                                            {member.role}
                                        </span>
                                    </div>

                                    {/* Joined */}
                                    <div className="md:col-span-2 text-sm text-gray-500">
                                        {formatDistanceToNow(new Date(member.joinedAt), { addSuffix: true })}
                                    </div>

                                    {/* Actions */}
                                    <div className="md:col-span-2 flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Edit2 className="w-4 h-4 text-gray-500" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {/* Empty State */}
                            {filteredMembers.length === 0 && (
                                <div className="p-12 text-center">
                                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No members found</h3>
                                    <p className="text-gray-500">Try adjusting your search or invite new members.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {showInviteModal && organizationId && (
                    <InviteOrganizationMemberModal
                        organizationId={organizationId}
                        onClose={() => setShowInviteModal(false)}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}
