import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { queryKeys } from '@/lib/react-query';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const { token } = useAuthStore.getState();
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new ApiError(`API Error: ${response.statusText}`, response.status);
  }

  return response.json();
};

export const useProjects = () => {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: () => apiRequest('/projects')
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () => apiRequest(`/projects/${id}`),
    enabled: !!id
  });
};

export const useAssessments = (projectId?: string) => {
  return useQuery({
    queryKey: queryKeys.assessments(projectId),
    queryFn: () => apiRequest(`/assessments${projectId ? `?projectId=${projectId}` : ''}`)
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    }
  });
};

export const useCreateAssessment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiRequest('/assessments', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assessments() });
    }
  });
};