import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 401 || error?.status === 403) return false;
        return failureCount < 3;
      }
    },
    mutations: {
      retry: false
    }
  }
});

export const queryKeys = {
  auth: ['auth'],
  user: ['user'],
  projects: ['projects'],
  project: (id: string) => ['project', id],
  assessments: (projectId?: string) => ['assessments', projectId],
  assessment: (id: string) => ['assessment', id],
  questions: ['questions'],
  credits: ['credits'],
  analytics: (projectId: string) => ['analytics', projectId]
};