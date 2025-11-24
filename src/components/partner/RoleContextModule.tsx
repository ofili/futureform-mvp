import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCircle } from 'lucide-react';

interface RoleContextModuleProps {
    role: string;
    domains: string[];
    whySelected: string;
}

export default function RoleContextModule({
    role,
    domains,
    whySelected
}: RoleContextModuleProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <UserCircle className="w-5 h-5 text-blue-600" />
                    Your Role in This Assessment
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Role Assigned:</p>
                    <p className="text-lg font-semibold text-gray-900">{role}</p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Domain(s):</p>
                    <div className="flex flex-wrap gap-2">
                        {domains.map((domain, index) => (
                            <Badge key={index} variant="secondary" className="text-sm">
                                {domain.replace(/_/g, ' ')}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="pt-2 border-t">
                    <p className="text-sm font-medium text-gray-600 mb-2">Why You Were Selected:</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {whySelected}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
