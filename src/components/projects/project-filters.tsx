import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

const PROJECT_TYPES = ['Pre-investment due diligence', 'Vendor selection / procurement', 'Portfolio monitoring (existing partners)', 'Governance audit', 'Multi-stakeholder alignment'];
const SECTORS = ['Infrastructure', 'Digital Transformation', 'Health', 'Education', 'Agriculture', 'Financial Services', 'Climate', 'Governance'];
const REGIONS = ['Sub-Saharan Africa', 'MENA', 'South Asia', 'East Asia & Pacific', 'Latin America', 'Eastern Europe & Central Asia'];
const BUDGET_RANGES = ['<$1M', '$1M-$5M', '$5M-$20M', '$20M-$100M', '>$100M'];

interface ProjectFiltersProps {
    searchTerm: string;
    typeFilter: string;
    sectorFilter: string;
    regionFilter: string;
    budgetFilter: string;
    onSearchChange: (value: string) => void;
    onTypeChange: (value: string) => void;
    onSectorChange: (value: string) => void;
    onRegionChange: (value: string) => void;
    onBudgetChange: (value: string) => void;
}

export function ProjectFilters({
    searchTerm,
    typeFilter,
    sectorFilter,
    regionFilter,
    budgetFilter,
    onSearchChange,
    onTypeChange,
    onSectorChange,
    onRegionChange,
    onBudgetChange
}: ProjectFiltersProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) => onTypeChange(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="">All Types</option>
                        {PROJECT_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <select
                        value={sectorFilter}
                        onChange={(e) => onSectorChange(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="">All Sectors</option>
                        {SECTORS.map(sector => (
                            <option key={sector} value={sector}>{sector}</option>
                        ))}
                    </select>
                    <select
                        value={regionFilter}
                        onChange={(e) => onRegionChange(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="">All Regions</option>
                        {REGIONS.map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                    <select
                        value={budgetFilter}
                        onChange={(e) => onBudgetChange(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="">All Budgets</option>
                        {BUDGET_RANGES.map(range => (
                            <option key={range} value={range}>{range}</option>
                        ))}
                    </select>
                </div>
            </CardContent>
        </Card>
    );
}
