import type { Project } from '../types';

// Stubbed service - replace with real API calls
export async function getAllProjects(_token?: string): Promise<Project[]> {
  return [
    {
      id: 'p1',
      name: 'Proyecto Alpha',
      status: 'active',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      budget: 100000,
    },
  ];
}
