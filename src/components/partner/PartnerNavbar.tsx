import Link from 'next/link';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { HelpCircle, LogOut } from 'lucide-react';

interface PartnerNavbarProps {
    onHelp?: () => void;
    onLogout?: () => void;
}

export default function PartnerNavbar({ onHelp, onLogout }: PartnerNavbarProps) {
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Logo />

                    <div className="flex items-center gap-4">
                        {onHelp && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onHelp}
                                className="text-gray-700 hover:text-gray-900"
                            >
                                <HelpCircle className="w-4 h-4 mr-2" />
                                Help
                            </Button>
                        )}
                        {onLogout && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onLogout}
                                className="text-gray-700 hover:text-gray-900"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
