'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface FilterState {
  status: string[];
  trustScore: { min: number; max: number } | null;
  domain: string[];
}

interface AssessmentFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

export default function AssessmentFilters({ onFiltersChange, initialFilters = {} }: AssessmentFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    trustScore: null,
    domain: [],
    ...initialFilters
  });

  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const clearFilters = () => {
    const cleared = { status: [], trustScore: null, domain: [] };
    setFilters(cleared);
    onFiltersChange(cleared);
  };

  const activeFilterCount = [
    filters.status.length,
    filters.trustScore ? 1 : 0,
    filters.domain.length
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filters
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 mt-2 w-80 z-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Filters</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <div className="space-y-2">
                {['PENDING', 'IN_PROGRESS', 'COMPLETED'].map(status => (
                  <label key={status} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={(e) => {
                        const newStatus = e.target.checked
                          ? [...filters.status, status]
                          : filters.status.filter(s => s !== status);
                        updateFilters({ status: newStatus });
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{status.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Trust Score Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Trust Score Range</label>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={filters.trustScore?.min?.toString() || ''}
                  onValueChange={(value) => {
                    const min = parseInt(value);
                    updateFilters({
                      trustScore: { min, max: filters.trustScore?.max || 100 }
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 20, 40, 60, 80].map(val => (
                      <SelectItem key={val} value={val.toString()}>{val}%</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.trustScore?.max?.toString() || ''}
                  onValueChange={(value) => {
                    const max = parseInt(value);
                    updateFilters({
                      trustScore: { min: filters.trustScore?.min || 0, max }
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Max" />
                  </SelectTrigger>
                  <SelectContent>
                    {[20, 40, 60, 80, 100].map(val => (
                      <SelectItem key={val} value={val.toString()}>{val}%</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Trust Domain */}
            <div>
              <label className="text-sm font-medium mb-2 block">Trust Domain</label>
              <div className="space-y-2">
                {['SYSTEM_RELIABILITY', 'OPERATIONAL_TRANSPARENCY', 'GOVERNANCE_ACCOUNTABILITY', 'ORGANIZATIONAL_COMPETENCE', 'VENDOR_INTEGRITY', 'STAKEHOLDER_ALIGNMENT'].map(domain => (
                  <label key={domain} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.domain.includes(domain)}
                      onChange={(e) => {
                        const newDomain = e.target.checked
                          ? [...filters.domain, domain]
                          : filters.domain.filter(d => d !== domain);
                        updateFilters({ domain: newDomain });
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{domain}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}