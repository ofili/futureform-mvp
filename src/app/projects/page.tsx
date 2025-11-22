'use client';

import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { ProjectsHeader } from '@/components/projects/projects-header';
import { ProjectFilters } from '@/components/projects/project-filters';
import { ProjectsGrid } from '@/components/projects/projects-grid';
import { ProjectsTable } from '@/components/projects/projects-table';
import { ProjectsEmptyState } from '@/components/projects/projects-empty-state';
import { useState } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  projectType: string;
  sector: string;
  region: string;
  status: string;
  createdAt: string;
  assessmentCount: number;
  budgetRange?: string;
}

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['projects', searchTerm, typeFilter, sectorFilter, regionFilter, budgetFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (typeFilter) params.append('type', typeFilter);
      if (sectorFilter) params.append('sector', sectorFilter);
      if (regionFilter) params.append('region', regionFilter);
      if (budgetFilter) params.append('budget', budgetFilter);

      const response = await fetch(`/api/v1/projects?${params}`, {
        credentials: 'include'
      });
      const result = await response.json();
      return result.data || [];
    }
  });

  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64">Loading...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8 max-w-7xl space-y-8">
        <ProjectsHeader viewMode={viewMode} onViewModeChange={setViewMode} />

        <ProjectFilters
          searchTerm={searchTerm}
          typeFilter={typeFilter}
          sectorFilter={sectorFilter}
          regionFilter={regionFilter}
          budgetFilter={budgetFilter}
          onSearchChange={setSearchTerm}
          onTypeChange={setTypeFilter}
          onSectorChange={setSectorFilter}
          onRegionChange={setRegionFilter}
          onBudgetChange={setBudgetFilter}
        />

        {!projects?.length ? (
          <ProjectsEmptyState />
        ) : viewMode === 'card' ? (
          <ProjectsGrid projects={projects} />
        ) : (
          <ProjectsTable projects={projects} />
        )}
      </div>
    </DashboardLayout>
  );
}