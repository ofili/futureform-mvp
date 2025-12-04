'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    Building2,
    FileText,
    ClipboardList,
    DollarSign,
    Settings2,
    Layers,
    CreditCard,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    LogOut,
    ArrowLeftRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

interface AdminSidebarProps {
    className?: string;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export default function AdminSidebar({ className, collapsed, setCollapsed }: AdminSidebarProps) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const logout = useAuthStore((s) => s.logout);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const adminNavItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/organizations', label: 'Organizations', icon: Building2 },
        { href: '/admin/projects', label: 'Projects', icon: FileText },
        { href: '/admin/assessments', label: 'Assessments', icon: ClipboardList },
        { href: '/admin/tiers', label: 'Tiers', icon: Layers },
        { href: '/admin/credit-pricing', label: 'Credit Pricing', icon: DollarSign },
        { href: '/admin/exchange-rates', label: 'Exchange Rates', icon: ArrowLeftRight },
        { href: '/admin/billing', label: 'Billing', icon: CreditCard },
        { href: '/admin/form-options', label: 'Form Options', icon: Settings2 },
        { href: '/admin/support', label: 'Support', icon: MessageSquare },
    ];

    const handleLogout = () => {
        logout();
        try {
            localStorage.removeItem('token');
        } catch { }
        window.location.href = '/auth/login';
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-4">
                {collapsed ? (
                    <div className="flex items-center justify-center w-full">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                            FF
                        </div>
                    </div>
                ) : (
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                            FF
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">FutureForm</h1>
                            <p className="text-xs text-gray-500">Admin Console</p>
                        </div>
                    </Link>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                                collapsed && "justify-center px-2"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Actions */}
            <div className="border-t p-4 space-y-2">
                <button
                    onClick={handleLogout}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors",
                        collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? "Logout" : undefined}
                >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>Logout</span>}
                </button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full justify-center hidden md:flex"
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            <span>Collapse</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Trigger */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Button variant="outline" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-background border-r shadow-sm",
                    collapsed ? "w-20" : "w-60",
                    mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                    className
                )}
            >
                <SidebarContent />
            </aside>
        </>
    );
}
