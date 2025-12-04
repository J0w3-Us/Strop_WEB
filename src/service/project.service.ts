import type { Project } from '../types';

// Mock service alineado con ProjectModel.dart de la app móvil
export async function getAllProjects(_token?: string): Promise<Project[]> {
  return [
    {
      id: '1',
      name: 'Residencial del Valle',
      clientName: 'Inmobiliaria Sur',
      address: 'Av. Siempre Viva 123',
      location: 'Madrid',
      status: 'active',
      startDate: '2024-01-15T00:00:00Z',
      estimatedEndDate: '2024-12-31T00:00:00Z',
      progress: 0.75,
      superintendentId: '1',
      residentIds: ['2', '3'],
      openIncidents: 5,
      pendingApprovals: 2,
      teamCount: 8,
    },
    {
      id: '2',
      name: 'Centro Comercial Norte',
      clientName: 'Comercial SRL',
      address: 'Calle Falsa 456',
      location: 'Barcelona',
      status: 'completed',
      startDate: '2023-06-01T00:00:00Z',
      estimatedEndDate: '2024-05-30T00:00:00Z',
      progress: 1.0,
      superintendentId: '2',
      openIncidents: 0,
      pendingApprovals: 0,
      teamCount: 5,
    },
    {
      id: '3',
      name: 'Viaducto Metropolitano',
      clientName: 'Infraestructuras SA',
      address: 'Ruta Nacional km 12',
      location: 'Valencia',
      status: 'paused',
      startDate: '2024-03-01T00:00:00Z',
      estimatedEndDate: '2025-08-31T00:00:00Z',
      progress: 0.2,
      superintendentId: '1',
      residentIds: ['4'],
      openIncidents: 1,
      pendingApprovals: 0,
      teamCount: 12,
    },
  ];
}

