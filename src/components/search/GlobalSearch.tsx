'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Users, Building } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  type: 'project' | 'assessment' | 'organization';
  title: string;
  description: string;
  url: string;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { data: results = [], isLoading } = useQuery<SearchResult[]>({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const response = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.json();
    },
    enabled: query.length > 2
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'project': return <FileText className="w-4 h-4" />;
      case 'assessment': return <Users className="w-4 h-4" />;
      case 'organization': return <Building className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search projects, assessments..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-4"
        />
      </div>

      {isOpen && query.length > 2 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">Searching...</div>
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No results found</div>
            ) : (
              <div className="divide-y">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    onClick={() => setIsOpen(false)}
                    className="block p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium truncate">{result.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {result.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {result.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}