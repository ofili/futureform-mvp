'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    UserPlus, Mail, Shield, MoreHorizontal, Users,
    Search, ChevronRight, Edit2, Trash2, Check, X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    email: string;
    status: 'Active' | 'Pending' | 'Inactive';
    avatar?: string;
    lastActive?: string;
}

export default function TeamPage() {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock team data
    const teamMembers: TeamMember[] = [
        { id: 1, name: 'Alice Johnson', role: 'Admin', email: 'alice@example.com', status: 'Active', lastActive: '2 hours ago' },
        { id: 2, name: 'Bob Smith', role: 'Reviewer', email: 'bob@example.com', status: 'Active', lastActive: '5 hours ago' },
        { id: 3, name: 'Charlie Brown', role: 'Viewer', email: 'charlie@example.com', status: 'Pending', lastActive: 'Never' },
        { id: 4, name: 'Diana Prince', role: 'Analyst', email: 'diana@example.com', status: 'Active', lastActive: '1 day ago' },
    ];

    const filteredMembers = teamMembers.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: teamMembers.length,
        active: teamMembers.filter(m => m.status === 'Active').length,
        pending: teamMembers.filter(m => m.status === 'Pending').length,
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin': return 'bg-purple-100 text-purple-700';
            case 'reviewer': return 'bg-blue-100 text-blue-700';
            case 'analyst': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Active': return { color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' };
            case 'Pending': return { color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' };
            default: return { color: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-50' };
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
                <div className="p-6 space-y-6">
                    {/* Page Header */}
                    <PageHeader
                        title="Team Management"
                        description="Manage your organization's team members and permissions"
                        breadcrumbs={[{ label: 'Team' }]}
                        searchPlaceholder="Search members..."
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        actions={
                            <Button className="bg-blue-600 hover:bg-blue-700">
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
                                <Check className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                                <p className="text-sm text-gray-500">Active</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4">
                            <div className="p-3 bg-amber-100 rounded-lg">
                                <Mail className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                                <p className="text-sm text-gray-500">Pending Invites</p>
                            </div>
                        </div>
                    </div>

                    {/* Team Members List */}
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        {/* Table Header */}
                        <div className="px-6 py-4 border-b bg-gray-50/50 hidden md:grid md:grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                            <div className="col-span-4">Member</div>
                            <div className="col-span-2">Role</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Last Active</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        {/* Team Members */}
                        <div className="divide-y">
                            {filteredMembers.map((member) => {
                                const statusConfig = getStatusConfig(member.status);
                                return (
                                    <div
                                        key={member.id}
                                        className="px-6 py-4 hover:bg-gray-50 transition-colors grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                                    >
                                        {/* Member */}
                                        <div className="md:col-span-4 flex items-center gap-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email}`} />
                                                <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                                                    {member.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-gray-900">{member.name}</p>
                                                <p className="text-sm text-gray-500">{member.email}</p>
                                            </div>
                                        </div>

                                        {/* Role */}
                                        <div className="md:col-span-2">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                                                <Shield className="w-3 h-3" />
                                                {member.role}
                                            </span>
                                        </div>

                                        {/* Status */}
                                        <div className="md:col-span-2">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.color}`}></span>
                                                {member.status}
                                            </span>
                                        </div>

                                        {/* Last Active */}
                                        <div className="md:col-span-2 text-sm text-gray-500">
                                            {member.lastActive}
                                        </div>

                                        {/* Actions */}
                                        <div className="md:col-span-2 flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <Edit2 className="w-4 h-4 text-gray-500" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

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
        </DashboardLayout>
    );
}
