'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth-store';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Bell,
    Search,
    User,
    Settings,
    LogOut
} from 'lucide-react';
import Link from 'next/link';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const user = useAuthStore((s) => s.user);
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Sidebar */}
            <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className={cn(
                "transition-all duration-300 ease-in-out min-h-screen flex flex-col",
                collapsed ? "md:pl-20" : "md:pl-60"
            )}>
                {/* Top Header */}
                <header className="h-16 border-b bg-white/80 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4 w-full max-w-md">
                        <div className="relative w-full">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search admin..."
                                className="w-full bg-gray-50 pl-9 border-none focus-visible:ring-1"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="w-5 h-5 text-muted-foreground" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                        </Button>

                        <div className="flex items-center gap-3 pl-4 border-l">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                                <p className="text-xs text-muted-foreground">Administrator</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                                            <AvatarFallback>{user?.firstName?.[0] || 'A'}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link href="/settings/profile" className="flex items-center w-full">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/dashboard/settings/user" className="flex items-center w-full">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600" onClick={() => {
                                        useAuthStore.getState().logout();
                                        window.location.href = '/auth/login';
                                    }}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-6 w-full max-w-[1280px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
