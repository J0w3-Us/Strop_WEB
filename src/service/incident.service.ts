// Mock data aligned with the mobile IncidentModel (covers 5 types)
export async function getAllIncidents(_token?: string): Promise<any[]> {
  return [
    {
      id: 'inc-01',
      type: 'materialRequest',
      projectId: '1',
      title: 'Solicitud de Cemento Gris',
      description: 'Se requiere para colado de losa zona norte.',
      authorName: 'Ing. Juan Pérez',
      authorRole: 'superintendent', // Alineado con UserRole
      status: 'open',
      approvalStatus: 'pending',
      materialDetails: {
        itemName: 'Cemento Cruz Azul',
        quantity: 50,
        unit: 'bultos',
        justification: 'Construcción de losa en área norte'
      },
      hasPhotos: true,
      isCritical: true,
      createdAt: '2024-10-20T10:00:00Z',
      gpsLocation: '19.432608,-99.133209'
    },
    {
      id: 'inc-02',
      projectId: '1',
      type: 'safetyIncident',
      title: 'Falta de casco en obra',
      description: '3 obreros detectados sin equipo de protección.',
      authorName: 'Pedro Gómez',
      authorRole: 'resident', // Residente
      status: 'open',
      approvalStatus: 'approved',
      hasPhotos: false,
      isCritical: true,
      createdAt: '2024-09-15T08:30:00Z',
    },
    {
      id: 'inc-03',
      projectId: '2',
      type: 'progressReport',
      title: 'Avance de encofrado - Piso 3',
      description: 'Encofrado completado al 100% en la zona oeste.',
      authorName: 'Laura Martínez',
      authorRole: 'resident',
      status: 'closed',
      hasPhotos: true,
      isCritical: false,
      createdAt: '2024-10-18T14:20:00Z',
    },
    {
      id: 'inc-04',
      projectId: '2',
      type: 'problem',
      title: 'Retraso en entrega de acero',
      description: 'Proveedor reporta retraso de 2 semanas.',
      authorName: 'Miguel Torres',
      authorRole: 'cabo', // Personal de campo
      status: 'open',
      approvalStatus: 'pending',
      hasPhotos: false,
      isCritical: false,
      createdAt: '2024-10-19T09:00:00Z',
    },
    {
      id: 'inc-05',
      projectId: '3',
      type: 'consultation',
      title: 'Consulta sobre junta de dilatación',
      description: '¿Qué especificación aplicar para tránsito pesado?',
      authorName: 'Sofía Ruiz',
      authorRole: 'owner', // Dueño/Arquitecto
      status: 'open',
      hasPhotos: false,
      isCritical: false,
      createdAt: '2024-10-21T11:45:00Z',
    },
  ];
}
