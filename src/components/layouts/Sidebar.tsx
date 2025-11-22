'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FolderKanban,
    FileText,
    Settings,
    Users,
    ShieldCheck,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import Logo from '@/components/Logo';

interface SidebarProps {
    className?: string;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ className, collapsed, setCollapsed }: SidebarProps) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const logout = useAuthStore((s) => s.logout);
    const user = useAuthStore((s) => s.user);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const navItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            variant: 'default',
        },
        {
            title: 'Projects',
            href: '/projects',
            icon: FolderKanban,
            variant: 'ghost',
        },
        {
            title: 'Assessments',
            href: '/assessments',
            icon: FileText,
            variant: 'ghost',
        },
        {
            title: 'Team',
            href: '/dashboard/team',
            icon: Users,
            variant: 'ghost',
        },
        {
            title: 'Assessment Credits',
            href: '/dashboard/credits',
            icon: CreditCard,
            variant: 'ghost',
        },
    ];

    const adminItems = [
        {
            title: 'Admin Console',
            href: '/admin',
            icon: ShieldCheck,
            variant: 'ghost',
        },
    ];

    const handleLogout = () => {
        logout();
        try {
            localStorage.removeItem('token');
        } catch { }
        window.location.href = '/auth/login';
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full py-4 bg-card text-card-foreground border-r">
            <div className={cn("px-4 mb-8 flex items-center", collapsed ? "justify-center" : "justify-between")}>
                {!collapsed && <Logo />}
                {collapsed && <div className="font-bold text-xl text-primary">FF</div>}
            </div>

            <div className="flex-1 px-3 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group",
                            pathname === item.href
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
                            collapsed && "justify-center px-2"
                        )}
                        title={collapsed ? item.title : undefined}
                    >
                        <item.icon className={cn("w-5 h-5 flex-shrink-0", pathname === item.href && "text-primary-foreground")} />
                        {!collapsed && <span className="font-medium">{item.title}</span>}
                    </Link>
                ))}
            </div>

            <div className="mt-auto px-3 space-y-1">
                <Link
                    href="/dashboard/settings/organization"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 hover:bg-accent hover:text-accent-foreground text-muted-foreground",
                        pathname === '/dashboard/settings/organization' && "bg-accent text-accent-foreground",
                        collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? "Settings" : undefined}
                >
                    <Settings className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="font-medium">Settings</span>}
                </Link>

                <button
                    onClick={handleLogout}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 hover:bg-red-50 hover:text-red-600 text-muted-foreground group",
                        collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? "Logout" : undefined}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0 group-hover:text-red-600" />
                    {!collapsed && <span className="font-medium">Logout</span>}
                </button>

                <div className="pt-2 flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hidden md:flex w-full justify-center"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </Button>
                </div>
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
                    collapsed ? "w-20" : "w-[240px]",
                    mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                    className
                )}
            >
                <SidebarContent />
            </aside>
        </>
    );
}
