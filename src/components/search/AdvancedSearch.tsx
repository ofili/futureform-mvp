'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Save, X, Calendar, TrendingUp } from 'lucide-react';

interface SearchFilters {
  query: string;
  type: 'all' | 'project' | 'assessment' | 'partner';
  status: 'all' | 'active' | 'completed' | 'pending';
  trustScore: { min: number; max: number } | null;
  dateRange: { from: string; to: string } | null;
  domain: string[];
  tags: string[];
}

interface SavedFilter {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
}

export default function AdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    status: 'all',
    trustScore: null,
    dateRange: null,
    domain: [],
    tags: []
  });

  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['advanced-search', filters],
    queryFn: async () => {
      const response = await fetch('/api/v1/search/advanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(filters)
      });
      return response.json();
    },
    enabled: filters.query.length > 0 || filters.type !== 'all' || filters.status !== 'all'
  });

  const saveFilter = () => {
    if (!filterName.trim()) return;
    
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters: { ...filters },
      createdAt: new Date().toISOString()
    };
    
    setSavedFilters(prev => [...prev, newFilter]);
    setFilterName('');
    setShowSaveDialog(false);
    
    // Save to localStorage
    localStorage.setItem('savedFilters', JSON.stringify([...savedFilters, newFilter]));
  };

  const loadFilter = (savedFilter: SavedFilter) => {
    setFilters(savedFilter.filters);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      type: 'all',
      status: 'all',
      trustScore: null,
      dateRange: null,
      domain: [],
      tags: []
    });
  };

  const activeFilterCount = [
    filters.query ? 1 : 0,
    filters.type !== 'all' ? 1 : 0,
    filters.status !== 'all' ? 1 : 0,
    filters.trustScore ? 1 : 0,
    filters.dateRange ? 1 : 0,
    filters.domain.length,
    filters.tags.length
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Advanced Search
            </CardTitle>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <Badge variant="secondary">{activeFilterCount} filters active</Badge>
              )}
              <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(true)}>
                <Save className="w-4 h-4 mr-2" />
                Save Filter
              </Button>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Main Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects, assessments, partners..."
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filters.type} onValueChange={(value: any) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="project">Projects</SelectItem>
                <SelectItem value="assessment">Assessments</SelectItem>
                <SelectItem value="partner">Partners</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value: any) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min Score"
                value={filters.trustScore?.min || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  trustScore: { min: parseInt(e.target.value) || 0, max: prev.trustScore?.max || 100 }
                }))}
              />
              <Input
                type="number"
                placeholder="Max Score"
                value={filters.trustScore?.max || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  trustScore: { min: prev.trustScore?.min || 0, max: parseInt(e.target.value) || 100 }
                }))}
              />
            </div>

            <div className="flex gap-2">
              <Input
                type="date"
                value={filters.dateRange?.from || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { from: e.target.value, to: prev.dateRange?.to || '' }
                }))}
              />
              <Input
                type="date"
                value={filters.dateRange?.to || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { from: prev.dateRange?.from || '', to: e.target.value }
                }))}
              />
            </div>
          </div>

          {/* Saved Filters */}
          {savedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Saved filters:</span>
              {savedFilters.map((filter) => (
                <Button
                  key={filter.id}
                  variant="outline"
                  size="sm"
                  onClick={() => loadFilter(filter)}
                  className="h-7"
                >
                  {filter.name}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Search Results ({results.length})</span>
            {results.length > 0 && (
              <Button variant="outline" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Export Results
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Searching...</div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No results found. Try adjusting your search criteria.
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result: any) => (
                <div key={result.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{result.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{result.type}</Badge>
                        {result.trustScore && (
                          <Badge variant="secondary">{result.trustScore}% trust</Badge>
                        )}
                        {result.status && (
                          <Badge variant={result.status === 'completed' ? 'default' : 'secondary'}>
                            {result.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Save Search Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Filter name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={saveFilter} disabled={!filterName.trim()}>
                  Save Filter
                </Button>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}