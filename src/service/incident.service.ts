import type { Incident } from '../types';

export async function getAllIncidents(_token?: string): Promise<Incident[]> {
  return [
    {
      id: 'i1',
      project_id: 'p1',
      created_by: 'user1',
      title: 'Problema en cimiento',
      description: 'Se detectó una grieta en la zapata',
      type: 'problem',
      status: 'open',
      is_critical: false,
      created_at: new Date().toISOString(),
    },
  ];
}
