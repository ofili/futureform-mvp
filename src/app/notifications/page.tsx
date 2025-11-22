'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import NotificationCenter from '@/components/notifications/NotificationCenter';

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        <NotificationCenter />
      </div>
    </DashboardLayout>
  );
}
