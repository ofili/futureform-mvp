'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Mail, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function TeamPage() {
    // Mock team data for now
    const teamMembers = [
        { id: 1, name: 'Alice Johnson', role: 'Admin', email: 'alice@example.com', status: 'Active' },
        { id: 2, name: 'Bob Smith', role: 'Reviewer', email: 'bob@example.com', status: 'Active' },
        { id: 3, name: 'Charlie Brown', role: 'Viewer', email: 'charlie@example.com', status: 'Pending' },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
                        <p className="text-muted-foreground mt-1">Manage your organization's team members and permissions.</p>
                    </div>
                    <Button>Invite Member</Button>
                </div>

                <div className="grid gap-6">
                    {teamMembers.map((member) => (
                        <Card key={member.id}>
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email}`} />
                                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">{member.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="w-3 h-3" />
                                            {member.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Shield className="w-4 h-4 text-muted-foreground" />
                                        <span className="capitalize">{member.role}</span>
                                    </div>
                                    <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {member.status}
                                    </div>
                                    <Button variant="ghost" size="sm">Edit</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
