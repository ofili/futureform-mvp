'use client';

import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { PageHeader } from '@/components/shared/page-header';
import { ProjectFilters } from '@/components/projects/project-filters';
import { ProjectsGrid } from '@/components/projects/projects-grid';
import { ProjectsTable } from '@/components/projects/projects-table';
import { ProjectsEmptyState } from '@/components/projects/projects-empty-state';
import { Button } from '@/components/ui/button';
import { Plus, FileText, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
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

  // Stats for quick overview
  const stats = {
    total: projects?.length || 0,
    active: projects?.filter(p => p.status === 'ACTIVE').length || 0,
    pending: projects?.filter(p => p.status === 'PLANNING').length || 0
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
        <div className="p-6 space-y-6">
          {/* Page Header with Command Bar */}
          <PageHeader
            title="Projects"
            description="Manage your trust assessment projects"
            breadcrumbs={[{ label: 'Projects' }]}
            searchPlaceholder="Search projects..."
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            showViewToggle={true}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            actions={
              <Link href="/projects/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </Link>
            }
          />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Projects</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-500">Planning</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <ProjectFilters
              searchTerm=""
              typeFilter={typeFilter}
              sectorFilter={sectorFilter}
              regionFilter={regionFilter}
              budgetFilter={budgetFilter}
              onSearchChange={() => { }}
              onTypeChange={setTypeFilter}
              onSectorChange={setSectorFilter}
              onRegionChange={setRegionFilter}
              onBudgetChange={setBudgetFilter}
            />
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
              <div className="animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
              </div>
            </div>
          ) : !projects?.length ? (
            <ProjectsEmptyState />
          ) : (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              {viewMode === 'card' ? (
                <div className="p-6">
                  <ProjectsGrid projects={projects} />
                </div>
              ) : (
                <ProjectsTable projects={projects} />
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}