'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { SettingsHeader } from '@/components/settings/settings-header';
import { ProfileSettings } from '@/components/settings/profile-settings';
import { PasswordSettings } from '@/components/settings/password-settings';
import { DangerZone } from '@/components/settings/danger-zone';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const doLogout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleSaveProfile = (data: { firstName: string; lastName: string; email: string }) => {
    updateUser(data);
    toast.success('Profile updated');
  };

  const handleChangePassword = (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (!newPassword || newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    toast.success('Password updated');
  };

  const handleLogout = () => {
    try { localStorage.removeItem('token'); } catch { }
    doLogout();
    router.replace('/auth/login');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8 max-w-3xl space-y-8">
        <SettingsHeader userId={user?.id} />
        <ProfileSettings
          initialFirstName={user?.firstName}
          initialLastName={user?.lastName}
          initialEmail={user?.email}
          onSave={handleSaveProfile}
        />
        <PasswordSettings onChangePassword={handleChangePassword} />
        <DangerZone onLogout={handleLogout} />
      </div>
    </DashboardLayout>
  );
}
