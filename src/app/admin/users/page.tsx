'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Filter, Shield, Building } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'org_admin' | 'user';
  organizationName: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  assessmentCount: number;
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['admin-users', searchTerm, roleFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter && roleFilter !== 'all') params.append('role', roleFilter);

      const response = await fetch(`/api/v1/admin/users?${params}`);
      const result = await response.json();
      return result.data || [];
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; role: string }) => {
      const response = await fetch(`/api/v1/admin/users/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: data.role }),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      toast.success('User role updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setEditModalOpen(false);
    },
    onError: () => {
      toast.error('Failed to update user role');
    }
  });

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleUpdateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const formData = new FormData(e.target as HTMLFormElement);
    updateMutation.mutate({
      id: selectedUser.id,
      role: formData.get('role') as string
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <Badge className="bg-red-600">FutureForm Admin</Badge>;
      case 'user': return <Badge className="bg-gray-600">User</Badge>;
      default: return <Badge className="bg-gray-600">User</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-600">Active</Badge>;
      case 'suspended': return <Badge className="bg-red-600">Suspended</Badge>;
      default: return <Badge className="bg-gray-600">Inactive</Badge>;
    }
  };

  // Consolidated loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  // Normal (loaded) UI
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Users', current: true }
        ]}
      />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-2">
            Manage all platform users and their roles
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">FutureForm Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({users?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users?.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{user.name}</h3>
                    {getRoleBadge(user.role)}
                    {getStatusBadge(user.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{user.email}</span>
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {user.organizationName}
                    </span>
                    <span>{user.assessmentCount} assessments</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                    <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="h-8 px-3 text-xs"
                    onClick={() => openEditModal(user)}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Edit Role
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Role Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateRole} className="space-y-4">
            <div>
              <Label>User</Label>
              <p className="text-sm text-muted-foreground">{selectedUser?.name} ({selectedUser?.email})</p>
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <NativeSelect
                id="role"
                name="role"
                defaultValue={selectedUser?.role.toUpperCase()}
                required
              >
                <option value="USER">User</option>
                <option value="ADMIN">FutureForm Admin</option>
              </NativeSelect>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update Role'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}